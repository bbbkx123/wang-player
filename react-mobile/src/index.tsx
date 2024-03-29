import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import store from "@/store"
import App from "./App"
/* <React.StrictMode> */

ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App></App>
      </Router>
    </Provider>
  ,
  document.getElementById("root")
)
