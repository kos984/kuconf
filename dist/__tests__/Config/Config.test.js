"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./env");
const Config_1 = require("../../Config");
const validationRules_1 = require("./validationRules");
describe('Config', () => {
    const conf = new Config_1.default(validationRules_1.default, {
        allowGet: true,
        getSeparator: ':',
        logger: console,
    });
    conf
        .parseEnv({
        delimiter: '__',
        doNotWarnIfKeyOverridden: false,
        ignoreOneLodash: true,
        prefix: 'TEST__',
    });
    const config = conf.getConfig();
    it('rules should be parsed', () => {
        expect(conf.validation.rules).toMatchSnapshot();
    });
    it('config should be correct', () => {
        expect(config).toMatchSnapshot();
    });
    it('root validations should not pass', () => {
        expect(() => conf.validate()).toThrowErrorMatchingSnapshot();
    });
    it('db validation should not throw errors', () => {
        expect(() => conf.validate(config.db)).not.toThrowError();
    });
    it('validation redis should throw error', () => {
        expect(() => conf.validate(config.redis.host)).toThrowErrorMatchingSnapshot();
    });
    // FIXME: need add this to doc
    it('validation redis.host should throw error', () => {
        expect(() => conf.validate(config.redis.host)).toThrowErrorMatchingSnapshot();
    });
    it('validation redis.sentinels[0] should throw error', () => {
        expect(() => conf.validate(config.redis.sentinels[0])).toThrowErrorMatchingSnapshot();
    });
    it('validation redis.sentinels[1] should pass', () => {
        expect(() => conf.validate(config.redis.sentinels[1])).not.toThrowError();
    });
    it('config should be case-insensitive', () => {
        const c = config;
        expect(config.db === c.DB).toBeTruthy();
        expect(config.db.username === c.db.UserName).toBeTruthy();
        expect(config.db.database === c.db.dataBase).toBeTruthy();
    });
});
