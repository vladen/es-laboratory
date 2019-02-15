const proxies = new WeakSet;

const proxy = (target, handler) => {
  const result = new Proxy(target, handler);
  proxies.add(result);
  return result;
};

const isProxy = target => proxies.has(target);

const test = proxy({}, {});
isProxy(test);
// true
isProxy({});
// false
