import Config from './Config';

export const validate = Symbol('validate'); // move to Config constructor ?
export const rulesPath = Symbol('rulesPath');

export default class ProxyHandler {

  protected proxy = Symbol('proxy');
  protected hiddenProps: Map<any, boolean> = new Map();
  protected cache: Map<object, {proxy: any, rules: any}> = new Map();

  public constructor(protected config: Config<any>) {
    this.hiddenProps.set(this.proxy, true);
    this.hiddenProps.set(validate, true);
    this.hiddenProps.set(rulesPath, true);
  }

  public get(target: any, name: any) {
    if (name === validate) {
      return this[validate](target);
    }
    if (typeof name !== 'string') {
      return target[name];
    }
    const value = target[name.toLowerCase()];
    if (!value || typeof value !== 'object') {
      return value;
    }
    // save result for future iterations
    const cached = this.cache.get(value);
    if (cached) {
      return cached.proxy;
    }
    const proxyValue: any = new Proxy(value, this);
    this.cache.set(value, {
      proxy: proxyValue,
      rules: this.cache.has(target) ? `${this.cache.get(target).rules}.${name}` : name,
    });
    return proxyValue;
  }

  public getOwnPropertyDescriptor(target: any, name: string | any) {
    const path = typeof name === 'string' ? name.toLowerCase() : name;
    return Object.getOwnPropertyDescriptor(target, path);
  }

  protected [validate](target: any) {
    return () => {
      const path = this.cache.has(target) ? this.cache.get(target).rules : undefined;
      let errors: any = null;
      if (path === null ) {
        errors = this.config.getValidationErrors();
      } else if (path) {
        errors = this.config.getValidationErrors(path);
      }
      return errors;
    };
  }
}
