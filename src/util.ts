export function isString(x: any): boolean {
  return (typeof x !== 'undefined') && (Object.prototype.toString.call(x) === '[object String]');
}

export function exists(x?: any): boolean {
  return (typeof x !== 'undefined') && (x !== null);
}
