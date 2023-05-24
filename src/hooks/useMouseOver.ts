import { useEffect, useState } from "react";
import Mouse from "../managers/Mouse";
import Utils from "../utils/Utils";

export default function useMouseOver(element: HTMLDivElement | undefined | null, isListening: boolean=true): boolean {
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);

    useEffect(()=> {
        const unlistenMove = Mouse.onMove(e=> {
            if (!element || !isListening) {
                setIsMouseOver(false);
                return;
            }

            const bounds = element.getBoundingClientRect();

            setIsMouseOver(Utils.pointRectCollision(bounds.left, bounds.top, bounds.width, bounds.height, e.clientX, e.clientY))
        });

        return ()=> unlistenMove();
    }, [isListening]);

    return isMouseOver;
}