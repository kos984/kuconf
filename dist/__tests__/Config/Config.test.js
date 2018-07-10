"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./env");
const _ = require("lodash");
const Config_1 = require("../../Config");
const EnvParser_1 = require("../../parsers/EnvParser");
const validationRules_1 = require("./validationRules");
const prefix = 'TEST__';
describe('Config [default settings]', () => {
    describe('[options] caseSensitive', () => {
        it('config should be case-insensitive', () => {
            const envParser = new EnvParser_1.default({ prefix });
            const conf = new Config_1.default(envParser.get(), {
                validation: { rules: validationRules_1.default },
            });
            const config = conf.getConfig();
            const c = config;
            expect(config.db === c.DB).toBeTruthy();
            expect(config.db.username === c.db.UserName).toBeTruthy();
            expect(config.db.database === c.db.dataBase).toBeTruthy();
        });
        it('config should be case-sensitive', () => {
            const envParser = new EnvParser_1.default({ prefix, lower: true });
            const conf = new Config_1.default(envParser.get(), {
                caseSensitive: true,
                validation: { rules: validationRules_1.default },
            });
            const config = conf.getConfig();
            expect(config.db).toMatchSnapshot();
            expect(config.DB).not.toBeDefined();
        });
    });
    describe('[options] validation', () => {
        const envParser = new EnvParser_1.default({ prefix });
        const conf = new Config_1.default(envParser.get(), {
            validation: { rules: validationRules_1.default },
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
        it('validation case isensitive should return errors', () => {
            expect(conf.getValidationErrors('features.featureName')).toMatchSnapshot();
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
    });
    describe('[options] get', () => {
        const envParser = new EnvParser_1.default({ prefix, lower: true });
        describe('true', () => {
            const conf = new Config_1.default(envParser.get(), {
                get: { allowed: true, separator: ':' },
                validation: { rules: validationRules_1.default },
            });
            const config = conf.getConfig();
            expect(config.db).toMatchSnapshot();
            it('conf.get should works', () => {
                expect(config.db.replication.write === conf.get('db:replication:write')).toBeTruthy();
                expect(config.db.replication.write === conf.get('db.replication.write')).toBeTruthy();
            });
            it('lodash get should works', () => {
                expect(config.db.replication.write === _.get(config, 'db.replication.write'));
            });
        });
        describe('false', () => {
            const conf = new Config_1.default(envParser.get(), {
                validation: { rules: validationRules_1.default },
            });
            const config = conf.getConfig();
            expect(config.db).toMatchSnapshot();
            it('conf.get should not allow get', () => {
                expect(() => conf.get('db:replication:write')).toThrowErrorMatchingSnapshot();
            });
            it('lodash get should works', () => {
                expect(config.db.replication.write === _.get(config, 'db.replication.write'));
            });
        });
    });
    describe('merge', () => {
        const envParser = new EnvParser_1.default({ prefix });
        const conf = new Config_1.default(envParser.get(), {
            validation: { rules: validationRules_1.default },
        });
        conf.merge({ db: { port: 777 } });
        const config = conf.getConfig();
        expect(config).toMatchSnapshot();
        conf.merge({ db: { port: '7777' } });
        expect(config).toMatchSnapshot();
    });
});
