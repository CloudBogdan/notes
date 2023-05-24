import React, { useEffect, useRef } from "react";
import Node from "../../classes/nodes/Node";
import useNodeInteract from "../../hooks/nodes/useNodeInteract";
import useClassName from "../../hooks/useClassName";
import Selection from "../../managers/Selection";
import { MyComponent } from "../../types/component-types";
import ClickOutside from "../ui/ClickOutside";

export interface IOptionalNodeComponent {
    customInteract?: boolean
    
    onClickOutside?: ()=> void
    onClick?: ()=> void
}
export interface INodeComponent<T extends Node> extends MyComponent {
    node: T
}
export interface INodePreviewComponent extends MyComponent {
    dragging?: boolean
}

const NodeComponent: React.FC<INodeComponent<Node> & IOptionalNodeComponent> = props=> {
    const node = props.node;
    const { onPointerDown, onPointerUp } = !props.customInteract ? useNodeInteract(props.node) : { onPointerDown: ()=> {}, onPointerUp: ()=> {} };
    const ref = useRef<HTMLDivElement>();
    
    const className = useClassName([
        "node",
        Selection.isNodeSelected(node) && "selected",
        props.className
    ])

    useEffect(()=> {
        if (ref.current) {
            node.init(ref.current);
        }
    }, []);

    function onClickOutside() {
        props.onClickOutside && props.onClickOutside();
    }
    function onClick() {
        props.onClick && props.onClick();
    }

    return (
        <ClickOutside
            elementName="article"
            myRef={ el=> ref.current = el }

            className={ className }
            style={ props.style }

            onClickOutside={ onClickOutside }
            onClick={ onClick }
            onPointerDown={ onPointerDown }
            onPointerUp={ onPointerUp }
        >
            { props.children }
        </ClickOutside>
    );
}

export const NodePreviewComponent: React.FC<INodePreviewComponent> = props=> {
    const className = useClassName([
        "node-preview",
        props.dragging && "dragging",
        props.className
    ]);
    
    return (
        <article className={ className }>
            { props.children }
        </article>
    );
};

export default NodeComponent;