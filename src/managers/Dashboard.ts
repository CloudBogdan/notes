import { INodeData } from "../classes/nodes/Node";
import State from "../states/State";
import Config from "../utils/Config";
import Storage from "./Storage";

export interface IBoard {
    id: number
    name: string
    desc: string
    date: number
    previewSource: string | null
}
export interface IBoardData {
    id: number
    name: string
    desc: string
    date: number
    previewSource: string | null
    nodes: INodeData[]
}

export default class Dashboard {
    static Boards = new State<IBoard[]>("boards/boards", []);

    //
    static init() {
        // this.loadBoards();
    }
    
    //
    static loadBoards() {
        this.Boards.value = Storage.loadItems<IBoardData>(Config.BOARD_DATA_PREFIX).map(item=> {
            return {
                id: item.id,
                name: item.name,
                desc: item.desc,
                date: item.date,
                previewSource: item.previewSource
            }
        })
    }
    
    //
    static createBoard() {
        const boardId = Date.now();
        const data: IBoardData = {
            id: boardId,
            name: "New board",
            desc: "Empty",
            date: Date.now(),
            previewSource: null,
            nodes: []
        } ;
        
        this.saveBoard(boardId, data);
        this.loadBoards();
    }
    static editBoardData(id: number, params: Partial<IBoardData>): boolean {
        const boardData = this.getBoardData(id);
        if (!boardData) return false;

        Storage.saveItem(Config.BOARD_DATA_PREFIX + id, {
            ...boardData,
            ...params
        });

        return true;
    }
    static removeBoard(id: number) {
        Storage.removeItem(Config.BOARD_DATA_PREFIX + id);
        this.loadBoards();
    }
    static getBoardData(id: number): IBoardData | null {
        return Storage.loadItem<IBoardData>(Config.BOARD_DATA_PREFIX + id)
    }
    
    // Data
    static saveBoard(id: number, data: IBoardData) {
        Storage.saveItem(Config.BOARD_DATA_PREFIX + id, data);
    }
    static getBoards(): IBoard[] {
        return [];
    }
}