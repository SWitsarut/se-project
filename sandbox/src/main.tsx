import ReactDOM from "react-dom/client";
import App from "./App";
import Socket from "./Socket";
ReactDOM.createRoot(document.getElementById("root")!).render(
	<Socket>
		<App />
	</Socket>
);
