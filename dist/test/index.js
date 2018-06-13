"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Config_1 = require("../Config");
// db
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
const conf = new Config_1.default({
    redis: {
        host: 'string',
        port: 'integer',
        sentinels: {
            '*.host': 'string',
            '*.port': 'integer',
        }
    },
    db: {
        host: 'required_with:db|string',
        username: 'string',
        password: 'string',
        database: 'string',
        port: 'integer',
        replication: {
            write: {
                host: 'string',
                username: 'string',
                password: 'string',
                port: 'number',
            },
            read: {
                '*.host': 'string',
                '*.username': 'string',
                '*.password': 'string',
                '*.port': 'integer',
            },
        },
    }
}, {
    allowGet: true,
    getSeparator: ':',
    logger: console,
});
const config = conf
    .parseEnv({ prefix: 'TEST__' })
    .validate()
    .getConfig();
function memUsed() {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}
console.log(conf.generateEnv());
console.log('config', config);
const testArr = [];
const items = 100000;
for (let i = 0; i < items; i++) {
    testArr.push(0);
}
memUsed();
for (let i = 0; i < items; i++) {
    testArr[i] = config.db.replication;
    // console.log(config.obj);
}
console.log(testArr[0] === testArr[1]);
console.log(config.db.replication.read === conf.get('db:replication:read'));
console.log(conf.get('db:replication:read') === _.get(config, 'db.replication.read'));
memUsed();
