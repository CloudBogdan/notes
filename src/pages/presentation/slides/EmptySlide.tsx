import { motion } from "framer-motion";
import Slide, { SlideFadeContent } from "./Slide";
import { TodoNodePreviewComponent } from "../../../components/nodes/members/TodoNodeComponent";
import { useEffect } from "react";
import Cursor from "../Cursor";
import { gsap } from "gsap";
import { NoteNodePreviewComponent } from "../../../components/nodes/members/NoteNodeComponent";
import Mouse from "../../../managers/Mouse";
import Keyboard from "../../../managers/Keyboard";

const EmptySlide: React.FC = ()=> {
    useEffect(()=> {

        const timeline = gsap.timeline({ delay: .5, paused: true });

        const unlistenKeyboard = Keyboard.onKeyPressed(()=> {
            if (timeline.paused() && Keyboard.isKeyPressed("C"))
                timeline.play();
        });
        const unlistenMouse = Mouse.onPress(e=> {
            if (timeline.paused() && e.button == 1)
                timeline.play();
        });
        
        timeline.fromTo(
            ".anim-todo-node",
            { left: "20%", top: "-10%" },
            { left: "40%", top: "40%", ease: "power1.out", duration: .8 },
            0
        )
        timeline.fromTo(
            ".cursor",
            { left: "20%", top: "-10%" },
            { left: "40%", top: "40%", ease: "power1.out", duration: .8 },
            0
        )

        timeline.to(
            ".cursor",
            { left: "50%", top: "30%", ease: "power1.inOut", duration: .4 }
        )

        timeline.fromTo(
            ".anim-todo-node .todo-content-text",
            { text: "" },
            { text: "Придумать наполнение для 5-го слайда", ease: "none", duration: 3 }
        )

        timeline.to(
            ".cursor",
            { left: "40%", top: "40%", ease: "power1.inOut", duration: .4 },
            "+=2"
        )

        timeline.to(
            ".cursor",
            { left: "50%", top: "-20%", ease: "power1.in", duration: .8 },
            7
        )
        timeline.to(
            ".anim-todo-node",
            { left: "50%", top: "-20%", ease: "power1.in", duration: .8 },
            7
        )

        timeline.fromTo(
            ".anim-note-node",
            { left: "80%", top: "120%" },
            { left: "60%", top: "40%", ease: "power1.out", duration: 1 },
            10
        )
        timeline.fromTo(
            ".cursor",
            { left: "80%", top: "120%" },
            { left: "60%", top: "40%", ease: "power1.out", duration: 1 },
            10
        )
        timeline.to(
            ".cursor",
            { left: "80%", top: "30%", ease: "power1.inOut", duration: .4 },
        )

        timeline.fromTo(
            ".anim-note-node .node-content-text",
            { text: "" },
            { text: "Всем спасибо за внимание!", duration: 4, ease: "none" },
            "+=0.2"
        )
        timeline.to(
            ".anim-note-node .node-content-text",
            { text: "Всем спасибо за внимание!<br/> Сейчас ровно 22:37, думаю я не зря синяки на глазах зарабатываю...", duration: 4, ease: "none" },
            "+=1"
        )

        timeline.to(".cursor", {
            rotate: 360,
            ease: "none",
            duration: 1,
            repeat: Infinity,
            repeatRefresh: false
        })

        return ()=> {
            unlistenMouse();
            unlistenKeyboard();
        }

    }, []);
    
    return (
        <Slide className="empty-slide">
            <SlideFadeContent>

                <div className="centered-content">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { ease: "easeOut", duration: .5 } }}
                        exit={{ y: 10, opacity: 0, transition: { ease: "easeIn", duration: .2 } }}
                        
                        className="place-text"
                    >
                        <span>Текст слайда №5</span>
                    </motion.div>
                </div>

                <div className="anim-todo-node animated-node origin-center">
                    <TodoNodePreviewComponent  />
                </div>

                <div className="anim-note-node animated-node origin-center">
                    <NoteNodePreviewComponent />
                </div>

                <Cursor />
            
            </SlideFadeContent>
        </Slide>
    );
};

export default EmptySlide;