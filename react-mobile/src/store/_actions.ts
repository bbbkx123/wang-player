import { fetchSongUrl } from "@/service/index";

export const songReadyAction = (songIndex: number) => {
  return (dispatch: any, getState: any) => {
    dispatch({ type: "currentSongIndex", value: songIndex });
    const { playListDetail } = getState();
    const { sid } = playListDetail.listData[songIndex];
    fetchSongUrl(sid).then((res: any) => {
      dispatch({ type: "audioSrc", value: res.data.data[0].url });
    });
  };
};
