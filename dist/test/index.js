"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../Config");
process.env.TEST__AAA = 'test';
process.env['TEST__AA__0'] = 'test';
process.env['TEST__AA__1'] = 'test';
process.env['TEST__AA__2'] = 'test';
process.env.TEST__OBJ__A = 'test';
process.env.TEST__OBJ__B = 'test';
process.env.TEST__OBJ__C = 'test';
const conf = new Config_1.default({
    aa: 'string',
});
const config = conf
    .parseEnv({ prefix: 'TEST__' })
    // .validate()
    .getConfig();
function memUsed() {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}
console.log('config', config);
const testArr = [];
const items = 100000;
for (let i = 0; i < items; i++) {
    testArr.push(0);
}
memUsed();
for (let i = 0; i < items; i++) {
    testArr[i] = config.obj;
    // console.log(config.obj);
}
console.log(testArr[0] === testArr[1]);
memUsed();
