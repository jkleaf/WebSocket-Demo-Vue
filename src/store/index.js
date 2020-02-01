import Vue from 'vue'
import Vuex from 'vuex'
import '../lib/sockjs'
import '../lib/stomp'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      username: '',
      //password: '', //todo
    },
    stomp: null,
    roomMsgList: [],

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
      context.state.stomp = Stomp.over(new SockJS("/ws"));
      context.state.stomp.connect({}, success => {
        context.state.stomp.subscribe("/topic/game/chat", msg => {
          let message = JSON.parse(msg.body);
          let historyMsg = localStorage.getItem(message.sender + '#room_all');
          if (historyMsg == null) {
            historyMsg = [];
            historyMsg.push(message);
            localStorage.setItem(message.sender + '#room_all', JSON.stringify(historyMsg));
          } else {
            let historyMsgJson = JSON.parse(historyMsg);
            historyMsgJson.push(message);
            localStorage.setItem(message.sender + '#room_all', JSON.stringify(historyMsgJson));
          }

          let historyMsg2 = localStorage.getItem(message.sender + '#room_all');
          if (historyMsg2 == null) {
            context.commit('updateRoomMsgList', []);
          } else {
            context.commit('updateRoomMsgList', JSON.parse(historyMsg2));
          }
        });
        context.state.stomp.subscribe("/topic/game/chess", msg => {

        });
        context.state.stomp.subscribe("/user/queue/friend/chat", msg => {
          let message = JSON.parse(msg.body);
          let historyMsg = localStorage.getItem(context.state.user.username + '#' + message.sender);
          if (historyMsg == null) {
            historyMsg = [];
            historyMsg.push(message);
            localStorage.setItem(context.state.user.username + '#' + message.sender, JSON.stringify(historyMsg));
          } else {
            let historyMsgJson = JSON.parse(historyMsg);
            historyMsgJson.push(message);
            localStorage.setItem(context.state.user.username + '#' + message.sender, JSON.stringify(historyMsgJson));
          }

        });
        context.state.stomp.subscribe("/topic/home", msg => {

        });
      }, fail => {

      })
    }
  }
})
