import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import Login from '@/components/Login'
import UserInfo from "../components/UserInfo";
import Hall from "../components/Hall"
import Statistics from "../components/Statistics"
import Forum from "../components/Forum"
import Test from "../components/Test"
import Room from "../components/Room"

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
      },
      children: [
        {
          path: '/hall',
          name: 'Hall',
          component: Hall
          //todo
        },
        {
          path: '/statistics',
          name: 'Statistics',
          component: Statistics
        },
        {
          path: '/forum',
          name: 'Forum',
          component: Forum
        }
      ]
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
    {
      path: '/room/:roomId',
      name: 'Room',
      component: Room,
      meta: {
        title: '房间'
      }
    },
    {
      path: '/test',
      name: 'Test',
      component: Test,
    }
  ],
  // mode: 'history' 打包问题
})
