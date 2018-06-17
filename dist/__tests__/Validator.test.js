"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("../Validator");
describe('Validator', () => {
    it(`rule: ${Validator_1.ERule.Bool}`, () => {
        const validator = new Validator_1.default({
            arr: ['true', 'false', true, false, 'True', 'False', 'any'],
        }, {
            'arr.*': Validator_1.ERule.Bool,
        });
        validator.fails();
        expect(validator.errors).toMatchSnapshot();
    });
    it(`rule: ${Validator_1.ERule.ObjectKeysIn}`, () => {
        const validator = new Validator_1.default({
            arr: [
                { prop: 'Y' },
                { prop: 'N' },
                { prop: 'A' },
                { prop: 'B' },
            ],
        }, {
            'arr.*': `${Validator_1.ERule.ObjectKeysIn}:Y,N`,
        });
        validator.fails();
        expect(validator.errors).toMatchSnapshot();
    });
    it(`rule: ${Validator_1.ERule.Cast}`, () => {
        const payload = {
            bool: 'true',
            date: '1999-12-31',
            number: '100',
        };
        const validator = new Validator_1.default(payload, {
            // should cast if value exists
            bool: `${Validator_1.ERule.Bool}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Boolean}`,
            date: `${Validator_1.ERule.Date}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Date}`,
            number: `${Validator_1.ERule.Numeric}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Number}`,
            // should set default property if value not exists
            boolDefaultFalse: `${Validator_1.ERule.Bool}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Boolean},false`,
            boolDefaultTrue: `${Validator_1.ERule.Bool}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Boolean},true`,
            dateDefault: `${Validator_1.ERule.Date}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Date}:1999-12-31`,
            dateTimeDefault: `${Validator_1.ERule.Cast}:${Validator_1.ECastType.Date},1999-12-31T00:00:00`,
            numberDefault: `${Validator_1.ERule.Numeric}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Number},100`,
            // should not set if property not exists
            boolEmpty: `${Validator_1.ERule.Bool}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Boolean}`,
            dateEmpty: `${Validator_1.ERule.Date}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Date}`,
            numberEmpty: `${Validator_1.ERule.Numeric}|${Validator_1.ERule.Cast}:${Validator_1.ECastType.Number}`,
        });
        validator.fails();
        expect(validator.errors).toMatchSnapshot();
        expect(payload).toMatchSnapshot();
    });
});