import {BrowserRouter as Router, Route} from 'react-router-dom'

import Play from '@/views/play'
import Recommend from '@/views/recommend'

const AppRoute = () => {
  return (
    <div>
      <Router>
        <Route path="/play" component={Play}></Route>
        <Route path="/recommend" component={Recommend}></Route>
      </Router>
    </div>
  )
}

export default AppRoute