import Node from "../classes/nodes/Node";
import NoteNode from "../classes/nodes/members/NoteNode";
import TodoNode from "../classes/nodes/members/TodoNode";
import { IContextMenuButton, IContextMenuButtonsGroup } from "./ui/ContextMenu";
import ListNode from "../classes/nodes/members/ListNode";
import useClassName from "../hooks/useClassName";
import Selection from "./Selection";
import Icon from "../components/ui/Icon";
import { ResizeText, TextAlign, TextSize } from "../types/types";
import TextFormat from "../classes/TextFormat";
import ColorBrick from "../classes/node-bricks/members/ColorBrick";
import TextFormatBrick from "../classes/node-bricks/members/TextFormatBrick";
import ColoredIcon from "../components/ui/ColoredIcon";
import ImageNode from "../classes/nodes/members/ImageNode";

export interface IActionButton extends IContextMenuButton {
    name: string
    nodeNames: string[]

    disallowMultiple?: boolean
    hideInActions?: boolean
}
export type IActionButtonsGroup = IContextMenuButtonsGroup<IActionButton>;

export default class NodeActions {
    static actions: IActionButtonsGroup[] = [
        {
            name: "media",
            buttons: [
                {
                    nodeNames: [NoteNode.NAME],
                    name: "change-color",
                    text: "Change color",
                    actionName: "open-node-color-window",
                    disallowMultiple: true,
                    getListenStates: ()=> [Selection.getFirst()?.getBrick<ColorBrick>(ColorBrick)?.State],
                    getCustomIcon: ()=> <ColoredIcon icon="color" color={ Selection.getFirst()?.getBrick<ColorBrick>(ColorBrick)?.value } />,
                },
                {
                    nodeNames: [ImageNode.NAME],
                    name: "change-image",
                    text: "Change image",
                    icon: "image",
                    actionName: "open-image-changer-window",
                    disallowMultiple: true,
                }
            ]
        },
        
        {
            name: "default",
            buttons: [
                {
                    nodeNames: [NoteNode.NAME, TodoNode.NAME],
                    name: "edit",
                    icon: "pen",
                    text: "Edit",
                    actionName: "edit-selected-node-trigger",
                    disallowMultiple: true
                },
                {
                    nodeNames: [ListNode.NAME],
                    name: "rename",
                    icon: "pen",
                    text: "Rename",
                    actionName: "edit-selected-node-trigger",
                    disallowMultiple: true
                },
                {
                    nodeNames: [TodoNode.NAME],
                    name: "toggle",
                    icon: "checkbox",
                    text: "Toggle",
                    actionName: "toggle-selected-nodes-done",
                    everyNode: true
                },
                
                {
                    nodeNames: [],
                    name: "remove",
                    icon: "trash-can",
                    text: "Remove",
                    actionName: "remove-selected-nodes"
                },
            ]
        },

        {
            name: "text-align",
            radio: true,
            listenStates: ()=> Selection.count == 1 ? [Selection.getFirst()?.getBrick<TextFormatBrick>(TextFormatBrick)?.TextAlign] : [],
            buttons: [
                {
                    nodeNames: [NoteNode.NAME],
                    name: "text-align-left",
                    icon: "text-align-left",
                    text: "Text align left",
                    actionName: "format-text-trigger",
                    actionParams: [new TextFormat({ textAlign: TextAlign.LEFT })],
                    everyNode: true,
                    preventClose: true,
                    hideInActions: true,
                    getIsActive: ()=> Selection.count == 1 ? Selection.getFirst()?.getBrick<TextFormatBrick>(TextFormatBrick)?.textAlign == TextAlign.LEFT : false
                },
                {
                    nodeNames: [NoteNode.NAME],
                    name: "text-align-center",
                    icon: "text-align-center",
                    text: "Text align center",
                    actionName: "format-text-trigger",
                    actionParams: [new TextFormat({ textAlign: TextAlign.CENTER })],
                    everyNode: true,
                    preventClose: true,
                    hideInActions: true,
                    getIsActive: ()=> Selection.count == 1 ? Selection.getFirst()?.getBrick<TextFormatBrick>(TextFormatBrick)?.textAlign == TextAlign.CENTER : false
                },
                {
                    nodeNames: [NoteNode.NAME],
                    name: "text-align-right",
                    icon: "text-align-right",
                    text: "Text align right",
                    actionName: "format-text-trigger",
                    actionParams: [new TextFormat({ textAlign: TextAlign.RIGHT })],
                    everyNode: true,
                    preventClose: true,
                    hideInActions: true,
                    getIsActive: ()=> Selection.count == 1 ? Selection.getFirst()?.getBrick<TextFormatBrick>(TextFormatBrick)?.textAlign == TextAlign.RIGHT : false
                }
            ]
        },
        {
            name: "text-size",
            radio: true,
            listenStates: ()=> Selection.count == 1 ? [Selection.getFirst()?.getBrick<TextFormatBrick>(TextFormatBrick)?.TextSize] : [],
            buttons: [
                {
                    nodeNames: [NoteNode.NAME],
                    name: "increase-text-size",
                    icon: "increase-text-size",
                    text: "Increase text size",
                    actionName: "format-text-trigger",
                    actionParams: [new TextFormat({ resizeText: ResizeText.INCREASE })],
                    everyNode: true,
                    preventClose: true,
                    getIsDisabled: ()=> Selection.count == 1 ? Selection.getFirst()?.getBrick<TextFormatBrick>(TextFormatBrick)?.textSize == TextSize.EXTRA_LARGE : false
                },
                {
                    nodeNames: [NoteNode.NAME],
                    name: "decrease-text-size",
                    icon: "decrease-text-size",
                    text: "Decrease text size",
                    actionName: "format-text-trigger",
                    actionParams: [new TextFormat({ resizeText: ResizeText.DECREASE })],
                    everyNode: true,
                    preventClose: true,
                    getIsDisabled: ()=> Selection.count == 1 ? Selection.getFirst()?.getBrick<TextFormatBrick>(TextFormatBrick)?.textSize == TextSize.SMALL : false
                },
            ]
        },

        {
            name: "selection",
            buttons: [
                {
                    nodeNames: [ListNode.NAME],
                    name: "select-all-inner",
                    text: "Select items",
                    actionName: "select-all-in-container",
                    disallowMultiple: true
                }
            ]
        },
        
        {
            name: "misc",
            buttons: [
                {
                    nodeNames: [],
                    name: "pan-to-selection",
                    icon: "target",
                    text: "Focus",
                    actionName: "pan-to-selection"
                }
            ]
        },
    ];

    static getActionGroups(nodes: Node[]): IActionButtonsGroup[] {
        const groups: IActionButtonsGroup[] = [];

        for (const group of this.actions) {
            if (group.buttons.length == 0)
                continue;

            const newGroup: IActionButtonsGroup = { ...group, buttons: [] };
            groups.push(newGroup);

            for (const button of group.buttons) {
                if (nodes.length > 1 && button.disallowMultiple)
                    continue;

                if (button.nodeNames.length == 0) {
                    newGroup.buttons.push(button);
                    continue;
                }

                if (nodes.filter(n=> !button.nodeNames.includes(n.name)).length > 0)
                    continue;

                newGroup.buttons.push(button);
            }
        }

        return groups.filter(g=> g.buttons.length > 0);
    }
    static getActionsMenuGroups(node: Node[]): IActionButtonsGroup[] {
        return this.getActionGroups(node).map(g=> {
            g.buttons = g.buttons.filter(b=> (!!b.icon || !!b.getCustomIcon) && !b.hideInActions)
            return g;
        })
    }
    static getContextMenuGroups(nodes: Node[]): IContextMenuButtonsGroup[] {
        return this.getActionGroups(nodes);
    }
}