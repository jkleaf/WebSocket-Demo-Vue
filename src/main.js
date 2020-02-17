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
import {postJSONRequest} from './utils/api'
import {requestWithToken} from './utils/api'

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.prototype.postRequestWithToken = postRequestWithToken;
Vue.prototype.requestWithoutToken = requestWithoutToken;
Vue.prototype.requestWithToken = requestWithoutToken;
Vue.prototype.postJSONRequest = postJSONRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;

router.beforeEach((to, from, next) => {
    if (to.name === 'Login') {
      next();
      return;
    }
    let name = store.state.user.username;
    if (name == null) {
      next();
    } else {
      store.dispatch('connect');
      next();
    }
  }
);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
