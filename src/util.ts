export function isString(x: any): boolean {
  return (typeof x !== 'undefined') && (Object.prototype.toString.call(x) === '[object String]');
}

interface ObjectLiteral { [key: string]: any; }

export function lowercaseKeys<T extends ObjectLiteral>(source: T): T {
  const destination = {} as T;

  for (const [key, value] of Object.entries(source)) {
    destination[key.toLowerCase()] = value;
  }

  return destination;
}
