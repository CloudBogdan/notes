import NoteNodeComponent from "../../../components/nodes/members/NoteNodeComponent";
import Triggers from "../../../managers/Triggers";
import State from "../../../states/State";
import { Color } from "../../../types/types";
import Utils from "../../../utils/Utils";
import ColorBrick, { IColorBrickData } from "../../node-bricks/members/ColorBrick";
import TextFormatBrick, { ITextFormatBrickData } from "../../node-bricks/members/TextFormatBrick";
import ResizableNode, { IResizableNode, IResizableNodeData } from "../ResizableNode";

export interface INoteNode extends IResizableNode {
    content: string
}
export interface INoteNodeData extends IResizableNodeData {
    content: string
    color: IColorBrickData
    textFormat: ITextFormatBrickData
}

export default class NoteNode extends ResizableNode implements INoteNode {
    static readonly NAME: string = "note";

    static CurrentColor = new State<Color>("note-node/current-color", "blue");
    
    color = new ColorBrick();
    textFormat = new TextFormatBrick();
    content: string = "";
    
    constructor(id: number, color: Color="blue") {
        super(id, NoteNode.NAME);

        this.width = 160;
        this.height = 160;
        this.minWidth = 100;
        this.minHeight = 100;
        this.maxWidth = 400;
        this.maxHeight = 400;
        this.color.setColor(color);

        this.component = NoteNodeComponent;

        //
        this.color.State.listen(newColor=> {
            NoteNode.CurrentColor.value = newColor

            Triggers.onBoardEdited.trigger(true);
        });
        this.textFormat.TextAlign.listen(()=> Triggers.onBoardEdited.trigger(true));
        this.textFormat.TextSize.listen(()=> Triggers.onBoardEdited.trigger(true));

        this.addBrick(this.color);
        this.addBrick(this.textFormat);
    }

    setHTMLContent(content: string) {
        console.log(content, this.content);
        if (this.content == content) return;
        
        this.content = content;
        Triggers.onBoardEdited.trigger(true);
    }

    // Data
    loadData(data: INoteNodeData): void {
        super.loadData(data);

        if (data.content !== undefined)
            this.content = data.content;
        this.color.loadData(data.color);
        this.textFormat.loadData(data.textFormat);
    }
    getData(): INoteNodeData {
        return {
            ...super.getData(),
            content: this.content,
            color: this.color.getData(),
            textFormat: this.textFormat.getData(),
        }
    }
    
    // Static
    static create(id?: number, color?: Color): NoteNode {
        if (color !== undefined)
            this.CurrentColor.value = color;
        
        return new NoteNode(
            Utils.safeValue(id, Date.now()),
            Utils.safeValue(color, this.CurrentColor.value)
        );
    }
}