import {useState, useContext, useEffect} from "react"
import { StoreContext } from "@/store";

import List from "@/components/List"

const PlayListDetails = () => {
  const {dispatch, playListDetail} = useContext<any>(StoreContext)

  const [listData, setListData] = useState([])

  useEffect(() => {
    if (playListDetail) {
      setListData(playListDetail.listData)
    } 
  }, [playListDetail])

  return (
    <div>
      playListDetails
      <List listType="details" data={listData}></List>
    </div>
  )
}

export default PlayListDetails