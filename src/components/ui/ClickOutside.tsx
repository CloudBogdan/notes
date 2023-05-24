import { motion, MotionProps } from "framer-motion";
import React, { useEffect, useRef } from "react";
import useClassName from "../../hooks/useClassName";
import Mouse from "../../managers/Mouse";
import { MyComponent } from "../../types/component-types";
import Utils from "../../utils/Utils";

interface IClickOutside extends MyComponent {
    myRef?: (el: HTMLDivElement)=> void
    elementName?: string

    onClickOutside?: ()=> void
    onPointerDownOutside?: ()=> void
    onClick?: (e: React.PointerEvent<HTMLDivElement>)=> void
    onPointerDown?: (e: React.PointerEvent<HTMLDivElement>)=> void
    onPointerUp?: (e: React.PointerEvent<HTMLDivElement>)=> void
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement>)=> void
    deps?: any[]

    isMotion?: boolean
    motion?: MotionProps
}

const ClickOutside: React.FC<IClickOutside> = props=> {
    const ref = useRef<HTMLDivElement>();
    const ElementName = props.elementName || "div";
    
    const className = useClassName([
        props.className
    ])

    useEffect(()=> {
        const element = ref.current;
        if (!element) return;

        let isOver = false;
        
        function onWindowClick() {
            if (isOver) return;

            props.onClickOutside && props.onClickOutside();
        }
        function onWindowPointerDown() {
            if (isOver) return;

            props.onPointerDownOutside && props.onPointerDownOutside();
        }
        function onWindowMove(e: PointerEvent) {
            if (!element) return;
            
            const bounds = element.getBoundingClientRect();
            isOver = Utils.pointRectCollision(bounds.left, bounds.top, bounds.width, bounds.height, e.clientX, e.clientY);
        }
        
        const unlistenMove = Mouse.onMove(onWindowMove);
        const unlistenClick = Mouse.onClick(onWindowClick);
        const unlistenPress = Mouse.onPress(onWindowPointerDown);

        return ()=> {
            unlistenMove();
            unlistenClick();
            unlistenPress();
        }
    }, [ref, ...(props.deps || [])]);

    const elementProps = {
        ref: (el: HTMLDivElement)=> {
            if (el) {
                ref.current = el;
                props.myRef && props.myRef(el);
            }
        },
        className: className,
        style: props.style,

        onClick: props.onClick,
        onPointerDown: props.onPointerDown,
        onPointerUp: props.onPointerUp,
        onContextMenu: props.onContextMenu,
    }
    
    if (props.isMotion) {
        const MotionElement = (motion as any)[ElementName];
        
        return <MotionElement { ...elementProps } { ...(props.motion || {}) }>{ props.children }</MotionElement>;
    }
    
    // @ts-ignore
    return <ElementName { ...elementProps }>{ props.children }</ElementName>;
};

export default ClickOutside;