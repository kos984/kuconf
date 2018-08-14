import { StringsValue } from '../../types';
import { ECastType, ERule } from '../../Validator';
import { IConfig } from './types';

const rules: StringsValue<IConfig> = {
  db: {
    database: 'string',
    host: 'required_with:db|string',
    password: 'string',
    port: `integer|${ERule.Cast}:${ECastType.Number}`,
    replication: {
      read: [{
        host: 'string',
        password: 'string',
        port: `integer|${ERule.Cast}:${ECastType.Number}`,
        username: 'string',
      }],
      write: {
        host: 'string',
        password: 'string',
        port: `number|${ERule.Cast}:${ECastType.Number}`,
        username: 'string',
      },
    },
    username: 'string',
  },
  features: {
    featureName: {
      enabled: `${ERule.Bool}|${ERule.Cast}:${ECastType.Boolean},false`,
      key: 'required|string',
    },
  },
  queue: {
    first: {
      accessKeyId: 'string',
      endpoint: 'string',
      queueName: 'string',
      queueUrl: 'string',
      region: 'string',
      secretAccessKey: 'string',
    },
    second: {
      accessKeyId: 'string',
      endpoint: 'string',
      queueName: 'string',
      queueUrl: 'string',
      region: 'string',
      secretAccessKey: 'string',
    },
  },
  redis: {
    host: 'string',
    port: 'integer',
    sentinels: [{
      host: 'string',
      port: 'integer',
      test: `required|${ERule.Bool}|${ERule.Cast}:${ECastType.Boolean},false`,
    }],
  },
};

export default rules;
