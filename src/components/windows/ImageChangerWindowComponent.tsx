import { useEffect, useState } from "react";
import ImageBrick from "../../classes/node-bricks/members/ImageBrick";
import Nodes from "../../managers/board/Nodes";
import FloatingWindows from "../../managers/ui/FloatingWindows";
import FloatingWindowComponent, { FloatingWindowContentComponent, IFloatingWindowComponent } from "../ui/window/FloatingWindowComponent";
import useStateListener from "../../hooks/useStateListener";
import Mouse from "../../managers/Mouse";
import Config from "../../utils/Config";
import { useMotionValue } from "framer-motion";
import Checkbox from "../ui/inputs/Checkbox";
import ImageInput from "../ui/inputs/ImageInput";
import useClassName from "../../hooks/useClassName";
import Icon from "../ui/Icon";
import Button from "../ui/buttons/Button";

interface IImageChangerWindowComponent extends IFloatingWindowComponent {}

const ImageChangerWindowComponent: React.FC<IImageChangerWindowComponent> = props=> {
    const window = props.window;
    const nodeId = props.window.params[0];
    const node = Nodes.getNode(nodeId);
    const imageBrick = node?.getBrick<ImageBrick>(ImageBrick) || null;
    const xValue = useMotionValue<number>(0);
    const yValue = useMotionValue<number>(0);

    if (!node || !imageBrick) {
        FloatingWindows.closeWindow(window);
        return <></>;
    }
    
    const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [pixilated, setPixilated] = useStateListener(imageBrick.Pixilated);

    const className = useClassName([
        "image-changer-floating-window",
        pixilated && "pixilated",
        previewImageSrc && "loaded"
    ]);
    
    useEffect(()=> {
        setPreviewImageSrc(imageBrick.source);
        
        xValue.set(Mouse.x+10);
        yValue.set(Mouse.y+10);
    }, []);
    
    function onApply() {
        if (!imageBrick) return;

        if (previewImageSrc)
            imageBrick.loadImage(previewImageSrc);
        else
            imageBrick.unloadImage();
        
        FloatingWindows.closeWindow(window);
    }
    function onCancel() {
        FloatingWindows.closeWindow(window);
    }
    function onClearClick() {
        setErrorText(null);
        setPreviewImageSrc(null);
    }
    function onFileChange(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = ()=> {
            if (reader.result) {
                setPreviewImageSrc(reader.result.toString());
                setErrorText(null);
            }
        }
    }
    function onFileWrongType() {
        setErrorText("The file type is not supported");
    }
    function onFileTooMuchSize() {
        setErrorText("The file size is too big!");
    }
    function onPreviewError() {
        setPreviewImageSrc(null);
        // setErrorText("Something went wrong, try again...");
    }
    
    return (
        <FloatingWindowComponent
            { ...props }
            
            className={ className }
            title="Change image"
            clickOutsideToClose
            isDraggable

            xValue={ xValue }
            yValue={ yValue }
        >
            <FloatingWindowContentComponent className="row gap-2">
                <div className="col gap-1">
                    <div className="preview-image">

                        { errorText ?
                            <span className="error-text">{ errorText }</span>
                        :
                            <div className="icon-wrapper image-icon"><Icon icon="image" /></div>
                        }
                        
                        <img
                            onError={ onPreviewError }
                            src={ previewImageSrc || "" }
                            alt="preview"
                        />
                    </div>
                    <span className="text-muted">The file size must be less<br/>than 2mb</span>
                </div>
                
                <div className="col justify-between gap-4">
                    <div className="col gap-2">
                        <ImageInput 
                            onFileChange={ onFileChange }
                            onFileWrongType={ onFileWrongType }
                            onFileTooMuchSize={ onFileTooMuchSize }
                        />
                        <Button 
                            text="Clear image"
                            onClick={ onClearClick }
                        />
                        
                        <Checkbox value={ pixilated } onToggle={ v=> setPixilated(v) }>
                            <span>Pixilate image</span>
                        </Checkbox>
                    </div>

                    <div className="row gap-1">
                        <Button
                            color="blue"
                            text="Yes!"
                            fill
                            onClick={ onApply }
                        />
                        <Button
                            color="gray"
                            text="No"
                            fill
                            onClick={  onCancel }
                        />
                    </div>
                </div>
            </FloatingWindowContentComponent>
        </FloatingWindowComponent>
    );
};

export default ImageChangerWindowComponent;