import { MutableRef, RequiredRefCallback } from "../types/component-types"

export default function useApplyRefs<T extends HTMLElement=HTMLDivElement>(el: T | undefined | null, refs: (MutableRef<T> | RequiredRefCallback<T> | undefined | null)[]) {
    if (el)
        for (const ref of refs) {
            if (ref) {
                if (typeof ref == "function")
                    ref(el);
                else
                    ref.current = el
            }
        }
}