import {useContext} from 'react'

import {AppContext} from '@/store'

import './index.less'

const Play = () => {
  const {count, dispatch, $emit} = useContext<any>(AppContext)

  return (
    <div className="play">
      <div className="play--poster">
      play {count}
      </div>
      <div className="play--control">
        <span onClick={() => dispatch({type: 'count'})}>click</span>
      </div>
    </div>
  )
}

export default Play