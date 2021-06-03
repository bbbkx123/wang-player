import {defineComponent} from "vue"
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Recommend from '../views/Recommend/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Recommend',
    component: Recommend,
  },
  {
    path: '/playlistdetails',
    name: 'PlayListDetails',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PlayListDetails/index.vue')
  },
  {
    path: '/playpage',
    name: 'PlayPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PlayPage/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
