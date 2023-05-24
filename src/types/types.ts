export type Color = "white" | "blue" | "red" | "orange" | "green" | "pink"

export interface IPoint {
    x: number
    y: number
}

export interface IRect {
    x: number
    y: number
    width: number
    height: number
}
export interface IBox {
    width: number
    height: number
}
export interface IOffsets {
    left: number
    top: number
    right: number
    bottom: number
    width: number
    height: number
}

export enum TextFormatType {
    TEXT_ALIGN = "text-align"
}
export enum TextAlign {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right",
}
export enum TextSize {
    SMALL = "small",
    NORMAL = "normal",
    MIDDLE = "middle",
    LARGE = "large",
    EXTRA_LARGE = "extra-large"
}
export enum ResizeText {
    INCREASE = "increase",
    DECREASE = "decrease",
}