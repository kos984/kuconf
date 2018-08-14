import Validator, { ECastType, ERule } from '../Validator';

describe('Validator', () => {

  it(`rule: ${ERule.Bool}`, () => {
    const validator = new Validator({
      arr: [ 'true', 'false', true, false, 'True', 'False', 'any' ],
    }, {
      'arr.*': ERule.Bool,
    });
    validator.fails();
    expect(validator.errors).toMatchSnapshot();
  });

  it(`rule: ${ERule.ObjectKeysIn}`, () => {
    const validator = new Validator({
      arr: [
        { prop: 'Y' },
        { prop: 'N' },
        { prop: 'A' },
        { prop: 'B' },
      ],
    }, {
      'arr.*': `${ERule.ObjectKeysIn}:Y,N`,
    });
    validator.fails();
    expect(validator.errors).toMatchSnapshot();
  });

  it(`rule: ${ERule.Cast}`, () => {
    const payload: any = {
      bool: 'true',
      date: '1999-12-31',
      nullDate: null,
      number: '100',
    };
    const validator = new Validator(payload, {
      // should cast if value exists
      bool: `${ERule.Bool}|${ERule.Cast}:${ECastType.Boolean}`,
      date: `${ERule.Date}|${ERule.Cast}:${ECastType.Date}`,
      nullDate: `${ERule.Cast}:${ECastType.Date}`, // should be null
      number: `${ERule.Numeric}|${ERule.Cast}:${ECastType.Number}`,

      // should set default property if value not exists
      boolDefaultFalse: `${ERule.Bool}|${ERule.Cast}:${ECastType.Boolean},false`,
      boolDefaultTrue: `${ERule.Bool}|${ERule.Cast}:${ECastType.Boolean},true`,
      dateDefault: `${ERule.Date}|${ERule.Cast}:${ECastType.Date}:1999-12-31`,
      dateTimeDefault: `${ERule.Cast}:${ECastType.Date},1999-12-31T00:00:00`,
      numberDefault: `${ERule.Numeric}|${ERule.Cast}:${ECastType.Number},100`,
      stringDefault: `${ERule.String}|${ERule.Cast}:${ECastType.String},default\,String`,

      // should not set if property not exists
      boolEmpty: `${ERule.Bool}|${ERule.Cast}:${ECastType.Boolean}`,
      dateEmpty: `${ERule.Date}|${ERule.Cast}:${ECastType.Date}`,
      numberEmpty: `${ERule.Numeric}|${ERule.Cast}:${ECastType.Number}`,
    });
    validator.fails();
    expect(validator.errors).toMatchSnapshot();
    expect(payload).toMatchSnapshot();
  });

});
