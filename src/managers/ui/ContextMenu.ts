import { IconType } from "../../components/ui/Icon";
import State from "../../states/State";
import Trigger from "../../states/Trigger";

export interface IContextMenuButton {
    text: string
    icon?: IconType
    getCustomIcon?: ()=> JSX.Element

    actionName?: string
    actionParams?: any[]
    preventClose?: boolean
    everyNode?: boolean
    handle?: (targetId: number | null)=> void
    getListenStates?: ()=> (State<any> | null | undefined)[]
    getIsDisabled?: ()=> boolean
    getIsActive?: ()=> boolean
}
export type IContextMenuButtonsGroup<B=IContextMenuButton> = {
    name: string
    radio?: boolean
    listenStates?: ()=> (State<any> | null | undefined)[]
    buttons: B[]
};

export interface IContextMenuTrigger {
    targetsId?: number[]
    event: MouseEvent | React.MouseEvent<HTMLDivElement>
    groups: IContextMenuButtonsGroup[]
}

export default class ContextMenu {
    static IsActive = new State<boolean>("context-menu/is-active", false);
    static MenuTrigger = new Trigger<IContextMenuTrigger>("context-menu/buttons-groups");

    //
    static setContextMenu(params: IContextMenuTrigger) {
        this.IsActive.value = true;
        this.MenuTrigger.trigger(params);
    }
    
    // Get
    static get isActive(): boolean {
        return this.IsActive.value;
    }
}