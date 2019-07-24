import './env';

import * as _ from 'lodash';
import Config from '../../Config';
import EnvParser from '../../parsers/EnvParser';
import { IConfig } from './types';
import rules from './validationRules';

const prefix = 'TEST__';

describe('Config [default settings]', () => {

  describe('toObject test', () => {
    it('toObject', () => {
      const envParser = new EnvParser({ prefix });
      const conf = new Config<IConfig>(envParser.get(), {
        caseSensitive: false,
      });
      const config = conf.getConfig();
      expect(conf.toObject(config.db)).toMatchSnapshot();
    });
  });

  describe('[options] caseSensitive', () => {
    it('config should be case-insensitive', () => {
      const envParser = new EnvParser({ prefix });
      const conf = new Config<IConfig>(envParser.get(), {
        validation: { rules },
      });
      const config = conf.getConfig();
      const c: any = config;
      expect(config.db === c.DB).toBeTruthy();
      expect(config.db.username === c.db.UserName).toBeTruthy();
      expect(config.db.database === c.db.dataBase).toBeTruthy();
      // expect(config.queue).toMatchSnapshot();
    });
    it('config should be case-sensitive', () => {
      const envParser = new EnvParser({ prefix, lower: true });
      const conf = new Config<IConfig>(envParser.get(), {
        caseSensitive: true,
        validation: { rules },
      });
      const config = conf.getConfig();
      expect(config.db).toMatchSnapshot();
      expect((config as any).DB).not.toBeDefined();
    });
  });
  describe('[options] validation', () => {
    const envParser = new EnvParser({ prefix });
    const conf = new Config<IConfig>(envParser.get(), {
      validation: { rules },
    });
    const config = conf.getConfig();
    it ('rules should be parsed', () => {
      expect((conf as any).validation.rules).toMatchSnapshot();
    });
    it ('config should be correct', () => {
      expect(config).toMatchSnapshot();
    });
    it ('root validations should not pass', () => {
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
    const envParser = new EnvParser({ prefix, lower: true });
    describe('true', () => {
      const conf = new Config<IConfig>(envParser.get(), {
        get: { allowed: true, separator: ':' },
        validation: { rules },
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
      const conf = new Config<IConfig>(envParser.get(), {
        validation: { rules },
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
    const envParser = new EnvParser({ prefix });
    const conf = new Config<IConfig>(envParser.get(), {
      validation: { rules },
    });
    conf.merge({ db: { port: 777 } as any});
    const config = conf.getConfig();
    expect(config).toMatchSnapshot();
    conf.merge({ db: { port: '7777' } as any});
    expect(config).toMatchSnapshot();
  });
});
