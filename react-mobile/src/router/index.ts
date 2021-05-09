import PlayPage from "@/views/PlayPage"
import Recommend from "@/views/Recommend"
import PlayListDetails from "@/views/PlayListDetails"


const RouterConfig: any[] = [
  {
    path: "/play",
    component: PlayPage,
    sceneConfig: {
      enter: "from-bottom",
      exit: "to-bottom",
    },
  },
  {
    path: "/",
    component: Recommend,
    sceneConfig: {
      enter: "from-bottom",
      exit: "to-bottom",
    },
  },
  {
    path: "/playlistdetails",
    component: PlayListDetails,
    sceneConfig: {
      enter: "from-bottom",
      exit: "to-bottom",
    },
  },
]

export default RouterConfig