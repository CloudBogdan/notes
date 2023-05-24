import State from "../../../states/State";
import { TextAlign, TextSize } from "../../../types/types";
import NodeBrick, { INodeBrickData } from "../NodeBrick";

export interface ITextFormatBrickData extends INodeBrickData {
    textAlign: TextAlign
    textSize: TextSize
}

export default class TextFormatBrick extends NodeBrick {
    TextAlign = new State<TextAlign>("simple-text-format-brick/text-align", TextAlign.LEFT);
    TextSize = new State<TextSize>("simple-text-format-brick/text-size", TextSize.NORMAL);
    
    constructor() {
        super();
    }
    
    increaseTextSize() {
        if (this.textSize == TextSize.SMALL)
            this.TextSize.value = TextSize.NORMAL;
        else if (this.textSize == TextSize.NORMAL)
            this.TextSize.value = TextSize.MIDDLE;
        else if (this.textSize == TextSize.MIDDLE)
            this.TextSize.value = TextSize.LARGE;
        else if (this.textSize == TextSize.LARGE)
            this.TextSize.value = TextSize.EXTRA_LARGE;
    }
    decreaseTextSize() {
        if (this.textSize == TextSize.EXTRA_LARGE)
            this.TextSize.value = TextSize.LARGE;
        else if (this.textSize == TextSize.LARGE)
            this.TextSize.value = TextSize.MIDDLE;
        else if (this.textSize == TextSize.MIDDLE)
            this.TextSize.value = TextSize.NORMAL;
        else if (this.textSize == TextSize.NORMAL)
            this.TextSize.value = TextSize.SMALL;
    }
    setTextAlign(align: TextAlign) {
        this.TextAlign.value = align;
    }
    
    //
    get textAlign(): TextAlign {
        return this.TextAlign.value;
    }
    get textSize(): TextSize {
        return this.TextSize.value;
    }

    // Data
    loadData(data: ITextFormatBrickData): void {
        super.loadData(data);

        if (data.textAlign)
            this.TextAlign.value = data.textAlign;
        if (data.textSize)
            this.TextSize.value = data.textSize;
    }
    getData(): ITextFormatBrickData {
        return {
            ...super.getData(),
            textAlign: this.textAlign,
            textSize: this.textSize
        }
    }
}