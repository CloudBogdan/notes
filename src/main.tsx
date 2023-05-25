import ReactDOM from "react-dom/client"
import AppComponent from "./AppComponent"
import Actions from "./managers/Actions";
import Hotkeys from "./managers/Hotkeys";
import Keyboard from "./managers/Keyboard";
import Mouse from "./managers/Mouse";
import "./styles/style.scss";
import { BrowserRouter } from "react-router-dom";
import Storage from "./managers/Storage";
import NodesRegistry from "./registries/NodesRegistry";
import Dashboard from "./managers/Dashboard";
import Settings from "./managers/Settings";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

Mouse.init();
Keyboard.init();
Actions.init();
Hotkeys.init();
Dashboard.init();
Settings.init();

NodesRegistry.init();

gsap.registerPlugin(TextPlugin);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<AppComponent />
	</BrowserRouter>
)
