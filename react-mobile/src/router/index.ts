import {lazy} from "react"

// import PlayPage from "@/views/PlayPage"
// import Recommend from "@/views/Recommend"
// import PlayListDetails from "@/views/PlayListDetails"
// import Comment from "@/views/Comment"
// import Search from "@/views/Search"


const RouterConfig: any[] = [
  {
    path: "/play",
    component: lazy(() => import("@/views/PlayPage")),
    exact: false,
    sceneConfig: {
      enter: "from-bottom",
      exit: "to-bottom",
    },
  },
  {
    path: "/",
    component: lazy(() => import("@/views/Recommend")),
    exact: true,
    sceneConfig: {
      enter: "from-bottom",
      exit: "to-bottom",
    },
  },
  {
    path: "/playlistdetails",
    component: lazy(() => import("@/views/PlayListDetails")),
    exact: false,
    sceneConfig: {
      enter: "from-right",
      exit: "to-left",
    },
  },
  {
    path: "/search",
    component: lazy(() => import("@/views/Search")),
    exact: false,
    sceneConfig: {
      enter: "from-right",
      exit: "to-left",
    },
  },
  {
    path: "/comment",
    component: lazy(() => import("@/views/Comment")),
    exact: false,
    sceneConfig: {
      enter: "from-bottom",
      exit: "to-bottom",
    },
  },
]

export default RouterConfig