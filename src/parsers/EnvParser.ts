import * as _ from 'lodash';

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
  protected parsed: any = {};
  public constructor(params?: Partial<IEnvParserParams>) {
    this.params = {
      delimiter: '__',
      format: key => {
        return this.params.ignoreOneLodash ? key.replace(/_/g, '') : key.toLowerCase();
      },
      ignoreOneLodash: false,
      lower: true,
      prefix: '',
      ...params,
    };
    this.parse();
  }
  public get() {
    return this.parsed;
  }

  protected parse() {
    const { prefix, delimiter, format } = this.params;
    const parsed: any = this.parsed;
    Object.keys(process.env)
      .filter(key => (key.indexOf(prefix) === 0))
      .map(key => {
        const keyPath = key
          .replace(prefix, '')
          .split(delimiter)
          .map(subKey => format(subKey))
          .join('.');
        _.set(parsed, keyPath, process.env[key]);
      });
    return this;
  }

  /*
  public generateEnv(params?: IGenerateEnvParams): string[] {
    const { prefix, delimiter } = {
      delimiter: '__',
      prefix: '',
      ...params };
    this.initValidator();
    const rules = this.validation.rules;
    return Object.keys(rules).map((rule: string) => {
      return prefix + rule.replace(/\./g, delimiter).toUpperCase() + '=';
    });
  }
  */
}
