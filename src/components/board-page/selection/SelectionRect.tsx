import { createRef, useEffect } from "react";
import SelectionControls from "../../../managers/ui/SelectionControls";

const SelectionRect: React.FC = ()=> {
    const ref = createRef<HTMLDivElement>();
    
    useEffect(()=> {
        if (ref.current) {
            const unlisten = SelectionControls.init(ref.current);

            console.log("hey");
            return ()=> {
                unlisten();
                SelectionControls.destroy();
            }
        }
    }, [ref]);
    
    return (
        <div 
            ref={ ref }
            className="selection-rect"
        >
            <div className="selection-bg" />
        </div>
    );
};

export default SelectionRect;