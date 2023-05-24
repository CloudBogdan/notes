import State from "../../../states/State";
import { Color } from "../../../types/types";
import NodeBrick, { INodeBrickData } from "../NodeBrick";

export interface IColorBrickData extends INodeBrickData {
    color: Color
}

export default class ColorBrick extends NodeBrick {
    allowedColors: Color[] = ["blue", "green", "orange", "pink", "red", "white"];
    State = new State<Color>("color-brick/state", "blue");
    
    constructor() {
        super()
    }

    setColor(color: Color) {
        this.State.value = color;
    }

    // Get
    get value(): Color {
        return this.State.value;
    }

    // Data
    loadData(data: IColorBrickData): void {
        super.loadData(data);

        if (data.color)
            this.State.value = data.color;
    }
    getData(): IColorBrickData {
        return {
            ...super.getData(),
            color: this.value
        }
    }
}