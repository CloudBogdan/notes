import { Variants, animate, motion, useMotionValue } from "framer-motion";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import ListNode from "../../../classes/nodes/members/ListNode";
import NoteNode from "../../../classes/nodes/members/NoteNode";
import TodoNode from "../../../classes/nodes/members/TodoNode";
import useClassName from "../../../hooks/useClassName";
import Nodes from "../../../managers/board/Nodes";
import Mouse from "../../../managers/Mouse";
import { ListNodePreviewComponent } from "../../nodes/members/ListNodeComponent";
import { NoteNodePreviewComponent } from "../../nodes/members/NoteNodeComponent";
import { TodoNodePreviewComponent } from "../../nodes/members/TodoNodeComponent";
import FabButton from "../../ui/buttons/FabButton";
import ToolbarNodeButton from "./ToolbarNodeButton";
import ImageNode from "../../../classes/nodes/members/ImageNode";
import { ImageNodePreviewComponent } from "../../nodes/members/ImageNodeComponent";
import ContextMenu from "../../../managers/ui/ContextMenu";
import WorkspaceControls from "../../../managers/ui/WorkspaceControls";
import Board from "../../../managers/board/Board";
import { useNavigate } from "react-router";

const variants: Variants = {
    initial: {
        x: "-160%"
    },
    animate: {
        x: "0%",
        transition: {
            ease: "backOut",
            duration: .4,
            delay: .2,
            staggerChildren: .1,
        }
    },
    exit: {
        x: "-160%",
        transition: {
            ease: "circIn",
            duration: .3,
        }
    }
}

const Toolbar: React.FC = ()=> {
    const [creatingNodeElCallback, setCreatingNodeElCallback] = useState<(()=> JSX.Element) | null>(()=> null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const creatingRef = useRef<HTMLDivElement>();
    const creatingScale = useMotionValue(0);
    const navigate = useNavigate();

    const className = useClassName([
        "toolbar",
        isCreating && "creating"
    ])
    
    useEffect(()=> {
        
        const unlistenWindowMove = Mouse.onMove(e=> {
            const draggableElement = creatingRef.current;
            if (!draggableElement) return;
            
            gsap.killTweensOf(draggableElement);
            gsap.to(draggableElement, {
                left: e.clientX - draggableElement.offsetWidth/2,
                top: e.clientY - draggableElement.offsetHeight/2,
                ease: "sine.out",
                duration: .1
            })
        });

        return ()=> {
            unlistenWindowMove();
        }
    }, [creatingRef]);
    useEffect(()=> {
        if (!!creatingNodeElCallback) {
            if (isCreating) {
                animate(creatingScale, WorkspaceControls.zoom, { ease: "backOut", duration: .4 });
            } else
                animate(creatingScale, 0, { ease: "easeIn", duration: .1 });
        } else {
            creatingScale.stop();
            creatingScale.set(0);
        }

        Nodes.IsCreatingNode.value = !!creatingNodeElCallback && isCreating;

        if (Nodes.IsCreatingNode.value) {
            document.body.style.cssText = "cursor: grabbing !important";
        } else {
            document.body.style.cssText = "";
        }
    }, [creatingNodeElCallback, isCreating]);

    function onHomeClick() {
        Board.save().then(success=> {
            if (success)
                navigate("/");
        });
    }
    
    return <>
        <motion.aside 
            variants={ variants }
            initial="initial"
            animate="animate"
            exit="exit"
            className={ className }
        >
            <main className="toolbar-buttons">
                <FabButton title="Save and close" onClick={ onHomeClick } icon="house" transparent />
            </main>

            <div className="toolbar-node-buttons-wrapper">

                <div className="toolbar-node-buttons">

                    <ToolbarNodeButton 
                        nodeName={ NoteNode.NAME }
                        nodeClass={ NoteNode as any }
                        nodePreviewComponent={ NoteNodePreviewComponent }
                        setCreatingNodeElCallback={ setCreatingNodeElCallback }
                        setIsCreating={ setIsCreating }
                    />
                    <ToolbarNodeButton 
                        nodeName={ TodoNode.NAME }
                        nodeClass={ TodoNode as any }
                        nodePreviewComponent={ TodoNodePreviewComponent }
                        setCreatingNodeElCallback={ setCreatingNodeElCallback }
                        setIsCreating={ setIsCreating }
                    />
                    <ToolbarNodeButton 
                        nodeName={ ImageNode.NAME }
                        nodeClass={ ImageNode as any }
                        nodePreviewComponent={ ImageNodePreviewComponent }
                        setCreatingNodeElCallback={ setCreatingNodeElCallback }
                        setIsCreating={ setIsCreating }
                    />

                    <ToolbarNodeButton 
                        nodeName={ ListNode.NAME }
                        nodeClass={ ListNode as any }
                        nodePreviewComponent={ ListNodePreviewComponent }
                        setCreatingNodeElCallback={ setCreatingNodeElCallback }
                        setIsCreating={ setIsCreating }
                    />
                    
                </div>
                
            </div>
        </motion.aside>

        <motion.div 
            ref={ el=> el && (creatingRef.current = el) }
            style={{
                scale: creatingScale
            }}
            className="draggable-node-preview"
        >
            { !!creatingNodeElCallback && creatingNodeElCallback() }
        </motion.div>
    </>;
};

export default Toolbar;