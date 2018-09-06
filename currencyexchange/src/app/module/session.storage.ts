export class SessionStorage {

    public sessionStorage:any;

    constructor() {
        if (!sessionStorage) {
            throw new Error('Current browser does not support Local Storage');
        }
        this.sessionStorage = sessionStorage;
    }

    public set(key:string, value:string):void {
        this.sessionStorage[key] = value;
    }

    public get(key:string):string {
        return this.sessionStorage[key] || false;
    }

    public setObject(key:string, value:any):void {
        this.sessionStorage[key] = JSON.stringify(value);
    }

    public getObject(key:string):any {
        return JSON.parse(this.sessionStorage[key] || '{}');
    }

    public remove(key:string):any {
        this.sessionStorage.removeItem(key);
    }

    public clear():any {
        this.sessionStorage.clear();
    }
}
