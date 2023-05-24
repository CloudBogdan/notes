import { createRef, useEffect, useRef, useState } from "react";
import ImageNode from "../../../classes/nodes/members/ImageNode";
import useStateListener from "../../../hooks/useStateListener";
import Icon from "../../ui/Icon";
import { INodeComponent, INodePreviewComponent, NodePreviewComponent } from "../NodeComponent";
import ResizableNodeComponent from "../ResizableNodeComponent";
import useClassName from "../../../hooks/useClassName";
import useApplyRefs from "../../../hooks/useApplyRefs";

interface IImageNodeComponent extends INodeComponent<ImageNode> {}

const ImageNodeComponent: React.FC<IImageNodeComponent> = props=> {
    const node = props.node;
    const [imageSource] = useStateListener(node.image.Source);
    const [imagePixilated] = useStateListener(node.image.Pixilated);
    const [isLoading] = useStateListener(node.image.IsLoading);
    const [loaded, setLoaded] = useState<boolean>(false);
    const resizingRef = useRef<HTMLDivElement>();
    const imageRef = createRef<HTMLImageElement>();
    
    const className = useClassName([
        "image-node",
        imagePixilated && "pixilated",
        isLoading && "loading",
        loaded && "loaded"
    ])

    useEffect(()=> {
        if (imageRef.current)
            node.initImage(imageRef.current);
    }, []);
    useEffect(()=> {
        if (!imageSource)
            setLoaded(false);
    }, [imageSource]);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (!imageRef.current) return;
        
        setLoaded(true);
        node.image.onImageLoaded.trigger(e.target as HTMLImageElement);
    }

    return (
        <ResizableNodeComponent
            { ...props }
            resizingRef={ resizingRef }
            className={ className }
        >
            <div className="icon-wrapper image-icon-wrapper">
                <Icon icon="large-image" />
            </div>
            
            <div className="image">
                <img 
                    ref={ imageRef }
                    src={ imageSource || '' }
                    
                    onLoad={ onImageLoad }
                />
            </div>

            <div className="image-fold" ref={ el=> useApplyRefs(el, [resizingRef]) }>
                <Icon icon="image-fold" />
            </div>
        </ResizableNodeComponent>
    );
};

export const ImageNodePreviewComponent: React.FC<INodePreviewComponent> = props=> {
    return (
        <NodePreviewComponent { ...props } className="image-node-preview">
            <Icon icon="large-image" />
        </NodePreviewComponent>
    );
};

export default ImageNodeComponent;