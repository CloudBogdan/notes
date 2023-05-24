import SelectionControls from "../../managers/ui/SelectionControls";
import Config from "../../utils/Config";
import Utils from "../../utils/Utils";
import Node, { INode, INodeData } from "./Node";

export interface IResizableNode extends INode {
    width: number
    height: number
}
export interface IResizableNodeData extends INodeData {
    width: number
    height: number
}

export default class ResizableNode extends Node implements IResizableNode {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;

    isResizing: boolean = false;
    
    constructor(id: number, name: string) {
        super(id, name);

        this.width = 100;
        this.height = 100;
        this.minWidth = 100;
        this.minHeight = 100;
        this.maxWidth = 400;
        this.maxHeight = 400;
    }

    setSize(width: number, height: number, snapToGrid: boolean=true) {
        width = Utils.clamp(width, this.minWidth, this.maxWidth);
        height = Utils.clamp(height, this.minHeight, this.maxHeight);
        
        if (snapToGrid) {
            width = Math.floor(width / Config.GRID_SIZE) * Config.GRID_SIZE;
            height = Math.floor(height / Config.GRID_SIZE) * Config.GRID_SIZE;
        }

        this.width = width;
        this.height = height;

        this.updateElementTransform();
    }

    //
    updateElementTransform(): void {
        if (!this.element) return;
        super.updateElementTransform();

        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        
        SelectionControls.updateSelectionElement();
    }
    
    // Get
    getIsDraggable(): boolean {
        return super.getIsDraggable() && !this.isResizing;
    }

    // Data
    loadData(data: IResizableNodeData): void {
        super.loadData(data);

        if (data.width !== undefined)
            this.width = data.width;
        if (data.height !== undefined)
            this.height = data.height;
    }
    getData(): IResizableNodeData {
        return {
            ...super.getData(),
            width: this.width,
            height: this.height,
        };
    }
}