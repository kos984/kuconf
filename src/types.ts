// import ValidatorJs from '../../ValidatorJs';
export type StringsValue<T> = {
  [P in keyof T]: StringsValue<T[P]> | string;
};
export interface ILogger {
  log(...args: any[]): any;
  warn(...args: any[]): any;
}
export interface IConfigOptions {
  allowGet: boolean;
  getSeparator: string;
  logger: ILogger;
}
export interface IParseEnvParams {
  /** empty by default */
  prefix?: string;
  /** __ by default */
  delimiter?: string;
  /** if true will replace all '_' to '', false by default */
  ignoreOneLodash?: boolean;
  doNotWarnIfKeyOverridden?: boolean;
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
