import * as _ from 'lodash';
import ProxyHandler, { validate as partialValidate } from './ProxyHandler';
import { IConfigOptions, ILogger } from './types';
import Validator from './Validator';

const privateStoreKey = Symbol('config');

export default class Config<ConfigSchema> {

  /** ValidatorJs rules */
  // public schema: any = {};

  protected config: object = {};
  protected configObject: ConfigSchema;

  protected handler: ProxyHandler;
  protected logger: ILogger;
  protected validation: Validator.Validator<any>;
  // protected parsedKeyPaths: string[] = [];
  protected options: IConfigOptions;

  protected [privateStoreKey]: Map<any, any>;

  constructor(config: object, options?: Partial<IConfigOptions>) {
    this.options = {
      get: {
        allowed: false,
        separator: '.',
      },
      logger: console,
      validation: null,
      ...options};
    this.logger = this.options.logger;
    this.config = this.options.caseSensitive ? config : this.objectToLower(config);
    this.handler = new ProxyHandler(this, { caseSensitive: this.options.caseSensitive });
  }

  public merge(obj: Partial<ConfigSchema>): Config<ConfigSchema> {
    this.config = _.merge(this.config, this.options.caseSensitive ? obj : this.objectToLower(obj));
    // reset validation;
    this.validation = null;
    this.initValidator();
    return this;
  }

  public get(path: string, defaultValue?: any) {
    if (!this.options.get.allowed) {
      throw new Error('get is not allowed');
    }
    const config = this.getConfig();
    path = path.replace(new RegExp(this.options.get.separator, 'g'), '.');
    return _.get(config, path, defaultValue);
  }

  public getConfig(): ConfigSchema {
    if (this.configObject) {
      return this.configObject;
    }
    this.initValidator();
    this.configObject = new Proxy(this.config as any, this.handler);
    return this.configObject;
  }

  public validate(confPart?: any) {
    this.initValidator();
    if (arguments.length > 0 && (!confPart || !confPart[partialValidate])) {
      throw new Error('only objects allowed for validation');
    }
    const errors = arguments.length !== 0 ? confPart[partialValidate]() : this.validation.errors;
    if (errors && Object.keys(errors.errors).length) {
      throw new Error(JSON.stringify(errors));
    }
    return this;
  }

  public getValidationErrors(path?: string) {
    this.initValidator();
    if (!this.validation.errors) {
      return null;
    }
    if (!path) {
      return this.validation.errors;
    } else if (!this.options.caseSensitive) {
      path = path.toLowerCase();
    }
    const result: any = {
      errors: {},
    };
    let found = false;
    Object.keys(this.validation.errors.errors).forEach(key => {
      if (key.indexOf(path) === 0) {
        found = true;
        result.errors[key] = (this.validation.errors.errors as any)[key];
      }
    });
    return found ? result : null;
  }

  protected initValidator() {
    if (!this.options.validation || this.validation) {
      return;
    }
    this.validation = new Validator(this.config, this.prepareRules(this.options.validation.rules));
    Object.keys(this.validation.rules).forEach( key => {
      const newKey = this.options.caseSensitive ? key : key.toLowerCase();
      if (key !== newKey) {
        this.validation.rules[newKey] = this.validation.rules[key];
        delete this.validation.rules[key];
      }
    });
    this.validation.fails();
  }

  // in progress, so for not not public
  /*
  private omitNotValidatedProps(params: IOmitNotValidatedProps) {
    params = { logOmitted: true, ...params };
    this.initValidator();
    const newConfig = {};
    const rules: { [key: string]: boolean} = {};
    Object.keys(this.validation.rules).forEach(rule => (rules[rule.toLowerCase()] = true));
    for (const path of this.parsedKeyPaths) {
      if (!rules[path]) {
        if (params.logOmitted) {
          this.logger.warn(`path: ${path} is not under validation and will be omitted`);
        }
      } else {
        _.set(newConfig, path, _.get(this.config, path));
      }
    }
    // add default keys
    Object.keys(rules).forEach(path => {
      if (_.has(this.config, path)) {
        _.set(newConfig, path, _.get(this.config, path));
      }
    });

    this.config = newConfig as ConfigSchema;

    return this;
  }

  */

  protected objectToLower(obj: any, result: any = {}): any {
    if (Array.isArray(obj)) {
      return obj.map(o => this.objectToLower(o));
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach((key: string) => {
        const path = typeof key === 'string' ? key.toLowerCase() : key;
        const value = this.objectToLower(obj[key], result[key] ? result[key] : {});
        result[path] = value;
      });
      return result;
    }
    return obj;
  }

  protected prepareRules(schema: any) {
    const result: { [key: string]: string } = {};
    const parse = (obj: any, start?: string) => {
      Object.keys(obj).forEach(key => {
        const fullKey = start ? start + '.' : '';
        const value = obj[key];
        if (typeof value === 'string') {
          result[`${fullKey}${key}`] = value;
        } else if (Array.isArray(value)) {
          parse(value[0], `${fullKey}${key}.*`);
        } else {
          parse(value, `${fullKey}${key}`);
        }
      });
    };
    parse(schema);
    return result;
  }

}
