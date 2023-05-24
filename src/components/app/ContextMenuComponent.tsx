import { motion, useAnimationControls, Variants } from "framer-motion";
import { createRef, useEffect, useRef, useState } from "react";
import useClassName from "../../hooks/useClassName";
import useStateListener from "../../hooks/useStateListener";
import ContextMenu, { IContextMenuButton, IContextMenuButtonsGroup } from "../../managers/ui/ContextMenu";
import Mouse from "../../managers/Mouse";
import Utils from "../../utils/Utils";
import Button, { IButton } from "../ui/buttons/Button";
import ClickOutside from "../ui/ClickOutside";
import State from "../../states/State";
import Actions from "../../managers/Actions";
import Hotkeys from "../../managers/Hotkeys";

interface IContextMenuButtonComponent extends IContextMenuButton {
    targetsId: number[]
    setIsActive: (v: boolean)=> void
}
export type IContextMenuGroupComponent = {
    targetsId: number[]
    setIsActive: (v: boolean)=> void
    activatedTimes: number
} & IContextMenuButtonsGroup

const ContextMenuComponent: React.FC = ()=> {
    const [activatedTimes, setActivatedTimes] = useState<number>(0);
    const [isActive, setIsActive] = useStateListener(ContextMenu.IsActive);
    const [buttonsGroups, setButtonsGroups] = useState<IContextMenuButtonsGroup[]>([]);
    const [targetsId, setTargetsId] = useState<number[]>([]);
    const controls = useAnimationControls();
    const wrapperRef = useRef<HTMLDivElement>();
    const contentRef = createRef<HTMLDivElement>();

    const variants: Variants = {
        hidden: {
            height: 0,
            transition: { ease: "easeIn", duration: .2 }
        },
        visible: ()=> ({
            height: (contentRef.current?.offsetHeight || 0) + 4,
            transition: { ease: "circOut", duration: .1 }
        })
    }

    const className = useClassName([
        "context-menu"
    ]);
    const wrapperClassName = useClassName([
        "context-menu-wrapper",
        isActive && "active"
    ]);

    useEffect(()=> {
        const unlistenWheel = Mouse.onWheel(()=> {
            setIsActive(false);
        });
        const unlistenTrigger = ContextMenu.MenuTrigger.listen(params=> {
            setButtonsGroups(params.groups);
            setTargetsId(params.targetsId || []);
        });

        return ()=> {
            unlistenTrigger();
            unlistenWheel();
        }
    }, [])
    useEffect(()=> {
        
        if (isActive) {
            setActivatedTimes(old=> old + 1);
            controls.stop();
            controls.set("hidden")
            controls.start("visible");
            updateTransform();
        } else
            controls.start("hidden")
            
    }, [isActive]);

    function updateTransform() {
        const wrapperElement = wrapperRef.current;
        const contentElement = contentRef.current;
        if (!wrapperElement || !contentElement) return;

        const contentBounds = contentElement.getBoundingClientRect();
        let x = Mouse.x;
        let y = Mouse.y;
        
        if (x + contentBounds.width > innerWidth-10)
            x = Mouse.x - contentBounds.width;
        if (y + contentBounds.height > innerHeight-10)
            y = Mouse.y - contentBounds.height;

        x = Utils.clamp(x, 10, innerWidth - contentBounds.width - 10);
        y = Utils.clamp(y, 10, innerHeight - contentBounds.height - 10);
        
        wrapperElement.style.left = x + "px";
        wrapperElement.style.top = y + "px";
    }

    function onWrapperPointerDownOutside() {
        setIsActive(false);
    }
    
    return (
        <ClickOutside
            myRef={ el=> wrapperRef.current = el }
            className={ wrapperClassName }

            onPointerDownOutside={ onWrapperPointerDownOutside }
        >
            <motion.div
                className={ className }

                initial={{ height: 0 }}
                animate={ controls }
                variants={ variants }
            >
                <main ref={ contentRef } className="context-menu-content">
                    
                    { buttonsGroups.filter(g=> g.buttons.length > 0).map((group, groupIndex)=>
                        <ContextMenuGroupComponent
                            key={ groupIndex }
                            activatedTimes={ activatedTimes }
                            setIsActive={ setIsActive }
                            targetsId={ targetsId }
                            { ...group }
                        />
                    ) }

                </main>
            </motion.div>
        </ClickOutside>
    );
};

export const ContextMenuGroupComponent: React.FC<IContextMenuGroupComponent> = props=> {
    const [updates, setUpdates] = useState<number>(0);
    
    const className = useClassName([
        "buttons-group",
        props.radio && "radio"
    ])

    useEffect(()=> {
        if (!props.listenStates) return;

        for (const state of props.listenStates()) {
            if (!!state && state instanceof State)
                state.listen(()=> setUpdates(old=> old+1));
        }
    }, []);
    
    return (
        <div className={ className } key={ props.name }>
            { props.buttons.map((button, buttonIndex)=>
                <ContextMenuButtonComponent 
                    { ...button }
                    key={ props.activatedTimes + buttonIndex }
                    setIsActive={ props.setIsActive }
                    targetsId={ props.targetsId }
                />
            ) }
        </div>
    );
};

export const ContextMenuButtonComponent: React.FC<IContextMenuButtonComponent & IButton> = props=> {
    const [updates, setUpdates] = useState<number>(0);
    const hotkey = props.actionName ? Hotkeys.registeredHotkeys[props.actionName] : null;
    const hotkeyText = hotkey?.binds[0].split("+").map(w=> Utils.capitalize(w)).join("+");
    
    const className = useClassName([
        "context-menu-button",
        (props.getIsActive && props.getIsActive()) && "active",
        props.className,
    ])

    useEffect(()=> {
        if (!props.getListenStates) return;

        for (const state of props.getListenStates()) {
            if (!!state && state instanceof State)
                state.listen(()=> setUpdates(old=> old+1));
        }
    }, []);
    
    function onClick() {
        function handle(targetId: number | null) {
            if (props.actionName) {
                if (targetId !== null)
                    Actions.invoke(props.actionName, [targetId, ...(props.actionParams || [])]);
                else
                    Actions.invoke(props.actionName, props.actionParams || []);
            }
    
            if (props.handle)
                props.handle(targetId);
        }

        if (props.targetsId.length > 0 && props.everyNode) {
            for (const targetId of props.targetsId) {
                handle(targetId);
            }
        } else {
            handle(props.targetsId[0] || null);
        }

        if (!props.preventClose)
            props.setIsActive(false);
    }
    
    return (
        <Button
            { ...props }
            actionName={ undefined }
            actionProps={ undefined }
        
            className={ className }
            text={ props.text }
            icon={ props.icon }
            title={ props.text + (hotkeyText ? ` [${ hotkeyText }]` : "") }
            
            iconWrapper
            iconElement={ props.getCustomIcon && props.getCustomIcon() }
            disabled={ props.getIsDisabled ? props.getIsDisabled() : false }

            onClick={ onClick }
        >
            { hotkeyText && <span className="hotkey">{ hotkeyText }</span> }
        </Button>
    );
};

export default ContextMenuComponent;