import { FormEvent, useEffect, useRef, useState } from "react";
import NoteNode from "../../../classes/nodes/members/NoteNode";
import useClassName from "../../../hooks/useClassName";
import useStateListener from "../../../hooks/useStateListener";
import Selection from "../../../managers/Selection";
import Triggers from "../../../managers/Triggers";
import ContentEditable from "../../ui/ContentEditable";
import Icon from "../../ui/Icon";
import { INodeComponent, INodePreviewComponent, NodePreviewComponent } from "../NodeComponent";
import ResizableNodeComponent from "../ResizableNodeComponent";
import useApplyRefs from "../../../hooks/useApplyRefs";
import { ResizeText, TextSize } from "../../../types/types";

export interface INoteNodeComponent extends INodeComponent<NoteNode> {
    
}

const NoteNodeComponent: React.FC<INoteNodeComponent> = props=> {
    const node = props.node;

    const [content, setContent] = useState<string>(node.content);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [textAlign] = useStateListener(node.textFormat.TextAlign);
    const [textSize] = useStateListener(node.textFormat.TextSize);
    const [color] = useStateListener(node.color.State);
    const textRef = useRef<HTMLDivElement>();
    const resizingRef = useRef<HTMLDivElement>();
    
    const className = useClassName([
        "note-node",
        `color-${ color }`,
        isEditing && "editing",
        content.length == 0 && "empty"
    ])
    const contentClassName = useClassName([
        "note-content",
        `text-align-${ textAlign }`,
        `text-size-${ textSize }`,
    ])

    useEffect(()=> {
        const unlistenTextFormat = Triggers.formatText.listen(({ targetsId, format })=> {
            if (!targetsId.includes(node.id)) return;

            if (format.textAlign)
                node.textFormat.setTextAlign(format.textAlign);

            if (format.resizeText == ResizeText.INCREASE)
                node.textFormat.increaseTextSize();
            else if (format.resizeText == ResizeText.DECREASE)
                node.textFormat.decreaseTextSize();
        })

        return ()=> {
            unlistenTextFormat();
        }
    }, [textSize]);
    useEffect(()=> {
        const unlistenEdit = Triggers.editNode.listen(({ targetsId })=> {
            if (targetsId.includes(node.id))
                setIsEditing(true);
        })

        return ()=> {
            unlistenEdit();
        }
    }, []);
    useEffect(()=> {
        node.isEditing = isEditing;
    }, [isEditing]);

    function onContentDoubleClick() {
        if (!Selection.isMultipleSelectionKey)
            setIsEditing(true);
    }
    function onTextInput(value: string) {
        setContent(value);
    }
    function onTextBlur(e: FormEvent<HTMLDivElement>) {
        const value = (e.target as HTMLDivElement).innerHTML
        
        node.setHTMLContent(value);
    }
    
    return (
        <ResizableNodeComponent
            { ...props }
            className={ className }
            resizingRef={ resizingRef }
        >
            <main 
                onDoubleClick={ onContentDoubleClick }
                className={ contentClassName }
            >
                <ContentEditable
                    myRef={ el=> textRef.current = el }
                    className="node-content-text"
                
                    initialContent={ node.content }
                    isActive={ isEditing }
                    setIsActive={ setIsEditing }
                    content={ content }
                    setContent={ setContent }
                    
                    placeholder="Some note..."
                    preventFromScroll

                    onInput={ onTextInput }
                    onBlur={ onTextBlur }
                />
            </main>

            <div className="note-fold" ref={ el=> useApplyRefs(el, [resizingRef]) }>
                <Icon icon="note-fold" />
            </div>
        </ResizableNodeComponent>
    );
};

export const NoteNodePreviewComponent: React.FC<INodePreviewComponent> = props=> {
    const [currentColor] = useStateListener(NoteNode.CurrentColor);
    
    const className = useClassName([
        "note-node",
        `color-${ currentColor }`
    ])
    
    return (
        <NodePreviewComponent { ...props } className={ className }>
            <main className="note-content">
                <div className="node-content-text" />
            </main>

            <div className="note-fold">
                <Icon icon="note-fold" />
            </div>
        </NodePreviewComponent>
    );
};

export default NoteNodeComponent;