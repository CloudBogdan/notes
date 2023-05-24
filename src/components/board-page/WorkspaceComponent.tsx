import React, { createRef, useEffect, useState } from "react";
import useStateListener from "../../hooks/useStateListener";
import Board from "../../managers/board/Board";
import Selection from "../../managers/Selection";
import WorkspaceControls from "../../managers/ui/WorkspaceControls";
import ActionsMenu from "../app/ActionsMenu";
import SelectionRect from "./selection/SelectionRect";
import SelectionControls from "../../managers/ui/SelectionControls";

const WorkspaceComponent: React.FC = ()=> {
    const [isInited, setIsInited] = useState<boolean>(false);
    const ref = createRef<HTMLDivElement>();
    
    useEffect(()=> {
        if (ref.current) {
            setIsInited(true);
            const unlisten = WorkspaceControls.init(ref.current);

            return ()=> {
                unlisten();
                WorkspaceControls.destroy();
            }
        }
    }, []);
    
    return (
        <div ref={ ref } className="workspace">
            <WorkspaceTransform />
            { isInited && <>
                <SelectionRect />
                <ActionsMenu />
            </> }
        </div>
    );
};

const WorkspaceTransform: React.FC = ()=> {
    const [nodes] = useStateListener(Board.Nodes);
    const [selectedNodes] = useStateListener(Selection.SelectedNodes);

    function onGridPointerUp(e: React.PointerEvent) {
        if (e.button != 0 && e.button != 2) return;
        
        if (!Selection.isMultipleSelectionKey && !SelectionControls.isDragging)
            Selection.deselectAll();
    }
    
    return (
        <div className="workspace-transform">
            <div 
                className="workspace-grid"
                onPointerUp={ onGridPointerUp }
            />
                
            <div className="workspace-nodes">
                
                { nodes.map(node=> {
                    return <node.component node={ node } key={ node.id } />;
                }) }
                
            </div>
        </div>
    );
};

export default WorkspaceComponent;