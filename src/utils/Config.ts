export default class Config {
    static readonly IS_DEV: boolean = import.meta.env.DEV;
    
    static readonly GRID_SIZE: number = 10;
    static readonly BOARD_DATA_PREFIX: string = "board:";

    static readonly CREATE_NODE_DRAG_THRESHOLD: number = 20;
    static readonly NODE_DRAG_THRESHOLD: number = 10;
    static readonly CONTAINER_CHILD_DRAG_THRESHOLD: number = 20;

    static readonly SUPPORT_IMAGE_TYPES: string[] = ["image/png", "image/jpeg", "image/bmp", "image/gif"];
    static readonly MAX_FILE_SIZE: number = 2 * 1024 * 1024;
    static readonly AUTO_SAVE_DELAY: number = 6;
    
    static readonly MIN_ZOOM: number = .3;
    static readonly MAX_ZOOM: number = 1;

    static readonly LOG_TRIGGERS: boolean = this.IS_DEV && false;
    static readonly LOG_STATES: boolean = this.IS_DEV && false;
}