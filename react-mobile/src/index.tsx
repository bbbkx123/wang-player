import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import store from "@/store"
import "antd-mobile/dist/antd-mobile.css"

import App from "./App"

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App></App>
    </Router>
  </Provider>,
  document.getElementById("root")
)
