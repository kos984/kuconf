import Config from './Config';

export const validate = Symbol('validate'); // move to Config constructor ?
export const rulesPath = Symbol('rulesPath');

export default class ProxyHandler {

  protected proxy = Symbol('proxy');

  public constructor(protected config: Config<any>) {}

  public get(target: any, name: any) {
    if (name === validate) {
      return () => {
        let errors: any;
        if (target[rulesPath] === null ) {
          errors = this.config.getErrorsForPath();
        } else if (target[rulesPath]) {
          errors = this.config.getErrorsForPath(target[rulesPath]);
        }
        return errors;
      };
    }
    if (name === this.proxy || name === rulesPath) {
      return undefined;
    }
    if (typeof name !== 'string') {
      return target[name];
    }
    const value = target[name.toLowerCase()];
    if (!value || typeof value !== 'object') {
      return value;
    }
    // save result for future iterations
    if (value[this.proxy]) {
      return value[this.proxy];
    }
    value[this.proxy] = new Proxy(value, this);
    value[rulesPath] = target[rulesPath] ? `${target[rulesPath]}.${name}` : name;
    return value[this.proxy];
  }

  public getOwnPropertyDescriptor(target: any, name: string | any) {
    if (name === this.proxy || name === rulesPath) {
      return undefined;
    }
    const path = typeof name === 'string' ? name.toLowerCase() : name;
    return Object.getOwnPropertyDescriptor(target, path);
  }
}
