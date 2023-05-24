import Trigger from "../../states/Trigger";
import { IPoint } from "../../types/types";
import Config from "../../utils/Config";
import Utils from "../../utils/Utils";
import Mouse from "../Mouse";
import gsap from "gsap";
import Keyboard from "../Keyboard";
import SelectionControls from "./SelectionControls";
import Selection from "../Selection";

export default class WorkspaceControls {
    static inited: boolean = false;
    
    static zoom: number = 1;
    static pan: IPoint = { x: 0, y: 0 };
    static allowPan: boolean = true;

    static workspaceElement: HTMLDivElement;
    static nodesElement: HTMLDivElement;
    static gridElement: HTMLDivElement;
    static transformElement: HTMLDivElement;

    static onPanChanged = new Trigger<{ pan: IPoint, zoom: number }>("workspace/on-pan-changed");
    
    static init(workspaceElement: HTMLDivElement) {
        if (this.inited) return ()=> {};
        this.inited = true;

        this.zoom = 1;
        this.pan.x = 0;
        this.pan.y = 0;
        
        this.workspaceElement = workspaceElement;
        this.nodesElement = workspaceElement.querySelector(".workspace-nodes")!;
        this.gridElement = workspaceElement.querySelector(".workspace-grid")!;
        this.transformElement = workspaceElement.querySelector(".workspace-transform")!;

        this.updateWorkspaceElement();

        //
        const unlistenPan = this.initPan();
        const unlistenZoom = this.initZoom();
        
        return ()=> {
            unlistenPan();
            unlistenZoom();
        }
    }
    static initPan() {
        const unlistenMove = Mouse.onMove(()=> {
            // Pan with mouse pressed wheel
            if (!this.getAllowPanZoom()) return;

            if (!Keyboard.isCtrl && (Mouse.isButtonPressed(1) || Keyboard.isSpace) && this.allowPan) {
            
                this.pan.x -= Mouse.movementX / this.zoom;
                this.pan.y -= Mouse.movementY / this.zoom;

                this.updateWorkspaceElement();
            }
        });
        const unlistenWheel = Mouse.onWheel(e=> {
            if (!this.getAllowPanZoom()) return;

            if (!Keyboard.isCtrl && this.allowPan) {
                if (Keyboard.isShift)
                    this.pan.x += e.deltaY / this.zoom;
                else {
                    this.pan.x += e.deltaX / this.zoom;
                    this.pan.y += e.deltaY / this.zoom;
                }

                this.updateWorkspaceElement();
            }
        })
        
        return ()=> {
            unlistenMove();
            unlistenWheel();
        }
    }
    static initZoom() {
        const unlistenMove = Mouse.onMove(e=> {
            // Zoom with ctrl and mouse movement
            if (!this.getAllowPanZoom() || !Keyboard.isCtrl || !Mouse.isButtonPressed(1)) return;

            this.zoom = Utils.clamp((this.zoom - e.movementY / 140 * this.zoom), Config.MIN_ZOOM, Config.MAX_ZOOM);

            this.updateWorkspaceElement();
        });
        const unlistenWheel = Mouse.onWheel(e=> {
            // Zoom mouse wheel
            if (!e.ctrlKey || !this.getAllowPanZoom()) return;

            e.preventDefault();
            
            this.zoom = Utils.clamp((this.zoom - e.deltaY / 200 * this.zoom), Config.MIN_ZOOM, Config.MAX_ZOOM);

            this.updateWorkspaceElement();
        }, undefined, false);

        return ()=> {
            unlistenWheel();
            unlistenMove();
        }
    }
    static destroy() {
        this.inited = false;
    }

    //
    static smoothPanTo(x: number | null, y: number | null, zoom?: number) {
        if (zoom != undefined) {
            zoom = Utils.clamp(zoom, Config.MIN_ZOOM, Config.MAX_ZOOM);
            
            gsap.to(this, {
                zoom: zoom,
                duration: .2,
                ease: "power2.inOut",
                onUpdate: ()=> {
                    if (x === null && y === null)
                        this.updateWorkspaceElement();
                },
                onComplete: ()=> {
                    this.zoom = zoom!;
                    this.updateWorkspaceElement();
                }
            })
        }
        
        if (x !== null && y !== null) {
            gsap.to(this.pan, {
                x: x,
                y: y,
                duration: .2,
                ease: "power2.out",
                onUpdate: ()=> {
                    this.updateWorkspaceElement()
                },
                onStart: ()=> {
                    this.allowPan = false;
                },
                onComplete: ()=> {
                    this.allowPan = true;
                    this.updateWorkspaceElement()
                }
            })
        }
    }
    static smoothPanToSelection() {
        let x = 0;
        let y = 0;
        
        if (SelectionControls.selectionElement && Selection.count > 0) {
            const selectionBounds = SelectionControls.selectionElement.getBoundingClientRect();
            x = (selectionBounds.left + selectionBounds.width/2 - innerWidth/2 + this.pan.x * this.zoom) / this.zoom;
            y = (selectionBounds.top + selectionBounds.height/2 - innerHeight/2 + this.pan.y * this.zoom) / this.zoom;
        }
        
        this.smoothPanTo(x, y, 1);
    }
    
    //
    static updateWorkspaceElement(notify: boolean=true) {
        this.transformElement.style.transform = `scale(${ this.zoom })`;
        
        this.nodesElement.style.transform = `translate(${ -Math.floor(this.pan.x) }px, ${ -Math.floor(this.pan.y) }px)`;

        this.gridElement.style.opacity = (Utils.clamp(this.zoom - .5, 0, 1) * .1 * 2).toString();
        this.gridElement.style.backgroundPosition = `${ -Math.floor(this.pan.x) % Config.GRID_SIZE }px ${ -Math.floor(this.pan.y) % Config.GRID_SIZE }px`;
        
        if (notify)
            this.onPanChanged.trigger({ pan: this.pan, zoom: this.zoom });

        SelectionControls.updateSelectionElement();
    }

    // Get
    static getAllowPanZoom(): boolean {
        return !Keyboard.inputFocused;
    }
}