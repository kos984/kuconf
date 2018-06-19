# Config

  - **case-insensitive by default**
  - **support validation**
  - **support partial validation**

```
  constructor(config: object, options?: Partial<IConfigOptions>);
```

  - options:
    - **caseSensitive** - default false
    - **validation** - object { rules } - rules should be valid ValidatorJs rules
    - **get** - default { allowed: false, separator: '.' }, allow get config like `cong.get('db.userName')`
    - **logger** - TBD, api in progress
  
  - methods:
     - `public merge(obj: Partial<ConfigSchema>): Config<ConfigSchema>`
     - `public get(path: string, defaultValue?: any)` - return config value
     - `public getConfig(): ConfigSchema` - return config object
     - `public validate(confPart?: any)` - @throws Error
     - `public getValidationErrors(path?: string): TBD`

example
```
const Config = require('kuconf').Config;

const conf = new Config({
  db: {
    username: 'username',
    password: 'password',
  },
  redis: {
  },
}, {
  validation: {
    rules: {
      db: {
        userName: 'required|string',
        password: 'required|string',
      },
      redis: {
        host: 'required|string',
      },
    },
  },
});

const config = conf.getConfig();

console.log( config.db.userName === config.db.username ); // true
try {
  conf.validate();
} catch (e) {
  console.log(e.message); // {"errors":{"redis.host":["The redis.host field is required."]}}
}
conf.validate(config.db); // no errors

try {
  conf.validate(config.redis);
} catch (e) {
  console.log(e.message); // {"errors":{"redis.host":["The redis.host field is required."]}}
}

```

# Parsers

## EnvParser

```
  class EnvParser(params?: Partial<IEnvParserParams>);
```

  - params:
    - **prefix** - default empty
    - **delimiter** - default '__'
    - **ignoreOneLodash** - if want user case-insensitive config object, it may be useful just remove remove all '_' from key CLIENT_NAME => CLIENTNAME
    - **lower** - all keys will be in lower case
    - **format** - format key function `key => newFormatedKey`, if defined params ignoreOneLodash and lower will be ignored


example
```
import EnvParser from '../parsers/EnvParser';

process.env.TEST__DB__USERNAME = 'username';
process.env.TEST__DB__PASSWORD = 'password';
process.env.TEST__DB__REPLICATION__WRITE__HOST = 'write.example.com';
process.env.TEST__DB__REPLICATION__READ__0__HOST = 'read0.example.com';
process.env.TEST__DB__REPLICATION__READ__1__HOST = 'read1.example.com';

const env = new EnvParser({
  prefix: 'TEST__',
});
console.log(JSON.stringify(env.get(), null, 2));
```

out
```
{
  "db": {
    "username": "username",
    "password": "password",
    "replication": {
      "write": {
        "host": "write.example.com"
      },
      "read": [
        {
          "host": "read0.example.com"
        },
        {
          "host": "read1.example.com"
        }
      ]
    }
  }
}
```
