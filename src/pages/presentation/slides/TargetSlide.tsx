import { motion } from "framer-motion";
import Slide from "./Slide";
import { NoteNodePreviewComponent } from "../../../components/nodes/members/NoteNodeComponent";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { TodoNodePreviewComponent } from "../../../components/nodes/members/TodoNodeComponent";
import Cursor from "../Cursor";
import Icon from "../../../components/ui/Icon";

const TargetSlide: React.FC = ()=> {
    const [nodeDone, setNodeDone] = useState<boolean>(false);
    
    useEffect(()=> {
        const timeline = gsap.timeline({ delay: .4 });
        
        // Node
        timeline.fromTo(
            ".anim-todo-node",
            { left: "-20%", top: "-40%" },
            { left: "50%", top: "50%", ease: "power1.out", duration: 1 },
            0
        )

        // Cursor
        timeline.fromTo(
            ".cursor",
            { left: "-20%", top: "-40%" },
            { left: "50%", top: "50%", ease: "power1.out", duration: 1 },
            0
        );
        timeline.to(".cursor", {
            left: "110%",
            top: "60%",
            ease: "sine.in",
            duration: .6,
            delay: .2
        });

        // Node
        timeline.to(".anim-todo-node .todo-content-text", { 
            text: "Cоздать удобное, быстрое и современное веб-приложение с открытым исходным кодом, представляющее собой приложение для создания «досок идей» прямо в браузере",
            ease: "none",
            duration: 2
        }, 2)

        timeline.fromTo(
            ".target-text",
            { left: "110%", top: "60%" },
            { left: "50%", top: "30%", ease: "power1.out", duration: .6 },
            2.5
        )
        timeline.to(".cursor", {
            left: "50%",
            top: "30%",
            ease: "power1.out",
            duration: .6
        }, 2.5)

        timeline.to(".cursor", {
            left: "30%",
            top: "-20%",
            ease: "sine.in",
            duration: .6,
            onComplete: ()=> {
                setTimeout(()=> {
                    setNodeDone(true)
                }, 600);
            }
        }, 3.2)
    }, [])
    
    return (
        <Slide className="target-slide">
            <motion.svg 
                className="wobble absolute"
                initial={{ right: -400, bottom: -800, scale: 0 }}
                animate={{ right: -200, bottom: -200, scale: 1, transition: { type: "spring", stiffness: 20, damping: 6, delay: 1 } }}
                exit={{ right: -400, bottom: -800, scale: 0, transition: { ease: "circIn", duration: .5 } }}
                width="1095" height="698" viewBox="0 0 1095 698" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M342 356.317C180.5 396.317 127 435.317 0 651.817L996 697.817C1050.83 492.817 1141.4 70.1174 1065 19.3174C969.5 -44.1826 791 59.8174 713 172.317C646.481 268.258 503.5 316.317 342 356.317Z" fill="#19BB57"/>
            </motion.svg>
            
            <div className="skew size-fill">
                <motion.div 
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ ease: "circIn", duration: .5 }}
                    className="centered-content"
                >
                    <h1 className="target-text absolute origin-center text-yellow" style={{ fontSize: 28 }}>Цель проекта</h1>

                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ ease: "backOut", duration: .4, delay: 3.5 }}
                        style={{ left: "58%", top: "22%" }}
                        className="particle text-yellow"
                    >
                        <Icon icon="star" />
                    </motion.div>

                    <div className="animated-node origin-center anim-todo-node">
                        <TodoNodePreviewComponent done={ nodeDone } />
                    </div>
                    
                    <Cursor />
                </motion.div>
            </div>

        </Slide>
    );
};

export default TargetSlide;