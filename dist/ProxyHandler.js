"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = Symbol('validate'); // move to Config constructor ?
exports.rulesPath = Symbol('rulesPath');
class ProxyHandler {
    constructor(config) {
        this.config = config;
        this.proxy = Symbol('proxy');
        this.hiddenProps = new Map();
        this.cache = new Map();
        this.hiddenProps.set(this.proxy, true);
        this.hiddenProps.set(exports.validate, true);
        this.hiddenProps.set(exports.rulesPath, true);
    }
    get(target, name) {
        if (name === exports.validate) {
            return this[exports.validate](target);
        }
        if (typeof name !== 'string') {
            return target[name];
        }
        const value = target[name.toLowerCase()];
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
        const path = typeof name === 'string' ? name.toLowerCase() : name;
        return Object.getOwnPropertyDescriptor(target, path);
    }
    [exports.validate](target) {
        const path = this.cache.has(target) ? this.cache.get(target).rules : undefined;
        console.log('path', path);
        return () => {
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
