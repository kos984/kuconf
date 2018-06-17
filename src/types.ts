// import ValidatorJs from '../../ValidatorJs';
export type StringsValue<T> = {
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

// TODO: delete this
export interface IGenerateEnvParams {
  /** empty by default */
  prefix?: string;
  /** __ by default */
  delimiter?: string;
}

// TODO: need to implement
export interface IOmitNotValidatedProps {
  /** true by default */
  logOmitted: boolean;
}
