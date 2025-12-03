/**
 * Utility functions for validation
 */

/**
 * Check if value is a valid email
 * @param email - Email to validate
 * @returns True if valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if value is a valid phone number (Vietnamese format)
 * @param phone - Phone number to validate
 * @returns True if valid phone number
 */
export function isValidVietnamesePhone(phone: string): boolean {
  const phoneRegex =
    /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
  return phoneRegex.test(phone);
}

/**
 * Check if value is a valid Vietnamese ID card
 * @param idCard - ID card to validate
 * @returns True if valid ID card
 */
export function isValidVietnameseIdCard(idCard: string): boolean {
  const idCardRegex = /^[0-9]{9}$|^[0-9]{12}$/;
  return idCardRegex.test(idCard);
}

/**
 * Check if string contains only numbers
 * @param str - String to check
 * @returns True if contains only numbers
 */
export function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}

/**
 * Check if value is not null, undefined, or empty string
 * @param value - Value to check
 * @returns True if value is not empty
 */
export function isNotEmpty(value: any): boolean {
  return value !== null && value !== undefined && value !== '';
}
