// tslint:disable:no-console

import EnvParser from '../parsers/EnvParser';

process.env.TEST__DB__USERNAME = 'username';
process.env.TEST__DB__PASSWORD = 'password';
process.env.TEST__DB__REPLICATION__WRITE__HOST = 'write.example.com';
process.env.TEST__DB__REPLICATION__READ__0__HOST = 'read0.example.com';
process.env.TEST__DB__REPLICATION__READ__1__HOST = 'read1.example.com';

const env = new EnvParser({
  prefix: 'TEST__',
});
console.log(JSON.stringify(env.get(), null, 2));
