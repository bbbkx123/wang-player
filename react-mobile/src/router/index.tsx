import React from "react";
import { BrowserRouter  as Router, Route } from "react-router-dom";


const AppRoute = () => {
  return (
    <div>
      <Router>
        <Route path="/recommend"></Route>

      </Router>
    </div>
  )
}