import Config from "../utils/Config";

let _key = 0;

type StateListener<T> = (value: T, oldValue: T)=> void;
type StateListeners<T> = {
    [key: string]: StateListener<T>
}

class State<T> {
    name: string
    private _oldValue: T
    private _value: T
    listeners: StateListeners<T> = {};
    
    constructor(name: string, initValue: T) {
        this.name = name;
        this._value = initValue;
        this._oldValue = initValue;
    }

    get value(): T {
        return this._value;
    }
    get oldValue(): T {
        return this._oldValue;
    }
    set value(v: T) {
        this._oldValue = this._value;
        this._value = v;

        if (this._value != this._oldValue)
            this.notify();
    }
    set(callback: (old: T)=> T, notify: boolean=true) {
        this._oldValue = this._value;
        this._value = callback(this._value);

        if (notify && this._value != this._oldValue)
            this.notify();
    }
    
    //
    notify() {
        for (const listenerName of Object.keys(this.listeners)) {
            this.listeners[listenerName](this.value, this.oldValue);
        }

        if (Config.LOG_STATES)
            console.log(`State "${ this.name }" notified ${ Object.keys(this.listeners).length } listeners!`);
    }
    listen(listener: StateListener<T>, key?: string, override: boolean=false):()=> void {
        key = key || (_key ++).toString();
        if (this.listeners[key]) {
            if (override) {
                if (Config.IS_DEV)
                    console.warn(`State listener with key "${ key }" is already exists in state "${ this.name }". Override!`);
            } else {
                if (Config.IS_DEV)
                    console.error(`State listener with key "${ key }" is already exists in state "${ this.name }"`);
                return ()=> {};
            }
        }
        
        this.listeners[key] = listener;

        return ()=> this.unlisten(key!);
    }
    unlisten(key: string) {
        delete this.listeners[key];
    }
}
export default State;