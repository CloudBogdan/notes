import Node from "../../classes/nodes/Node";
import State from "../../states/State";
import Selection from "../Selection";
import Triggers from "../Triggers";
import Board from "./Board";

export default class Nodes {
    static IsCreatingNode = new State<boolean>("nodes/is-creating/node", false);
    
    //
    static addNode(node: Node, onLoaded: (element: HTMLDivElement)=> void=()=>{}): Node {
        node.onElementLoaded = onLoaded;
        
        this.nodesState.set(old=> [...old, node]);

        Triggers.onBoardEdited.trigger(true);
        return node;
    }
    static placeNode(node: Node, x?: number, y?: number, auto: boolean=true): Node {
        if (auto) {
            node.autoSelect = true;
            node.autoCenter = true;
            node.autoSnap = true;
        }
        
        if (x !== undefined && y !== undefined)
            node.setPos(x, y, node.autoCenter, !node.autoSnap);
            
        return this.addNode(node);
    }
    static removeNode(node: Node | null): boolean {
        if (!node) return false;

        Selection.deselectNode(node);
        this.nodesState.set(old=> old.filter(n=> n != node));

        Triggers.onBoardEdited.trigger(true);
        return true;
    }
    static removeNodes(nodes: Node[], deselect: boolean=true) {
        for(const node of nodes) {
            if (deselect)
                Selection.deselectNode(node, false);
            this.nodesState.set(old=> old.filter(n=> n != node), false);
        }

        this.nodesState.notify();
        Selection.SelectedNodes.notify();
        
        Triggers.onBoardEdited.trigger(true);
    }
    static removeSelectedNodes() {
        this.removeNodes(Selection.SelectedNodes.value);
    }
    static getNodesByClass<T extends Node>(nodeClass: typeof Node, nodes: Node[]=this.nodes): T[] {
        return nodes.filter(n=> n instanceof nodeClass) as T[];
    }

    static getNode<T extends Node=Node>(id: number, nodeClass: typeof Node=Node): T | null {
        return this.nodes.find(n=> n.id == id && n instanceof nodeClass) as T || null;
    }

    // Get
    static get nodes(): Node[] {
        return this.nodesState.value;
    }
    static get nodesState(): State<Node[]> {
        return Board.Nodes;
    }
    static get isCreatingNode(): boolean {
        return this.IsCreatingNode.value;
    }
}