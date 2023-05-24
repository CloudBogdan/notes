import ListNodeComponent from "../../../components/nodes/members/ListNodeComponent";
import Triggers from "../../../managers/Triggers";
import State from "../../../states/State";
import Utils from "../../../utils/Utils";
import ContainerNode, { IContainerNode, IContainerNodeData } from "../ContainerNode";
import TodoNode from "./TodoNode";

export interface IListNode extends IContainerNode {}
export interface IListNodeData extends IContainerNodeData {
    title: string
}

export default class ListNode extends ContainerNode implements IListNode {
    static readonly NAME: string = "list";

    Title = new State<string>("list-node/title", "List");
    
    constructor(id: number) {
        super(id, ListNode.NAME);

        this.component = ListNodeComponent;

        this.canContainNodeNames = [TodoNode.NAME];

        this.Title.listen(()=> Triggers.onBoardEdited.trigger(true));
    }

    setTitle(title: string) {
        this.Title.value = title;
    }

    // Data
    loadData(data: IListNodeData): void {
        super.loadData(data);

        if (data.title)
            this.Title.value = data.title;
    }
    getData(): IListNodeData {
        return {
            ...super.getData(),
            title: this.Title.value
        }
    }
    
    // Static
    static create(id?: number | undefined): ListNode {
        return new ListNode(Utils.safeValue(id, Date.now()));
    }
}