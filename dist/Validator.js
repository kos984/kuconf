"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const _ = require("lodash");
const Validator = require("validatorjs");
var ECastType;
(function (ECastType) {
    ECastType["Number"] = "number";
    ECastType["Boolean"] = "boolean";
    ECastType["Date"] = "Date";
    ECastType["String"] = "string";
})(ECastType = exports.ECastType || (exports.ECastType = {}));
var ERule;
(function (ERule) {
    ERule["Required"] = "required";
    ERule["Date"] = "date";
    ERule["Numeric"] = "numeric";
    ERule["String"] = "string";
    ERule["Min"] = "min";
    ERule["Max"] = "max";
    ERule["Integer"] = "integer";
    /** value should be strict equals 'true' or 'false' */
    ERule["Bool"] = "kuConfBool";
    /**
     * object should have properties only in listed values;
     * objectKeysIn:Y,N will check attrs: {a: 'Y', b: 'N'}
     */
    ERule["ObjectKeysIn"] = "kuConfObjectKeysIn";
    /**
     * cast:ECastType,defaultValue
     *
     * @example
     * const rules = { '*.age': `numeric|${ERule.Cast}:${ECastType.Number},10` };
     * const data = [{ age: '4' }, { name: 'test' }, { age: 5 }];
     *
     * @description should be last rule in the list, will not update inputValue
     */
    ERule["Cast"] = "kuConfCast";
})(ERule = exports.ERule || (exports.ERule = {}));
Validator.register(ERule.Bool, (value) => {
    return typeof value === 'boolean' || value === 'true' || value === 'false';
}, 'The :attribute must be a true or false');
Validator.register(ERule.ObjectKeysIn, function (value, params, attribute) {
    const ruleIn = this.validator.getRule('in');
    for (const key of Object.keys(value)) {
        const val = value[key];
        const rulePassed = ruleIn.validate(val, params, `${attribute}.${key}`);
        if (!rulePassed) {
            return false;
        }
    }
    return true;
}, `The :attribute keys should be in :${ERule.ObjectKeysIn}`);
/** should be last rule in a queue, will not update inputValue */
Validator.registerImplicit(ERule.Cast, function (value, input, path) {
    const source = this.validator.input;
    const [type, defaultValue] = input.split(',');
    if (!_.has(source, path)) {
        if (defaultValue) {
            value = defaultValue;
        }
        else {
            return true;
        }
    }
    else if (typeof value !== 'string') {
        // cast string only
        return true;
    }
    if (typeof value !== 'string') {
        // no need cast if value is not string
        return true;
    }
    if (exports.castHandlers[type]) {
        value = exports.castHandlers[type](value);
    }
    _.set(source, path, value);
    return true;
}, 'Cast rule not supports');
// test cast
{
    const data = [{ age: '4' }, { name: 'test' }, { age: 5 }];
    const rules = { '*.age': `numeric|${ERule.Cast}:${ECastType.Number}` };
    const validation = new Validator(data, rules);
    validation.passes(); // true
    assert.deepEqual(data, [{ age: 4 }, { name: 'test' }, { age: 5 }], 'Validator, cast rule is not works correctly');
}
exports.castHandlers = {
    [ECastType.Number]: (value) => {
        return Number(value);
    },
    [ECastType.Boolean]: (value) => {
        return value === 'true';
    },
    [ECastType.Date]: (value) => {
        return new Date(value);
    },
    [ECastType.String]: (value) => {
        return value.toString();
    },
};
exports.default = Validator;
