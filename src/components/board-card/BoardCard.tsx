import { useNavigate } from "react-router";
import Dashboard, { IBoard } from "../../managers/Dashboard";
import ContextMenu from "../../managers/ui/ContextMenu";
import useClassName from "../../hooks/useClassName";
import { useState } from "react";
import EditableTextInput from "../ui/inputs/EditableTextInput";
import { motion } from "framer-motion";

interface IBoardCard {
    board: IBoard
}

const BoardCard: React.FC<IBoardCard> = props=> {
    const board = props.board;
    const [isPreviewLoaded, setIsPreviewLoaded] = useState<boolean>(false);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [name, setName] = useState<string>(board.name);
    const navigate = useNavigate();

    const className = useClassName([
        "board",
        isPreviewLoaded && "preview-loaded",
        isEditingName && "not-clickable"
    ]);
    
    function onClick() {
        if (isEditingName) return;
        
        navigate(`/board/${ props.board.id }`)
    }
    function onContextMenu(e: React.MouseEvent<HTMLDivElement>) {
        ContextMenu.setContextMenu({
            event: e,
            targetsId: [board.id],
            groups: [
                {
                    name: "default",
                    buttons: [
                        {
                            icon: "pen",
                            text: "Rename",
                            handle: ()=> setIsEditingName(true)
                        },
                        {
                            icon: "trash-can",
                            text: "Delete",
                            actionName: "remove-board",
                            actionParams: [board.id]
                        },
                    ]
                }
            ]
        })
    }
    function onPreviewLoad() {
        setIsPreviewLoaded(true);
    }
    function onNameInputBlur() {
        console.log("HEY");
        console.log(name, Dashboard.editBoardData(board.id, { name: name }));
    }

    const relativeTime = new Intl.RelativeTimeFormat("en", { style: "long", numeric: "auto" });
    
    return (
        <article 
            className={ className }
            onClick={ onClick }
            onContextMenu={ onContextMenu }
        >
            <div className="board-preview">
                <img 
                    src={ board.previewSource || "" }
                    alt="preview"
                    onLoad={ onPreviewLoad }
                />
            </div>
            <main className="board-content">
                <EditableTextInput
                    className="board-name"
                    placeholder="Board name"

                    value={ name }
                    onChange={ v=> setName(v) }
                    onBlur={ onNameInputBlur }
                    isEditing={ isEditingName }
                    setIsEditing={ setIsEditingName }
                >{ board.name }</EditableTextInput>
                <span className="text-muted">
                    { relativeTime.format(Math.round((board.date - Date.now()) / (24*60*60*1000)), "days") } at { new Date(board.date).toLocaleTimeString(undefined, { timeStyle: "short" }) }
                </span>
            </main>
        </article>
    );
};

export default BoardCard;