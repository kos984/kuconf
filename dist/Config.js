"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ValidatorJs = require("validatorjs");
const ProxyHandler_1 = require("./ProxyHandler");
const proxy = Symbol('proxy');
class Config {
    constructor(schema, options) {
        /** ValidatorJs rules */
        this.schema = {};
        this.handler = new ProxyHandler_1.default(this);
        this.parsedKeyPaths = [];
        this.config = {};
        this.schema = schema;
        this.options = { logger: console, allowGet: false, getSeparator: '.', ...options };
        this.logger = this.options.logger;
    }
    get(path, defaultValue) {
        if (!this.options.allowGet) {
            throw new Error('get is not allowed');
        }
        const config = this.getConfig();
        path = path.replace(new RegExp(this.options.getSeparator, 'g'), '.');
        return _.get(config, path, defaultValue);
    }
    parseEnv(params) {
        const { prefix, delimiter, ignoreOneLodash, doNotWarnIfKeyOverridden } = {
            delimiter: '__',
            doNotWarnIfKeyOverridden: false,
            ignoreOneLodash: false,
            prefix: '',
            ...params
        };
        const config = this.config;
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
    validate(confPart) {
        this.initValidator();
        const errors = confPart ? confPart[ProxyHandler_1.validate]() : this.validation.errors;
        if (errors) {
            throw new Error(JSON.stringify(errors));
        }
        return this;
    }
    omitNotValidatedProps(params) {
        params = { logOmitted: true, ...params };
        this.initValidator();
        const newConfig = {};
        const rules = {};
        Object.keys(this.validation.rules).forEach(rule => (rules[rule.toLowerCase()] = true));
        for (const path of this.parsedKeyPaths) {
            if (!rules[path]) {
                if (params.logOmitted) {
                    this.logger.warn(`path: ${path} is not under validation and will be omitted`);
                }
            }
            else {
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
    getConfig() {
        this.initValidator();
        return new Proxy(this.config, this.handler);
    }
    generateEnv() {
        this.initValidator();
        const rules = this.validation.rules;
        return Object.keys(rules).map((rule) => {
            return 'TEST__' + rule.replace(/\./g, '__').toUpperCase() + '=';
        }); // FIXME: delimiter
    }
    getErrorsForPath(path) {
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
        if (this.validation) {
            return;
        }
        this.validation = new ValidatorJs(this.config, this.schema);
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
}
exports.default = Config;
