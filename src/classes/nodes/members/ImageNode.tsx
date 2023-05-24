import ImageNodeComponent from "../../../components/nodes/members/ImageNodeComponent";
import Triggers from "../../../managers/Triggers";
import Utils from "../../../utils/Utils";
import ImageBrick, { IImageBrickData } from "../../node-bricks/members/ImageBrick";
import Node from "../Node";
import ResizableNode, { IResizableNodeData } from "../ResizableNode";

export interface IImageNodeData extends IResizableNodeData {
    image: IImageBrickData
}

export default class ImageNode extends ResizableNode {
    static readonly NAME: string = "image";

    image = new ImageBrick();
    
    imageChanged: boolean = true;
    imageElement: HTMLImageElement | null = null;
    
    constructor(id: number) {
        super(id, ImageNode.NAME);
        
        this.width = 100;
        this.height = 100;
        this.minWidth = 100;
        this.minHeight = 100;
        this.maxWidth = 1500;
        this.maxHeight = 1500;
        
        this.component = ImageNodeComponent;

        //
        this.image.onImageLoaded.listen(imageElement=> {
            if (!this.imageChanged) return;
            this.imageChanged = false;

            if (this.image.source) {
                const image = new Image();
                image.src = this.image.source;
             
                image.onload = ()=> {
                    this.setSize(image.width, image.height);
                }
            }
        })
        this.image.Source.listen(()=> {
            this.imageChanged = true
            Triggers.onBoardEdited.trigger(true);
        });
        this.image.Pixilated.listen(()=> Triggers.onBoardEdited.trigger(true));

        this.addBrick(this.image);
    }

    initImage(imageElement: HTMLImageElement) {
        this.imageElement = imageElement;

        this.updateElementTransform();
    }
    
    updateElementTransform(): void {
        super.updateElementTransform();

        if (!this.imageElement) return;
        
        this.imageElement.width = this.width;
        this.imageElement.height = this.height;
    }

    // Data
    loadData(data: IImageNodeData): void {
        super.loadData(data);

        this.image.loadData(data.image);
    }
    getData(): IImageNodeData {
        return {
            ...super.getData(),
            image: this.image.getData()
        }
    }

    //
    static create(id?: number | undefined): Node {
        return new ImageNode(Utils.safeValue(id, Date.now()));
    }
}