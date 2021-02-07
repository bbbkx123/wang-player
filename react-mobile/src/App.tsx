import { BrowserRouter as Router } from "react-router-dom";
import Layouts from "@/layouts";
import "./App.less";

const App = () => {
  return (
    <div className="app">
      <Router>
        <Layouts></Layouts>
      </Router>
    </div>
  );
};

export default App;
