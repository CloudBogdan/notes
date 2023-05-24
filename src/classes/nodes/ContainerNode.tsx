import Triggers from "../../managers/Triggers";
import Nodes from "../../managers/board/Nodes";
import NodesRegistry from "../../registries/NodesRegistry";
import State from "../../states/State";
import Utils from "../../utils/Utils";
import Node, { INode, INodeData } from "./Node";

export interface IContainerNode extends INode {}
export interface IContainerNodeData extends INodeData {
    innerNodes: INodeData[]
}

export default class ContainerNode extends Node implements IContainerNode {
    innerElement: HTMLDivElement | null = null;

    InnerNodes = new State<Node[]>("container-node/inner-nodes", []);

    insertChildAtIndex: number = 0;
    canContainNodeNames: string[] = [];
    
    constructor(id: number, name: string) {
        super(id, name);

        this.InnerNodes.listen(()=> {
            Triggers.onBoardEdited.trigger(true);
        })
    }

    initInner(innerElement: HTMLDivElement): void {
        this.innerElement = innerElement;
    }

    //
    addChild(node: Node): void {
        if (this.innerNodes.includes(node)) return;
        super.addChild(node);

        Nodes.removeNode(node);
        this.InnerNodes.set(old=> Utils.insertItem(old, node, this.insertChildAtIndex));
    }
    removeChild(node: Node): void {
        if (!this.innerNodes.includes(node)) return;        
        super.removeChild(node);
        
        this.InnerNodes.set(old=> old.filter(n=> n != node));
        
        if (node.element && this.innerElement) {
            const a = node.element.getBoundingClientRect();
            const b = this.innerElement.getBoundingClientRect();

            node.setPos(
                b.left + (a.left - b.left),
                b.top + (a.top - b.top),
                false, false
            );
        }

        Nodes.addNode(node);
    }

    // Get
    get innerNodes(): Node[] {
        return this.InnerNodes.value;
    }
    
    // Data
    loadData(data: IContainerNodeData): void {
        super.loadData(data);

        if (data.innerNodes !== undefined)
            this.InnerNodes.value = data.innerNodes.map(nodeData=> {
                const nodeCallback = NodesRegistry.getNodeCallback(nodeData.name)

                if (nodeCallback) {
                    const node = nodeCallback(nodeData.id);
                    node.setParent(this);
                    node.loadData(nodeData);
                    return node;
                }   
                return null;
            }).filter(Boolean) as Node[]
    }
    getData(): IContainerNodeData {
        return {
            ...super.getData(),
            innerNodes: this.innerNodes.map(n=> n.getData())
        }
    }
}