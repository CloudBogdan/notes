import html2canvas from "html2canvas";
import Node from "../../classes/nodes/Node";
import NodesRegistry from "../../registries/NodesRegistry";
import State from "../../states/State";
import Config from "../../utils/Config";
import { IBoardData } from "../Dashboard";
import Selection from "../Selection";
import Storage from "../Storage";
import Triggers from "../Triggers";
import Settings from "../Settings";
import WorkspaceControls from "../ui/WorkspaceControls";

export default class Board {
    static opened: boolean = false;
    
    static id: number = Date.now();
    static Name = new State<string>("board/name", "Sample board");
    static Desc = new State<string>("board/desc", "Some board description");
    static Date = new State<number>("board/date", Date.now());
    static PreviewSource = new State<string | null>("board/preview-source", null);
    static Nodes = new State<Node[]>("board/nodes", []);

    static IsSaved = new State<boolean>("board/is-saved", false);
    static IsSaving = new State<boolean>("board/is-saving", false);

    static autoSaveTimer: number = -1;
    
    static init(): ()=> void {
        const unlistenOnEdited = Triggers.onBoardEdited.listen(()=> {
            this.IsSaved.value = false;
            this.Date.value = Date.now();
            
            if (Settings.isSettingActive("AutoSave")) {
                clearTimeout(this.autoSaveTimer);
                this.autoSaveTimer = setTimeout(()=> {
                    console.log("Auto saved!");
                    this.save(false);
                }, 1000 * Config.AUTO_SAVE_DELAY);
            }
        });
        const unlistenName = this.Name.listen(()=> {
            Triggers.onBoardEdited.trigger(true);
        })

        return ()=> {
            unlistenOnEdited();
            unlistenName();
        }
    }
    
    static open(boardId: number): boolean {
        if (this.opened) return false;
        this.opened = true;

        return this.load(boardId);
    }
    static close() {
        if (!this.opened) return;

        this.Nodes.value = [];
        
        this.opened = false;
    }
    static save(takeScreenshot: boolean=true): Promise<boolean> {
        return new Promise((resolve, reject)=> {
            if (!this.opened || this.IsSaving.value) {
                resolve(false);
                reject(false);
                return;
            }

            this.IsSaving.value = true;
            
            if (takeScreenshot) {
                html2canvas(WorkspaceControls.workspaceElement, { scale: .4 }).then(canvas=> {
                    const dataUrl = canvas.toDataURL();
                    this.PreviewSource.value = dataUrl;

                    Storage.saveItem(Config.BOARD_DATA_PREFIX + this.id, this.getData());

                    this.IsSaved.value = true;
                    this.IsSaving.value = false;
                    resolve(true)
                });
            } else {
                Storage.saveItem(Config.BOARD_DATA_PREFIX + this.id, this.getData());

                this.IsSaved.value = true;
                this.IsSaving.value = false;
                resolve(true)
            }

        });
    }
    static load(id: number): boolean {
        const data = Storage.loadItem<IBoardData>(Config.BOARD_DATA_PREFIX + id);
        if (!data) return false;
        
        this.loadData(data);

        return true;
    }
    
    // Data
    static loadData(data: IBoardData) {
        if (Config.IS_DEV)
            console.log(`Trying to load board by id ${ data.id }`);

        Selection.deselectAll();
        this.IsSaved.value = true;
        
        this.id = data.id;
        this.Name.value = data.name;
        this.Desc.value = data.desc;
        this.Date.value = data.date;

        this.Nodes.value = data.nodes.map(nodeData=> {
            const nodeCallback = NodesRegistry.getNodeCallback(nodeData.name)

            if (nodeCallback) {
                const node = nodeCallback(nodeData.id);
                node.loadData(nodeData);
                return node;
            }   
            return null;
        }).filter(Boolean) as Node[]
    }
    static getData(): IBoardData {
        return {
            id: this.id,
            name: this.Name.value,
            desc: this.Desc.value,
            date: this.Date.value,
            previewSource: this.PreviewSource.value,
            nodes: this.Nodes.value.map(n=> n.getData())
        }
    }
}