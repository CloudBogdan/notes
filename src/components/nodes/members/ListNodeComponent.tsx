import { useEffect, useRef, useState } from "react";
import ListNode from "../../../classes/nodes/members/ListNode";
import useNodeInteract from "../../../hooks/nodes/useNodeInteract";
import useClassName from "../../../hooks/useClassName";
import Triggers from "../../../managers/Triggers";
import EditableTextInput from "../../ui/inputs/EditableTextInput";
import ContainerNodeComponent, { ContainerNodeInnerComponent, IContainerNodeComponent } from "../ContainerNodeComponent";
import { INodePreviewComponent, NodePreviewComponent } from "../NodeComponent";
import useStateListener from "../../../hooks/useStateListener";

interface IListNodeComponent extends IContainerNodeComponent<ListNode> {
    
}

const ListNodePlaceholder: React.FC = ()=> {
    return <>
        <div className="skeleton" />
        <div className="skeleton" />
    </>;
};

const ListNodeComponent: React.FC<IListNodeComponent> = props=> {
    const node = props.node;
    const [title] = useStateListener(node.Title);
    const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
    const { onPointerDown, onPointerUp } = useNodeInteract(node);
    const innerRef = useRef<HTMLDivElement>();
    
    const className = useClassName([
        "list-node"
    ]);

    useEffect(()=> {
        const unlistenEdit = Triggers.editNode.listen(({ targetsId })=> {
            if (targetsId.includes(node.id))
                setIsEditingTitle(true);
        })

        return ()=> unlistenEdit();
    }, []);
    useEffect(()=> {
        if (innerRef.current)
            node.initInner(innerRef.current);
    }, []);
    
    return (
        <ContainerNodeComponent
            { ...props }
            className={ className }
            customInteract
        >
            <header 
                onPointerDown={ onPointerDown }
                onPointerUp={ onPointerUp }
                className="list-node-header"
            >
                <EditableTextInput
                    value={ title }
                    onChange={ v=> node.setTitle(v) }
                    isEditing={ isEditingTitle }
                    setIsEditing={ setIsEditingTitle }
                    placeholder="List name"
                    preventFromScroll
                />
            </header>

            <ContainerNodeInnerComponent
                node={ node }
                placeholder={ <ListNodePlaceholder /> }
                myRef={ el=> innerRef.current = el }
            >
                <div
                    onPointerDown={ onPointerDown }
                    onPointerUp={ onPointerUp }
                    className="interact-field"
                />
            </ContainerNodeInnerComponent>

        </ContainerNodeComponent>
    );
};

export const ListNodePreviewComponent: React.FC<INodePreviewComponent> = props=> {
    return (
        <NodePreviewComponent { ...props } className="list-node">
            <header className="list-node-header">
                <span>List</span>
            </header>
            <main className="container-node-inner">
                <div className="content">
                    <ListNodePlaceholder />
                </div>
            </main>
        </NodePreviewComponent>
    );
};

export default ListNodeComponent;