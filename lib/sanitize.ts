/**
 * Input sanitization utilities for La Boutique RD.
 * 
 * Strips HTML tags, script injections, and dangerous characters
 * from user-provided text before storing in Appwrite.
 */

// Strip all HTML tags
const stripTags = (str: string): string => str.replace(/<[^>]*>/g, '');

// Remove common script injection patterns
const stripScripts = (str: string): string =>
  str
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')      // onclick=, onerror=, etc.
    .replace(/data:\s*text\/html/gi, '')
    .replace(/vbscript:/gi, '');

// Collapse multiple whitespace into single spaces
const normalizeWhitespace = (str: string): string => str.replace(/\s+/g, ' ');

/**
 * Sanitize a general text input (names, rooms, notes, etc.)
 * - Strips HTML tags and script patterns
 * - Trims whitespace
 * - Maximum length enforcement
 */
export const sanitizeText = (input: string, maxLength = 500): string => {
  if (!input || typeof input !== 'string') return '';
  return normalizeWhitespace(stripScripts(stripTags(input))).trim().slice(0, maxLength);
};

/**
 * Sanitize a name input (client names, vendor names)
 * - Only allows letters, spaces, accents, hyphens, dots, apostrophes
 * - Max 100 characters
 */
export const sanitizeName = (input: string, maxLength = 100): string => {
  if (!input || typeof input !== 'string') return '';
  // Allow letters (including accented), spaces, hyphens, dots, apostrophes
  const cleaned = stripTags(input).replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s\-.']/g, '');
  return normalizeWhitespace(cleaned).trim().slice(0, maxLength);
};

/**
 * Sanitize a phone number
 * - Only allows digits, +, -, spaces, parentheses
 * - Max 20 characters
 */
export const sanitizePhone = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/[^\d+\-\s()]/g, '').trim().slice(0, 20);
};

/**
 * Sanitize a room number/identifier
 * - Allows alphanumeric, spaces, hyphens
 * - Max 20 characters
 */
export const sanitizeRoom = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9\s\-]/g, '').trim().slice(0, 20);
};

/**
 * Sanitize an email
 * - Basic email character whitelist
 * - Max 100 characters
 */
export const sanitizeEmail = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9@._+\-]/g, '').trim().slice(0, 100).toLowerCase();
};

/**
 * Sanitize a number input
 * - Returns 0 if not a valid number
 * - Clamps to min/max range
 */
export const sanitizeNumber = (input: unknown, min = 0, max = 999999): number => {
  const num = Number(input);
  if (isNaN(num) || !isFinite(num)) return min;
  return Math.max(min, Math.min(max, num));
};

/**
 * Sanitize a product/item description (allows more characters)
 * - Strips HTML and scripts but allows punctuation
 * - Max 2000 characters
 */
export const sanitizeDescription = (input: string, maxLength = 2000): string => {
  if (!input || typeof input !== 'string') return '';
  return normalizeWhitespace(stripScripts(stripTags(input))).trim().slice(0, maxLength);
};

/**
 * Sanitize a URL
 * - Must start with https:// or be an Appwrite file URL
 * - Max 1000 characters
 */
export const sanitizeUrl = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim().slice(0, 1000);
  // Only allow https URLs (and blob: for previews)
  if (trimmed.startsWith('https://') || trimmed.startsWith('blob:')) return trimmed;
  return '';
};

/**
 * Sanitize JSON string data (for items arrays stored as JSON strings)
 * - Parses, strips HTML from all string values, re-serializes
 */
export const sanitizeJsonString = (input: string): string => {
  try {
    const parsed = JSON.parse(input);
    const sanitized = deepSanitize(parsed);
    return JSON.stringify(sanitized);
  } catch {
    return '[]';
  }
};

// Deep-sanitize all string values in an object/array
const deepSanitize = (obj: unknown): unknown => {
  if (typeof obj === 'string') return sanitizeText(obj, 5000);
  if (Array.isArray(obj)) return obj.map(deepSanitize);
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      result[sanitizeText(key, 100)] = deepSanitize(val);
    }
    return result;
  }
  return obj;
};
