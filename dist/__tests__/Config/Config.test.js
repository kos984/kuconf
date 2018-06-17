"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./env");
const _ = require("lodash");
const Config_1 = require("../../Config");
const EnvParser_1 = require("../../parsers/EnvParser");
const validationRules_1 = require("./validationRules");
describe('Config', () => {
    const conf = new Config_1.default((new EnvParser_1.default({ prefix: 'TEST__' })).get(), {
        get: {
            allowed: true,
            separator: ':',
        },
        validation: {
            rules: validationRules_1.default,
        },
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
    it('lodash get should works', () => {
        expect(config.db.replication.write === _.get(config, 'db.replication.write'));
    });
    it('conf.get should works', () => {
        expect(config.db.replication.write === conf.get('db.replication.write'));
    });
});
