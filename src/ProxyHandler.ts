import Config from './Config';
import { IProxyHandlerOptions } from './types';

export const validate = Symbol('validate'); // move to Config constructor ?
export const rulesPath = Symbol('rulesPath');
export const toObject = Symbol('toObject');

export default class ProxyHandler {

  protected proxy = Symbol('proxy');
  protected hiddenProps: Map<any, boolean> = new Map();
  protected cache: Map<object, {proxy: any, rules: any}> = new Map();
  protected options: IProxyHandlerOptions;

  public constructor(protected config: Config<any>, options: IProxyHandlerOptions) {
    this.hiddenProps.set(this.proxy, true);
    this.hiddenProps.set(validate, true);
    this.hiddenProps.set(rulesPath, true);
    this.options = options;
  }

  public get(target: any, name: any) {
    if (name === validate) {
      return this[validate](target);
    }
    if (name === toObject) {
      return () => this[toObject](target);
    }
    if (typeof name !== 'string') {
      return target[name];
    }
    const value = target[this.options.caseSensitive ? name : name.toLowerCase()];
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
    const path = typeof name === 'string' && this.options.caseSensitive ? name.toLowerCase() : name;
    return Object.getOwnPropertyDescriptor(target, path);
  }

  protected [toObject](target: any) {
    return target;
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
