import * as _ from 'lodash';
import ProxyHandler, { validate as partialValidate } from './ProxyHandler';
import { IConfigOptions, IGenerateEnvParams, ILogger, IOmitNotValidatedProps } from './types';
import Validator from './Validator';

// FIXME: fix logger

const privateStoreKey = Symbol('config');

export default class Config<ConfigSchema> {

  /** ValidatorJs rules */
  // public schema: any = {};

  protected config: object = {};
  protected configObject: ConfigSchema = {} as ConfigSchema;

  protected handler = new ProxyHandler(this);
  protected logger: ILogger;
  protected validation: Validator.Validator<any>;
  // protected parsedKeyPaths: string[] = [];
  protected options: IConfigOptions;

  protected [privateStoreKey]: Map<any, any>;

  constructor(config: object, options?: Partial<IConfigOptions>) {
    this.config = config;
    // this.schema = this.prepareRules(schema);
    this.options = {
      get: {
        allowed: false,
        separator: '.',
      },
      logger: console,
      validation: null,
      ...options};
    this.logger = this.options.logger;
  }

  /**
   * allowed only before getConfig;
   */
  public add(path: string, config: object) {
    // FIXME: implement

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
    this.initValidator();
    return new Proxy(this.config as any, this.handler);
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
    // FIXME: need own validator, exists it not correct
    this.validation = new Validator(this.config, this.prepareRules(this.options.validation.rules));
    // all rules should be in lower case, because we use set in validator
    Object.keys(this.validation.rules).forEach( key => {
      const newKey = key.toLowerCase();
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
