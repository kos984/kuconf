"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.TEST__DB__USERNAME = 'username';
process.env.TEST__DB__PASSWORD = 'password';
process.env.TEST__DB__HOST = 'localhost';
process.env.TEST__DB__DATABASE = 'test';
process.env.TEST__DB__PORT = '3306';
process.env.TEST__DB__REPLICATION__WRITE__HOST = 'write.example.com';
process.env.TEST__DB__REPLICATION__WRITE__USERNAME = 'username_write';
process.env.TEST__DB__REPLICATION__WRITE__PASSWORD = 'password_write';
process.env.TEST__DB__REPLICATION__READ__0__HOST = 'read0.example.com';
process.env.TEST__DB__REPLICATION__READ__0__USERNAME = 'username_read_0';
process.env.TEST__DB__REPLICATION__READ__0__PASSWORD = 'password_read_0';
process.env.TEST__DB__REPLICATION__READ__1__HOST = 'read1.example.com';
process.env.TEST__DB__REPLICATION__READ__1__USERNAME = 'username_read_1';
process.env.TEST__DB__REPLICATION__READ__1__PASSWORD = 'password_read_1';
process.env.TEST__REDIS__SENTINELS__0__HOST = 'localhost';
process.env.TEST__REDIS__SENTINELS__0__PORT = '26379';
process.env.TEST__REDIS__SENTINELS__0__TEST = 'TEST';
process.env.TEST__REDIS__SENTINELS__1__HOST = 'localhost';
process.env.TEST__REDIS__SENTINELS__1__PORT = '26379';
process.env.TEST__REDIS__SENTINELS__1__TEST = 'true';
exports.default = null;