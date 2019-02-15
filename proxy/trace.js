const trace = (object, callback = console.log) => new Proxy(
  object,
  Object.getOwnPropertyNames(Reflect).reduce(
    (handlers, name) => {
      handlers[name] = (...args) => {
        callback(name, args);
        return Reflect[name](...args);
      }
      return handlers;
    },
    {}
  )
);

const test = trace(function test() {});

test.name;
// -> get (3) [ƒ, "name", ƒ]
'name' in test;
// -> has (2) [ƒ, "name"]
test.foo = 'bar';
// set (4) [ƒ, "foo", "bar", ƒ]
// getOwnPropertyDescriptor (2) [ƒ, "foo"]
// defineProperty (3) [ƒ, "foo", {…}]
test instanceof Function;
// getPrototypeOf [ƒ]
test(42);
// apply (3) [ƒ, undefined, Array(1)]
new test;
// construct (3) [ƒ, Array(0), ƒ]
// get (3) [ƒ, "prototype", ƒ]