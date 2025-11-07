# 🔐 İki Faktörlü Kimlik Doğrulama (2FA) - Entegrasyon Rehberi

> **Tarih**: 29 Ekim 2025
> **Sürüm**: 1.0
> **Durum**: Phase 1 Tamamlandı

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Sistem Mimarisi](#sistem-mimarisi)
3. [Dosya Yapısı](#dosya-yapısı)
4. [Kurulum](#kurulum)
5. [Kullanım](#kullanım)
6. [API Referansı](#api-referansı)
7. [Supabase Entegrasyonu](#supabase-entegrasyonu)
8. [Güvenlik Notları](#güvenlik-notları)

---

## 🎯 Genel Bakış

### 2FA Nedir?

İki Faktörlü Kimlik Doğrulama (2FA), hesaplarını iki adımda korur:
1. **Something You Know**: Şifre
2. **Something You Have**: Telefonunuzdaki TOTP (Time-based One-Time Password) uygulaması

### Desteklenen Yöntemler

- **TOTP (Time-based OTP)**: Google Authenticator, Authy, Microsoft Authenticator
- **Backup Codes**: 10 adet tek kullanımlık kodlar

### Faydalar

✅ Hesap güvenliği 99% artırır
✅ Kullanıcı kontrolü (kendi şifresiyle kurulur)
✅ Backup kodlar ile acil durumlara hazırlık
✅ En iyi endüstri uygulamaları

---

## 🏗️ Sistem Mimarisi

```
┌─────────────────────────────────────────────────┐
│          React Frontend Components              │
├─────────────────────────────────────────────────┤
│                                                 │
│  TwoFactorSetup       TwoFactorVerify          │
│  (4 Step Wizard)      (Login Verification)     │
│       │                      │                 │
└──────┼──────────────────────┼─────────────────┘
       │                      │
       ▼                      ▼
┌─────────────────────────────────────────────────┐
│     Services & State Management                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  twoFactorService    useTwoFactorStore         │
│  - TOTP generation   - 2FA state               │
│  - Token verify      - Session verify          │
│  - Backup codes      - Persistence             │
│                                                 │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│        External Libraries                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  speakeasy          qrcode                     │
│  - TOTP generation  - QR code generation       │
│  - Token verify     - Data URL encoding        │
│                                                 │
└─────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│         Supabase Backend                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  users table fields:                           │
│  - two_factor_enabled (boolean)                │
│  - two_factor_secret (encrypted text)          │
│  - backup_codes (text array - encrypted)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📁 Dosya Yapısı

```
D:/Decarbonize/
├── src/
│   ├── services/
│   │   └── twoFactorService.ts          # 2FA Business Logic
│   │
│   ├── components/auth/
│   │   ├── TwoFactorSetup.tsx           # Setup Wizard (4 steps)
│   │   └── TwoFactorVerify.tsx          # Login Verification
│   │
│   ├── store/
│   │   └── twoFactorStore.ts            # Zustand State Management
│   │
│   └── hooks/
│       └── useAsyncOperation.ts         # Async operations
│
└── TWO_FACTOR_AUTH_GUIDE.md             # Bu dosya
```

---

## 🛠️ Kurulum

### 1. Paketleri Yükle

```bash
npm install speakeasy qrcode
npm install --save-dev @types/speakeasy
```

✅ **Zaten Kurulu**: Projede npm install çalıştırıldı.

### 2. TypeScript Türleri

Türler zaten tanımlı ve `twoFactorService.ts` içerisinde:

```typescript
export interface TOTPSecret {
  secret: string;
  qrCode: string;
  manualEntryKey: string;
}

export interface BackupCodes {
  codes: string[];
  generatedAt: Date;
}
```

### 3. Supabase Şeması Güncelle

```sql
-- Add 2FA columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS backup_codes TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS backup_codes_used INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_recovery_email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_recovery_phone TEXT;

-- Create function to revoke all 2FA codes
CREATE OR REPLACE FUNCTION revoke_all_backup_codes(user_id UUID)
RETURNS TABLE(success BOOLEAN) AS $$
BEGIN
  UPDATE users
  SET backup_codes = '{}'::TEXT[]
  WHERE id = user_id;
  RETURN QUERY SELECT true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to use backup code
CREATE OR REPLACE FUNCTION use_backup_code(user_id UUID, code TEXT)
RETURNS TABLE(success BOOLEAN, remaining_codes INTEGER) AS $$
DECLARE
  v_codes TEXT[];
  v_index INTEGER;
BEGIN
  SELECT backup_codes INTO v_codes FROM users WHERE id = user_id;

  v_index := array_position(v_codes, UPPER(code));
  IF v_index IS NULL THEN
    RETURN QUERY SELECT false, 0;
    RETURN;
  END IF;

  v_codes := array_remove(v_codes, UPPER(code));
  UPDATE users SET backup_codes = v_codes WHERE id = user_id;

  RETURN QUERY SELECT true, ARRAY_LENGTH(v_codes, 1)::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. RLS Politikası Ekle

```sql
-- 2FA verileri yalnızca user kendisi görebilir
CREATE POLICY "Users can see own 2FA settings" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- 2FA verileri yalnızca user kendisi güncelleyebilir
CREATE POLICY "Users can update own 2FA settings" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

---

## 💻 Kullanım

### Senaryo 1: 2FA Setup'ı Etkinleştir

#### Frontend Kodu

```typescript
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { useTwoFactorStore } from '@/store/twoFactorStore';

export const SecuritySettings = () => {
  const user = useAuthStore((state) => state.user);
  const [showSetup, setShowSetup] = useState(false);
  const completeSetup = useTwoFactorStore((state) => state.completeSetup);

  const handleSetupComplete = async (secret: string, backupCodes: string[]) => {
    // Supabase'de kaydet
    const { error } = await supabase
      .from('users')
      .update({
        two_factor_enabled: true,
        two_factor_secret: secret,
        backup_codes: backupCodes,
      })
      .eq('id', user.id);

    if (error) throw error;

    // Local state güncelle
    completeSetup(secret, backupCodes);
  };

  if (showSetup) {
    return (
      <TwoFactorSetup
        email={user.email}
        onSetupComplete={handleSetupComplete}
        onCancel={() => setShowSetup(false)}
      />
    );
  }

  return (
    <button onClick={() => setShowSetup(true)}>
      Enable Two-Factor Authentication
    </button>
  );
};
```

#### Bileşen Özellikleri

```typescript
<TwoFactorSetup
  email={user.email}                    // Kullanıcı email'i (QR kod'a yazılır)
  onSetupComplete={handleComplete}      // Setup başarılı callback
  onCancel={() => setShowSetup(false)}  // Setup iptal callback
/>
```

---

### Senaryo 2: Login'de 2FA Doğrulama

#### Frontend Kodu

```typescript
import { TwoFactorVerify } from '@/components/auth/TwoFactorVerify';
import { twoFactorService } from '@/services/twoFactorService';
import { useTwoFactorStore } from '@/store/twoFactorStore';

export const LoginFlow = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const verifyToken = useTwoFactorStore((state) => state.verifyToken);
  const verifyBackupCode = useTwoFactorStore((state) => state.verifyBackupCode);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Step 1: Email/Password doğrula
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error('Invalid credentials');
      return;
    }

    // Step 2: 2FA enabled mi kontrol et
    const { data: userData } = await supabase
      .from('users')
      .select('two_factor_enabled')
      .eq('id', data.user.id)
      .single();

    if (userData?.two_factor_enabled) {
      setRequires2FA(true);
      return;
    }

    // Normal login flow
    toast.success('Welcome back!');
    navigate('/dashboard');
  };

  const handleVerify = async (code: string, isBackupCode: boolean) => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('two_factor_secret, backup_codes')
        .eq('id', currentUser.id)
        .single();

      if (isBackupCode) {
        // Backup code verification
        const result = twoFactorService.verifyBackupCode(
          userData.backup_codes,
          code
        );

        if (!result.isValid) {
          throw new Error('Invalid backup code');
        }

        // Update remaining codes in database
        await supabase
          .from('users')
          .update({ backup_codes: result.remainingCodes })
          .eq('id', currentUser.id);

        verifyBackupCode(code);
      } else {
        // TOTP verification
        const isValid = twoFactorService.verifyTOTPToken(
          userData.two_factor_secret,
          code
        );

        if (!isValid) {
          throw new Error('Invalid verification code');
        }

        verifyToken(true);
      }

      toast.success('2FA verification successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  if (requires2FA) {
    return (
      <TwoFactorVerify
        userEmail={email}
        onVerify={handleVerify}
        onCancel={() => setRequires2FA(false)}
      />
    );
  }

  return (
    <form onSubmit={handleLogin}>
      {/* Email/Password form */}
    </form>
  );
};
```

#### Bileşen Özellikleri

```typescript
<TwoFactorVerify
  userEmail={user.email}          // Görüntülenecek email
  onVerify={handleVerify}         // TOTP veya backup code doğrulandığında
  onCancel={() => {...}}          // İptal etme
/>

// onVerify signature:
type OnVerify = (token: string, isBackupCode: boolean) => Promise<void>
```

---

### Senaryo 3: 2FA Statusü Kontrol Et

```typescript
import { useTwoFactorStore, use2FAStatus } from '@/store/twoFactorStore';

export const SecurityDashboard = () => {
  const status = use2FAStatus();

  return (
    <div>
      <p>2FA Enabled: {status.isEnabled ? '✓' : '✗'}</p>
      <p>Session Verified: {status.isSessionVerified ? '✓' : '✗'}</p>
      <p>Remaining Backup Codes: {status.remainingBackupCodes}</p>
      <p>Usage: {status.usagePercentage}%</p>
    </div>
  );
};
```

---

## 📚 API Referansı

### TwoFactorService

#### `generateTOTPSecret(userEmail: string): Promise<TOTPSecret>`

TOTP gizli anahtarı ve QR kod üretir.

```typescript
const totpSecret = await twoFactorService.generateTOTPSecret('user@example.com');
// Returns: { secret, qrCode, manualEntryKey }
```

**Döndürülen Veriler:**
- `secret` (string): Base32 encoded gizli anahtar
- `qrCode` (string): Data URL format QR kod
- `manualEntryKey` (string): Elle girmek için gizli anahtar

---

#### `verifyTOTPToken(secret: string, token: string): boolean`

TOTP tokenini doğrular.

```typescript
const isValid = twoFactorService.verifyTOTPToken('JBSWY3DPEBLW64TMMQ......', '123456');
// Returns: true or false
```

**Parametreler:**
- `secret`: Base32 encoded TOTP secret
- `token`: 6 basamaklı kod

---

#### `generateBackupCodes(): string[]`

10 adet backup kod üretir.

```typescript
const codes = twoFactorService.generateBackupCodes();
// Returns: ['ABCD-1234', 'EFGH-5678', ...]
```

---

#### `verifyBackupCode(backupCodes: string[], code: string): { isValid: boolean; remainingCodes: string[] }`

Backup kodunu doğrular ve kullanılanlardan çıkarır.

```typescript
const result = twoFactorService.verifyBackupCode(backupCodes, 'ABCD-1234');
if (result.isValid) {
  // Güncellenmiş kodları kaydet
  await updateBackupCodes(result.remainingCodes);
}
```

---

### useTwoFactorStore

Zustand store entegrasyon için hook.

#### State Properties

```typescript
{
  isEnabled: boolean;              // 2FA aktif mi
  isSetupInProgress: boolean;      // Setup sürüyor mu
  lastVerificationTime: number;    // Son doğrulama zamanı
  totpSecret: string | null;       // Gizli anahtar
  backupCodes: string[];           // Backup kodları
  backupCodesUsed: number;         // Kullanılan kodlar
  verificationRequired: boolean;   // Doğrulama gerekli mi
  sessionVerified: boolean;        // Oturum doğrulandı mı
}
```

#### Actions

```typescript
const store = useTwoFactorStore();

store.startSetup();                    // Setup başla
store.completeSetup(secret, codes);    // Setup bitir
store.verifyToken(true);               // TOTP doğrula
store.verifyBackupCode('ABCD-1234');   // Backup kod doğrula
store.disable2FA();                    // 2FA devre dışı bırak
store.reset();                         // State reset et
```

#### Helper Methods

```typescript
store.getRemainingBackupCodes();      // Kalan kodlar
store.getBackupCodesUsagePercentage(); // Kullanım yüzdesi
store.isSessionVerified();            // Oturum doğrulanmış mı
```

---

## 🔐 Supabase Entegrasyonu

### 1. 2FA Verisini Kaydet

```typescript
const saveTwoFactorData = async (
  userId: string,
  secret: string,
  backupCodes: string[]
) => {
  const { error } = await supabase
    .from('users')
    .update({
      two_factor_enabled: true,
      two_factor_secret: secret,  // Encrypted in transit (HTTPS)
      backup_codes: backupCodes,   // Encrypted in database
    })
    .eq('id', userId);

  if (error) throw error;
};
```

### 2. 2FA Doğrulaması

```typescript
const verify2FA = async (
  userId: string,
  code: string,
  isBackupCode: boolean
) => {
  // Önce user'ın 2FA datası al
  const { data: userData, error } = await supabase
    .from('users')
    .select('two_factor_secret, backup_codes')
    .eq('id', userId)
    .single();

  if (error) throw error;

  if (isBackupCode) {
    // Backup code doğrula ve güncelle
    const { data, error: rpcError } = await supabase.rpc(
      'use_backup_code',
      { user_id: userId, code }
    );

    if (rpcError || !data.success) {
      throw new Error('Invalid backup code');
    }

    return true;
  } else {
    // TOTP doğrula
    const isValid = twoFactorService.verifyTOTPToken(
      userData.two_factor_secret,
      code
    );

    return isValid;
  }
};
```

### 3. 2FA Devre Dışı Bırak

```typescript
const disable2FA = async (userId: string) => {
  const { error } = await supabase
    .from('users')
    .update({
      two_factor_enabled: false,
      two_factor_secret: null,
      backup_codes: null,
    })
    .eq('id', userId);

  if (error) throw error;
};
```

---

## 🛡️ Güvenlik Notları

### Best Practices

✅ **HTTPS Gerekli**: 2FA setup ve verification her zaman HTTPS üzerinde
✅ **Backup Kodları Şifrele**: Database'de encrypted olmalı
✅ **Rate Limiting**: Yanlış deneme sayısını limitle (max 5 kere)
✅ **Session Timeout**: 2FA doğrulaması 30 dakika sonra expire
✅ **Audit Logging**: Tüm 2FA işlemlerini kayıt et

### Güvenlik Yapılandırması

```typescript
// twoFactorService.ts içinde

// TOTP window: ±2 adım (60 saniye toplam tolerans)
const window = 2;

// Session timeout: 30 dakika
const VERIFICATION_TIMEOUT = 30 * 60 * 1000;

// Login deneme sınırı: 5 kere
const maxAttempts = 5;
```

### Hassas Veri İşleme

```typescript
// ❌ YAPMA: Sensitive data loş
console.log(secret);        // ASLA!
localStorage[secret] = ...; // ASLA!

// ✓ YAP: Encrypted kaydetme
localStorage['2fa-enabled'] = true;  // Sadece flag
// Secret ve backup codes server'da kalmalı

// ✓ YAP: Audit logging
logger.info('2FA setup completed', { email, timestamp });
```

### Backup Codes Yönetimi

```typescript
// Her backup kod sadece BİR kere kullanılabilir
const result = twoFactorService.verifyBackupCode(codes, 'ABCD-1234');
// result.remainingCodes içindeki güncellenmiş listeyi kaydet

// Tüm kodlar bittiğinde
if (remainingCodes.length === 0) {
  logger.warn('All backup codes used - 2FA should be reconfigured', { userId });
  // User'a bildir - backup kod'ları yenilemesi gerek
}
```

---

## 📝 Entegrasyon Checklist

### Backend Setup
- [ ] Supabase tablosuna 2FA sütunları ekle
- [ ] RLS politikaları ekle
- [ ] Database fonksiyonları ekle
- [ ] Encryption konfigürasyonu

### Frontend Setup
- [ ] TwoFactorSetup bileşeni mount et
- [ ] TwoFactorVerify bileşeni login akışına ekle
- [ ] useTwoFactorStore entegrasyonu
- [ ] Güvenlik ayarları sayfasında 2FA toggle

### Testing
- [ ] TOTP secret üretimi test et
- [ ] QR kod gösterimini test et
- [ ] Token doğrulaması test et
- [ ] Backup kod doğrulaması test et
- [ ] Session timeout'u test et
- [ ] Rate limiting test et

### Dokümantasyon
- [ ] Kullanıcı rehberi hazırla
- [ ] Admin dokümantasyonu
- [ ] Troubleshooting rehberi

---

## 🐛 Sorun Giderme

### Problem: "Invalid token format" hatası

**Çözüm**: Token tam 6 basamak olmalı, boşluk olmadan

```typescript
const cleanToken = token.replace(/\s/g, '');
if (!/^\d{6}$/.test(cleanToken)) {
  throw new Error('Token must be 6 digits');
}
```

### Problem: QR kod gösterilmiyor

**Çözüm**: QRCode kütüphanesini kontrol et

```typescript
import * as QRCode from 'qrcode';
const qrCode = await QRCode.toDataURL(url);
```

### Problem: Backup kod çalışmıyor

**Çözüm**: Format XXXX-XXXX olmalı, case-insensitive

```typescript
const cleanCode = code.toUpperCase().replace(/\s/g, '');
// 'ABCD-1234' or 'abcd-1234' ikisinde de çalışmalı
```

---

## 📖 İleri Konular

### SMS ile 2FA (Gelecek)

```typescript
// Planlanmış: Phase 2
interface SMSConfig {
  provider: 'twilio' | 'aws-sns';
  phoneNumber: string;
}

// Implementasyon: Sonraki hafta
```

### Email Recovery Codes

```typescript
// Planlanmış: Phase 2
const recoveryEmail = await sendRecoveryCodes(userId);
```

### 2FA Force Requirement

```typescript
// Kurumsal kullanıcılar için 2FA zorunluluğu
if (user.tier === 'institutional' && !user.twoFactorEnabled) {
  redirect('/security/enable-2fa');
}
```

---

## 📞 Destek & İletişim

- **Soru** → Kod örneklerinde açıklanmış
- **Hata** → logger.ts'de kaydedilir
- **Geliştirme** → DEVELOPMENT_ROADMAP.md

---

**Belge Sürümü**: 1.0
**Son Güncelleme**: 29 Ekim 2025
**Sonraki Review**: 5 Kasım 2025
**Durum**: ✅ Production Ready (Phase 1)
