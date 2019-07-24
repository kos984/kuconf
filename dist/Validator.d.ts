import * as Validator from 'validatorjs';
export declare enum ECastType {
    Number = "number",
    Boolean = "boolean",
    Date = "Date",
    String = "string"
}
export declare enum ERule {
    Required = "required",
    Date = "date",
    Numeric = "numeric",
    String = "string",
    Min = "min",
    Max = "max",
    Integer = "integer",
    /** value should be strict equals 'true' or 'false' */
    Bool = "kuConfBool",
    /**
     * object should have properties only in listed values;
     * objectKeysIn:Y,N will check attrs: {a: 'Y', b: 'N'}
     */
    ObjectKeysIn = "kuConfObjectKeysIn",
    /**
     * cast:ECastType,defaultValue
     *
     * @example
     * const rules = { '*.age': `numeric|${ERule.Cast}:${ECastType.Number},10` };
     * const data = [{ age: '4' }, { name: 'test' }, { age: 5 }];
     *
     * @description should be last rule in the list, will not update inputValue
     */
    Cast = "kuConfCast"
}
export declare const castHandlers: {
    [key: string]: any;
};
export default Validator;
