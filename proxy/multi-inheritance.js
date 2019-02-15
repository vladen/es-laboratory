const $prototypes = Symbol('prototypes');
function getPrototypesOf(object) {
  return Object.prototype.hasOwnProperty.call(object, $prototypes)
    ? object[$prototypes]
    : [];
}
function setPrototypesOf(object, ...prototypes) {
  object = Object(object);
  prototypes = prototypes.map(Object);
  if (Object.prototype.hasOwnProperty.call(object, $prototypes)) {
    object[$prototypes] = object[$prototypes].concat(prototypes);
    return object;
  }
  const prototype = Object.getPrototypeOf(object) || Object.create(null);
  object[$prototypes] = [prototype, ...prototypes];
  return Object.setPrototypeOf(object, new Proxy(
    prototype,
    {
      get(_, key) {
        for (const candidate of object[$prototypes]) {
          if (Reflect.has(candidate, key)) return Reflect.get(candidate, key, object);
        }
      },
      has(_, key) {
        for (const candidate of object[$prototypes]) {
          if (Reflect.has(candidate, key)) return true;
        }
      }
    }
  ));
}

const hasAllPrototypes = (object, prototypes) => (
  candidates => prototypes.every(prototype => candidates.includes(prototype))
)(getPrototypesOf(object));

const testStringPrototypes = [[]];
const testString = setPrototypesOf("test", ...testStringPrototypes);
console.assert(testString.join(", ") === "t, e, s, t");
console.assert(hasAllPrototypes(testString, testStringPrototypes));

const testObjectPrototypes = [
  { bar: 'bar' },
  { baz: 'baz' },
  { foo: 'foo' }
];
const testObject = setPrototypesOf(Object.create(null), ...testObjectPrototypes);
console.assert(testObject.bar === 'bar');
console.assert(testObject.baz === 'baz');
console.assert(testObject.foo === 'foo');
console.assert(hasAllPrototypes(testObject, testObjectPrototypes));

const numberPrototypes = [
  { plus(value) { return this + value; } },
  { minus(value) { return this - value; } }
];
setPrototypesOf(Number.prototype, ...numberPrototypes);
console.assert((2).plus(3).minus(1) === 4);
console.assert(hasAllPrototypes(Number.prototype, numberPrototypes));