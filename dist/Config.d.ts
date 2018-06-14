import * as ValidatorJs from 'validatorjs';
import ProxyHandler from './ProxyHandler';
import { IConfigOptions, ILogger, IOmitNotValidatedProps, IParseEnvParams } from './types';
export default class Config<ConfigSchema> {
    /** ValidatorJs rules */
    schema: any;
    protected handler: ProxyHandler;
    protected logger: ILogger;
    protected validation: ValidatorJs.Validator<any>;
    protected parsedKeyPaths: string[];
    protected config: ConfigSchema;
    protected options: IConfigOptions;
    constructor(schema: object, options?: IConfigOptions);
    get(path: string, defaultValue?: any): any;
    parseEnv(params?: IParseEnvParams): this;
    validate(confPart?: any): this;
    omitNotValidatedProps(params: IOmitNotValidatedProps): this;
    getConfig(): ConfigSchema;
    generateEnv(): string[];
    getErrorsForPath(path?: string): any;
    protected initValidator(): void;
}
