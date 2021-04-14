import { useState } from "react";
import { withRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { NavBar, Icon } from "antd-mobile";

import { StoreContext, useThunkReducer } from "@/store";

import PlayPage from "@/views/PlayPage";
import Recommend from "@/views/recommend";
import "./index.less";

const Layouts = (props: any) => {
  const { history } = props;
  const [pageTitle, setPageTitle] = useState<string>("default title");

  const handleClick = () => {
    history.push("/play");
  };

  const [state, dispatch] = useThunkReducer();

  return (
    <StoreContext.Provider value={{ ...state, dispatch }}>
      <div className="layouts">
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={handleClick}
          rightContent={[
            <Icon key="0" type="search" style={{ marginRight: "16px" }} />,
            <Icon key="1" type="ellipsis" />,
          ]}
        >
          {pageTitle}
        </NavBar>
        <Route path="/play" component={PlayPage}></Route>
        <Route path="/recommend" component={Recommend}></Route>
      </div>
    </StoreContext.Provider>
  );
};

export default withRouter(Layouts);
