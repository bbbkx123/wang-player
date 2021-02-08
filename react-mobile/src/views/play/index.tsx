import {useEffect, useContext} from 'react'

import ProgressBar from '@/components/ProgressBar'
import {AppContext} from '@/store'

import './index.less'

const Play = () => {
  const {count, dispatch, EventEmitter} = useContext<any>(AppContext)

  useEffect(() => {
    EventEmitter.addListener('progress-changing', () => {
      console.log('progress-changing');
      
    })
    EventEmitter.addListener('progress-change', () => {
      console.log('progress-change');
    })
  }, [])

  return (
    <div className="play">
      <div className="play--poster">
      play {count}
      </div>
      <div className="play--control">
        <ProgressBar precent={80}></ProgressBar>
        {/* <progress-bar @progress-changing="progressChanging" @progress-change="progressChange" :precent="precent"></progress-bar> */}
        <span onClick={() => dispatch({type: 'count'})}>click</span>
      </div>
    </div>
  )
}

export default Play