import Node from "../../classes/nodes/Node";
import Selection from "../../managers/Selection";
import SelectionControls from "../../managers/ui/SelectionControls";

export default function useNodeInteract(node: Node) {
    function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (e.button != 0) return;
        
        if (Selection.isSelectedMultiple && !Selection.isMultipleSelectionKey && !SelectionControls.isDragging && Selection.isNodeSelected(node)) {
            Selection.deselectAll(false);
            Selection.selectNode(node);
        }
    }
    function onPointerDown(e: React.PointerEvent) {
        if (e.button != 0 && e.button != 2) return;
        
        if (!Selection.isMultipleSelectionKey && !Selection.isNodeSelected(node)) {
            Selection.deselectAll(false);
        }

        if (Selection.isMultipleSelectionKey && Selection.isNodeSelected(node)) {
            Selection.deselectNode(node);
        } else {
            Selection.selectNode(node);
        }
    }

    return { onPointerUp, onPointerDown };
}