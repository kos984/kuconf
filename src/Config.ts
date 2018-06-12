import * as _ from 'lodash';
import { ILogger, IConfigOptions, IParseEnvParams, IOmitNotValidatedProps } from "./types";
import * as ValidatorJs from 'validatorjs';
import ProxyHandler from './ProxyHandler';

const proxy = Symbol('proxy');

export default class Config<ConfigSchema> {

  protected handler = new ProxyHandler();

  /** ValidatorJs rules */
  protected schema: any = {};
  protected config: any = {};
  protected logger: ILogger;
  protected validation: ValidatorJs.Validator<any>;
  protected parsedKeyPaths: string[] = [];

  constructor(schema: object, options?: IConfigOptions) {
    this.schema = schema;
    options = { logger: console, ...options};
    this.logger = options.logger;
  }

  public parseEnv(params?: IParseEnvParams) {
    const { prefix, delimiter, ignoreOneLodash, doNotWarnIfKeyOverridden } = {
      prefix: '',
      delimiter: '__',
      ignoreOneLodash: false,
      doNotWarnIfKeyOverridden: false,
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

  public validate() {
    this.validation = new ValidatorJs(this.config, this.schema);
    // all rules should be in lower case, because we use set in validator
    Object.keys(this.validation.rules).forEach( key => {
      const newKey = key.toLowerCase();
      if (key !== newKey) {
        this.validation.rules[newKey] = this.validation.rules[key];
        delete this.validation.rules[key];
      }
    });
    if (this.validation.fails()) {
      throw new Error(JSON.stringify(this.validation.errors));
    }
    return this;
  }

  public omitNotValidatedProps(params: IOmitNotValidatedProps) {
    params = { logOmitted: true, ...params };
    if (!this.validation) {
      this.validate();
    }
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

    this.config = newConfig;

    return this;
  }

  public getConfig(): ConfigSchema {
    return new Proxy(this.config, this.handler);
  }
}
