import { useEffect } from "react";
import BoardCardsGrid from "../components/board-card/BoardCardsGrid";
import Page from "../components/ui/pages/Page";
import Dashboard from "../managers/Dashboard";
import useStateListener from "../hooks/useStateListener";
import Notification from "../components/ui/notifications/Notification";
import StartScreen from "../components/dashboard-page/StartScreen";
import { Link } from "react-router-dom";

const DashboardPage: React.FC = ()=> {
    const [boards] = useStateListener(Dashboard.Boards);

    useEffect(()=> {
        Dashboard.loadBoards();
    }, []);
    
    return (
        <Page className="dashboard-page">

            <div className="scrollable">
                
                <main className="container">
                    <StartScreen />
                    
                    <section className="section">
                        <Notification className="mb-3">
                            This is <span className="badge">alpha</span>, boy!
                        </Notification>
                    </section>

                    <section className="section boards-section p-0">
                        <h1 className="section-title">Boards</h1>
                        <BoardCardsGrid boards={ boards } />
                    </section>

                    <section>
                        <Link to="/presentation">Open presentation</Link>
                    </section>
                </main>

            </div>
            
        </Page>
    );
};

export default DashboardPage;