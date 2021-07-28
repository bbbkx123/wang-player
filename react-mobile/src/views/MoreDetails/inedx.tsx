import { useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Tabs } from "antd-mobile";
import Scroll from "@/components/Scroll";
import * as api from "@/service/index";
import { tabs as _tabs } from "./define";
import { instanceRef } from "./define";

import "./index.less";

const usePlayDetails = (tag: string) => {
  const [details, setDetails] = useState([]);
  useEffect(() => {
    api
      .fetchMorePlayListDetail(tag, 20, 0)
      .then((res: any) => setDetails(res.data.playlists));
  }, [tag]);
  return details;
};

let MoreDetails = (props: any) => {
  const { history } = props;
  const [tabs] = useState(_tabs);
  const [active, setActive] = useState<any>("流行");
  const details = usePlayDetails(active);
  const onChange = useCallback(
    (tab: any, index: Number) => {
      setActive(tab.title)
    },
    []
  );
  const pageToPlaylistDetail = useCallback(
    (id: number) =>
      history.push({ pathname: "/playlistdetails", query: { id } }),
    []
  );

  return (
    <div className="more-details">
      <Tabs
        tabs={tabs}
        renderTabBar={(props) => <Tabs.DefaultTabBar {...props} page={3} />}
        tabBarBackgroundColor={"#000"}
        onChange={onChange}
        // distanceToChangeTab={0.9}
        animated={false}
      >
        {/* onReload={onReload} fetchDataForPullUp={() => handleAppendPlayList(state, dispatch)} */}
        <div style={{height: "800px"}}>
          {details.length > 0 && (
            <Scroll mode="list-detail" config={instanceRef}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {details.map((detail: any, index) => {
                  return (
                    <div
                      className={`more-details--item ${(index + 1) % 3 === 0 ? 'no-margin' : ''}` }
                      key={`details-${index}`}
                      onClick={() => pageToPlaylistDetail(detail.id)}
                    >
                      <img
                        style={{width:'100px', height: '100px'}}
                        src={`${detail.coverImgUrl}?param=100y100`}
                        alt={detail.description}
                      />
                      <span className="text">{detail.name}</span>
                    </div>
                  );
                })}
              </div>
            </Scroll>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default withRouter(MoreDetails);
