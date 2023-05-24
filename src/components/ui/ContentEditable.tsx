import React, { useEffect, useRef, useState } from "react";
import useApplyRefs from "../../hooks/useApplyRefs";
import useClassName from "../../hooks/useClassName";
import useSafeState from "../../hooks/useSafeState";
import Keyboard from "../../managers/Keyboard";
import { MyComponent, RequiredRefCallback, SetState } from "../../types/component-types";

interface IContentEditable extends MyComponent {
    initialContent: string
    isActive?: boolean
    setIsActive?: SetState<boolean>
    content?: string
    setContent?: SetState<string>
    
    placeholder?: string
    noFocusOnActivate?: boolean
    noDeactivateOnBlur?: boolean
    noListenEscapeKey?: boolean
    doubleClickActivate?: boolean
    preventFromScroll?: boolean
    textContent?: boolean
    textFormat?: (content: string)=> string
    myRef?: RequiredRefCallback<HTMLDivElement>

    onInput?: (content: string)=> void
    onFocus?: (e: React.FocusEvent<HTMLDivElement>)=> void
    onBlur?: (e: React.FocusEvent<HTMLDivElement>)=> void
}

const ContentEditable: React.FC<IContentEditable> = props=> {
    const [isActive, setIsActive] = useSafeState(props.isActive, props.setIsActive, false);
    const [content, setContent] = useSafeState(props.content, props.setContent, props.initialContent);
    const ref = useRef<HTMLDivElement>();
    
    const className = useClassName([
        "content-editable",
        content.length == 0 && "empty",
        isActive && "active",
        props.className
    ])

    useEffect(()=> {
        if (props.noListenEscapeKey) return;

        const unlistenKeyboard = Keyboard.onKeyPressed(()=> {
            if (Keyboard.isKeyPressed("escape")) {
                ref.current?.blur();
                setIsActive(false);
            }
        }, true)

        return ()=> unlistenKeyboard();
    }, []);
    useEffect(()=> {
        if (ref.current) {
            // if (props.textContent)
            //     ref.current.innerText = props.initialContent;
            // else
                ref.current.innerHTML = props.initialContent;
        }
    }, []);
    useEffect(()=> {
        if (!props.noFocusOnActivate)
            ref.current?.focus();
    }, [isActive]);

    function onInput(e: React.FormEvent<HTMLDivElement>) {
        const target = e.target as HTMLDivElement;
        if (!target) return;

        let value = target.innerHTML;
        if (props.textContent)
            value = target.innerText;
        
        setContent(value);
        props.onInput && props.onInput(value);

        if (props.preventFromScroll)
            scrollTo(0, 0);
    }
    function onFocus(e: React.FocusEvent<HTMLDivElement>) {
        props.onFocus && props.onFocus(e);

        if (props.preventFromScroll)
            scrollTo(0, 0);
        Keyboard.inputFocused = true;
    }
    function onBlur(e: React.FocusEvent<HTMLDivElement>) {
        let value: string = (e.target as HTMLDivElement).innerHTML;
        if (props.textContent)
            value = (e.target as HTMLDivElement).innerText;

        if (props.textFormat)
            value = props.textFormat(value);
        
        setContent(value);
        setInnerContent(value);
        props.onBlur && props.onBlur(e);
        
        if (!props.noDeactivateOnBlur)
            setIsActive(false);
        if (props.preventFromScroll)
            scrollTo(0, 0);
            
        Keyboard.inputFocused = false;
    }
    function onDoubleClick() {
        setIsActive(true);
    }

    function setInnerContent(value: string) {
        if (!ref.current) return;
        
        if (props.textContent)
            ref.current.innerText = value;
        else
            ref.current.innerHTML = value;
    }
    
    return (
        <div 
            ref={ el=> useApplyRefs(el, [ref, props.myRef]) }
            className={ className }
            style={ props.style }

            contentEditable={ isActive }
            onInput={ onInput }
            onFocus={ onFocus }
            onBlur={ onBlur }
            onDoubleClick={ props.doubleClickActivate ? onDoubleClick : undefined }

            { ...{ "data-placeholder": props.placeholder || "" } }
        />
    );
};

export default ContentEditable;