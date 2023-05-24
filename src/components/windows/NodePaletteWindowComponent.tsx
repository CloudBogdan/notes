import { useEffect } from "react";
import FloatingWindows from "../../managers/ui/FloatingWindows";
import FloatingWindowComponent, { IFloatingWindowComponent } from "../ui/window/FloatingWindowComponent";
import Nodes from "../../managers/board/Nodes";
import NoteNode from "../../classes/nodes/members/NoteNode";
import useStateListener from "../../hooks/useStateListener";
import PaletteList from "../ui/PaletteList";
import { Color } from "../../types/types";
import Mouse from "../../managers/Mouse";
import ColorBrick from "../../classes/node-bricks/members/ColorBrick";
import { useMotionValue } from "framer-motion";

interface IPaletteFloatingWindowComponent extends IFloatingWindowComponent {}

const NodePaletteWindowComponent: React.FC<IPaletteFloatingWindowComponent> = props=> {
    const window = props.window;
    const nodeId = window.params[0];
    const node = Nodes.getNode(nodeId);
    const colorBrick = node?.getBrick<ColorBrick>(ColorBrick);
    const xValue = useMotionValue<number>(0);
    const yValue = useMotionValue<number>(0);

    if (!node || !colorBrick) {
        FloatingWindows.closeWindow(window);
        return <></>;
    }

    const [nodeColor] = useStateListener(colorBrick.State);
    
    useEffect(()=> {
        var x = 0;
        var y = 0;
        
        if (node.element && window.element) {
            const bounds = window.element.getBoundingClientRect();
            const nodeBounds = node.element.getBoundingClientRect();

            if (nodeBounds.left + nodeBounds.width + bounds.width + 20 > innerWidth) {
                x = nodeBounds.left - bounds.width - 10;
                y = nodeBounds.top;
            } else {
                x = nodeBounds.left + nodeBounds.width + 10;
                y = nodeBounds.top;
            }
        } else {
            x = Mouse.x + 10;
            y = Mouse.y + 10;
        }
        
        xValue.set(x);
        yValue.set(y);
    }, []);

    function onColorClick(color: Color) {
        if (!colorBrick) return;
        
        colorBrick.setColor(color);
    }
    
    return (
        <FloatingWindowComponent
            { ...props }

            className="palette-floating-window"
            title="Change color"
            clickOutsideToClose

            xValue={ xValue }
            yValue={ yValue }
        >
            <PaletteList
                colors={ colorBrick.allowedColors }
                currentColor={ nodeColor }
                onColorClick={ onColorClick }
            />
        </FloatingWindowComponent>
    );
};

export default NodePaletteWindowComponent;