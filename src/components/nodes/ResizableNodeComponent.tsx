import { useEffect } from "react";
import ResizableNode from "../../classes/nodes/ResizableNode";
import useClassName from "../../hooks/useClassName";
import Mouse from "../../managers/Mouse";
import WorkspaceControls from "../../managers/ui/WorkspaceControls";
import NodeComponent, { INodeComponent, IOptionalNodeComponent } from "./NodeComponent";
import Keyboard from "../../managers/Keyboard";
import Triggers from "../../managers/Triggers";

export interface IResizableNodeComponent<T extends ResizableNode> extends INodeComponent<T> {
    resizingRef: React.MutableRefObject<HTMLDivElement | undefined>
}

const ResizableNodeComponent: React.FC<IResizableNodeComponent<ResizableNode> & IOptionalNodeComponent> = props=> {
    const node = props.node;
    
    useEffect(()=> {
        const resizingElement = props.resizingRef.current;
        if (!resizingElement) return;

        let startWidth = 0;
        let startHeight = 0;
        let aspectRatio = 1;
        
        function onResizingPointerDown() {
            node.isResizing = true;

            startWidth = node.width;
            startHeight = node.height;
            aspectRatio = node.width / node.height;
        }
        function onWindowPointerUp() {
            if (!node.isResizing) return;
            
            node.isResizing = false;
            Triggers.onBoardEdited.trigger(true);
        }
        function onWindowPointerMove() {
            if (!node.isResizing || !Mouse.isButtonPressed(0)) return;

            if (Keyboard.isShift) {
                const x = Mouse.deltaX / WorkspaceControls.zoom;
                
                node.setSize(
                    startWidth + x,
                    startHeight + x / aspectRatio
                );
            } else {
                node.setSize(
                    startWidth + Mouse.deltaX / WorkspaceControls.zoom,
                    startHeight + Mouse.deltaY / WorkspaceControls.zoom
                );
            }
        }
        
        const unlistenPress = Mouse.onPress(onResizingPointerDown, resizingElement);
        const unlistenUp = Mouse.onUp(onWindowPointerUp);
        const unlistenMove = Mouse.onMove(onWindowPointerMove);

        return ()=> {
            unlistenPress();
            unlistenUp();
            unlistenMove();
        }
    }, []);
    
    return (
        <NodeComponent
            { ...props }
            className={ useClassName([props.className, "resizable-node"]) }
        />
    );
};

export default ResizableNodeComponent;