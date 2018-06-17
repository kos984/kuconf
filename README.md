# Config
 - support validation
 - case-insensitive by default

# Parsers

## EnvParser

```
  class EnvParser(params?: Partial<IEnvParserParams>);
```

  - params:
    -- prefix - default empty
    -- delimiter - default '__'
    -- ignoreOneLodash - if want user case-insensitive config object, it may be useful just remove remove all '_' from key CLIENT_NAME => CLIENTNAME
    -- lower - all keys will be in lower case
    -- format - format key function `key => newFormatedKey`, if defined params ignoreOneLodash and lower will be ignored


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
