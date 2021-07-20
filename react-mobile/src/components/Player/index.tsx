import { useState, useEffect, useRef } from "react"
import { withRouter } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import action from "@/store/action"

const Player = (props: any) => {
  const { history} = props

  const dispatch = useDispatch()
  const playList = useSelector((state: any) => state.playlist.data)
  const currentSongIndex = useSelector((state: any) => state.playlist.currentSongIndex)
  const showController = useSelector((state: any) => state.global.showController)
  const testLog = useSelector((state: any) => state.test.log)

  const audioElemRef = useRef<any>(null)
  const [loop] = useState<boolean>(false)

  // !问题: buffer加载时, currentTime需要loading效果
  const onEnded = () => {
    audioElemRef.current.pause()
    dispatch({ type: "audio/paused", value: true })
    if (playList.length > 0) {
      if (currentSongIndex < playList.length - 1) {
        dispatch(action.beforeCanPlayAction(currentSongIndex + 1))
      } else if (currentSongIndex === playList.length - 1) {
        // if (this.isLoopPlayList) {
        //     this.songChangeIndex = 0
        // }
      }
    }
  }

  const onTimeUpdate = (e: any) => {
    let _currentTime = Math.floor(e.target.currentTime * 100) / 100
    
    // testLog.push(`onTimeUpdate ----- currentTime ：${_currentTime}`)
    // dispatch({type: 'test/log', value: [...testLog]})

    // 最初放在onCanplay，线上环境onCanplay执行audio.duration为0
    dispatch({ type: "audio/duration", value: audioElemRef.current.duration })
    dispatch({ type: "audio/current-time", value: _currentTime })
  }

  const onCanPlay = () => {
    const { pathname } = history.location
    dispatch({ type: "audio/paused", value: false })
    // if (!showController && pathname !== "/play") dispatch({ type: "global/show-controller", value: true })
  }

  useEffect(() => {
    audioElemRef.current.volume = 0.5
    dispatch({ type: "audio/instance", value: audioElemRef.current })
    return () => {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // *问题: react-hooks/exhaustive-deps
  // 解决: 如果不需要在useEffect外使用方法, 可以简单的将方法移入useEffect内, 或者禁用

  // *问题: 直接访问listDetail为null, 暂时将listDetail存入ref
  // 在useEffect(() => {}, [])访问, listDetail是初始值null, 暂时这样实现

  return <audio ref={audioElemRef} autoPlay={true} onEnded={onEnded} onTimeUpdate={onTimeUpdate} onCanPlay={onCanPlay} loop={loop}></audio>
}

export default withRouter(Player)
