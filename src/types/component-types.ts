import { CSSProperties, PropsWithChildren } from "react";

export interface MyComponent extends PropsWithChildren {
    className?: string
    style?: CSSProperties
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type MutableRef<T extends HTMLElement=HTMLDivElement> = React.MutableRefObject<T | undefined | null>;
export type RequiredRefCallback<T extends HTMLElement=HTMLDivElement> = (el: T)=> void;