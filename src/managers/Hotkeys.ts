import Utils from "../utils/Utils";
import Actions from "./Actions";
import Keyboard from "./Keyboard";

interface IHotkey {
    binds: string[]
    actionProps?: any[]
    noPrevent?: boolean
}

export default class Hotkeys {
    static registeredHotkeys: { [key: string]: IHotkey } = {};
    
    static init() {
        // Selection
        this.registerHotkey("deselect-all", { binds: ["escape", "shift+ctrl+a"] })
        this.registerHotkey("select-all-in-view", { binds: ["ctrl+a"] })
        
        // Nodes
        this.registerHotkey("remove-selected-nodes", { binds: ["x", "delete"] })
        this.registerHotkey("edit-selected-node-trigger", { binds: ["e", "enter"] })
        this.registerHotkey("toggle-selected-nodes-done", { binds: ["d"] })
        
        // Board
        this.registerHotkey("save-current-board", { binds: ["ctrl+s"] })
        this.registerHotkey("create-board", { binds: ["ctrl+b"] })
        
        // Workspace
        this.registerHotkey("pan-to-selection", { binds: ["f"] })
        this.registerHotkey("reset-zoom", { binds: ["ctrl+0"] })
        this.registerHotkey("increase-zoom", { binds: ["ctrl+add", "ctrl+equal"] })
        this.registerHotkey("decrease-zoom", { binds: ["ctrl+subtract", "ctrl+minus"] })

        this.initHotkeys();
    }

    static initHotkeys() {
        Keyboard.onKeyPressed(e=> {
            for (const hotkeyKey of Object.keys(this.registeredHotkeys)) {
                const hotkey = this.registeredHotkeys[hotkeyKey];

                for (const bind of hotkey.binds) {
                    const keys = bind.split("+");
                    
                    if (
                        keys.includes(Utils.formatKey(e.code)) &&
                        (keys.includes("shift") ? e.shiftKey : true) &&
                        (keys.includes("ctrl") ? e.ctrlKey : true)
                    ) {
                        if (!hotkey.noPrevent)
                            e.preventDefault();

                        Actions.invoke(hotkeyKey, hotkey.actionProps || []);
                        return;
                    }
                }
            }
        });
    }

    //
    static registerHotkey(name: string, bind: IHotkey) {
        this.registeredHotkeys[name] = bind;
    }
    static getHotkey(name: string): IHotkey | null {
        return this.registeredHotkeys[name] || null;
    }
}