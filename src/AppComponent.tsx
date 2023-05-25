import { Navigate, useLocation, useRoutes } from "react-router-dom";
import ContextMenuComponent from "./components/app/ContextMenuComponent";
import BoardPage from "./pages/board-page/BoardPage";
import DashboardPage from "./pages/DashboardPage";
import { AnimatePresence } from "framer-motion";
import React from "react";
import FloatingWindowsField from "./components/app/FloatingWindowsField";
import PresentationPage from "./pages/presentation/PresentationPage";

const AppComponent: React.FC = ()=> {
	const routes = useRoutes([
		{
			path: "/",
			element: <DashboardPage />
		},
		{
			path: "/board/:id",
			element: <BoardPage />
		},
		{
			path: "/presentation",
			element: <PresentationPage />,
		},

		{ path: "/board", element: <Navigate to="/" /> },
	])
	
	const location = useLocation();
	
	return (
		<main className="app" onContextMenu={ e=> e.preventDefault() }>
			<AnimatePresence mode="wait">
				{/* @ts-ignore */}
				{ React.cloneElement(routes, { key: location.pathname }) }
			</AnimatePresence>

			<FloatingWindowsField />
			<ContextMenuComponent />
		</main>
	);
};

export default AppComponent;