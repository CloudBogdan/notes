import Node from "../classes/nodes/Node";
import Keyboard from "./Keyboard";
import State from "../states/State";
import Nodes from "./board/Nodes";
import Utils from "../utils/Utils";
import ContainerNode from "../classes/nodes/ContainerNode";

export default class Selection {
    static SelectedNodes = new State<Node[]>("selection/selected-nodes", []);
    
    //
    static selectNode(node: Node, notify: boolean=true): boolean {
        if (this.isNodeSelected(node)) return false;
        
        if (node.parent && this.selectedNodes.includes(node.parent))
            this.deselectAll(false);
        if (this.selectedNodes.filter(n=> n.parent == node).length > 0)
            this.deselectAll(false);
        
        node.onSelect();
        this.SelectedNodes.set(old=> [...old, node], notify);
        
        return true;
    }
    static deselectNode(node: Node, notify: boolean=true): boolean {
        if (!this.isNodeSelected(node)) return false;
        
        node.onDeselect();
        this.SelectedNodes.set(old=> old.filter(n=> n != node), notify);
        
        return true;
    }
    static deselectAll(notify: boolean=true): boolean {
        if (this.count == 0) return false;
        
        this.SelectedNodes.value.map(n=> n.onDeselect());
        this.SelectedNodes.set(()=> [], notify);

        return true;
    }
    static selectAllInView() {
        this.deselectAll();
        
        for (const node of Nodes.nodes) {
            if (!node.element) continue;

            const nodeBounds = node.element.getBoundingClientRect();
            
            if (Utils.reactRectCollision(
                nodeBounds.left, nodeBounds.top, nodeBounds.width, nodeBounds.height,
                0, 0, innerWidth, innerHeight
            )) {
                this.selectNode(node);
            }
        }

        if (this.selectedNodes.length > 0)
            this.SelectedNodes.notify();
    }
    static selectAllInContainer(containerNode: ContainerNode | null): boolean {
        if (!containerNode || containerNode.innerNodes.length == 0) return false;

        this.deselectAll(false);
        for (const node of containerNode.innerNodes) {
            this.selectNode(node, false);
        }
        this.SelectedNodes.notify();

        return true;
    }
    static isNodeSelected(node: Node): boolean {
        return this.SelectedNodes.value.indexOf(node) >= 0;
    }

    // Get
    static getFirst(): Node | null {
        return this.selectedNodes[0] || null;
    }
    static get selectedNodes(): Node[] {
        return this.SelectedNodes.value;
    }
    static get count(): number {
        return this.SelectedNodes.value.length;
    }
    static get isMultipleSelectionKey(): boolean {
        return Keyboard.isShift
    }
    static get isSelectedMultiple(): boolean {
        return this.count > 1;
    }
    static get isSelected(): boolean {
        return this.count > 0;
    }
    static getSelectedNodesId(): number[] {
        return this.SelectedNodes.value.map(n=> n.id);
    }
}