import { useEffect } from "react";
import Slide from "./Slide";
import { gsap } from "gsap";
import Cursor from "../Cursor";
import { motion } from "framer-motion";
import { NoteNodePreviewComponent } from "../../../components/nodes/members/NoteNodeComponent";
import TodoNodeComponent, { TodoNodePreviewComponent } from "../../../components/nodes/members/TodoNodeComponent";
import Icon from "../../../components/ui/Icon";

const PlusMinusSlide: React.FC = ()=> {
    useEffect(()=> {

        const timeline = gsap.timeline({ delay: .5 });

        timeline.fromTo(
            ".plus",
            { left: "-50%", top: "20%" },
            { left: "25%", top: "50%", ease: "power1.out", duration: 1 },
            0
        )
        timeline.fromTo(
            ".cursor",
            { left: "-50%", top: "20%" },
            { left: "30%", top: "50%", ease: "power1.out", duration: 1 },
            0
        )

        timeline.to(
            ".cursor",
            { left: "150%", top: "80%", ease: "sine.in", duration: .8, delay: .3 }
        )

        timeline.fromTo(
            ".minus",
            { left: "150%", top: "80%" },
            { left: "70%", top: "50%", ease: "power1.out", duration: 1 },
            2
        )
        timeline.fromTo(
            ".cursor",
            { left: "150%", top: "80%" },
            { left: "70%", top: "50%", ease: "power1.out", duration: 1 },
            2
        )

        timeline.to(
            ".cursor",
            { left: "20%", top: "-20%", ease: "sine.in", duration: .4 }
        )
        
        timeline.fromTo(
            ".animated-node",
            { scale: 0 },
            { scale: 1, ease: "elastic.out(0.5, 0.4)", duration: 1, stagger: .1 },
            3
        )
        timeline.fromTo(
            ".star",
            { scale: 0 },
            { scale: 1, ease: "elastic.out(0.5, 0.4)", duration: 1, stagger: .1 },
            3
        )
        
    }, []);
    
    return (
        <Slide>

            <motion.div 
                initial={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ ease: "circIn", duration: .4 }}
            
                style={{ left: "60%", top: "10%" }}
                className="animated-node"
            >
                <NoteNodePreviewComponent />
            </motion.div>
            <motion.div 
                initial={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ ease: "circIn", duration: .4, delay: .1 }}
            
                style={{ left: "62%", top: "5%" }}
                className="animated-node"
            >
                <NoteNodePreviewComponent />
            </motion.div>
            
            <motion.div 
                initial={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ ease: "circIn", duration: .4, delay: .2 }}
            
                style={{ left: "30%", top: "80%" }}
                className="animated-node"
            >
                <TodoNodePreviewComponent />
            </motion.div>
            <motion.div 
                initial={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ ease: "circIn", duration: .4, delay: .3 }}
            
                style={{ left: "30%", top: "88%" }}
                className="animated-node"
            >
                <TodoNodePreviewComponent />
            </motion.div>

            <motion.div 
                initial={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ ease: "circIn", duration: .4 }}
                style={{ left: "55%", top: "8%" }}
                className="particle star text-green"
            >
                <Icon icon="star" />
            </motion.div>
            <motion.div 
                initial={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ ease: "circIn", duration: .4 }}
                style={{ left: "28%", top: "76%" }}
                className="particle star text-green"
            >
                <Icon icon="line-star" />
            </motion.div>
            <motion.div 
                initial={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ ease: "circIn", duration: .4 }}
                style={{ left: "92%", top: "28%" }}
                className="particle star text-blue"
            >
                <Icon icon="star" />
            </motion.div>

            <div className="size-fill">

                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: "easeIn", duration: .2 }}
                
                    className="absolute origin-center plus sel col gap-2 text-align-left"
                    style={{ minWidth: "max-content", fontSize: 22 }}
                >
                    <h1>Плюсы приложения</h1>
                    <ul className="no-markers text-muted">
                        <li><span className="text-green">Скорость</span> - работает на устройстве пользователя</li>
                        <li><span className="text-green">Доступность</span> - бесплатный и опенсорс</li>
                        <li><span className="text-green">Дизайн</span> - минималистичный и приятный дизайн</li>
                        <li><span className="text-green">Удобство</span> - управляй доской где угодно</li>
                        <li><span className="text-green">Функционал</span> - даже кнопки работают!</li>
                    </ul>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: "easeIn", duration: .2 }}
                
                    className="absolute origin-center minus sel col gap-2"
                    style={{ minWidth: "max-content", fontSize: 22 }}
                >
                    <h1>Минусы приложения</h1>
                    <ul className="no-markers text-muted">
                        <li><span className="text-red">Плата за скорость.</span> Никакой свободы...</li>
                        <li><span className="text-red">Ещё сырой.</span> Приготовь перед использованием</li>
                        <li><span className="text-red">Ошибки повсюду.</span> á̵̡̟͚̱̭͍͍̼͕͉̰̾̐̀̐̈̉͊̿̕̚͠ǎ̴̡̪͔̺̼̦̟̹̟͜ͅͅą̸̺̺̲͓̠̟̖͈͚̻̲̣̼̪̅̈́̍͂̅ą̴̤͉̼̙̘̮͉͎̻̥̝͑̾̒͊̕͝͝a̸̢̛̙̝̫̻̞̤̲̯͉̭̓͜á̵͍̦͓͖̟̖͙̙̜͙͚̂̎͘</li>
                        <li><span className="text-red">Телефоны запрещены!</span></li>
                    </ul>
                </motion.div>
                    
            </div>

            <Cursor />

        </Slide>
    );
};

export default PlusMinusSlide;