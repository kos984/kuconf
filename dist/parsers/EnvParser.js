"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class EnvParser {
    constructor(params) {
        this.parsed = {};
        this.params = {
            delimiter: '__',
            format: key => {
                return this.params.ignoreOneLodash ? key.replace(/_/g, '') : key.toLowerCase();
            },
            ignoreOneLodash: false,
            lower: true,
            prefix: '',
            ...params,
        };
        this.parse();
    }
    get() {
        return this.parsed;
    }
    parse() {
        const { prefix, delimiter, format } = this.params;
        const parsed = this.parsed;
        Object.keys(process.env)
            .filter(key => (key.indexOf(prefix) === 0))
            .map(key => {
            const keyPath = key
                .replace(prefix, '')
                .split(delimiter)
                .map(subKey => format(subKey))
                .join('.');
            _.set(parsed, keyPath, process.env[key]);
        });
        return this;
    }
}
exports.default = EnvParser;
