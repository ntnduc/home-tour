/**
 * Utility functions for string manipulation
 */

/**
 * Convert string to slug format (lowercase, replace spaces with hyphens)
 * @param text - The text to convert to slug
 * @returns The slugified string
 */
export function removeAccents(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Capitalize first letter of each word
 * @param text - The text to capitalize
 * @returns The capitalized string
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generate random string
 * @param length - Length of the random string
 * @returns Random string
 */
export function generateRandomString(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Check if string is empty or only whitespace
 * @param text - The text to check
 * @returns True if empty or whitespace only
 */
export function isEmptyOrWhitespace(text: string): boolean {
  return !text || text.trim().length === 0;
}
