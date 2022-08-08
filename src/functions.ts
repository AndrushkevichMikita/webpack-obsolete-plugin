/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const { hasOwnProperty } = Object.prototype;
/**
 * Execute a provided function once for each array element.
 */
function forEach(arr: unknown[], callback: (...args) => unknown, thisArg: unknown) {
  if (toString.call(arr) !== "[object Array]") {
    throw new TypeError("Parameter `arr` is not an array.");
  }
  if (toString.call(callback) !== "[object Function]") {
    throw new TypeError("Parameter `callback` is not an array.");
  }
  for (const i in arr) {
    callback.call(thisArg, arr[i], i, arr);
  }
}
/**
 * Get an array of a given object's own enumerable keys.
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
/**
 * Get an array of a given object's own enumerable [key, value] pairs.
 */
function entries<T extends object>(obj: T) {
  if (!["[object Object]", "[object Function]"].includes(toString.call(obj))) {
    throw new TypeError("Parameter `obj` is not a object.");
  }

  const ownKeys = keys(obj);
  const pairs = new Array(ownKeys.length);

  for (const i in ownKeys) {
    pairs[i] = [ownKeys[i], obj[ownKeys[i]]];
  }
  return pairs;
}
/**
 * Bind function to a specific context.
 */
function bind(func, context, ...args) {
  if (toString.call(func) !== "[object Function]") {
    throw new TypeError("Parameter `func` is not a function.");
  }

  // eslint-disable-next-line func-names
  return function (...boundArgs) {
    return func.apply(context, [...args, ...boundArgs]);
  };
}

export { forEach, keys, values, entries, bind };
