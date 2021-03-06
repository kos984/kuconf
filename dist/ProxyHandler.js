"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = Symbol('validate'); // move to Config constructor ?
exports.rulesPath = Symbol('rulesPath');
exports.toObject = Symbol('toObject');
class ProxyHandler {
    constructor(config, options) {
        this.config = config;
        this.proxy = Symbol('proxy');
        this.hiddenProps = new Map();
        this.cache = new Map();
        this.hiddenProps.set(this.proxy, true);
        this.hiddenProps.set(exports.validate, true);
        this.hiddenProps.set(exports.rulesPath, true);
        this.options = options;
    }
    get(target, name) {
        if (name === exports.validate) {
            return this[exports.validate](target);
        }
        if (name === exports.toObject) {
            return () => this[exports.toObject](target);
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
        const proxyValue = new Proxy(value, this);
        this.cache.set(value, {
            proxy: proxyValue,
            rules: this.cache.has(target) ? `${this.cache.get(target).rules}.${name}` : name,
        });
        return proxyValue;
    }
    getOwnPropertyDescriptor(target, name) {
        const path = typeof name === 'string' && this.options.caseSensitive ? name.toLowerCase() : name;
        return Object.getOwnPropertyDescriptor(target, path);
    }
    [exports.toObject](target) {
        return target;
    }
    [exports.validate](target) {
        return () => {
            const path = this.cache.has(target) ? this.cache.get(target).rules : undefined;
            let errors = null;
            if (path === null) {
                errors = this.config.getValidationErrors();
            }
            else if (path) {
                errors = this.config.getValidationErrors(path);
            }
            return errors;
        };
    }
}
exports.default = ProxyHandler;
