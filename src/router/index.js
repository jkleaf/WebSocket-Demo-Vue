import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import Login from '@/components/Login'
import UserInfo from "../components/UserInfo";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      hidden: true
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      hidden: true,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/user/info',
      name: 'UserInfo',
      component: UserInfo,
      hidden: true,
      meta: {
        requireAuth: true
      },
    },
  ],
  mode: 'history'
})
