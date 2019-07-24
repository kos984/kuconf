"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("../../Validator");
const rules = {
    db: {
        database: 'string',
        host: 'required_with:db|string',
        password: 'string',
        port: `integer|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Number}`,
        replication: {
            read: [{
                    host: 'string',
                    password: 'string',
                    port: `integer|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Number}`,
                    username: 'string',
                }],
            write: {
                host: 'string',
                password: 'string',
                port: `number|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Number}`,
                username: 'string',
            },
        },
        username: 'string',
    },
    features: {
        featureName: {
            enabled: `${Validator_1.ERule.Bool}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Boolean},false`,
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
                test: `required|${Validator_1.ERule.Bool}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Boolean},false`,
            }],
    },
};
exports.default = rules;
