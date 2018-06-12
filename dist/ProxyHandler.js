"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProxyHandler {
    constructor() {
        this.proxy = Symbol('proxy');
    }
    get(target, name) {
        if (name === this.proxy) {
            return undefined;
        }
        if (typeof name !== 'string') {
            return target[name];
        }
        let value = target[name.toLowerCase()];
        if (!value || typeof value !== 'object') {
            return value;
        }
        // save result for future iterations
        if (value[this.proxy]) {
            return value[this.proxy];
        }
        value[this.proxy] = new Proxy(value, this);
        return value[this.proxy];
    }
    getOwnPropertyDescriptor(target, name) {
        if (name === this.proxy) {
            return undefined;
        }
        const path = typeof name === 'string' ? name.toLowerCase() : name;
        return Object.getOwnPropertyDescriptor(target, path);
    }
}
exports.default = ProxyHandler;
