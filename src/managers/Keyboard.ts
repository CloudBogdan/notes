import Utils from "../utils/Utils";

export default class Keyboard {
    static isPressed: boolean = false;
    static keysPressed: { [key: string]: boolean } = {}

    static isShift: boolean = false;
    static isCtrl: boolean = false;
    static isSpace: boolean = false;

    static inputFocused: boolean = false;
    
    static init() {
        addEventListener("keydown", e=> {
            if (e.ctrlKey && (e.code == "NumpadAdd" || e.code == "Equal" || e.code == "Minus" || e.code == "NumpadAdd"))
                e.preventDefault();
            
            this.isPressed = true;
            this.keysPressed[Utils.formatKey(e.code)] = true;
            
            if (e.shiftKey)
                this.isShift = true;
            if (e.ctrlKey)
                this.isCtrl = true;
            if (e.code == "Space")
                this.isSpace = true;
        });
        addEventListener("keyup", e=> {
            this.isPressed = false;
            delete this.keysPressed[Utils.formatKey(e.code)]

            this.isShift = false;
            this.isCtrl = false;
            if (e.code == "Space")
                this.isSpace = false;
        });

        addEventListener("blur", ()=> {
            this.keysPressed = {};
            this.isPressed = false;
            this.isShift = false;
            this.isCtrl = false;
            this.isSpace = false;
        })
    }

    //
    static isKeyPressed(key: string): boolean {
        return this.isPressed && this.keysPressed[Utils.formatKey(key)];
    }

    //
    static onKeyPressed(listener: (e: KeyboardEvent)=> void, ignoreFocusedInputs: boolean=false): ()=> void {
        const func = (e: KeyboardEvent)=> {
            if (ignoreFocusedInputs ? true : !this.inputFocused)
                listener(e);
        }
        addEventListener("keydown", func);
        return ()=> removeEventListener("keydown", func);
    }
}