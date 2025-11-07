/**
 * HTML Content Sanitization Utility
 * Prevents XSS attacks by sanitizing HTML content
 */

import DOMPurify from 'dompurify';

/**
 * Configuration for DOMPurify sanitization
 * Allows specific tags and attributes commonly used in content editing
 */
const SANITIZE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'td', 'th', 'caption',
    'div', 'span', 'hr', 'iframe'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height',
    'class', 'style', 'data-*', 'id', 'name'
  ],
  KEEP_CONTENT: true,
};

/**
 * Strict configuration for user-generated content
 * More restrictive than SANITIZE_CONFIG
 */
const STRICT_SANITIZE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3',
    'ul', 'ol', 'li', 'blockquote', 'a'
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  KEEP_CONTENT: true,
};

/**
 * Blog-specific configuration
 * Allows media content for blog posts
 */
const BLOG_SANITIZE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img',
    'div', 'span', 'hr', 'figcaption', 'figure',
    'table', 'thead', 'tbody', 'tr', 'td', 'th'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height',
    'class', 'style', 'data-src', 'loading'
  ],
  KEEP_CONTENT: true,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @param config - Optional custom DOMPurify configuration
 * @returns Clean, safe HTML string
 */
export const sanitizeHTML = (
  dirty: string,
  config: DOMPurify.Config = SANITIZE_CONFIG
): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  try {
    return DOMPurify.sanitize(dirty, config);
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
};

/**
 * Sanitize user-generated content with strict rules
 * @param dirty - The potentially unsafe HTML string
 * @returns Clean, safe HTML string with strict filtering
 */
export const sanitizeUserContent = (dirty: string): string => {
  return sanitizeHTML(dirty, STRICT_SANITIZE_CONFIG);
};

/**
 * Sanitize blog post content
 * @param dirty - The potentially unsafe HTML string
 * @returns Clean, safe HTML string for blog posts
 */
export const sanitizeBlogContent = (dirty: string): string => {
  return sanitizeHTML(dirty, BLOG_SANITIZE_CONFIG);
};

/**
 * Sanitize plain text to prevent HTML injection
 * @param text - The text to sanitize
 * @returns Escaped text safe for display
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * @param url - The URL to sanitize
 * @returns Safe URL or empty string if invalid
 */
export const sanitizeURL = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const trimmedURL = url.trim();

    // Block dangerous protocols
    if (
      trimmedURL.startsWith('javascript:') ||
      trimmedURL.startsWith('data:') ||
      trimmedURL.startsWith('vbscript:')
    ) {
      return '';
    }

    // Validate URL format
    const urlObj = new URL(trimmedURL, window.location.href);
    return urlObj.href;
  } catch (error) {
    // If URL parsing fails, assume it's a relative path
    if (url.startsWith('/') || url.startsWith('#')) {
      return url;
    }
    return '';
  }
};

/**
 * Sanitize email addresses
 * @param email - The email to sanitize
 * @returns Validated email or empty string
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  const trimmed = email.trim().toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return '';
  }

  return trimmed;
};

/**
 * Sanitize username to prevent special characters
 * @param username - The username to sanitize
 * @returns Sanitized username or empty string
 */
export const sanitizeUsername = (username: string): string => {
  if (!username || typeof username !== 'string') {
    return '';
  }

  // Allow only alphanumeric characters, hyphens, and underscores
  const sanitized = username.replace(/[^a-zA-Z0-9_-]/g, '');

  return sanitized.substring(0, 50); // Max 50 characters
};

/**
 * Sanitize JSON string to prevent injection
 * @param jsonString - The JSON string to sanitize
 * @returns Parsed safe object or null
 */
export const sanitizeJSON = <T = any>(jsonString: string): T | null => {
  if (!jsonString || typeof jsonString !== 'string') {
    return null;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Invalid JSON provided:', error);
    return null;
  }
};

/**
 * Create a safe React render object with sanitized HTML
 * @param html - The HTML to sanitize
 * @param config - Optional custom DOMPurify configuration
 * @returns Object suitable for dangerouslySetInnerHTML
 */
export const createSafeHTML = (
  html: string,
  config?: DOMPurify.Config
): { __html: string } => {
  return {
    __html: sanitizeHTML(html, config),
  };
};

/**
 * Validate and sanitize file names
 * @param filename - The filename to sanitize
 * @returns Safe filename
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return 'file';
  }

  // Remove or replace unsafe characters
  let sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Prevent directory traversal
  sanitized = sanitized.replace(/\.\./g, '_');

  // Limit length
  const [name, extension] = sanitized.split('.');
  const maxNameLength = 100;
  const truncatedName = (name || '').substring(0, maxNameLength);

  return extension ? `${truncatedName}.${extension}` : truncatedName;
};

/**
 * Remove all HTML tags from string
 * @param html - The HTML string
 * @returns Plain text without tags
 */
export const stripHTML = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html.replace(/<[^>]*>/g, '').trim();
};

export default {
  sanitizeHTML,
  sanitizeUserContent,
  sanitizeBlogContent,
  sanitizeText,
  sanitizeURL,
  sanitizeEmail,
  sanitizeUsername,
  sanitizeJSON,
  createSafeHTML,
  sanitizeFilename,
  stripHTML,
};
