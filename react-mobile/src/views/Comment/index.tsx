import * as api from "@/service/index"
import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
// import { withLoading } from "@/components/HOC/Loading"
import List from "@/components/List"
import Scroll from "@/components/Scroll"

import "./index.less"

const Comment = (props: any) => {
  const { songId } = props
  const [, setLoading] = useState<boolean>(false)
  const [comment, setComment] = useState<any>()
  const commentPageConf = useRef<any>({
    scrollY: true,
    scrollX: false,
    // 锁定方向
    directionLockThreshold: 0,
    freeScroll: false,
  })

  const fetchMusicComment = async () => {
    setLoading(true)
    let comment = await api.fetchMusicComment(songId, 20, 0)
    setComment(comment)
    setLoading(false)
  }

  const onTouchStart = () => {}

  const onTouchEnd = () => {}

  const ScrollView = () => (
    <Scroll mode="normal-scroll-y" config={commentPageConf.current}>
      <List mode="COMMENT_LIST" data={comment.data.comments} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
    </Scroll>
  )

  // const ScrollViewWithLoading = withLoading(ScrollView)

  useEffect(() => {
    fetchMusicComment()
    return () => {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="page-container">
    {/* <ScrollViewWithLoading loading={loading}></ScrollViewWithLoading> */}
    {comment && <ScrollView></ScrollView>}
  </div>
}

const stateToProps = (state: any) => ({
  songId: state.playpage.songId,
})

export default connect(stateToProps)(Comment)
