import Vue from 'vue'
import Vuex from 'vuex'
import '../lib/sockjs'
import '../lib/stomp'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      username: '',
      password: '', //todo
    },
    stomp: null,
    roomMsgList: [], // contains game & chat

  },
  mutations: {
    login(state, user) {
      state.user = user;
      window.sessionStorage.setItem('user', JSON.stringify(user));
    },
    logout(state) {
      window.sessionStorage.removeItem('user');
      state.routes = [];
    },
    updateRoomMsgList(state, roomMsgList) {
      state.roomMsgList = roomMsgList;
    }
  },
  actions: {
    connect(context) {
      context.state.stomp = Stomp.over(new SockJS("/ws/endpoint"));
      context.state.stomp.connect({}, success => { //全局                
        
        context.state.stomp.subscribe("/topic/home", frame => { //接收服务端消息推送(定时+系统消息)
          console.log(frame.body);
        });
      }, fail => {

      })
    }
  }
})
