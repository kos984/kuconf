import * as assert from 'assert';
import * as _ from 'lodash';
import * as Validator from 'validatorjs';

export enum ECastType {
  Number = 'number',
  Boolean = 'boolean',
  Date = 'Date',
  String = 'string',
}

export enum ERule {
  Required = 'required',
  Date = 'date',
  Numeric = 'numeric',
  String = 'string',
  Min = 'min',
  Max = 'max',
  Integer = 'integer',
  /** value should be strict equals 'true' or 'false' */
  Bool = 'kuConfBool',
  /**
   * object should have properties only in listed values;
   * objectKeysIn:Y,N will check attrs: {a: 'Y', b: 'N'}
   */
  ObjectKeysIn = 'kuConfObjectKeysIn',
  /**
   * cast:ECastType,defaultValue
   *
   * @example
   * const rules = { '*.age': `numeric|${ERule.Cast}:${ECastType.Number},10` };
   * const data = [{ age: '4' }, { name: 'test' }, { age: 5 }];
   *
   * @description should be last rule in the list, will not update inputValue
   */
  Cast = 'kuConfCast',
}

Validator.register(
  ERule.Bool,
  (value: any) => {
    return typeof value === 'boolean' || value === 'true' || value === 'false';
  },
  'The :attribute must be a true or false',
);

Validator.register(
  ERule.ObjectKeysIn,
  function(value: { [key: string]: string }, params: string, attribute: string) {
    const ruleIn = this.validator.getRule('in');
    for (const key of Object.keys(value)) {
      const val = value[key];
      const rulePassed = ruleIn.validate(val, params, `${attribute}.${key}`);
      if (!rulePassed) {
        return false;
      }
    }
    return true;
  },
  'The :attribute keys should be in :objectKeysIn',
);

/** should be last rule in a queue, will not update inputValue */
(Validator as any).registerImplicit(
  ERule.Cast,
  function(value: any, input: any, path: string) {
    const source = this.validator.input;
    const [type, defaultValue] = input.split(',');
    if (!_.has(source, path)) {
      if (defaultValue) {
        value = defaultValue;
      } else {
        return true;
      }
    } else if (typeof value !== 'string') {
      // cast string only
      return true;
    }
    switch (type) {
      case ECastType.Number: {
        value = typeof value === 'number' ? value : Number(value);
        break;
      }
      case ECastType.Boolean: {
        value = typeof value === 'boolean' ? value : value === 'true';
        break;
      }
      case ECastType.Date: {
        value = new Date(value);
        break;
      }
      case ECastType.String: {
        value = value.toString();
        break;
      }
      default: {
        return false;
      }
    }
    _.set(source, path, value);
    return true;
  },
  'Cast rule not supports',
);

// test cast
{
  const data = [{ age: '4' }, { name: 'test' }, { age: 5 }];
  const rules = { '*.age': `numeric|${ERule.Cast}:${ECastType.Number}` };
  const validation = new Validator(data, rules);
  validation.passes(); // true
  assert.deepEqual(data, [{ age: 4 }, { name: 'test' }, { age: 5 }], 'Validator, cast rule is not works correctly');
}

export default Validator;
