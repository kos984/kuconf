"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = Symbol('validate'); // move to Config constructor ?
exports.rulesPath = Symbol('rulesPath');
class ProxyHandler {
    constructor(config) {
        this.config = config;
        this.proxy = Symbol('proxy');
    }
    get(target, name) {
        if (name === exports.validate) {
            return () => {
                let errors;
                if (target[exports.rulesPath] === null) {
                    errors = this.config.getErrorsForPath();
                }
                else if (target[exports.rulesPath]) {
                    errors = this.config.getErrorsForPath(target[exports.rulesPath]);
                }
                return errors;
            };
        }
        if (name === this.proxy || name === exports.rulesPath) {
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
        value[exports.rulesPath] = target[exports.rulesPath] ? `${target[exports.rulesPath]}.${name}` : name;
        return value[this.proxy];
    }
    getOwnPropertyDescriptor(target, name) {
        if (name === this.proxy || name === exports.rulesPath) {
            return undefined;
        }
        const path = typeof name === 'string' ? name.toLowerCase() : name;
        return Object.getOwnPropertyDescriptor(target, path);
    }
}
exports.default = ProxyHandler;
