import TextFormat from "../classes/TextFormat";
import Trigger from "../states/Trigger";

interface ITriggerParams {
    targetsId: number[]
}
interface IFormatTextTrigger extends ITriggerParams {
    format: TextFormat
}

export default class Triggers {
    static editNode = new Trigger<ITriggerParams>("triggers/edit-node");
    static toggleNodeDone = new Trigger<ITriggerParams>("triggers/toggle-node-done");
    static formatText = new Trigger<IFormatTextTrigger>("triggers/format-text");

    static onBoardEdited = new Trigger<boolean>("triggers/on-board-edited");
}