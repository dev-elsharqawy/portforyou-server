/**
 * Creates a MongoDB update object with dot notation for nested properties
 * @param prefix The prefix for the dot notation path
 * @param obj The object to convert to dot notation
 * @returns An object with dot notation paths
 */
export function createDotNotationUpdate(prefix: string, obj: any): Record<string, any> {
  const updateObj: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedObj = createDotNotationUpdate(path, value);
      Object.assign(updateObj, nestedObj);
    } else if (value !== undefined) {
      updateObj[path] = value;
    }
  }

  return updateObj;
}
