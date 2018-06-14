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
