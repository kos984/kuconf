import * as Validator from 'validatorjs';
export declare enum ECastType {
    Number = "number",
    Boolean = "boolean",
    Date = "Date"
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
    Bool = "bool",
    /**
     * object should have properties only in listed values;
     * objectKeysIn:Y,N will check attrs: {a: 'Y', b: 'N'}
     */
    ObjectKeysIn = "objectKeysIn",
    /**
     * cast:ECastType,defaultValue
     *
     * @example
     * const rules = { '*.age': 'numeric|cast:number,10' };
     * const data = [{ age: '4' }, { name: 'test' }, { age: 5 }];
     *
     * @description should be last rule in the list, will not update inputValue
     */
    Cast = "cast"
}
export default Validator;
