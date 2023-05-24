import { BoundingBox, MotionValue, motion, useDragControls, useTime } from "framer-motion";
import FloatingWindow from "../../../classes/floating-windows/FloatingWindow";
import useClassName from "../../../hooks/useClassName";
import FloatingWindows from "../../../managers/ui/FloatingWindows";
import { MyComponent } from "../../../types/component-types";
import FabButton from "../buttons/FabButton";
import { useEffect, useRef, useState } from "react";
import useApplyRefs from "../../../hooks/useApplyRefs";
import ClickOutside from "../ClickOutside";

export interface IFloatingWindowComponent extends MyComponent {
    window: FloatingWindow

    title?: string
    isDraggable?: boolean
    clickOutsideToClose?: boolean

    xValue?: MotionValue<number>
    yValue?: MotionValue<number>
}

const FloatingWindowComponent: React.FC<IFloatingWindowComponent> = props=> {
    const window = props.window;
    const [isInited, setIsInited] = useState<boolean>(false);
    const [dragConstraints, setDragConstraints] = useState<BoundingBox>({ left: 0, top: 0, right: 200, bottom: 200 });
    const ref = useRef<HTMLDivElement>();
    const dragControls = useDragControls();
    
    const className = useClassName([
        "floating-window",
        props.isDraggable && "draggable",
        props.className
    ]);
    const wrapperClassName = useClassName([
        "floating-window-wrapper",
    ]);
    
    useEffect(()=> {
        const element = ref.current;
        if (!element) return;
        
        window.init(element);
        setIsInited(true);
    }, []);
    useEffect(()=> {
        onWindowResize();
        function onWindowResize() {
            if (!ref.current) return;
            
            const bounds = ref.current.getBoundingClientRect();
            
            setDragConstraints({
                left: 10,
                top: 10,
                right: innerWidth - bounds.width - 10,
                bottom: innerHeight - bounds.height - 10
            });
        }

        addEventListener("resize", onWindowResize);
        return ()=> removeEventListener("resize", onWindowResize);
    }, []);

    function onPointerDownOutside() {
        if (!props.clickOutsideToClose || !isInited) return;

        FloatingWindows.closeWindow(props.window);
    }
    function onTitlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        dragControls.start(e, { snapToCursor: false });
    }
    function onCloseClick() {
        FloatingWindows.closeWindow(props.window);
    }
    
    return (
        <ClickOutside 
            myRef={ el=> useApplyRefs(el, [ref]) }
            className={ wrapperClassName }
            style={ props.style }
            
            onPointerDownOutside={ onPointerDownOutside }
            deps={[ isInited ]}

            isMotion
            motion={{
                drag: props.isDraggable,
                dragControls: dragControls,
                dragConstraints: dragConstraints,
                dragElastic: .1,
                dragListener: false,
                dragMomentum: false,

                style: {
                    x: props.xValue,
                    y: props.yValue,
                }
            }}
        >
            <div className={ className }>
                <header className="floating-window-header">
                    <div onPointerDown={ onTitlePointerDown } className="header-title">{ props.title }</div>

                    <FabButton
                        icon="small-crosshair"
                        size="small"
                        transparent
                        onClick={ onCloseClick }
                    />
                </header> 
                
                { props.children }
            </div>
        </ClickOutside>
    );
};

export const FloatingWindowContentComponent: React.FC<MyComponent> = props=> {
    const className = useClassName([
        "floating-window-content",
        props.className
    ]);
    
    return (
        <main className={ className } style={ props.style }>
            { props.children }
        </main>
    );
};

export default FloatingWindowComponent;