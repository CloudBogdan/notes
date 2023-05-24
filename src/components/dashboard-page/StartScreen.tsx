import { gsap } from "gsap";
import { useEffect } from "react";
import bogdanovLogo_png from "../../images/bogdanov-logo.png";

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
    "Good boy"
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

                <svg className="particle star green-star" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 8L14 2" stroke="#19BB57" strokeWidth="4" strokeLinecap="round" />
                    <path d="M26 14L20 14" stroke="#19BB57" strokeWidth="4" strokeLinecap="round" />
                    <path d="M14 26L14 20" stroke="#19BB57" strokeWidth="4" strokeLinecap="round" />
                    <path d="M2 14L8 14" stroke="#19BB57" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <svg className="particle star purple-star" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2V8" stroke="#AA3DDD" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M26 14L20 14" stroke="#AA3DDD" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M14 26L14 20" stroke="#AA3DDD" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M2 14L8 14" stroke="#AA3DDD" strokeWidth="4" strokeLinecap="round"/>
                </svg>
                <svg className="particle star yellow-star" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.1243 2.06902C12.7686 0.327779 15.2314 0.327774 15.8757 2.06901L18.2724 8.54597C18.475 9.09341 18.9066 9.52503 19.454 9.7276L25.931 12.1243C27.6722 12.7686 27.6722 15.2314 25.931 15.8757L19.454 18.2724C18.9066 18.475 18.475 18.9066 18.2724 19.454L15.8757 25.931C15.2314 27.6722 12.7686 27.6722 12.1243 25.931L9.7276 19.454C9.52503 18.9066 9.09341 18.475 8.54597 18.2724L2.06902 15.8757C0.327779 15.2314 0.327774 12.7686 2.06901 12.1243L8.54597 9.7276C9.09341 9.52503 9.52503 9.09341 9.7276 8.54597L12.1243 2.06902Z" fill="#FFAF1A"/>
                </svg>

                <div className="splash">{ splashes[Math.floor(Math.random() * splashes.length)] }</div>
            </div>

            <a className="bogdanov-logo" href="https://vk.com/bbogdan_ov" target="_blank">
                <img src={ bogdanovLogo_png } alt="by Bogdanov" />
            </a>
            
        </section>
    );
};

export default StartScreen;