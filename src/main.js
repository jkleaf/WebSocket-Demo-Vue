// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import {postRequestWithToken} from './utils/api'
import {getRequest} from './utils/api'
import {postRequest} from './utils/api'
import {deleteRequest} from './utils/api'
import {putRequest} from './utils/api'
import {requestWithoutToken} from './utils/api'
import {requestWithToken} from './utils/api'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.postRequestWithToken = postRequestWithToken;
Vue.prototype.requestWithoutToken = requestWithoutToken;
Vue.prototype.requestWithToken = requestWithoutToken;
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, //把 store 的实例注入所有的子组件
  components: {App},
  template: '<App/>'
})
