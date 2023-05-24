import React from "react";
import useClassName from "../../../hooks/useClassName";
import Keyboard from "../../../managers/Keyboard";
import { MyComponent, RequiredRefCallback } from "../../../types/component-types";

export interface ITextInput extends MyComponent {
    value: string
    onChange?: (value: string)=> void
    onFocus?: (e: React.FocusEvent<HTMLInputElement>)=> void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>)=> void

    placeholder?: string
    disabled?: boolean
    preventFromScroll?: boolean

    myRef?: RequiredRefCallback<HTMLInputElement>
}

const TextInput: React.FC<ITextInput> = props=> {
    const className = useClassName([
        "text-input"
    ])
    
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.onChange && props.onChange(e.target.value.toString());

        if (props.preventFromScroll)
            scrollTo(0, 0);
    }
    function onFocus(e: React.FocusEvent<HTMLInputElement>) {
        props.onFocus && props.onFocus(e);

        Keyboard.inputFocused = true;
        if (props.preventFromScroll)
            scrollTo(0, 0);
    }
    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        props.onBlur && props.onBlur(e);

        Keyboard.inputFocused = false;
        if (props.preventFromScroll)
            scrollTo(0, 0);
    }
    
    return (
        <input 
            ref={ el=> el && props.myRef && props.myRef(el) }
        
            type="text"
            className={ className }
            value={ props.value }
            placeholder={ props.placeholder }
            disabled={ props.disabled }

            onChange={ onChange }
            onFocus={ onFocus }
            onBlur={ onBlur }
        />
    );
};

export default TextInput;