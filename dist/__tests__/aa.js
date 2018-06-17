"use strict";
// tslint:disable:no-console
Object.defineProperty(exports, "__esModule", { value: true });
const EnvParser_1 = require("../parsers/EnvParser");
process.env.TEST__DB__USERNAME = 'username';
process.env.TEST__DB__PASSWORD = 'password';
process.env.TEST__DB__REPLICATION__WRITE__HOST = 'write.example.com';
process.env.TEST__DB__REPLICATION__READ__0__HOST = 'read0.example.com';
process.env.TEST__DB__REPLICATION__READ__1__HOST = 'read1.example.com';
const env = new EnvParser_1.default({
    prefix: 'TEST__',
});
// console.log(JSON.stringify(env.get(), null, 2));
const Config_1 = require("../Config");
const conf = new Config_1.default({
    db: {
        username: 'username',
        password: 'password',
    },
    redis: {},
}, {
    validation: {
        rules: {
            db: {
                userName: 'required|string',
                password: 'required|string',
            },
            redis: {
                host: 'required|string',
            },
        },
    },
});
const config = conf.getConfig();
console.log(config.db.userName === config.db.username); // true
console.log(conf.validate()); // Error: {"errors":{"redis.host":["The redis.host field is required."]}}
console.log(conf.validate(config.db)); // no errors
console.log(conf.validate(config.redis)); // Error: {"errors":{"redis.host":["The redis.host field is required."]}}
