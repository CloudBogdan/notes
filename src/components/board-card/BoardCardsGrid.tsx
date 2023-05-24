import { motion } from "framer-motion";
import useClassName from "../../hooks/useClassName";
import Dashboard, { IBoard } from "../../managers/Dashboard";
import { MyComponent } from "../../types/component-types";
import Icon from "../ui/Icon";
import BoardCard from "./BoardCard";

interface IBoardCardsGrid extends MyComponent {
    boards: IBoard[]
}

const BoardCardsGrid: React.FC<IBoardCardsGrid> = props=> {
    const className = useClassName([
        "boards-grid",
        props.className
    ])

    function onCreateBoardClick() {
        Dashboard.createBoard();
    }
    
    return (
        <div
            style={ props.style }
            className={ className }
        >
            <div onClick={ onCreateBoardClick } className="new-board-card">
                <div className="board-preview">
                    <Icon icon="plus" />
                </div>
            </div>
            
            { props.boards.sort((a, b)=> b.date - a.date).map(board=>
                <motion.div
                    key={ board.id }
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    
                    layout
                    transition={{ ease: "easeOut", duration: .2 }}
                >
                    <BoardCard 
                        board={ board }
                    />
                </motion.div>
            ) }
        </div>
    );
};

export default BoardCardsGrid;