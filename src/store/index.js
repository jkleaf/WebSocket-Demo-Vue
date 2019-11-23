import Vue from 'vue'
import Vuex from 'vuex'
import '../lib/sockjs'
import '../lib/stomp'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:{
      username:''
    },
    stomp: null,
  },
  mutations:{
    login(state, user){
      state.user = user;
      window.sessionStorage.setItem('user', JSON.stringify(user));
    },
    logout(state){
      window.sessionStorage.removeItem('user');
      state.routes = [];
    },
  },
  actions:{
    // connect(context){
    //   context.state.stomp = Stomp.over(new SockJS("/ws/endpointChat"));
    //   context.state.stomp.connect({}, frame=> {
    //     context.state.stomp.subscribe("/user/queue/chat", message=> {
    //       var msg = JSON.parse(message.body);
    //       var oldMsg = window.localStorage.getItem(context.state.user.username + "#" + msg.from);
    //       if (oldMsg == null) {
    //         oldMsg = [];
    //         oldMsg.push(msg);
    //         window.localStorage.setItem(context.state.user.username + "#" + msg.from, JSON.stringify(oldMsg))
    //       } else {
    //         var oldMsgJson = JSON.parse(oldMsg);
    //         oldMsgJson.push(msg);
    //         window.localStorage.setItem(context.state.user.username + "#" + msg.from, JSON.stringify(oldMsgJson))
    //       }
    //       if (msg.from != context.state.currentFriend.username) {
    //         context.commit("addValue2DotMap", "isDot#" + context.state.user.username + "#" + msg.from);
    //       }
    //       //更新msgList
    //       var oldMsg2 = window.localStorage.getItem(context.state.user.username + "#" + context.state.currentFriend.username);
    //       if (oldMsg2 == null) {
    //         context.commit('updateMsgList', []);
    //       } else {
    //         context.commit('updateMsgList', JSON.parse(oldMsg2));
    //       }
    //     });
    //     context.state.stomp.subscribe("/topic/nf", message=> {
    //       context.commit('toggleNFDot', true);
    //     });
    //   }, failedMsg=> {
    //
    //   });
    // }
  }
})
