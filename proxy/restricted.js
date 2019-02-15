function restrictMemberAssignments(object, validators) {
  return new Proxy(object, { defineProperty, set });

  function defineProperty(target, key, descriptor) {
    validate(key, descriptor.value);
    return Reflect.defineProperty(target, key, descriptor);
  }

  function set(target, key, value) {
    validate(key, value);
    return Reflect.set(target, key, value);
  }

  function validate(key, value) {
    const validator = validators[key];
    if (!validator(value)) {
      throw new TypeError(`Value "${value}" is not valid for "${key}".`);
    }
  }
}

const restricted = restrictMemberAssignments({}, {
  foo: value => value > 0,
  bar: value => typeof value === 'string' && value.length > 0
});

restricted.foo = 1;
restricted.bar = 'bar';
restricted.foo = 0;
// -> Uncaught TypeError: Value "0" is not valid for "foo".
Object.defineProperty(restricted, 'foo', { value: 0 });
// -> Uncaught TypeError: Value "0" is not valid for "foo".
restricted.bar = '';
// -> Uncaught TypeError: Value "" is not valid for "bar".