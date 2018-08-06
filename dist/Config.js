"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ProxyHandler_1 = require("./ProxyHandler");
const Validator_1 = require("./Validator");
const privateStoreKey = Symbol('config');
class Config {
    constructor(config, options) {
        /** ValidatorJs rules */
        // public schema: any = {};
        this.config = {};
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
        this.config = this.options.caseSensitive ? config : this.objectToLower(config);
        this.handler = new ProxyHandler_1.default(this, { caseSensitive: this.options.caseSensitive });
    }
    merge(obj) {
        this.config = _.merge(this.config, this.options.caseSensitive ? obj : this.objectToLower(obj));
        // reset validation;
        this.validation = null;
        this.initValidator();
        return this;
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
        if (this.configObject) {
            return this.configObject;
        }
        this.initValidator();
        this.configObject = new Proxy(this.config, this.handler);
        return this.configObject;
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
        else if (!this.options.caseSensitive) {
            path = path.toLowerCase();
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
        this.validation = new Validator_1.default(this.config, this.prepareRules(this.options.validation.rules));
        Object.keys(this.validation.rules).forEach(key => {
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
    objectToLower(obj, result = {}) {
        if (Array.isArray(obj)) {
            return obj.map(o => this.objectToLower(o));
        }
        else if (typeof obj === 'object') {
            Object.keys(obj).forEach((key) => {
                const path = typeof key === 'string' ? key.toLowerCase() : key;
                const value = this.objectToLower(obj[key], obj[key] ? obj[key] : {});
                result[path] = value;
            });
            return result;
        }
        return obj;
    }
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
