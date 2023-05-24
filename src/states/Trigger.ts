import Config from "../utils/Config";

let _key = 0;

type TriggerListener<T> = (params: T)=> void;
type TriggerListeners<T> = {
    [key: string]: TriggerListener<T>
}

class Trigger<T> {
    name: string
    listeners: TriggerListeners<T> = {};
    
    constructor(name: string) {
        this.name = name;
    }
    
    //
    trigger(params: T) {
        for (const listenerName of Object.keys(this.listeners)) {
            this.listeners[listenerName](params);
        }

        if (Config.LOG_TRIGGERS)
            console.log(`Trigger "${ this.name }" notified ${ Object.keys(this.listeners).length } listeners!`);
    }
    listen(listener: TriggerListener<T>, key?: string, override: boolean=false):()=> void {
        key = key || (_key ++).toString();
        if (this.listeners[key]) {
            if (override) {
                if (Config.IS_DEV)
                    console.warn(`Trigger listener with key "${ key }" is already exists in state "${ this.name }". Override!`);
            } else {
                if (Config.IS_DEV)
                    console.error(`Trigger listener with key "${ key }" is already exists in state "${ this.name }"`);
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
export default Trigger;