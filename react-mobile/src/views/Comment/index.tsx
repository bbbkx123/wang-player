import * as api from "@/service/index"
import { useCallback, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { useAsync } from "@/utils/hook"
// import { withLoading } from "@/components/HOC/Loading"
import List from "@/components/List"
import Scroll from "@/components/Scroll"
import Loading from "@/components/Loading"

import "./index.less"

const useComment = (songId: any) => {
  const { loading, data, error, execute } = useAsync(useCallback(async () => await api.fetchMusicComment(songId, 20, 0), [songId]))
  useEffect(() => execute(), [execute])
  return {
    comment: data,
    commentLoading: loading,
    commentError: error,
  }
}

const Comment = (props: any) => {
  const songId = useSelector((state: any) => state.playpage.songId)
  const {comment, commentLoading} = useComment(songId)
  const commentPageConf = useRef<any>({
    scrollY: true,
    scrollX: false,
    // 锁定方向
    directionLockThreshold: 0,
    freeScroll: false,
  })
  
  const onTouchStart = () => {}

  const onTouchEnd = () => {}

  return (
    <div className="page-container">
      {commentLoading && <Loading></Loading>}
      {comment && (
        <Scroll mode="normal-scroll-y" config={commentPageConf.current}>
          <List mode="COMMENT_LIST" data={comment.data.comments} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
        </Scroll>
      )}
    </div>
  )
}

export default Comment
