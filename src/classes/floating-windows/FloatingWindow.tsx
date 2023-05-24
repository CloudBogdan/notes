import FloatingWindowComponent, { IFloatingWindowComponent } from "../../components/ui/window/FloatingWindowComponent";

export default class FloatingWindow {
    id: number
    name: string
    
    element: HTMLDivElement | null = null;
    component: React.FC<IFloatingWindowComponent>
    params: any[] = []
    
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;

        this.component = FloatingWindowComponent;
    }

    init(element: HTMLDivElement) {
        this.element = element;
    }
}