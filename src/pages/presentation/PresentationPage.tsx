import { Navigate, Outlet, useParams } from "react-router";
import Page from "../../components/ui/pages/Page";
import React, { useEffect, useLayoutEffect, useState } from "react";
import StarterSlide from "./slides/StarterSlide";
import { AnimatePresence } from "framer-motion";
import Keyboard from "../../managers/Keyboard";
import TargetSlide from "./slides/TargetSlide";
import TechSlide from "./slides/TechSlide";
import PlusMinusSlide from "./slides/PlusMinusSlide";
import EmptySlide from "./slides/EmptySlide";
import EndSlide from "./slides/EndSlide";
import Mouse from "../../managers/Mouse";

const PresentationPage: React.FC = ()=> {
    const [slideIndex, setSlideIndex] = useState<number>(0);
    
    const slides: ((index: number)=> JSX.Element)[] = [
        i=> <StarterSlide key={ i } />,
        i=> <TargetSlide key={ i } />,
        i=> <TechSlide key={ i } />,
        i=> <PlusMinusSlide key={ i } />,
        i=> <EmptySlide key={ i } />,
        i=> <EndSlide key={ i } />,
    ]
    const curSlideCallback = slides[slideIndex];

    useEffect(()=> {
        const unlistenKeyboard = Keyboard.onKeyPressed(()=> {
            if (Keyboard.isKeyPressed("right"))
                setSlideIndex(old=> {
                    if (old + 1 < slides.length)
                        return old + 1;
                    return old;
                })
            else if (Keyboard.isKeyPressed("left"))
                setSlideIndex(old=> {
                    if (old - 1 >= 0)
                        return old - 1;
                    return old;
                })
        });
        const unlistenMouse = Mouse.onPress(e=> {
            if (e.button == 0)
                setSlideIndex(old=> {
                    if (old + 1 < slides.length)
                        return old + 1;
                    return old;
                })
            else if (e.button == 2)
                setSlideIndex(old=> {
                    if (old - 1 >= 0)
                        return old - 1;
                    return old;
                })
        });

        return ()=> {
            unlistenKeyboard();
            unlistenMouse();
        }
    }, []);
    useEffect(()=> {
        console.log(slideIndex);
    }, [slideIndex]);

    return (
        <Page className="presentation-page">
            
            <AnimatePresence mode="wait">
                { curSlideCallback && curSlideCallback(slideIndex) }
			</AnimatePresence>
            
        </Page>
    );
};

export default PresentationPage;