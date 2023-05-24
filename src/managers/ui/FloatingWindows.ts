import FloatingWindow from "../../classes/floating-windows/FloatingWindow";
import { IFloatingWindowComponent } from "../../components/ui/window/FloatingWindowComponent";
import State from "../../states/State";

export default class FloatingWindows {
    static OpenedWindows = new State<FloatingWindow[]>("floating-windows/opened-windows", []);
    
    static openWindow(windowComponent: React.FC<IFloatingWindowComponent>, name: string, params: any[]=[]) {
        const window = new FloatingWindow(Date.now(), name);
        window.params = [...params];
        window.component = windowComponent;
        this.addWindow(window);
    }
    static addWindow(floatingWindow: FloatingWindow) {
        const existsWindow = this.openedWindows.find(w=> w.name == floatingWindow.name);
        if (existsWindow) {
            this.closeWindow(existsWindow);
        }
        
        this.OpenedWindows.set(old=> [...old, floatingWindow]);
    }
    static closeWindow(floatingWindow: FloatingWindow) {
        this.OpenedWindows.set(old=> old.filter(w=> w != floatingWindow));
    }

    // Get
    static get openedWindows(): FloatingWindow[] {
        return this.OpenedWindows.value;
    }
}