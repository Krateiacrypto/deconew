import { VALIDATION, ERROR_MESSAGES } from './constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('E-posta adresi gereklidir');
  } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
    errors.push('Geçerli bir e-posta adresi girin');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Şifre gereklidir');
  } else {
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      errors.push(`Şifre en az ${VALIDATION.PASSWORD_MIN_LENGTH} karakter olmalıdır`);
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Şifre en az bir büyük harf içermelidir');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Şifre en az bir küçük harf içermelidir');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Şifre en az bir rakam içermelidir');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (phone && !VALIDATION.PHONE_REGEX.test(phone)) {
    errors.push('Geçerli bir telefon numarası girin');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!value || value.trim() === '') {
    errors.push(`${fieldName} gereklidir`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFileSize = (file: File, maxSizeInMB: number = 10): ValidationResult => {
  const errors: string[] = [];
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxSizeInBytes) {
    errors.push(`Dosya boyutu ${maxSizeInMB}MB'dan küçük olmalıdır`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFileType = (file: File, allowedTypes: string[]): ValidationResult => {
  const errors: string[] = [];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Desteklenmeyen dosya türü');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  
  if (url) {
    try {
      new URL(url);
    } catch {
      errors.push('Geçerli bir URL girin');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): ValidationResult => {
  const allErrors: string[] = [];
  
  Object.entries(rules).forEach(([field, validator]) => {
    const result = validator(data[field]);
    if (!result.isValid) {
      allErrors.push(...result.errors);
    }
  });
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};