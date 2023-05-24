import { IOffsets } from "../types/types";

export default class Utils {
    static pointRectCollision(rectX: number, rectY: number, rectWidth: number, rectHeight: number, pointX: number, pointY: number): boolean {
        return (
            rectX < pointX &&
            rectY < pointY &&
            rectX + rectWidth > pointX &&
            rectY + rectHeight > pointY
        )
    }
    static reactRectCollision(aX: number, aY: number, aWidth: number, aHeight: number, bX: number, bY: number, bWidth: number, bHeight: number): boolean {
        return (
            aX + aWidth > bX &&
            aY + aHeight > bY &&
            aX < bX + bWidth &&
            aY < bY + bHeight
        )
    }
    static distance(ax: number, ay: number, bx: number=0, by: number=0): number {
        return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
    }
    static clamp(value: number, min: number, max: number): number {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    }
    static getElementOffsets(element: HTMLDivElement, offsetX: number=0, offsetY: number=0, a: number=1): IOffsets {
        const bounds = element.getBoundingClientRect();
        
        const left = (bounds.left* a + offsetX);
        const top = (bounds.top* a + offsetY);
        const width = bounds.width * a;
        const height = bounds.height * a;
        const right = left + width;
        const bottom = top + height;
        
        return { left, top, right, bottom, width, height };
    }
    static safeValue<T>(value: T | undefined | null, safe: T): T {
        if (value === undefined || value === null)
            return safe;
        return value;
    }
    static exists<T>(value: T | undefined | null): boolean {
        return value !== undefined && value !== null;
    }
    static insertItem<T>(array: T[], item: T, index: number): T[] {
        array.splice(index, 0, item);
        return array;
    }
    
    static formatKey(key: string): string {
        return key.toLowerCase().replace(/key|digit|arrow|numpad/igm, "");
    }
    static compareObjects(a: object, b: object): boolean {
        return JSON.stringify(a) == JSON.stringify(b);
    }
    static capitalize(string: string): string {
        return string[0].toUpperCase() + string.slice(1, string.length);
    }

    static removeItem<T>(array: T[], item: T): T[] {
        if (!item) return array;
        const index = array.indexOf(item);
        if (index < 0) return array;
        return array.splice(index, 1);
    }
}