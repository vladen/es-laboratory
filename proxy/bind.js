const cache = new WeakMap;

const bind = object => new Proxy(object, {
  get(target, key) {
    let bucket = cache.get(target);
    if (!bucket) cache.set(target, bucket = new Map);
    let member = bucket.get(key);
    if (member) return member;
    member = target[key];
    if (typeof member != 'function') return member;
    member = member.bind(target);
    bucket.set(key, member);
    return member;
  }
});

const bound = bind({
  foo: 'foo',
  bar() {
    return this.foo;
  }
});

const bar = bound.bar;
bar();
// "foo"
