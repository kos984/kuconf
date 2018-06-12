import { ILogger, IConfigOptions, IParseEnvParams, IOmitNotValidatedProps } from "./types";
import * as ValidatorJs from 'validatorjs';
import ProxyHandler from './ProxyHandler';
export default class Config<ConfigSchema> {
    protected handler: ProxyHandler;
    /** ValidatorJs rules */
    protected schema: any;
    protected logger: ILogger;
    protected validation: ValidatorJs.Validator<any>;
    protected parsedKeyPaths: string[];
    protected config: ConfigSchema;
    protected options: IConfigOptions;
    constructor(schema: object, options?: IConfigOptions);
    get(path: string, defaultValue?: any): any;
    parseEnv(params?: IParseEnvParams): this;
    validate(): this;
    omitNotValidatedProps(params: IOmitNotValidatedProps): this;
    getConfig(): ConfigSchema;
}
