export declare type StringsValue<T> = {
    [P in keyof T]: StringsValue<T[P]> | string;
};
export interface ILogger {
    log(...args: any[]): any;
    warn(...args: any[]): any;
}
export interface IConfigOptions {
    /** @default false */
    caseSensitive?: boolean;
    /** @default null */
    validation?: {
        rules: object;
    };
    get: {
        /** @default false */
        allowed: boolean;
        /** @default . */
        separator: string;
    };
    /** @default console */
    logger: ILogger;
}
export interface IGenerateEnvParams {
    /** empty by default */
    prefix?: string;
    /** __ by default */
    delimiter?: string;
}
export interface IOmitNotValidatedProps {
    /** true by default */
    logOmitted: boolean;
}
