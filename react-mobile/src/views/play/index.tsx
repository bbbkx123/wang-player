import {useState, useEffect, useContext, useRef} from 'react'

import ProgressBar from '@/components/ProgressBar'
import {AppContext} from '@/store'

import './index.less'

const Player = () => {
  const audio = useRef<any>()
  const {count, dispatch, EventEmitter} = useContext<any>(AppContext)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [percent, setPercent] = useState<number>(0)

  const handlePlay = (needPlay: boolean) => {
    needPlay ? audio.current.play() : audio.current.pause()
    // this.$store.commit('SET_PLAYING', needPlay)
  }

  // const onEnded = () => {
  //   handlePlay(false)
  //   setCurrentTime(0)
  //   if (this.currentIndex < this.playlist.length - 1) {
  //       this.songChangeIndex = this.currentIndex + 1
  //   } else if (this.currentIndex === this.playlist.length - 1) {
  //       if (this.isLoopPlayList) {
  //           this.songChangeIndex = 0
  //       }
  //   }
  // }

  useEffect(() => {
    EventEmitter.addListener('progress-changing', () => {
      console.log('progress-changing');
      
    })
    EventEmitter.addListener('progress-change', () => {
      console.log('progress-change');
    })
  }, [])

  useEffect(() => {
    for (let i = 0 ; i < 10; i++) {
      setTimeout(() => {
        setPercent(i / 10)
        console.log(i / 10);
      }, i * 1000)
    }
  }, [])



  return (
    <div className="play">
      <div className="play--poster">
      play {count}
      </div>
      <div className="play--control">
        <ProgressBar percent={percent}></ProgressBar>
        {/* <progress-bar @progress-changing="progressChanging" @progress-change="progressChange" :precent="precent"></progress-bar> */}
        <span onClick={() => dispatch({type: 'count'})}>click</span>
      </div>
      {/* <audio ref={audio} onEnded={onEnded} onTimeupdate={_onTimeUpdate} onCanplay={onCanPlay} loop={loop}></audio> */}
    </div>
  )
}

export default Player