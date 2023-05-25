import { MotionProps, motion } from "framer-motion";
import useClassName from "../../../hooks/useClassName";
import { MyComponent } from "../../../types/component-types";

export interface ISlide extends MyComponent {
    motion?: MotionProps
}

const Slide: React.FC<ISlide> = props=> {
    const className = useClassName([
        "slide",
        props.className
    ])
    
    return (
        <motion.section
            className={ className }

            { ...(props.motion || {
                initial: { y: .5 },
                animate: { y: 0 },
                exit: { y: .5 },
                transition: { ease: "easeInOut", duration: .2 }
            }) }
        >
            { props.children }

        </motion.section>
    );
};

export const SlideFadeContent: React.FC<MyComponent> = props=> {
    const className = useClassName([
        "fade-content",
        props.className
    ])
    
    return (
        <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: .2 }}
            className={ className }
        >
            { props.children }
        </motion.div>
    );
};

export default Slide;