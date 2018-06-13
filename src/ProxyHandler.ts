import Config from './Config';

const configObjKey = Symbol('config');

export default class ProxyHandler {

  protected proxy = Symbol('proxy');

  public get(target: any, name: any) {
    if (name === this.proxy) {
      return undefined;
    }
    if (typeof name !== 'string') {
      return target[name];
    }
    let value = target[name.toLowerCase()];
    if (!value || typeof value !== 'object') {
      return value;
    }
    // save result for future iterations
    if (value[this.proxy]) {
      return value[this.proxy];
    }
    value[this.proxy] = new Proxy(value, this);
    return value[this.proxy];
  }

  public getOwnPropertyDescriptor(target: any, name: string | any) {
    if (name === this.proxy) {
      return undefined;
    }
    const path = typeof name === 'string' ? name.toLowerCase() : name;
    return Object.getOwnPropertyDescriptor(target, path);
  }
}