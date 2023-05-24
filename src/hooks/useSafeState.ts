import { useState } from "react";
import { SetState } from "../types/component-types";

export default function useSafeState<T>(stateValue: T | undefined | null, setState: SetState<T> | undefined | null, safeValue: T): [T, SetState<T>] {
    if (stateValue === undefined || stateValue === null || !setState)
        return useState(safeValue);
    
    return [stateValue, setState]
}