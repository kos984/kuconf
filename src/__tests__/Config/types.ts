export interface IConfig {
  queue: {
    first: {
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
      queueName: string;
      endpoint?: string;
      queueUrl?: string;
    };
    second: {
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
      queueName: string;
      endpoint?: string;
      queueUrl?: string;
    };
  };
  redis: {
    host?: string;
    port?: number;
    sentinels?: Array<{
      host: string;
      port?: number;
      test?: boolean;
    }>
  };
  db: {
    host: string;
    username: string;
    password: string;
    database: string;
    port?: number;
    replication?: {
      write: {
        host: string;
        username?: string;
        password?: string;
        port?: number;
      };
      read: Array<{
        host: string;
        username?: string;
        password?: string;
        port?: number;
      }>;
    };
  };
  features: {
    featureName: {
      enabled: boolean;
      key: string;
    };
  };
}
