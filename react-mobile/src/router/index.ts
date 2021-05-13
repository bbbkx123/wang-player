import PlayPage from "@/views/PlayPage"
import Recommend from "@/views/Recommend"
import PlayListDetails from "@/views/PlayListDetails"
import Comment from "@/views/Comment"
import Search from "@/views/Search"


const RouterConfig: any[] = [
  {
    path: "/play",
    component: PlayPage,
    exact: false,
    sceneConfig: {
      enter: "from-bottom",
      exit: "to-bottom",
    },
  },
  {
    path: "/",
    component: Recommend,
    exact: true,
    sceneConfig: {
      enter: "from-bottom",
      exit: "to-bottom",
    },
  },
  {
    path: "/playlistdetails",
    component: PlayListDetails,
    exact: false,
    sceneConfig: {
      enter: "from-right",
      exit: "to-left",
    },
  },
  {
    path: "/search",
    component: Search,
    exact: false,
    sceneConfig: {
      enter: "from-right",
      exit: "to-left",
    },
  },
  {
    path: "/comment",
    component: Comment,
    exact: false,
    sceneConfig: {
      enter: "from-right",
      exit: "to-left",
    },
  },
]

export default RouterConfig