import { Color } from "../types/types";

class Random {
    static float(from: number, to: number): number {
        return Math.random() * (to - from) + from;
    }
    static int(from: number, to: number): number {
        return Math.floor(this.float(from, to+1));
    }
    static item<T>(array: T[]): T {
        return array[this.int(0, array.length-1)];
    }
    
    static key(): string {
        return this.int(0, 100).toString() + Date.now().toString();
    }

    static color(): Color {
        return this.item<Color>(["blue", "green", "orange", "pink", "red", "white"]);
    }
}
export default Random;