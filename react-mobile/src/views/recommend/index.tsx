import {useState} from 'react'
// import {Route} from 'react-router-dom'
import {TabBar} from 'antd-mobile'

const Route1 = () => {
  return (
    <div>Route1</div>
  )
}

const Route2 = () => {
  return (
    <div>Route2</div>
  )
}

const TAB = ['FIRST', 'SECOND']

const Recommend = () => {
  const [selectedTab, setSelectedTab] = useState<String>(TAB[0])
  return (
    <div>
     
    </div>
  )
}

export default Recommend