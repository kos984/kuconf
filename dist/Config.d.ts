/// <reference types="validatorjs" />
import ProxyHandler from './ProxyHandler';
import { IConfigOptions, IGenerateEnvParams, ILogger, IOmitNotValidatedProps, IParseEnvParams } from './types';
import Validator from './Validator';
export default class Config<ConfigSchema> {
    /** ValidatorJs rules */
    schema: any;
    protected handler: ProxyHandler;
    protected logger: ILogger;
    protected validation: Validator.Validator<any>;
    protected parsedKeyPaths: string[];
    protected config: ConfigSchema;
    protected options: IConfigOptions;
    constructor(schema: object, options?: IConfigOptions);
    prepareRules(schema: any): {
        [key: string]: string;
    };
    get(path: string, defaultValue?: any): any;
    parseEnv(params?: IParseEnvParams): this;
    validate(confPart?: any): this;
    omitNotValidatedProps(params: IOmitNotValidatedProps): this;
    getConfig(): ConfigSchema;
    generateEnv(params?: IGenerateEnvParams): string[];
    getValidationErrors(path?: string): any;
    protected initValidator(): void;
}
