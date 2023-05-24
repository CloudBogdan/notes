import Node from "../classes/nodes/Node";
import ImageNode from "../classes/nodes/members/ImageNode";
import ListNode from "../classes/nodes/members/ListNode";
import NoteNode from "../classes/nodes/members/NoteNode";
import TodoNode from "../classes/nodes/members/TodoNode";

type IRegisteredNode = (id: number)=> Node

export default class NodesRegistry {
    static registeredNodes: { [key: string]: IRegisteredNode } = {};

    static init() {
        this.registerNode(NoteNode.NAME, id=> new NoteNode(id));
        this.registerNode(TodoNode.NAME, id=> new TodoNode(id));
        this.registerNode(ListNode.NAME, id=> new ListNode(id));
        this.registerNode(ImageNode.NAME, id=> new ImageNode(id));
    }

    static registerNode(name: string, nodeCallback: IRegisteredNode) {
        this.registeredNodes[name] = nodeCallback;
    }
    static getNodeCallback(name: string): IRegisteredNode | null {
        return this.registeredNodes[name] || null;
    }
}