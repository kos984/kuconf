export default class ProxyHandler {
    protected proxy: symbol;
    get(target: any, name: any): any;
    getOwnPropertyDescriptor(target: any, name: string | any): PropertyDescriptor;
}
