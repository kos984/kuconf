"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./env");
const Config_1 = require("../../Config");
const validationRules_1 = require("./validationRules");
describe('Config', () => {
    it('config', () => {
        const conf = new Config_1.default(validationRules_1.default, {
            allowGet: true,
            getSeparator: ':',
            logger: console,
        });
        conf
            .parseEnv({
            delimiter: '__',
            doNotWarnIfKeyOverridden: false,
            ignoreOneLodash: true,
            prefix: 'TEST__',
        });
        const config = conf.getConfig();
        expect(conf.validation.rules).toMatchSnapshot();
        expect(config).toMatchSnapshot();
    });
});
