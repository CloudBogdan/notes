import { motion } from "framer-motion";
import useClassName from "../../../hooks/useClassName";
import { MyComponent } from "../../../types/component-types";

interface IPage extends MyComponent {
    
}

const Page: React.FC<IPage> = props=> {
    const className = useClassName([
        "page",
        props.className
    ]);
    
    return (
        <motion.main
            style={ props.style }
            className={ className }

            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { ease: "linear", duration: .2 } }}
            exit={{ opacity: 0, scale: .9, transition: { ease: "easeIn", duration: .2 } }}
        >
            { props.children }
        </motion.main>
    );
};

export default Page;