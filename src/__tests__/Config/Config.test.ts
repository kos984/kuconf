import './env';

import * as _ from 'lodash';
import Config from '../../Config';
import { IConfig } from './types';
import rules from './validationRules';

describe('Config', () => {
  it ('config', () => {
    const conf = new Config<IConfig>(rules, {
      allowGet: true,
      getSeparator: ':',
      logger: console,
    });
    conf
      .parseEnv({
        delimiter: '__',
        doNotWarnIfKeyOverridden: false,
        ignoreOneLodash: true,
        prefix: 'TEST__',
      });
    const config = conf.getConfig();
    expect((conf as any).validation.rules).toMatchSnapshot();
    expect(config).toMatchSnapshot();
  });
});
