import FloatingWindow from "../classes/floating-windows/FloatingWindow";
import DoneBrick from "../classes/node-bricks/members/DoneBrick";
import TextFormat from "../classes/TextFormat";
import ImageChangerWindowComponent from "../components/windows/ImageChangerWindowComponent";
import NodePaletteWindowComponent from "../components/windows/NodePaletteWindowComponent";
import Board from "./board/Board";
import Nodes from "./board/Nodes";
import Dashboard from "./Dashboard";
import Selection from "./Selection";
import Storage from "./Storage";
import Triggers from "./Triggers";
import FloatingWindows from "./ui/FloatingWindows";
import WorkspaceControls from "./ui/WorkspaceControls";

type Action = (...args: any[])=> void
interface IRegisteredActions {
    [key: string]: Action
}

export default class Actions {
    static registeredActions: IRegisteredActions = {};
    
    static init() {
        // Selection
        this.registerAction("deselect-all", ()=> Selection.deselectAll());
        this.registerAction("select-all-in-view", ()=> Selection.selectAllInView());
        
        // Nodes
        this.registerAction("remove-selected-nodes", ()=> Nodes.removeSelectedNodes());
        this.registerAction("edit-selected-node-trigger", ()=> this.editSelectedNodeTriggerAction());
        this.registerAction("toggle-selected-nodes-done", ()=> this.toggleSelectedNodesAction());
        this.registerAction("select-all-in-container", (nodeId: number)=> Selection.selectAllInContainer(Nodes.getNode(nodeId)));

        this.registerAction("format-text-trigger", (nodeId: number, format: TextFormat)=> Triggers.formatText.trigger({ targetsId: [nodeId], format }));

        this.registerAction("open-node-color-window", (nodeId: number)=> FloatingWindows.openWindow(NodePaletteWindowComponent, "node-color", [nodeId]));
        this.registerAction("open-image-changer-window", (nodeId: number)=> FloatingWindows.openWindow(ImageChangerWindowComponent, "image-changer", [nodeId]));
        
        // Board
        this.registerAction("save-current-board", ()=> Board.save());
        this.registerAction("create-board", ()=> Dashboard.createBoard(Date.now()));
        this.registerAction("remove-board", (boardId: number)=> Dashboard.removeBoard(boardId));
        
        // Workspace
        this.registerAction("pan-to-selection", ()=> WorkspaceControls.smoothPanToSelection());
        this.registerAction("reset-zoom", ()=> WorkspaceControls.smoothPanTo(null, null, 1));
        this.registerAction("increase-zoom", ()=> WorkspaceControls.smoothPanTo(null, null, WorkspaceControls.zoom + .3 * WorkspaceControls.zoom));
        this.registerAction("decrease-zoom", ()=> WorkspaceControls.smoothPanTo(null, null, WorkspaceControls.zoom - .3 * WorkspaceControls.zoom));
    }

    private static editSelectedNodeTriggerAction() {
        if (Selection.count == 1)
            Triggers.editNode.trigger({ targetsId: [Selection.selectedNodes[0].id] })
    }
    private static toggleSelectedNodesAction() {
        for (const node of Selection.selectedNodes) {
            node.getBrick<DoneBrick>(DoneBrick)?.toggleDone();
        }
    }

    //
    static invoke(name: string, args: any[]): boolean {
        const action = this.getAction(name);
        if (!action) return false;
        action(...args);
        console.log("Invoked", name);
        
        return true;
    }

    //
    static registerAction(name: string, action: Action) {
        this.registeredActions[name] = action;
    }
    static getAction(name: string): Action | null {
        return this.registeredActions[name] || null;
    }
}