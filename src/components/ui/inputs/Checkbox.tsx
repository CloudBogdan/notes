import { motion, useAnimationControls } from "framer-motion";
import useClassName from "../../../hooks/useClassName";
import { MyComponent } from "../../../types/component-types";
import { useEffect } from "react";
import Button from "../buttons/Button";

interface ICheckbox extends MyComponent {
    value: boolean
    onClick?: ()=> void
    onToggle?: (v: boolean)=> void
}

const Checkbox: React.FC<ICheckbox> = props=> {
    const iconControls = useAnimationControls();
    
    const className = useClassName([
        "checkbox",
        props.className,
        props.value && "checked"
    ])

    useEffect(()=> {

        if (props.value)
            iconControls.start({
                pathLength: 1,
                transition: { ease: "circOut", duration: .2 }
            });
        else
            iconControls.start({
                pathLength: 0,
                transition: { ease: "easeIn", duration: .1 }
            });

    }, [props.value]);
    
    function onClick() {
        props.onClick && props.onClick();
        props.onToggle && props.onToggle(!props.value);
    }
    
    return (
        <div className="checkbox-wrapper" onClick={ onClick }>
            <Button 
                style={ props.style }
                className={ className }
                size="small"
                color={ props.value ? "blue" : "gray" }
                noAnim
            >
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path 
                        animate={ iconControls }
                        initial={{ pathLength: +props.value }}
                        d="M1 5.8L3.85714 9L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                </svg>
            </Button>

            { props.children }
        </div>
    );
};

export default Checkbox;