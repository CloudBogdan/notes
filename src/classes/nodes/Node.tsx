import gsap from "gsap"
import NodeComponent, { INodeComponent } from "../../components/nodes/NodeComponent"
import Selection from "../../managers/Selection"
import Config from "../../utils/Config"
import Utils from "../../utils/Utils"
import State from "../../states/State"
import NodeBrick from "../node-bricks/NodeBrick"
import Nodes from "../../managers/board/Nodes"

export interface INode {
    id: number
    name: string
    x: number
    y: number
}
export interface INodeData {
    id: number
    name: string
    x: number
    y: number
    parentId: number | null
}

export default class Node implements INode {
    id: number;
    name: string;
    x: number = 0;
    y: number = 0;
    parent: Node | null = null;

    IsDragOver = new State<boolean>("node/is-drag-over", false);

    isDragging: boolean = false;
    isEditing: boolean = false;
    bricks: NodeBrick[] = [];
    
    autoSelect: boolean = false;
    autoCenter: boolean = false;
    autoSnap: boolean = false;
    
    onElementLoaded: (element: HTMLDivElement)=> void = ()=> {};
    
    element: HTMLDivElement | null = null;
    component: React.FC<INodeComponent<any>>;
    
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        
        this.component = NodeComponent;
    }

    init(element: HTMLDivElement) {
        this.element = element;

        if (this.autoCenter) {
            this.setPos(this.x, this.y, true, !this.autoSnap);
            this.autoCenter = false;
        }

        if (this.autoSelect) {
            Selection.deselectAll();
            Selection.selectNode(this);
            this.autoSelect = false;
        }
        if (this.autoSnap) {
            this.snapToGrid();
            this.autoSnap = false;
        }

        this.updateElementTransform();
        this.onElementLoaded(this.element);
    }

    //
    setPos(x: number, y: number, centered: boolean=false, snapToGrid: boolean=true, animate: boolean=false) {
        if (centered && this.element) {
            x = x - this.element.offsetWidth/2;
            y = y - this.element.offsetHeight/2;
        }

        if (snapToGrid) {
            x = Math.round(x / Config.GRID_SIZE) * Config.GRID_SIZE;
            y = Math.round(y / Config.GRID_SIZE) * Config.GRID_SIZE;
        }

        gsap.killTweensOf(this, "x,y");

        this.x = x;
        this.y = y;

        this.updateElementTransform();
    }
    snapToGrid(onTweenUpdate: ()=> void=()=> {}) {
        gsap.killTweensOf(this, "x,y");
        gsap.to(this, {
            x: Math.round(this.x / Config.GRID_SIZE) * Config.GRID_SIZE,
            y: Math.round(this.y / Config.GRID_SIZE) * Config.GRID_SIZE,
            ease: "power3.out",
            duration: .2,
            onUpdate: ()=> {
                this.updateElementTransform();
                onTweenUpdate();
            },
            onComplete: ()=> {
            }
        })
    }
    updateElementTransform() {
        if (!this.element) return;

        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    }
    setParent(parent: Node) {
        this.parent = parent;
        this.parent.addChild(this);
    }
    clearParent() {
        if (this.parent)
            this.parent.removeChild(this);
    }
    addChild(node: Node) {
        node.parent = this;
    }
    removeChild(node: Node) {
        node.parent = null;
    }

    addBrick(brick: NodeBrick) {
        this.bricks.push(brick);
    }
    getBrick<T extends NodeBrick=any>(brickClass: typeof NodeBrick): T | null {
        return this.bricks.find(b=> b instanceof brickClass) as T || null;
    }

    //
    onStartDrag() {
        this.isDragging = true;
        this.clearParent();
    }
    onDragging() {}
    onEndDrag() {
        this.isDragging = false;
    }
    onSelect() {}
    onDeselect() {}
    onDragOver() {
        this.IsDragOver.value = true;
    }
    onDragOut() {
        this.IsDragOver.value = false;
    }

    // Get
    getIsDraggable(): boolean {
        return !this.isEditing;
    }
    getDragThreshold(): number {
        if (this.parent)
            return Config.CONTAINER_CHILD_DRAG_THRESHOLD;
        
        return Config.NODE_DRAG_THRESHOLD
    }

    // Data
    loadData(data: INodeData) {
        if (data.id !== undefined)
            this.id = data.id;
        if (data.x !== undefined)
            this.x = data.x;
        if (data.y !== undefined)
            this.y = data.y;
    }
    getData(): INodeData {
        return {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            parentId: this.parent?.id || null,
        };
    }

    // Static
    static create(id?: number): Node {
        return new Node(Utils.safeValue(id, Date.now()), "node");
    }

    static onStartCreating() {
        
    }
    static onEndCreating() {
        
    }
}