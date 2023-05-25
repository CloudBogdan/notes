import { useEffect } from "react";
import Icon from "../../../components/ui/Icon";
import Slide from "./Slide";
import { gsap } from "gsap";
import bogdanovLogo_png from "../../../images/bogdanov-logo.png";
import Button from "../../../components/ui/buttons/Button";
import { motion } from "framer-motion";

const EndSlide: React.FC = ()=> {
    useEffect(()=> {

        const timeline = gsap.timeline({ delay: .3 });

        // Logo
        timeline.fromTo(
            ".start-screen .logo .char",
            { y: "-50%", opacity: 0 },
            { y: "0%", opacity: 1, ease: "elastic.out(1, 0.5)", duration: .6, stagger: .05 }
        );
        timeline.to(".start-screen .logo .char", {
            keyframes: [
                { y: "0%", ease: "power2.inOut", },
                { y: "-10%", ease: "power2.inOut", },
                { y: "0%", ease: "power2.inOut", },
            ],
            stagger: .1,
            duration: .5,
            repeatDelay: .4,
            repeat: Infinity
        })

        // Particles
        timeline.fromTo(
            ".start-screen .illustration .star",
            { scale: 0 },
            { scale: 1, ease: "elastic.out(1, 0.5)", duration: .6, stagger: .1 },
            ".5"
        )
        timeline.to(".start-screen .illustration .star", {
            keyframes: [
                { rotate: 0, ease: "elastic.out(1, 0.5)", },
                { rotate: 45, ease: "elastic.out(1, 0.5)", },
                { rotate: 90, ease: "elastic.out(1, 0.5)", },
                { rotate: 135, ease: "elastic.out(1, 0.5)", },
                { rotate: 180, ease: "elastic.out(1, 0.5)", }
            ],
            duration: 3,
            stagger: .2,
            repeat: Infinity,
            repeatDelay: 0
        })

        // Bogdanov logo
        timeline.fromTo(
            ".start-screen .bogdanov-logo",
            { opacity: 0 },
            { opacity: 1, ease: "none", duration: .5 },
            1
        )

    }, []);
    
    return (
        <Slide className="start-screen end-slide">

            <div className="illustration">
                <div className="logo">
                    { "Вау!".split("").map((char, index)=>
                        <div key={ index } className="char">{ char === " " ? <>&nbsp;</> : char }</div>
                    ) }
                </div>

                <div className="particle star green-star">
                    <Icon icon="line-star" />
                </div>
                <div className="particle star purple-star">
                    <Icon icon="line-star" />
                </div>
                <div className="particle star yellow-star">
                    <Icon icon="star" />
                </div>
            </div>
  
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ease: "easeOut", duration: .3, delay: 2 }}
                className="centered-content"
            >
                <Button
                    style={{ padding: "24px 36px", top: 200, fontSize: 18 }}
                    color="blue"
                    size="large"
                    text="Нажать!"
                    to="/"
                />
            </motion.div>

            <a className="bogdanov-logo" href="https://vk.com/bbogdan_ov" target="_blank">
                <img src={ bogdanovLogo_png } alt="by Bogdanov" />
            </a>
            
        </Slide>
    );
};

export default EndSlide;