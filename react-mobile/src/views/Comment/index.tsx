import * as api from "@/service/index"
import { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
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

const useComment = (songId: string)  => {
  const { loading, data, error, execute } = useAsync(useCallback(async () => await api.fetchMusicComment(songId, 20, 0), [songId]))
  useEffect(() => execute(), [execute])
  return {
    comment: data,
    commentLoading: loading,
    commentError: error,
  }
}

const Comment = () => {
  const songId = useSelector((state: StoreState) => state.playpage.songId)
  const {comment, commentLoading} = useComment(songId)
  const {onTouchStart, onTouchEnd} = useTouchEvent(() => {})

  return (
    <div className="page-container">
      {commentLoading && <Loading></Loading>}
      {comment && (
        <Scroll mode="normal-scroll-y" config={commentPageConf}>
          <List mode="COMMENT_LIST" data={comment.data.comments} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
        </Scroll>
      )}
    </div>
  )
}

export default Comment
