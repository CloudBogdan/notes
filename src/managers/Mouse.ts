import WorkspaceControls from "./ui/WorkspaceControls";

export default class Mouse {
    static x: number = 0;
    static y: number = 0;
    static startX: number = 0;
    static startY: number = 0;
    static movementX: number = 0;
    static movementY: number = 0;
    static workspaceX: number = 0;
    static workspaceY: number = 0;
    static deltaX: number = 0;
    static deltaY: number = 0;
    static isPressed: boolean = false;
    static buttonPressed: number = 0;

    static init() {
        addEventListener("pointermove", e=> {
            this.x = e.clientX;
            this.y = e.clientY;
            this.movementX = e.movementX;
            this.movementY = e.movementY;

            this.deltaX = this.x - this.startX;
            this.deltaY = this.y - this.startY;

            if (WorkspaceControls.transformElement) {
                const bounds = WorkspaceControls.transformElement.getBoundingClientRect();
                this.workspaceX = (this.x - bounds.left + WorkspaceControls.pan.x * WorkspaceControls.zoom) / WorkspaceControls.zoom;
                this.workspaceY = (this.y - bounds.top + WorkspaceControls.pan.y * WorkspaceControls.zoom) / WorkspaceControls.zoom;
            }
        })
        addEventListener("pointerdown", e=> {
            if (e.button == 1)
                e.preventDefault();
            
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.isPressed = true;
            this.buttonPressed = e.button;
        })
        addEventListener("pointerup", e=> {
            this.isPressed = false;
        })
    }
    
    //
    static isButtonPressed(button: number=0): boolean {
        return this.isPressed && this.buttonPressed == button;
    }
    
    //
    static onMove(listener: (e: PointerEvent)=> void, element?: HTMLDivElement): ()=> void {
        const el = element || window;
        el.addEventListener("pointermove", listener as any)
        return ()=> el.removeEventListener("pointermove", listener as any);
    }
    static onPress(listener: (e: PointerEvent)=> void, element?: HTMLDivElement): ()=> void {
        const el = element || window;
        el.addEventListener("pointerdown", listener as any)
        return ()=> el.removeEventListener("pointerdown", listener as any)
    }
    static onUp(listener: (e: PointerEvent)=> void, element?: HTMLDivElement): ()=> void {
        const el = element || window;
        el.addEventListener("pointerup", listener as any)
        return ()=> el.removeEventListener("pointerup", listener as any)
    }
    static onClick(listener: (e: PointerEvent)=> void, element?: HTMLDivElement): ()=> void {
        const el = element || window;
        el.addEventListener("click", listener as any)
        return ()=> el.removeEventListener("click", listener as any)
    }
    static onWheel(listener: (e: WheelEvent)=> void, element?: HTMLDivElement, passive: boolean=true): ()=> void {
        const el = element || window;
        el.addEventListener("wheel", listener as any, { passive });
        return ()=> el.removeEventListener("wheel", listener as any)
    }
    static onContextMenu(listener: (e: MouseEvent)=> void, element?: HTMLDivElement): ()=> void {
        const el = element || window;
        el.addEventListener("contextmenu", listener as any)
        return ()=> el.removeEventListener("contextmenu", listener as any)
    }
}