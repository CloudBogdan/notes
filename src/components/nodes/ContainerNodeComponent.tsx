import { createRef, useEffect, useRef, useState } from "react";
import ContainerNode from "../../classes/nodes/ContainerNode";
import useApplyRefs from "../../hooks/useApplyRefs";
import useClassName from "../../hooks/useClassName";
import useMouseOver from "../../hooks/useMouseOver";
import useStateListener from "../../hooks/useStateListener";
import Nodes from "../../managers/board/Nodes";
import Mouse from "../../managers/Mouse";
import Selection from "../../managers/Selection";
import { MyComponent, RequiredRefCallback } from "../../types/component-types";
import { IBox } from "../../types/types";
import Config from "../../utils/Config";
import Utils from "../../utils/Utils";
import NodeComponent, { INodeComponent, IOptionalNodeComponent } from "./NodeComponent";
import SelectionControls from "../../managers/ui/SelectionControls";

export interface IContainerNodeComponent<T extends ContainerNode> extends INodeComponent<T> {
    
}
interface IContainerNodeInnerComponent extends MyComponent {
    node: ContainerNode

    placeholder?: JSX.Element
    myRef?: RequiredRefCallback
}

const ContainerNodeComponent: React.FC<IContainerNodeComponent<ContainerNode> & IOptionalNodeComponent> = props=> {
    return (
        <NodeComponent
            { ...props }
            className={ useClassName([props.className, "container-node"]) }
        />
    );
};

export const ContainerNodeInnerComponent: React.FC<IContainerNodeInnerComponent> = props=> {
    const node = props.node;
    const [innerNodes] = useStateListener(node.InnerNodes);
    const [insertNodesAtIndex, setGhostsOrder] = useState<number>(0);
    const [selectedNodes] = useStateListener(Selection.SelectedNodes);
    const [isCorrectNodesDragging, setIsCorrectNodesDragging] = useState<boolean>(false);
    const [nodeGhosts, setNodeGhosts] = useState<IBox[]>([]);
    const ref = useRef<HTMLDivElement>();
    const isMouseOver = useMouseOver(ref.current, isCorrectNodesDragging);
    
    const className = useClassName([
        "container-node-inner",
        isMouseOver && "mouse-over",
        isCorrectNodesDragging && "nodes-dragging",
        props.className
    ])

    useEffect(()=> {
        const unlistenMouseUp = Mouse.onUp(()=> {
            if (!isMouseOver) return;
            
            insertSelectedNodes();
            setNodeGhosts([]);
        });

        return ()=> unlistenMouseUp();
    }, [selectedNodes, isMouseOver])
    useEffect(()=> {
        const unlistenDragging = SelectionControls.onDragging.listen(()=> {
            for (let i = 0; i < node.innerNodes.length; i ++) {
                const innerNode = node.innerNodes[i];
                if (!innerNode.element) continue;
                
                const bounds = innerNode.element.getBoundingClientRect();
                
                if (Utils.pointRectCollision(bounds.left, bounds.top, bounds.width, bounds.height, Mouse.x, Mouse.y)) {
                    if (Mouse.y > bounds.top + bounds.height/2)
                        setGhostsOrder(i + 1);
                    else 
                        setGhostsOrder(i);
                }
            }
        });
        const unlistenIsDragging = SelectionControls.IsDragging.listen(isDragging=> {
            const nodesAreCorrect = selectedNodes.filter(n=> node.canContainNodeNames.includes(n.name) && n != node).length == selectedNodes.length;
            
            setIsCorrectNodesDragging(isDragging && nodesAreCorrect);
        });
        
        return ()=> {
            unlistenIsDragging();
            unlistenDragging();
        }
    }, [selectedNodes]);
    useEffect(()=> {
        if (isMouseOver) {
            const nodes = selectedNodes.map(n=> {
                if (!n.element) return null;

                return {
                    width: n.element.offsetWidth,
                    height: n.element.offsetHeight
                } as IBox;
            })
            
            setNodeGhosts(nodes.filter(Boolean) as IBox[]);
        } else {
            setNodeGhosts([]);
        }
    }, [isMouseOver, selectedNodes]);
    useEffect(()=> {
        node.insertChildAtIndex = insertNodesAtIndex;
    }, [insertNodesAtIndex]);

    function insertSelectedNodes() {
        Nodes.removeNodes(selectedNodes)

        const sortedNodes = selectedNodes.sort((a, b)=> {
            if (!a.element || !b.element) return 0;

            const aBounds = a.element.getBoundingClientRect();
            const bBounds = b.element.getBoundingClientRect();

            return bBounds.top - aBounds.top;
        })

        for (const selectedNode of sortedNodes) {
            node.addChild(selectedNode);
        }
    }
    
    return (
        <main
            ref={ el=> useApplyRefs(el as HTMLDivElement, [ref, props.myRef]) }
            className={ className }
        >
            { props.children }
            
            <div className="content">

                { (innerNodes.length == 0 && nodeGhosts.length == 0) && props.placeholder }

                { nodeGhosts.map((ghost, index)=>
                    <div
                        key={ index }
                        style={{ width: ghost.width, height: ghost.height, order: insertNodesAtIndex }}
                        className="node-ghost"
                    />
                ) }

                { innerNodes.map((innerNode, index)=>
                    <div
                        key={ innerNode.id }
                        style={{ order: index }}
                        className="inner-node"
                    >
                        <innerNode.component node={ innerNode } />
                    </div>
                ) }

            </div>
        </main>
    );
};

export default ContainerNodeComponent;