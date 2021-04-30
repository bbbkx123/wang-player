import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import store from "@/store"
import "antd-mobile/dist/antd-mobile.css"

import App from "./App"
import React from "react"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App></App>
      </Router>
    </Provider>
  </React.StrictMode>
  ,
  document.getElementById("root")
)
