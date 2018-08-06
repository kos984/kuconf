import { StringsValue } from '../../types';
import { IConfig } from './types';

const rules: StringsValue<IConfig> = {
  db: {
    database: 'string',
    host: 'required_with:db|string',
    password: 'string',
    port: 'integer|cast:number',
    replication: {
      read: [{
        host: 'string',
        password: 'string',
        port: 'integer|cast:number',
        username: 'string',
      }],
      write: {
        host: 'string',
        password: 'string',
        port: 'number|cast:number',
        username: 'string',
      },
    },
    username: 'string',
  },
  features: {
    featureName: {
      enabled: 'bool|cast:boolean,false',
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
      test: 'required|bool|cast:boolean,false',
    }],
  },
};

export default rules;
