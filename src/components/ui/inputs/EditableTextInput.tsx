import { useEffect, useRef, useState } from "react";
import useApplyRefs from "../../../hooks/useApplyRefs";
import useClassName from "../../../hooks/useClassName";
import useSafeState from "../../../hooks/useSafeState";
import Keyboard from "../../../managers/Keyboard";
import { SetState } from "../../../types/component-types";
import TextInput, { ITextInput } from "./TextInput";

export interface IEditableTextInput extends ITextInput {
    isEditing?: boolean
    setIsEditing?: SetState<boolean>

    noFocusOnEditing?: boolean
    noStopEditingOnBlur?: boolean
    noListenEscapeKey?: boolean
    noDoubleClickEdit?: boolean
}

const EditableTextInput: React.FC<IEditableTextInput> = props=> {
    const [lastValue, setLastValue] = useState<string>(props.value);
    const [isEditing, setIsEditing] = useSafeState(props.isEditing, props.setIsEditing, false);
    const inputRef = useRef<HTMLInputElement>();
    
    const className = useClassName([
        "editable-text-input",
        props.className,
        isEditing && "editing"
    ]);

    useEffect(()=> {
        if (props.noListenEscapeKey) return;

        const unlistenKeyboardEscape = Keyboard.onKeyPressed(()=> {
            if (Keyboard.isKeyPressed("escape") && isEditing) {
                props.onChange && props.onChange(lastValue);
                setIsEditing(false);
            }
        }, true)
        const unlistenKeyboardEnter = Keyboard.onKeyPressed(()=> {
            if (Keyboard.isKeyPressed("enter") && isEditing) {
                setIsEditing(false);
            }
        }, true)

        return ()=> {
            unlistenKeyboardEscape();
            unlistenKeyboardEnter();
        }
    }, [lastValue, isEditing]);
    useEffect(()=> {
        if (!props.noFocusOnEditing)
            inputRef.current?.focus();
        }, [isEditing]);
    useEffect(()=> {
        if (props.disabled)
            inputRef.current?.blur();
        setIsEditing(false);
    }, [props.disabled]);

    function onInputBlur(e: React.FocusEvent<HTMLInputElement>) {
        let value = e.target.value.toString().trim().replace(/\s{2,}/gm, " ");
        
        if (!value)
            value = lastValue;
            
        props.onChange && props.onChange(value);
        props.onBlur && props.onBlur(e);
        setLastValue(value);
        
        if (!props.noStopEditingOnBlur)
            setIsEditing(false);
    }
    function onDoubleClick() {
        if (!props.disabled)
            setIsEditing(true);
    }

    return (
        <div 
            className={ className }
            onDoubleClick={ !props.noDoubleClickEdit ? onDoubleClick : undefined }
        >
            <span className="text">{ props.value }</span>
            
            <TextInput
                { ...props }
                className=""
                myRef={ el=> useApplyRefs(el, [props.myRef, inputRef]) }
                onBlur={ onInputBlur }
            />
        </div>
    );
};

export default EditableTextInput;