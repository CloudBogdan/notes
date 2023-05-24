import State from "../../../states/State";
import Trigger from "../../../states/Trigger";
import NodeBrick, { INodeBrickData } from "../NodeBrick";

export interface IImageBrickData extends INodeBrickData {
    source: string | null
    pixilated: boolean
}

export default class ImageBrick extends NodeBrick {
    Source = new State<string | null>("image-brick/source", null);
    Pixilated = new State<boolean>("image-brick/pixilate", false);
    IsLoading = new State<boolean>("image-brick/is-loading", false);

    onImageLoaded = new Trigger<HTMLImageElement>("image-brick/on-image-loaded");
    
    constructor() {
        super();
    }

    loadFromFile(file: File): Promise<string | null> {
        this.IsLoading.value = true;
        
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise((resolve, reject)=> {
            reader.onload = ()=> {
                if (reader.result) {
                    this.loadImage(reader.result.toString())
                    resolve(reader.result.toString());
                } else {
                    this.unloadImage();
                    reject(null);
                }

                this.IsLoading.value = false;
            }
            reader.onerror = ()=> {
                this.unloadImage();
                reject(null);

                this.IsLoading.value = false;
            }
        })
    }
    loadImage(source: string) {
        this.Source.value = source;
    }
    unloadImage() {
        this.Source.value = null;
    }

    // Data
    get source(): string | null {
        return this.Source.value;
    }
    get isLoading(): boolean {
        return this.IsLoading.value;
    }

    // Data
    loadData(data: IImageBrickData): void {
        super.loadData(data);

        if (data.source !== undefined)
            this.Source.value = data.source;
        if (data.pixilated !== undefined)
            this.Pixilated.value = data.pixilated;
    }
    getData(): IImageBrickData {
        return {
            ...super.getData(),
            source: this.source,
            pixilated: this.Pixilated.value
        }
    }
}