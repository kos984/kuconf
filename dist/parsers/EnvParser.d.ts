export interface IEnvParserParams {
    /** @default '' */
    prefix: string;
    /** @default '__' */
    delimiter: string;
    /**
     * if true will replace all '_' to ''
     * works only if format function not passed
     * @default false
     */
    ignoreOneLodash: boolean;
    /**
     * works only if format function not passed
     * @default true
     */
    lower: boolean;
    /**
     * format key, buy default make key lower and delete all '_' symbols
     */
    format: (key: string) => string;
}
export default class EnvParser {
    protected params: IEnvParserParams;
    protected parsed: any;
    constructor(params?: Partial<IEnvParserParams>);
    get(): any;
    protected parse(): this;
}
