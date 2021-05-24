import * as api from "@/service/index"
import { useEffect, useRef, useState } from "react"

import List from "@/components/List"
import Scroll from "@/components/Scroll"

import "./index.less"

const Comment = (props: any) => {
  const [comment, setComment] = useState<any>()
  const commentPageConf = useRef<any>({
    scrollY: true,
    scrollX: false,
    // 锁定方向
    directionLockThreshold: 0,
    freeScroll: false,
  })

  const fetchMusicComment = async () => {
    let comment = await api.fetchMusicComment("1501477654", 20, 0)
    setComment(comment)
  }

  const onTouchStart = () => {}

  const onTouchEnd = () => {}

  useEffect(() => {
    fetchMusicComment()
    return () => {}
  }, [])

  return (
    <div className="page-container">
      
      {
        comment && (<Scroll mode="normal-scroll-y" config={commentPageConf.current}>
        <List mode="COMMENT_LIST" data={comment.data.comments} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}></List>
      </Scroll>)
      }
    </div>
  )
}

export default Comment
