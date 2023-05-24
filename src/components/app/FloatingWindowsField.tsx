import useStateListener from "../../hooks/useStateListener";
import FloatingWindows from "../../managers/ui/FloatingWindows";

const FloatingWindowsField: React.FC = ()=> {
    const [openedWindows] = useStateListener(FloatingWindows.OpenedWindows);
    
    return (
        <>
        
            { openedWindows.map(window=>
                <window.component
                    key={ window.id + window.name }
                    window={ window }
                />
            ) }
            
        </>
    );
};

export default FloatingWindowsField;