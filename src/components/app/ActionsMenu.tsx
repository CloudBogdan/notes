import { motion, useAnimationControls, Variants } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import useClassName from "../../hooks/useClassName";
import NodeActions, { IActionButtonsGroup } from "../../managers/NodeActions";
import Selection from "../../managers/Selection";
import WorkspaceControls from "../../managers/ui/WorkspaceControls";
import Utils from "../../utils/Utils";
import SelectionControls from "../../managers/ui/SelectionControls";
import { ContextMenuGroupComponent } from "./ContextMenuComponent";

const variants: Variants = {
    hidden: {
        y: 5,
        scale: .5,
        transition: { ease: "easeIn", duration: .1 }
    },
    visible: {
        y: 0,
        scale: 1,
        transition: { ease: "backOut", duration: .2 }
    }
}

const ActionsMenu: React.FC = React.memo(()=> {
    const [activatedTimes, setActivatedTimes] = useState<number>(0);
    const [buttonsGroups, setButtonsGroups] = useState<IActionButtonsGroup[]>([]);
    const [isActive, setIsActive] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>();
    const controls = useAnimationControls();
    
    const className = useClassName([
        "actions-menu"
    ])
    const wrapperClassName = useClassName([
        "actions-menu-wrapper",
        isActive && "active"
    ])

    useEffect(()=> {
        
        const unlisten = Selection.SelectedNodes.listen(nodes=> {
            controls.mount();

            const actions = NodeActions.getActionsMenuGroups(nodes);
            
            if (actions.length == 0 || nodes.length == 0) {
                controls.start("hidden");
                setIsActive(false);
                return;
            }

            if (!Utils.compareObjects(actions, buttonsGroups) || nodes.length <= 1) {
                setActivatedTimes(old=> old + 1);
                controls.stop();
                controls.set("hidden");
            }
            controls.start("visible")

            setIsActive(true);
            setButtonsGroups(actions);
        });

        updateTransform();

        return ()=> {
            unlisten();
        }
        
    }, [buttonsGroups])
    useEffect(()=> {
        const unlistenPanChanged = WorkspaceControls.onPanChanged.listen(()=> {
            updateTransform();
        })
        const unlistenSelectionChanged = SelectionControls.onSelectionRectChanged.listen(()=> {
            updateTransform();
        })

        return ()=> {
            unlistenPanChanged()
            unlistenSelectionChanged();
        }
    }, []);
    
    function updateTransform() {
        const wrapperElement = wrapperRef.current;
        if (!wrapperElement || !SelectionControls.selectionElement) return;

        const selectionBounds = SelectionControls.selectionElement.getBoundingClientRect();
        const bounds = wrapperElement.getBoundingClientRect();
        
        let x = selectionBounds.left + selectionBounds.width/2 - bounds.width/2;
        let y = selectionBounds.top - bounds.height - 10;

        if (y < 10) {
            y = selectionBounds.bottom + 10;
        }

        x = Utils.clamp(x, 10, innerWidth - bounds.width - 10);
        y = Utils.clamp(y, 10, innerHeight - bounds.height - 10);
        
        wrapperElement.style.left = x + "px"
        wrapperElement.style.top = y + "px"
    }
    
    return (
        <div 
            ref={ el=> el && (wrapperRef.current = el) }
            className={ wrapperClassName }
        >
            <motion.div 
                animate={ controls }
                variants={ variants }
                initial="hidden"
                className={ className }
            >
            
                { buttonsGroups.filter(g=> g.buttons.length > 0).map(group=>
                    <ActionsMenuGroup
                        key={ group.name }
                        activatedTimes={ activatedTimes }
                        { ...group }
                    />
                ) }

            </motion.div>
        </div>
    );
});

const ActionsMenuGroup: React.FC<IActionButtonsGroup & { activatedTimes: number }> = props=> {
    return <ContextMenuGroupComponent
        { ...props }
        activatedTimes={ props.activatedTimes }

        radio={ false }
        setIsActive={ ()=> {} }
        targetsId={ Selection.getSelectedNodesId() }
    />
}

export default ActionsMenu;