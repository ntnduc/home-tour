/**
 * Utility functions for object manipulation and reflection
 */

/**
 * Check if a method is overridden in a child class
 * @param instance - The instance to check
 * @param methodName - The method name to check
 * @param baseClass - The base class to compare against
 * @returns True if the method is overridden
 */
export function isMethodOverridden<T>(
  instance: any,
  methodName: string,
  baseClass: new (...args: any[]) => T,
): boolean {
  return (
    instance.constructor.prototype[methodName] !==
    baseClass.prototype[methodName]
  );
}

/**
 * Get all property names of an object (including inherited ones)
 * @param obj - The object to get properties from
 * @returns Array of property names
 */
export function getAllPropertyNames(obj: any): string[] {
  const props: string[] = [];
  let current = obj;

  while (current) {
    props.push(...Object.getOwnPropertyNames(current));
    current = Object.getPrototypeOf(current);
  }

  return [...new Set(props)];
}

/**
 * Deep clone an object
 * @param obj - The object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (typeof obj === 'object') {
    const cloned = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * Check if two objects are deeply equal
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns True if objects are deeply equal
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return false;

  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== 'object') return obj1 === obj2;

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}
