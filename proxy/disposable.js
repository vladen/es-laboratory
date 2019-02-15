const $revoke = Symbol('revoke');
class Disposable {
  constructor() {
    const { proxy, revoke } = Proxy.revocable(this, {});
    Object.defineProperty(this, $revoke, { value: revoke });
    return proxy;
  }
  dispose() {
    this[$revoke]();
  }
}

class Connection extends Disposable {
  connect() {
    console.log('Performing some warm-up logic');
  }
  dispose() {
    console.log('Performing some tear-down logic');
    super.dispose();
  }
}

const connection = new Connection;

connection.connect();
// Performing some warm-up logic
connection.dispose();
// Performing some tear-down logic
connection.connect();
// Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
