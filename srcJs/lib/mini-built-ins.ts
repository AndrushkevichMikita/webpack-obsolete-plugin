const hasOwnProperty = Object.prototype.hasOwnProperty;
const toString = Object.prototype.toString;
/**
 * Get an array of a given object's own enumerable keys.
 *
 * @param {Object<string, any>} obj
 */
 function keys<T>(obj: T) {
  if (!["[object Object]", "[object Function]"].includes(toString.call(obj))) {
    throw new TypeError("Parameter `obj` is not a object.");
  }

  const result: Array<keyof T> = [];

  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      result.push(key);
    }
  }
  return result;

}
/**
 * Get an array of a given object's own enumerable values.
 *
 * @param {Object<string, any>} obj
 */
 function values<T extends object>(obj: T): Array<T[keyof T]> {
  if (!["[object Object]", "[object Function]"].includes(toString.call(obj))) {
    throw new TypeError("Parameter `obj` is not a object.");
  }
  const result: Array<T[keyof T]> = [];
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      result.push(obj[key]);
    }
  }
  return result;
}
export { keys, values };
