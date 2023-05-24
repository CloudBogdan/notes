import { Variants, motion } from "framer-motion";
import { MyComponent } from "../../types/component-types";
import { Color } from "../../types/types";
import useClassName from "../../hooks/useClassName";

interface IPaletteList extends MyComponent {
    colors: Color[]
    currentColor?: Color
    onColorClick?: (color: Color)=> void
}

const variants: Variants = {
    initial: {

    },
    animate: {
        transition: {
            staggerChildren: .05
        }
    }
}
const bubbleVariants: Variants = {
    initial: {
        y: "120%",
        opacity: 0
    },
    animate: {
        y: "0%",
        opacity: 1,
        transition: { ease: "backOut", duration: .3 }
    }
}

const PaletteList: React.FC<IPaletteList> = props=> {
    return (
        <motion.div 
            variants={ variants }
            initial="initial"
            animate="animate"
            className="palette-list"
        >
            
            { props.colors.map(color=>
                <motion.div
                    key={ color }
                    variants={ bubbleVariants }
                    className="color-bubble-wrapper"
                >
                    <div
                        className={ useClassName(["color-bubble", `color-${ color }`, color == props.currentColor && "active"]) }
                        onClick={ ()=> props.onColorClick && props.onColorClick(color) }
                    />
                </motion.div>
            ) } 

        </motion.div>
    );
};

export default PaletteList;