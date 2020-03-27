import Vue from 'vue'
import Router from 'vue-router'
import Main from 'components/Main'

import Home from 'view/Home'
import RecommendOfDaily from 'view/RecommendOfDaily'
import FavouriteList from 'view/FavouriteList'
import PlayPage from 'view/PlayPage'
import ListDetails from 'view/ListDetails'
import Search from 'view/Search'
import OtherList from 'view/OtherList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'Home'
    }, {
      path: '/Main',
      name: 'Main',
      component: Main,
      children: [ 
        {
          path: '',
          component: FavouriteList
        }, {
          path: 'FavouriteList',
          name: 'FavouriteList',
          component: FavouriteList
        }, {
          path: 'Home',
          name: 'Home',
          component: Home
        }, {
          path: 'RecommendOfDaily',
          name: 'RecommendOfDaily',
          component: RecommendOfDaily
        }, {
          path: 'ListDetails/:listid',
          name: 'ListDetails',
          component: ListDetails
        }, {
          path: 'Search',
          name: 'Search',
          component: Search
        }, {
          path: 'OtherList',
          name: 'OtherList',
          component: OtherList
        }
      ]
    }, {
      path: '/PlayPage',
      name: 'PlayPage',
      component: PlayPage
    }
  ]
})
