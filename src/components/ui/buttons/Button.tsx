import { Link } from "react-router-dom";
import useApplyRefs from "../../../hooks/useApplyRefs";
import useClassName from "../../../hooks/useClassName";
import { MyComponent, RequiredRefCallback } from "../../../types/component-types";
import Icon, { IconType } from "../Icon";
import Actions from "../../../managers/Actions";

export type ButtonColor = "gray" | "blue" | "white";
export type ButtonSize = "small" | "normal" | "large";

export interface IButton extends MyComponent {
    color?: ButtonColor
    size?: ButtonSize
    compact?: boolean
    pill?: boolean
    transparent?: boolean
    noAnim?: boolean
    disabled?: boolean
    fill?: boolean

    to?: string

    icon?: IconType
    iconElement?: JSX.Element
    iconWrapper?: boolean
    text?: string
    title?: string
    myRef?: RequiredRefCallback<HTMLButtonElement | HTMLAnchorElement>
    element?: string

    actionName?: string
    actionProps?: any[]
    onClick?: (e: React.MouseEvent<HTMLDivElement>)=> void
    onPointerDown?: ()=> void
    onFocus?: ()=> void
    onBlur?: ()=> void
}

const Button: React.FC<IButton> = props=> {
    const className = useClassName([
        "button",
        props.color && `color-${ props.color }`,
        props.size && `size-${ props.size }`,
        props.compact && "compact",
        props.pill && "pill",
        props.fill && "fill",
        props.transparent && "transparent",
        props.noAnim && "no-anim",
        props.className
    ])
    
    function onClick(e: React.MouseEvent<HTMLDivElement>) {
        props.onClick && props.onClick(e);

        if (props.actionName) {
            Actions.invoke(props.actionName, props.actionProps || []);
        }
    }
    
    const content = <>
        { (props.icon || props.iconElement || props.iconWrapper) && <div className="icon-wrapper">
            { props.icon && <Icon icon={ props.icon } /> }
            { props.iconElement }
        </div> }
        { props.text && <span>{ props.text }</span> }
        { props.children }
    </>;
    const buttonProps = {
        className: className,
        style: props.style,
        disabled: props.disabled,
        title: props.title,
        
        onClick: onClick,
        onPointerDown: props.onPointerDown,
        onFocus: props.onFocus,
        onBlur: props.onBlur,
    }
    
    if (props.to) // @ts-ignore
        return <Link
            ref={ el=> useApplyRefs(el, [props.myRef]) }
            to={ props.to }
            { ...buttonProps }
        >{ content }</Link>

    const ButtonElement: any = props.element || "button";
    
    return (// @ts-ignore
        <ButtonElement
            ref={ (el: any)=> useApplyRefs(el, [props.myRef]) }
            { ...buttonProps }
        >{ content }</ButtonElement>
    );
};

export default Button;