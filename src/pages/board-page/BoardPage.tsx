import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Toolbar from "../../components/board-page/toolbar/Toolbar";
import WorkspaceComponent from "../../components/board-page/WorkspaceComponent";
import Page from "../../components/ui/pages/Page";
import Board from "../../managers/board/Board";
import BoardHeader from "../../components/board-page/BoardHeader";

const BoardPage: React.FC = ()=> {
    const params = useParams();
    const boardId = params.id ? +params.id : null;
    const navigate = useNavigate();

    useEffect(()=> {
        if (!boardId) return;

        const success = Board.open(boardId);
        if (!success) {
            navigate("/");
            return;
        }
        const unlisten = Board.init();
        
        function onWindowScroll() {
            scrollTo(0, 0);
        }
        onWindowScroll();
        addEventListener("scroll", onWindowScroll);
        return ()=> {
            Board.close();
            unlisten();
            removeEventListener("scroll", onWindowScroll);
        }
    }, [])
    
    return (
        <Page className="board-page">
            <WorkspaceComponent />

            <Toolbar />
            <BoardHeader />
        </Page>
    );
};

export default BoardPage;