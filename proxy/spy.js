const noop = () => undefined;

function spy(stubs = {}) {
  const $operations = [];

  function spy(target, key) {
    if (typeof target !== 'function') return target;
    return (...args) => {
      const result = target(...args);
      $operations.push({ args, key, result, type: 'call' });
      return result;
    };
  }

  return new Proxy({ $operations }, { 
    get(target, key) {
      if (!Reflect.has(target, key)) target[key] = spy(
        Reflect.has(stubs, key) ? stubs[key] : noop,
        key
      );
      return target[key];
    }
  });
}

const agent = spy({
	foo() { return 'bar' }
});

agent.foo();
// -> "bar"
agent.bar('baz');
// -> undefined
agent.$operations;
// -> [{"args":[],"key":"foo","result":"bar","type":"call"},{"args":["baz"],"key":"bar","type":"call"}]