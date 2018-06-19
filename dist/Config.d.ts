/// <reference types="validatorjs" />
import ProxyHandler from './ProxyHandler';
import { IConfigOptions, ILogger } from './types';
import Validator from './Validator';
declare const privateStoreKey: unique symbol;
export default class Config<ConfigSchema> {
    /** ValidatorJs rules */
    protected config: object;
    protected configObject: ConfigSchema;
    protected handler: ProxyHandler;
    protected logger: ILogger;
    protected validation: Validator.Validator<any>;
    protected options: IConfigOptions;
    protected [privateStoreKey]: Map<any, any>;
    constructor(config: object, options?: Partial<IConfigOptions>);
    merge(obj: Partial<ConfigSchema>): Config<ConfigSchema>;
    get(path: string, defaultValue?: any): any;
    getConfig(): ConfigSchema;
    validate(confPart?: any): this;
    getValidationErrors(path?: string): any;
    protected initValidator(): void;
    protected objectToLower(obj: any): any;
    protected prepareRules(schema: any): {
        [key: string]: string;
    };
}
export {};
