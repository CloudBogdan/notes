import React, { useEffect, useRef, useState } from "react";
import TodoNode from "../../../classes/nodes/members/TodoNode";
import useClassName from "../../../hooks/useClassName";
import useStateListener from "../../../hooks/useStateListener";
import Selection from "../../../managers/Selection";
import Triggers from "../../../managers/Triggers";
import FabButton from "../../ui/buttons/FabButton";
import ContentEditable from "../../ui/ContentEditable";
import NodeComponent, { INodeComponent, INodePreviewComponent, NodePreviewComponent } from "../NodeComponent";
import Checkbox from "../../ui/inputs/Checkbox";

interface ITodoNodeComponent extends INodeComponent<TodoNode> {
    
}

const TodoNodeComponent: React.FC<ITodoNodeComponent> = props=> {
    const node = props.node;

    const [done] = useStateListener(node.done.State);
    const [content, setContent] = useState<string>(node.content);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const textRef = useRef<HTMLDivElement>();
    
    const className = useClassName([
        "todo-node",
        done && "done",
        content.length == 0 && "empty"
    ])

    useEffect(()=> {
        const unlistenEdit = Triggers.editNode.listen(({ targetsId })=> {
            if (targetsId.includes(node.id)) {
                setIsEditing(true);
            }
        })

        return ()=> {
            unlistenEdit();
        }
    }, []);
    useEffect(()=> {
        node.isEditing = isEditing;
    }, [isEditing]);

    function toggleDone() {
        node.done.toggleDone();
    }

    function onContentDoubleClick() {
        if (!Selection.isMultipleSelectionKey)
            setIsEditing(true);
    }
    function onTextInput(value: string) {
        setContent(value);
    }
    function onTextBlur(e: React.FocusEvent<HTMLDivElement>) {
        const value = (e.target as HTMLDivElement).innerHTML;

        node.setTextContent(value);
    }
    
    return (
        <NodeComponent 
            { ...props }
            className={ className }
        >

            <div className="todo-checkbox-wrapper">
                <Checkbox
                    className="todo-checkbox"
                    value={ done }
                    onClick={ toggleDone }
                />
            </div>

            <main 
                className="todo-content"
                onDoubleClick={ onContentDoubleClick }
            >
                <ContentEditable
                    myRef={ el=> textRef.current = el }
                    className="todo-content-text"
                
                    initialContent={ node.content }
                    isActive={ isEditing }
                    setIsActive={ setIsEditing }
                    content={ content }
                    setContent={ setContent }
                    
                    placeholder="Todo something"
                    preventFromScroll
                    textContent
                    textFormat={ c=> c.trim().replace(/\s{2,}/gm, " ") }

                    onInput={ onTextInput }
                    onBlur={ onTextBlur }
                />
            </main>
            
        </NodeComponent>
    );
};

export const TodoNodePreviewComponent: React.FC<INodePreviewComponent & { done?: boolean }> = props=> {
    return (
        <NodePreviewComponent { ...props } className="todo-node">
            <div className="todo-checkbox-wrapper">
                <Checkbox className="todo-checkbox" value={ props.done || false } />
            </div>

            <main className="todo-content">
                <div className="todo-content-text content-editable" { ...{ "data-placeholder": "Todo something" } } />
            </main>
        </NodePreviewComponent>
    );
};

export default TodoNodeComponent;