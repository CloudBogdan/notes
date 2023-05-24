import TodoNodeComponent from "../../../components/nodes/members/TodoNodeComponent";
import Triggers from "../../../managers/Triggers";
import State from "../../../states/State";
import Utils from "../../../utils/Utils";
import DoneBrick, { IDoneBrickData } from "../../node-bricks/members/DoneBrick";
import Node, { INode, INodeData } from "../Node";

export interface ITodoNode extends INode {
    content: string
}
export interface ITodoNodeData extends INodeData {
    content: string
    done: IDoneBrickData
}

export default class TodoNode extends Node implements ITodoNode {
    static readonly NAME: string = "todo";

    done = new DoneBrick();
    content: string = "";
    
    constructor(id: number) {
        super(id, TodoNode.NAME);

        this.component = TodoNodeComponent;

        this.done.State.listen(()=> {
            Triggers.onBoardEdited.trigger(true);
        })

        //
        this.addBrick(this.done);
    }

    //
    setTextContent(content: string) {
        if (this.content == content) return;
        
        this.content = content;
        Triggers.onBoardEdited.trigger(true);
    }

    // Get
    loadData(data: ITodoNodeData): void {
        super.loadData(data);

        if (data.content !== undefined)
            this.content = data.content;
        this.done.loadData(data.done);
    }
    getData(): ITodoNodeData {
        return {
            ...super.getData(),
            content: this.content,
            done: this.done.getData()
        }
    }

    // Static
    static create(id?: number): TodoNode {
        return new TodoNode(Utils.safeValue(id, Date.now()));
    }
}