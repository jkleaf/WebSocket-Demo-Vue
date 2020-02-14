<template>
  <div>
    <el-button @click="send1">Send1</el-button>
    <el-button @click="send2">Send2</el-button>
    <div id="msg">

    </div>
    <div>
      {{list}}
    </div>
    <div class="">
      {{a}}
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        stompClient: Stomp.over(new SockJS("/ws/endpoint")),
        list: [],
        a: false,
      }
    },
    // name: "Test"
    methods: {
      send1() {
        const msg = "Fuck You";
        this.stompClient.send("/ws/friend/chat", {}, msg);
      },
      send2() {
        const msg = "Fuck You";
        this.stompClient.send("/ws/sys", {}, msg);
        this.a=!this.a;
      },
      connectUser() {
        this.stompClient.connect({}, success => {
          this.stompClient.subscribe("user/queue/friend/chat", msg => {
            console.log("user/queue/friend/chat => " + msg.body);
            document.getElementById('msg').append(msg.body + '<br>');
          }, fail => {
            console.log(fail);
          })
        });
      },
      connectTopic() {
        this.stompClient.connect({}, success => {
          this.stompClient.subscribe("/topic/home", msg => {
            console.log("topic/home => " + msg.body);
            document.getElementById('msg').append(msg.body + '<br>');
          }, fail => {
            console.log(fail);
          })
        });
        // this.stompClient.send("/ws/sys", {}, 'fuck you');
      },
      ranking() {
        this.stompClient.connect({}, succcess => {
          this.stompClient.subscribe('/topic/ranking', frame => {
            this.list=frame.body;
          }, fail => {

          })
        }, fail => {

        });
      },
    },
    mounted() {
      // this.connectUser();
      // this.connectTopic();
      this.ranking();
    },
    watch:{
      a(){
        sessionStorage['a']=this.a;
      }
    }
  }
</script>

<style scoped>

</style>
