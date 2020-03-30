import Player from 'components/Player'
import Main from 'components/Main'
import Menu from 'components/Menu'
import Header from 'components/Header'
import PageList from 'components/PageList'
import ProgressBar from 'components/ProgressBar'
import SimpleDetailsView from 'components/SimpleDetailsView'
import LoadingView from 'components/LoadingView'
import List from 'components/List'
import Page from 'components/Page'
import CommentList from 'components/CommentList'

// 路由页面
import Home from 'view/Home'
import RecommendOfDaily from 'view/RecommendOfDaily'
import FavouriteList from 'view/FavouriteList'
import PlayPage from 'view/PlayPage'
import ListDetails from 'view/ListDetails'
import OtherList from 'view/OtherList'

const componentsOfInstall = {
    Player,
    Main,
    Menu,
    Header,
    PageList,
    ProgressBar,
    SimpleDetailsView,
    LoadingView,
    List,
    Page,
    CommentList,
    // 路由
    Home,
    RecommendOfDaily,
    FavouriteList,
    PlayPage,
    ListDetails,
    OtherList
}

const components = {}
components.install = (Vue) => {
    Object.keys(componentsOfInstall).forEach((key) => {
        Vue.component(key, componentsOfInstall[key])
    })
}

export default components
