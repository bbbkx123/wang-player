import React from "react";
import { BrowserRouter  as Router, Route } from "react-router-dom";

import Play from "@/views/Play";

const AppRoute = () => {
  return (
    <div>
      <Router>
        <Route path="/play" component={Play}></Route>

      </Router>
    </div>
  )
}