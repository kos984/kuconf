"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("../Validator");
describe('Validator', () => {
    it(`rule: ${Validator_1.ERule.Bool}`, () => {
        const validator = new Validator_1.default([
            'true', 'false', true, false, 'True', 'False', 'any',
        ], {
            '*': Validator_1.ERule.Bool,
        });
        validator.fails();
        expect(validator.errors).toMatchSnapshot();
    });
});
