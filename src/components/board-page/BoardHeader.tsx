import EditableTextInput from "../ui/inputs/EditableTextInput";
import useStateListener from "../../hooks/useStateListener";
import Board from "../../managers/board/Board";
import FabButton from "../ui/buttons/FabButton";
import ContextMenu from "../../managers/ui/ContextMenu";
import React, { useEffect, useState } from "react";
import WorkspaceControls from "../../managers/ui/WorkspaceControls";
import useClassName from "../../hooks/useClassName";
import Icon from "../ui/Icon";
import Settings from "../../managers/Settings";

const BoardHeader: React.FC = ()=> {
    const [isBoardNameEditing, setIsBoardNameEditing] = useState<boolean>(false);
    const [boardName, setBoardName] = useState<string>(Board.Name.value);
    const [isBoardSaving] = useStateListener(Board.IsSaving);
    const [isBoardSaved] = useStateListener(Board.IsSaved);

    const className = useClassName([
        "board-header row gap-2",
        isBoardSaving && "saving"
    ])
    
    useEffect(()=> {
        const unlistenBoardName = Board.Name.listen(name=> {
            setBoardName(name);
        })

        return ()=> {
            unlistenBoardName();
        }
    }, []);
    
    function openBoardContextMenu(e: React.MouseEvent<HTMLDivElement>) {
        ContextMenu.setContextMenu({
            event: e,
            groups: [
                {
                    name: "default",
                    buttons: [
                        {
                            icon: "pen",
                            text: "Rename board",
                            handle: ()=> setIsBoardNameEditing(true)
                        },
                        {
                            icon: "floppy",
                            text: "Save board",
                            actionName: "save-current-board"
                        }
                    ]
                },
                {
                    name: "misc",
                    buttons: [
                        {
                            text: "Select all in view",
                            actionName: "select-all-in-view"
                        },
                    ]
                },
                {
                    name: "settings",
                    buttons: [
                        {
                            icon: Settings.isSettingActive("AutoSave") ? "checkbox" : "empty-checkbox",
                            text: "Auto save",
                            handle: ()=> Settings.toggleSetting("AutoSave")
                        }
                    ]
                }
            ]
        })
    }
    function onBoardNameBlur() {
        Board.Name.value = boardName;
    }
    function onBoardNameDoubleClick() {
        setIsBoardNameEditing(true);
    }
    
    return (
        <header className={ className }>
            <div className="row gap-1">
                <FabButton
                    icon="menu"
                    onClick={ openBoardContextMenu }
                />
                
                <div 
                    className="board-name"
                    title={ `${ !isBoardSaved ? "•" : "" } ${ boardName } ${ !isBoardSaved ? "[unsaved]" : "[saved]" }` }

                    onContextMenu={ openBoardContextMenu }
                    onDoubleClick={ onBoardNameDoubleClick }
                >
                    { isBoardSaving && <span className="saving-text">Saving...</span> }
                    { !isBoardSaved && <div className="text-muted unsaved-icon"><Icon icon="circle" /></div> }
                    
                    <EditableTextInput
                        preventFromScroll
                        noDoubleClickEdit
                        disabled={ isBoardSaving }
                        
                        value={ boardName }
                        onChange={ v=> setBoardName(v) }
                        isEditing={ isBoardNameEditing }
                        setIsEditing={ setIsBoardNameEditing }
                        onBlur={ onBoardNameBlur }
                    />
                </div>
            </div>

            <div className="header-buttons row-centered gap-1">
                <FabButton
                    icon="target"
                    transparent
                    onClick={ ()=> WorkspaceControls.smoothPanTo(0,0,1) }
                    title="Focus to start of board [F]"
                />

                <div className="row-centered">
                    <FabButton
                        icon="decrease-zoom"
                        transparent
                        actionName="decrease-zoom"
                        title="Decrease zoom [Ctrl+Minus]"
                    />
                    <FabButton
                        icon="increase-zoom"
                        transparent
                        actionName="increase-zoom"
                        title="Increase zoom [Ctrl+Plus]"
                    />
                </div>
            </div>
        </header>
    );
};

export default BoardHeader;