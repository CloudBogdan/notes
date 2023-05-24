import { useEffect, useRef, useState } from "react";
import Node from "../../../classes/nodes/Node";
import useClassName from "../../../hooks/useClassName";
import Nodes from "../../../managers/board/Nodes";
import Mouse from "../../../managers/Mouse";
import Utils from "../../../utils/Utils";
import { INodePreviewComponent } from "../../nodes/NodeComponent";
import Config from "../../../utils/Config";
import { Variants, motion } from "framer-motion";

interface IToolbarNodeButton {
    nodeName: string
    nodeClass: typeof Node
    nodePreviewComponent: React.FC<INodePreviewComponent>

    setCreatingNodeElCallback: (callback: (()=> ()=> JSX.Element) | null)=> void
    setIsCreating: (v: boolean)=> void
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement>)=> void
}

const buttonVariants: Variants = {
    initial: {
        x: "-120%"
    },
    animate: {
        x: "0%",
        transition: {
            ease: "backOut",
            duration: .6
        }
    },
    exit: {
        x: "-120%",
        transition: {
            ease: "circIn",
            duration: .3,
        }
    }
}

const ToolbarNodeButton: React.FC<IToolbarNodeButton> = props=> {
    const ref = useRef<HTMLDivElement>();

    const className = useClassName([
        "toolbar-node-button",
        props.nodeName + "-node-button"
    ]);
    
    useEffect(()=> {
        const element = ref.current;
        if (!element) return;

        let isPressed = false;
        let isDragging = false;
        let isDraggingOver = false;

        const unlistenPress = Mouse.onPress(e=> {
            if (e.button != 0) return;
            
            isPressed = true;
        }, element);
        const unlistenWindowMove = Mouse.onMove(e=> {
            if (!isPressed) {
                isDraggingOver = false;
                return;
            }

            if (!isDragging && Utils.distance(Mouse.deltaX, Mouse.deltaY) > Config.CREATE_NODE_DRAG_THRESHOLD) {
                startDrag();
                isDragging = true;
            }

            const bounds = element.getBoundingClientRect();
            isDraggingOver = Utils.pointRectCollision(bounds.left, bounds.top, bounds.width, bounds.height, e.clientX, e.clientY)
        })
        const unlistenWindowUp = Mouse.onUp(e=> {
            isPressed = false;
            
            // Cancel creating
            if (isDraggingOver) {
                isDragging = false;
                props.setIsCreating(false);
                
                return;
            }
            
            if (!isDragging) return;
            
            isDragging = false;
            endDragAndCreateNode();
        });

        return ()=> {
            unlistenPress();
            unlistenWindowMove();
            unlistenWindowUp();
        }

    }, []);

    function startDrag() {
        props.nodeClass.onStartCreating();
        props.setCreatingNodeElCallback(()=> ()=> <props.nodePreviewComponent dragging />);
        props.setIsCreating(true);
    }
    function endDragAndCreateNode() {
        props.setIsCreating(false);
        props.setCreatingNodeElCallback(null);

        // Create node
        const node = props.nodeClass.create();
        Nodes.placeNode(node, Mouse.workspaceX, Mouse.workspaceY);
        
        props.nodeClass.onEndCreating();
    }
    
    return (
        <motion.div
            ref={ el=> el && (ref.current = el) }
            className={ className }

            variants={ buttonVariants }
            onContextMenu={ props.onContextMenu }
        >
            <div className="node-preview-wrapper">
                <props.nodePreviewComponent />
            </div>
        </motion.div>
    );
};

export default ToolbarNodeButton;