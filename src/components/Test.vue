<template>
  <div>
    <el-button @click="send">Send</el-button>
    <div id="msg">

    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        stompClient: '',
      }
    },
    // name: "Test"
    methods: {
      send() {
        const msg = "Fuck You";
        this.$store.state.stomp.send("/ws/friend/chat", {}, msg);
      },
      connect() {
        this.stompClient = Stomp.over(new SockJS("/ws/endpoint"));
        this.stompClient.connect({}, success => {
          this.stompClient.subscribe("/user/queue/friend/chat", msg => {
            console.log("/user/queue/friend/chat => " + msg.body);
            document.getElementById('msg').append(msg.body);
          })
        });
      }
    },
    mounted() {
      this.connect();
    }
  }
</script>

<style scoped>

</style>
