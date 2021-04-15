import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "antd-mobile/dist/antd-mobile.css";

import App from "./App";

ReactDOM.render(
  <Router>
    <App></App>
  </Router>,
  document.getElementById("root")
);
