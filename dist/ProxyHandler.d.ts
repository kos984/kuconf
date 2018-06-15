import Config from './Config';
export declare const validate: unique symbol;
export declare const rulesPath: unique symbol;
export default class ProxyHandler {
    protected config: Config<any>;
    protected proxy: symbol;
    protected hiddenProps: Map<any, boolean>;
    protected cache: Map<object, {
        proxy: any;
        rules: any;
    }>;
    constructor(config: Config<any>);
    get(target: any, name: any): any;
    getOwnPropertyDescriptor(target: any, name: string | any): PropertyDescriptor;
    protected [validate](target: any): () => any;
}
