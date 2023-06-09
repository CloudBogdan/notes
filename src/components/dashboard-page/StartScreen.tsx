import { gsap } from "gsap";
import { useEffect } from "react";
import bogdanovLogo_png from "../../images/bogdanov-logo.png";
import Icon from "../ui/Icon";

const splashes: string[] = [
    "Hello!",
    "by Bogdanov",
    "Yea",
    "Let's go!",
    "Привет, одногруппники!!!!",
    "Данил, тоже привет",
    "Только посмотри на это!",
    "Привет, ИПЭК!",
    "Awesome",
    "Notes!",
    "Create a board, right now!",
    "Mobile is not allowed",
    "Created with love ❤",
    "I love you all!",
    "Hey",
    "Something down there",
    "Look at me",
    "I stole splashes from Minecraft!",
    "Hello, I'm yellow text",
    "Awesome animations, isn't it?",
    "Let's talk",
    "WOOOO",
    "YOOO",
    "Finger me!",
    "Jack Stauber is awesome",
    "I love you. And you me?..",
    "Good boy",
    "Open source!",
    "bogdanov#4802",
    "vk.com/bbogdan_ov",
    "t.me/bbogdan_ov",
    "Wow",
    "Let me cook",
    "All right",
    "Спина белая",
    "Я тоже знаю русский"
]

const StartScreen: React.FC = ()=> {
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

        // Screen
        timeline.fromTo(
            ".start-screen",
            { height: "100vh" },
            { height: "60vh", ease: "back.out", duration: .4 },
            .5
        )

        // Splash
        timeline.fromTo(
            ".start-screen .splash",
            { opacity: 0, y: 20, rotate: -30, scale: 0 },
            { opacity: 1, y: 0, rotate: -30, scale: 1, ease: "back.out", duration: .4 },
        )
        timeline.to(".start-screen .splash", {
            keyframes: [
                { scale: 1 },
                { scale: 1.1, ease: "sine.out" },
                { scale: 1, ease: "sine.in" },
            ],
            duration: 1,
            repeat: Infinity
        })

        // Bogdanov logo
        timeline.fromTo(
            ".start-screen .bogdanov-logo",
            { opacity: 0 },
            { opacity: 1, ease: "none", duration: .5 },
            "+=0.4"
        )

    }, []);
    
    return (
        <section className="section start-screen">
            
            <div className="illustration">
                <div className="logo">
                    { "Notes!".split("").map((char, index)=>
                        <div key={ index } className="char">{ char }</div>
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

                <div className="splash">{ splashes[Math.floor(Math.random() * splashes.length)] }</div>
            </div>

            <a className="bogdanov-logo" href="https://vk.com/bbogdan_ov" target="_blank">
                <img src={ bogdanovLogo_png } alt="by Bogdanov" />
            </a>
            
        </section>
    );
};

export default StartScreen;