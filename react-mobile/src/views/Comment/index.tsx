import * as api from "@/service/index"
import { useCallback, useEffect } from "react"
import { useSelector, useStore, useDispatch } from "react-redux"
import { useAsync, useTouchEvent } from "@/utils/hook"
import List from "@/components/List"
import Scroll from "@/components/Scroll"
import Loading from "@/components/Loading"

import "./index.less"

const commentPageConf = {
  scrollY: true,
  scrollX: false,
  // 锁定方向
  directionLockThreshold: 0,
  freeScroll: false,
}

const useComment = (songId: string, state: any, dispatch: Function)  => {
  const { loading, data, error, execute } = useAsync(useCallback(async () => await api.fetchMusicComment(songId, 20, 0), [songId]))

  useEffect(() => execute(), [songId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const comments = data?.data?.comments
    if (Array.isArray(comments) && comments.length > 0) {
      dispatch({ type: "views/comment/data", value: comments })
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  setTimeout(() => {
    dispatch({type: "play-page/song-id", value: 1861640172})
  }, 5000)

  return {
    data,
    loading,
    error,
  }
}

const Comment = () => {
  const store = useStore()
  const dispatch = useDispatch()
  const songId = useSelector((state: StoreState) => state.playpage.songId)
  const comment = useSelector((state: any) => state.comment.data)
  const {loading, error} = useComment(songId, store.getState(), dispatch)
  const {onTouchStart, onTouchEnd} = useTouchEvent(() => {})

  return (
    <div className="page-container">
      {loading && <Loading></Loading>}
      {comment && (
        <Scroll mode="normal-scroll-y" config={commentPageConf}>
          <List mode="COMMENT_LIST" data={comment} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
        </Scroll>
      )}
    </div>
  )
}

export default Comment
