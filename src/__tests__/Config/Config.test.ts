import './env';

import * as _ from 'lodash';
import Config from '../../Config';
import EnvParser from '../../parsers/EnvParser';
import { IConfig } from './types';
import rules from './validationRules';

describe('Config', () => {
  const conf = new Config<IConfig>(
    (new EnvParser({ prefix: 'TEST__' })).get(),
    {
      get: {
        allowed: true,
        separator: ':',
      },
      validation: {
        rules,
      },
    },
  );
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
    const c: any = config;
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
