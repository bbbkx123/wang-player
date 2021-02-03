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
      <TabBar unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={false}>
        <TabBar.Item
            title="Life"
            key="Life"
            icon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }}
            />
            }
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
            />
            }
            selected={selectedTab === TAB[0]}
            badge={1}
            onPress={() => setSelectedTab(TAB[0])}
            data-seed="logId"
          >
            {Route1()}
          </TabBar.Item>
          <TabBar.Item
            title="Life"
            key="Life"
            icon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }}
            />
            }
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
            />
            }
            selected={selectedTab === TAB[1]}
            badge={1}
            onPress={() => setSelectedTab(TAB[1])}
            data-seed="logId"
          >
            {Route2()}
          </TabBar.Item> 
      </TabBar>
    </div>
  )
}

export default Recommend