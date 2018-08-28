import "normalize.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import "./types";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
