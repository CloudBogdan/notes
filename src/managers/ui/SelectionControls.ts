import { gsap } from "gsap";
import Node from "../../classes/nodes/Node";
import State from "../../states/State";
import Trigger from "../../states/Trigger";
import { IPoint, IRect } from "../../types/types";
import Utils from "../../utils/Utils";
import ContextMenu from "./ContextMenu";
import Keyboard from "../Keyboard";
import Mouse from "../Mouse";
import NodeActions from "../NodeActions";
import Selection from "../Selection";
import WorkspaceControls from "./WorkspaceControls";
import Nodes from "../board/Nodes";
import Triggers from "../Triggers";

export default class SelectionControls {
    static inited: boolean = false;
    static selectionElement: HTMLDivElement | null = null;
    
    static IsDragging = new State<boolean>("selection/is-dragging", false);
    
    static dragOffsets: IPoint[] = [];
    static allowDrag: boolean = true;
    static isMouseOver: boolean = false;

    static onDragging = new Trigger<Node[]>("selection/on-dragging");
    static onSelectionRectChanged = new Trigger<{ rect: IRect, isMoving: boolean }>("selection/on-selection-rect-changed");

    static init(selectionElement: HTMLDivElement) {
        if (this.inited) return ()=> {};
        this.inited = true;

        this.selectionElement = selectionElement;

        this.updateSelectionElement();
        
        //
        const unlistenSelectedNodes = Selection.SelectedNodes.listen(nodes=> {
            if (nodes.length == 0)
                this.endDragSelection();
            
            this.updateSelectionElement();
        });
        const unlistenGrabbing = this.initDragging();

        return ()=> {
            unlistenSelectedNodes();
            unlistenGrabbing();
        }
    }
    static initDragging() {
        let isPressed = false;
        
        const unlistenWindowUp = Mouse.onUp(()=> {
            isPressed = false;
            if (!this.isDragging && this.allowDrag) return;
            
            this.endDragSelection();
            this.allowDrag = true;
        })
        const unlistenWorkspacePress = Mouse.onPress(e=> {
            if (e.button == 0)
                isPressed = true;
        }, WorkspaceControls.workspaceElement)
        const unlistenWindowMove = Mouse.onMove(()=> {
            // Check mouse hover
            if (!(isPressed && this.isMouseOver))
                this.checkMouseOver();
            
            // Start drag
            if (isPressed && !this.isMouseOver)
                this.allowDrag = false;
            
            if (
                isPressed &&
                this.isMouseOver &&
                this.allowDrag &&
                !this.isDragging &&
                Selection.isSelected &&
                !Selection.isMultipleSelectionKey &&
                Utils.distance(Mouse.deltaX, Mouse.deltaY) > Math.min(...Selection.selectedNodes.map(n=> n.getDragThreshold()))
            ) {
                this.startDragSelection();
            }
            
            // Dragging selection
            this.updateDraggingSelection();
        })
        const unlistenWindowContextMenu = Mouse.onContextMenu(e=> {
            this.checkMouseOver();
            
            if (!this.isMouseOver || !Selection.isSelected) return;

            ContextMenu.setContextMenu({
                event: e,
                targetsId: Selection.getSelectedNodesId(),
                groups: NodeActions.getContextMenuGroups(Selection.selectedNodes)
            });
        })

        return ()=> {
            unlistenWindowUp();
            unlistenWorkspacePress();
            unlistenWindowMove();
            unlistenWindowContextMenu();
        }
    }
    static checkMouseOver() {
        if (!this.selectionElement) return;
        
        const bounds = this.selectionElement.getBoundingClientRect()
        this.isMouseOver = Utils.pointRectCollision(bounds.left, bounds.top, bounds.width, bounds.height, Mouse.x, Mouse.y);
    }
    
    static startDragSelection() {
        if (!this.getCanDrag()) return;
        
        this.IsDragging.value = true;
        this.dragOffsets = [];

        for (const node of Selection.selectedNodes) {
            if (!node.element) continue;

            node.onStartDrag();

            const nodeBounds = node.element.getBoundingClientRect();
            const offset: IPoint = {
                x: (Mouse.x - nodeBounds.left),
                y: (Mouse.y - nodeBounds.top),
                // x: (Mouse.x - nodeBounds.left - Mouse.deltaX),
                // y: (Mouse.y - nodeBounds.top - Mouse.deltaY),
            };
            
            this.dragOffsets.push(offset);
        }
    }
    static updateDraggingSelection() {
        if (!this.isDragging) return;

        const transformBounds = WorkspaceControls.transformElement.getBoundingClientRect();

        for (let i = 0; i < Selection.count; i ++) {
            const node = Selection.selectedNodes[i];
            const offset = this.dragOffsets[i];

            if (node && offset) {
                node.setPos(
                    (Mouse.x - offset.x - transformBounds.left + WorkspaceControls.pan.x * WorkspaceControls.zoom) / WorkspaceControls.zoom,
                    (Mouse.y - offset.y - transformBounds.top + WorkspaceControls.pan.y * WorkspaceControls.zoom) / WorkspaceControls.zoom,
                    false,
                    Keyboard.isShift,
                    !Keyboard.isShift
                );
                node.onDragging();
            }
        }

        this.onDragging.trigger(Selection.selectedNodes);
        this.updateSelectionElement(true);
    }
    static endDragSelection() {
        if (!this.IsDragging.value) return;

        let lag = 0;
        this.IsDragging.value = false;
        
        for (const node of Selection.selectedNodes) {
            lag ++;

            node.onEndDrag();
            node.snapToGrid(lag <= 1 ? ()=> {
                this.updateSelectionElement();
            } : undefined);
        }

        Triggers.onBoardEdited.trigger(true);
    }

    static destroy() {
        if (!this.inited) return;
        
        this.inited = false;
        Selection.deselectAll();
    }

    //
    static updateSelectionElement(isMoving: boolean=false) {
        if (!this.selectionElement) return;
        
        const rect = this.getSelectionRect();
        const paddings = 10;

        this.selectionElement.style.left = (rect.x - paddings) + "px";
        this.selectionElement.style.top = (rect.y - paddings) + "px";
        this.selectionElement.style.width = (rect.width + paddings*2) + "px";
        this.selectionElement.style.height = (rect.height + paddings*2) + "px";

        this.selectionElement.style.visibility = Selection.count > 1 ? "visible" : "hidden";

        this.onSelectionRectChanged.trigger({ rect: rect, isMoving: isMoving });
    }

    // Get
    static get isDragging(): boolean {
        return this.IsDragging.value;
    }
    static getCanDrag(): boolean {
        return (
            !Nodes.isCreatingNode && !ContextMenu.isActive && !Keyboard.inputFocused &&
            Selection.selectedNodes.filter(n=> !n.getIsDraggable()).length == 0
        );
    }
    static getSelectionRect(): IRect {
        let minLeft = Infinity;
        let minTop = Infinity;
        let maxRight = -Infinity;
        let maxBottom = -Infinity;
        
        for (const node of Selection.selectedNodes) {
            if (!node.element) continue;
            
            const bounds = node.element.getBoundingClientRect();
            
            if (bounds.left < minLeft)
                minLeft = bounds.left;
            if (bounds.top < minTop)
                minTop = bounds.top;

            if (bounds.right > maxRight)
                maxRight = bounds.right;
            if (bounds.bottom > maxBottom)
                maxBottom = bounds.bottom;
        }
        
        return {
            x: minLeft,
            y: minTop,
            width: maxRight - minLeft,
            height: maxBottom - minTop
        };
    }
}