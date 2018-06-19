export interface IConfig {
    redis: {
        host?: string;
        port?: number;
        sentinels?: Array<{
            host: string;
            port?: number;
            test?: boolean;
        }>;
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
}
