import State from "../../../states/State";
import Utils from "../../../utils/Utils";
import NodeBrick, { INodeBrickData } from "../NodeBrick";

export interface IDoneBrickData extends INodeBrickData {
    done: boolean
}

export default class DoneBrick extends NodeBrick {
    State = new State<boolean>("done-brick/state", false);
    
    constructor() {
        super();
    }

    toggleDone(done?: boolean) {
        this.State.set(old=> Utils.safeValue(done, !old));
    }

    // Get
    get value(): boolean {
        return this.State.value;
    }
    
    // Data
    loadData(data: IDoneBrickData): void {
        super.loadData(data);

        if (data.done !== undefined)
            this.State.value = data.done;
    }
    getData(): IDoneBrickData {
        return {
            ...super.getData(),
            done: this.value
        }
    }
}