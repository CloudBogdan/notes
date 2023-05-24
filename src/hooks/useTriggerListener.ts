import { useEffect, useState } from "react";
import Trigger from "../states/Trigger";

function useTriggerListener<T>(trigger: Trigger<T>, key?: string): T | null {
    const [value, setValue] = useState<T | null>(null);

    useEffect(()=> trigger.listen(v=> setValue(v), key), []);
    
    return value;
}
export default useTriggerListener;