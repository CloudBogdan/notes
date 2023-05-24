import { useEffect, useState } from "react";
import State from "../states/State";

function useStateListener<T>(state: State<T>, key?: string): [T, (value: T)=> void] {
    const [value, setValue] = useState<T>(state.value);

    useEffect(()=> state.listen(v=> setValue(v), key), []);
    
    return [value, (value)=> state.value = value];
}
export default useStateListener;