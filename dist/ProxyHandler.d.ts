import Config from './Config';
export declare const validate: unique symbol;
export declare const rulesPath: unique symbol;
export default class ProxyHandler {
    protected config: Config<any>;
    protected proxy: symbol;
    constructor(config: Config<any>);
    get(target: any, name: any): any;
    getOwnPropertyDescriptor(target: any, name: string | any): PropertyDescriptor;
}
