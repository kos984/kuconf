import Config from './Config';
import { IProxyHandlerOptions } from './types';
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
    protected options: IProxyHandlerOptions;
    constructor(config: Config<any>, options: IProxyHandlerOptions);
    get(target: any, name: any): any;
    getOwnPropertyDescriptor(target: any, name: string | any): PropertyDescriptor;
    protected [validate](target: any): () => any;
}
