const context = {}

export default class Context {
  get(key) {
    return context[key] ?? null;
  }

  set(key, value) {
    context[key] = value;
  }

  delete(key) {
    delete context[key];
  }
}