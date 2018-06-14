import * as _ from 'lodash';
import * as ValidatorJs from 'validatorjs';
import ProxyHandler, { validate as partialValidate } from './ProxyHandler';
import { IConfigOptions, IGenerateEnvParams, ILogger, IOmitNotValidatedProps, IParseEnvParams } from './types';

export default class Config<ConfigSchema> {

  /** ValidatorJs rules */
  public schema: any = {};

  protected handler = new ProxyHandler(this);
  protected logger: ILogger;
  protected validation: ValidatorJs.Validator<any>;
  protected parsedKeyPaths: string[] = [];
  protected config: ConfigSchema = {} as ConfigSchema;
  protected options: IConfigOptions;

  constructor(schema: object, options?: IConfigOptions) {
    this.schema = schema;
    this.options = { logger: console, allowGet: false, getSeparator: '.', ...options};
    this.logger = this.options.logger;
  }

  public get(path: string, defaultValue?: any) {
    if (!this.options.allowGet) {
      throw new Error('get is not allowed');
    }
    const config = this.getConfig();
    path = path.replace(new RegExp(this.options.getSeparator, 'g'), '.');
    return _.get(config, path, defaultValue);
  }

  public parseEnv(params?: IParseEnvParams) {
    const { prefix, delimiter, ignoreOneLodash, doNotWarnIfKeyOverridden } = {
      delimiter: '__',
      doNotWarnIfKeyOverridden: false,
      ignoreOneLodash: false,
      prefix: '',
      ...params };
    const config: any = this.config;
    Object.keys(process.env)
      .filter(key => (key.indexOf(prefix) === 0))
      .map(key => {
        let keyPath = key.replace(prefix, '').split(delimiter).join('.').toLowerCase();
        if (ignoreOneLodash) {
          keyPath = keyPath.replace(/_/g, '');
        }
        if (_.has(config, keyPath) && !doNotWarnIfKeyOverridden) {
          this.logger.warn(`key ${key} will override defined property: ${keyPath}`);
        }
        this.parsedKeyPaths.push(keyPath);
        _.set(config, keyPath, process.env[key]);
      });
    return this;
  }

  public validate(confPart?: any) {
    this.initValidator();
    const errors = confPart ? confPart[partialValidate]() : this.validation.errors;
    if (errors) {
      throw new Error(JSON.stringify(errors));
    }
    return this;
  }

  public omitNotValidatedProps(params: IOmitNotValidatedProps) {
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

  public getConfig(): ConfigSchema {
    this.initValidator();
    return new Proxy(this.config as any, this.handler);
  }

  public generateEnv(params?: IGenerateEnvParams): string[] {
    const { prefix, delimiter } = {
      delimiter: '__',
      prefix: '',
      ...params };
    this.initValidator();
    const rules = this.validation.rules;
    return Object.keys(rules).map((rule: string) => {
      return prefix + rule.replace(/\./g, delimiter).toUpperCase() + '=';
    });
  }

  public getErrorsForPath(path?: string) {
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
    if (this.validation) {
      return;
    }
    this.validation = new ValidatorJs(this.config, this.schema);
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

}
