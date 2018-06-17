"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ProxyHandler_1 = require("./ProxyHandler");
const Validator_1 = require("./Validator");
// FIXME: fix logger
const privateStoreKey = Symbol('config');
class Config {
    constructor(config, options) {
        /** ValidatorJs rules */
        // public schema: any = {};
        this.config = {};
        this.configObject = {};
        this.handler = new ProxyHandler_1.default(this);
        this.config = config;
        // this.schema = this.prepareRules(schema);
        this.options = {
            get: {
                allowed: false,
                separator: '.',
            },
            logger: console,
            validation: null,
            ...options
        };
        this.logger = this.options.logger;
    }
    /**
     * allowed only before getConfig;
     */
    add(path, config) {
        // FIXME: implement
    }
    get(path, defaultValue) {
        if (!this.options.get.allowed) {
            throw new Error('get is not allowed');
        }
        const config = this.getConfig();
        path = path.replace(new RegExp(this.options.get.separator, 'g'), '.');
        return _.get(config, path, defaultValue);
    }
    getConfig() {
        this.initValidator();
        return new Proxy(this.config, this.handler);
    }
    validate(confPart) {
        this.initValidator();
        if (arguments.length > 0 && (!confPart || !confPart[ProxyHandler_1.validate])) {
            throw new Error('only objects allowed for validation');
        }
        const errors = arguments.length !== 0 ? confPart[ProxyHandler_1.validate]() : this.validation.errors;
        if (errors && Object.keys(errors.errors).length) {
            throw new Error(JSON.stringify(errors));
        }
        return this;
    }
    getValidationErrors(path) {
        this.initValidator();
        if (!this.validation.errors) {
            return null;
        }
        if (!path) {
            return this.validation.errors;
        }
        const result = {
            errors: {},
        };
        let found = false;
        Object.keys(this.validation.errors.errors).forEach(key => {
            if (key.indexOf(path) === 0) {
                found = true;
                result.errors[key] = this.validation.errors.errors[key];
            }
        });
        return found ? result : null;
    }
    initValidator() {
        if (!this.options.validation || this.validation) {
            return;
        }
        // FIXME: need own validator, exists it not correct
        this.validation = new Validator_1.default(this.config, this.prepareRules(this.options.validation.rules));
        // all rules should be in lower case, because we use set in validator
        Object.keys(this.validation.rules).forEach(key => {
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
    prepareRules(schema) {
        const result = {};
        const parse = (obj, start) => {
            Object.keys(obj).forEach(key => {
                const fullKey = start ? start + '.' : '';
                const value = obj[key];
                if (typeof value === 'string') {
                    result[`${fullKey}${key}`] = value;
                }
                else if (Array.isArray(value)) {
                    parse(value[0], `${fullKey}${key}.*`);
                }
                else {
                    parse(value, `${fullKey}${key}`);
                }
            });
        };
        parse(schema);
        return result;
    }
}
exports.default = Config;
