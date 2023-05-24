import { ResizeText, TextAlign, TextFormatType } from "../types/types";

interface ITextFormatParams {
    textAlign?: TextAlign
    resizeText?: ResizeText
}

export default class TextFormat {
    textAlign: TextAlign | null
    resizeText: ResizeText | null
    
    constructor(params: ITextFormatParams) {
        this.textAlign = params.textAlign || null;
        this.resizeText = params.resizeText || null;
    }
}