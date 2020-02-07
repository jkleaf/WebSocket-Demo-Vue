<template>
  <div>
    <el-container>
      <el-header height="60px">
        <el-button type="info" @click="quit" :disabled="!gameOver" class="quit">退出</el-button>
        <i class="fa fa-align-justify icon-2x collapse-aside" aria-hidden="true" @click="hideAside"></i>
      </el-header>
      <el-container>
        <el-main>
          <span></span>
          <canvas id="chessboard" width="510px" height="510px"></canvas>
        </el-main>
        <el-aside width="550px" :class="{'display-none':asideHidden}">
          <div style="height: 200px; border-bottom: 5px dashed #E9EEF3; margin-top: 15px">
            <el-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" :size="180"
                       style="margin-right: 30px"></el-avatar>
            <el-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" :size="180"
                       style="margin-left: 30px"></el-avatar>
          </div>
          <div style="height: 60px;">
            <el-button type="warning" class="proposeDraw" @click="proposeDraw">求和</el-button>
            <el-button type="danger" class="undo" @click="undo">悔棋</el-button>
          </div>
          <div class="tabs">
            <el-tabs tab-position="right" type="border-card" style="margin: 0 10px">
              <el-tab-pane label="聊天" class="chat-panel">
                <p style="display: flex; justify-content:center">
                  <el-tag type="success" size="small">#{{roomId}}号游戏房间闲聊</el-tag>
                </p>
                <div style="height: 200px;">
                  <ul id="chatPanel" style="height: 200px; overflow-y: scroll;">
                    <li v-for="msg in chatMsgList" class="chat-message">
                      <!--                    <i style="background-color: rgb(255, 193, 7);">o</i>-->
                      <!--                    <img :src=""/>-->
                      <span style="font-size: 10px; color: #7600ff; font-weight: bold;">
                      {{msg.sender}}
                    </span>
                      <p>
                        {{msg.content}}
                      </p>
                    </li>
                  </ul>
                </div>
                <div style="text-align: left; line-height:0; margin-top: 5px">
                  <el-input id="input" v-model="inputText" placeholder="请输入内容..." size="mini" style="width: 400px;"
                            type="textarea"
                            autosize></el-input>
                  <!--                  <img src="../assets/smile-wink.png" class="emoji" alt="">-->
                  <!--                  <i class="fa fa-smile-o emoji" aria-hidden="true"></i>-->
                  <!--:disabled="!currentFriend.id"-->
                  <!--                                    <div>-->
                  <el-popover
                    placement="left-start"
                    title="Emoji"
                    width="200px"
                    trigger="click">
                    <p v-for="i in 3">
                      <span v-for="j in 14" class="emoji-span" @click="sendEmoji(emoji[(i-1)*14+j])">
                        {{emoji[(i-1)*14+j]}}
                      </span>
                    </p>
                    <el-button size="small" slot="reference" class="emoji">表情</el-button>
                  </el-popover>
                  <!--                  </div>-->
                  <el-button size="small" type="primary" class="sendBtn" @click="sendMsg">发送</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="记录">

              </el-tab-pane>
              <el-tab-pane label="玩家">

              </el-tab-pane>

              <el-tab-pane label="设置">
                <div class="sound-dashboard">
                  <el-progress type="dashboard" :percentage="percentage" :color="colors"></el-progress>
                  <!--                  <div>-->
                  <!--                  <span style="display: flex">调节音量</span>-->
                  <!--                  </div>-->
                  <el-button-group class="adjust-sound">
                    <el-button icon="el-icon-minus" @click="decrease"></el-button>
                    <el-button icon="el-icon-plus" @click="increase"></el-button>
                  </el-button-group>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-aside>
      </el-container>
    </el-container>

  </div>
</template>

<script>
  import {hex_md5} from "../utils/md5";
  import api from "../utils";

  export default {
    name: "Room",
    data() {
      return {
        roomUid: '',
        currentUsersCount: 0,
        maxUsersCount: 0, //todo
        percentage: 10,
        chessGame: [], //todo
        chatMsgList: [],
        colors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ],
        emoji: [
          '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😛', '👎',
          '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '🙄', '😣', '😥', '😮', '😫', '😝', '💩',
          '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '😵', '😡', '😠', '🤬', '😷', '🤮', '🥳',
        ],
        chessBoard: '',
        lineWidth: 34,
        lineHeight: 34,
        chessBoardWidth: '', //todo 调整棋盘大小
        chessBoardHeight: '',
        context: '',
        chessBox: [],
        me: true, //todo
        gameOver: true,
        msg: '',
        asideHidden: false,
        soundDrawer: false,
        currentUser: this.$store.state.user,
        stompClient: this.$store.state.stomp,
        inputText: '',
      }
    },
    methods: {
      sendMsg() { //TODO
        // let historyMsg = localStorage.getItem(this.$store.state.user.username + '#room_all');
        // if (historyMsg == null) {
        //   historyMsg = [];
        //   historyMsg.push({})
        // } else {
        //
        // }
        const chatMsg = {type: 'CHAT', content: this.inputText, sender: this.currentUser.username};
        this.stompClient.send('/ws/' + this.roomUid + '/game/chat', {}, JSON.stringify(chatMsg));
        // this.msg = '';
        // this.updateChatPanel();
        // this.$store.state.stomp.send('/ws/sys', {}, 'fuck you'); //body: JSON
        this.updateChatPanel(chatMsg);
        this.inputText = '';
      },
      updateChatPanel(chatMsg) { //TODO
        this.chatMsgList.push(chatMsg);
        // let historyMsg = localStorage.getItem(this.currentUser.username + '#room_all')
        // if (historyMsg == null) {
        //   this.$store.commit('updateRoomMsgList', []); //TODO MUST HAVE A ROOM ID TO DISTINGUISH
        // } else {
        //   this.$store.commit('updateRoomMsgList', JSON.parse(historyMsg));
        // }
      },
      sendEmoji(emoji) {
        this.inputText += emoji;
      },
      createRoom() {
        api.requestWithToken("/room/" + this.roomUid, "post", {}, res => {
          if (res.data.code === 200) {
            this.$message({
              message: '你已成为房主',
              type: 'success'
            })
          }
        }, err => {
          this.$message({
            message: err.data, //todo
            type: 'error'
          })
        });
      },
      initChessBoard() {
        this.chessBoard = document.getElementById('chessboard');
        this.chessBoardWidth = 15 * this.lineWidth;
        this.chessBoardHeight = 15 * this.lineHeight;
        this.context = this.chessBoard.getContext('2d');
        //todo
        for (let i = 0; i < 15; i++) {
          this.chessBox[i] = [];
          for (let j = 0; j < 15; j++) {
            this.chessBox[i][j] = 0;
          }
        }
        for (let i = 0; i < 15; i++) {
          this.context.moveTo(this.lineWidth / 2 + i * this.lineWidth, this.lineHeight / 2);
          this.context.lineTo(this.lineWidth / 2 + i * this.lineWidth, this.chessBoardHeight - this.lineHeight / 2);
          this.context.stroke();
          this.context.moveTo(this.lineWidth / 2, this.lineHeight / 2 + i * this.lineHeight);
          this.context.lineTo(this.chessBoardWidth - this.lineWidth / 2, this.lineHeight / 2 + i * this.lineHeight);
          this.context.stroke();
        }
        let _this = this;
        //todo
        this.chessBoard.onclick = (e => {
          let x = e.offsetX;//相对于棋盘左上角的x坐标
          let y = e.offsetY;//相对于棋盘左上角的y坐标
          let i = Math.floor(x / this.lineWidth);
          let j = Math.floor(y / this.lineHeight);
          if (_this.chessBox[i][j] === 0) {
            _this.oneStep(i, j, _this.me);
            if (_this.me) {
              _this.chessBox[i][j] = 1;
            } else {
              _this.chessBox[i][j] = 2;
            }
            _this.me = !_this.me;//下一步白棋
          }
          this.stompClient.send("/ws/" + this.roomUid + "/game/chess", {}, "fuck you");
        })
      },
      //todo
      oneStep(i, j, k) {
        this.context.beginPath();
        //todo
        this.context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);//绘制棋子
        let g = this.context.createRadialGradient(15 + i * 30, 15 + j * 30, 13, 15 + i * 30, 15 + j * 30, 0);//设置渐变
        if (k) {              //k=true是黑棋，否则是白棋
          g.addColorStop(0, '#0A0A0A');//黑棋
          g.addColorStop(1, '#636766');
        } else {
          g.addColorStop(0, '#D1D1D1');//白棋
          g.addColorStop(1, '#F9F9F9');
        }
        this.context.fillStyle = g;
        this.context.fill();
        this.context.closePath();

      },
      proposeDraw() {

      },
      undo() {

      },
      increase() {
        this.percentage += 10;
        if (this.percentage > 100) {
          this.percentage = 100;
        }
      },
      decrease() {
        this.percentage -= 10;
        if (this.percentage < 0) {
          this.percentage = 0;
        }
      },
      quit() {
        this.$confirm("确认退出吗?", "提示", {}).then(() => {
          if (this.currentUsersCount === 1) {
            //todo
            // put request
            //remove msg
          }
          //todo rm sub
          this.stompClient.unsubscribe('/topic/' + this.roomUid + '/game/chat', frame => {
            // console.log(frame.body);
          }, fail => {

          });
          this.stompClient.unsubscribe('/topic/' + this.roomUid + '/game/chess', frame => {
            // console.log(frame.body);
          }, fail => {

          });
          this.$router.replace({path: '/home'});
        })
      },
      hideAside() {
        this.asideHidden = !this.asideHidden;
      },
      changeSound() {
        this.soundDrawer = !this.soundDrawer;
      },
      genUniqRoomId() {
        if (this.currentUsersCount === 0) {
          this.roomUid = hex_md5(Date.now()) + '$' + this.$route.params.roomId;
          console.log(this.roomUid);
          this.createRoom();
        }
        this.currentUsersCount++;
        this.maxUsersCount = this.currentUsersCount > this.maxUsersCount ? this.currentUsersCount : this.maxUsersCount;
      },
      enterRoom() {
        this.genUniqRoomId();
        this.stompClient.connect({}, success => {
          this.stompClient.subscribe('/topic/' + this.roomUid + '/game/chat', frame => {
            const msgJson = frame.body;
            console.log('this.currentUser.username => ' + this.currentUser.username);
            console.log('msgJson.sender => ' + msgJson.sender);
            if (this.currentUser.username !== msgJson.sender) {
              this.updateChatPanel(JSON.parse(msgJson)); //todo get list from redis ...
            }
          }, fail => {
          });
          this.stompClient.subscribe('/topic/' + this.roomUid + '/game/chess', frame => {
            // console.log(frame.body);
          }, fail => {
          });
        }, failed => {

        });
      },
      onChatMessageReceived() { //callback

      },
      onChessMessageReceived() {

      }
    },
    computed: {
      roomId() {
        return this.$route.params.roomId
      },
      // chatMsgList() {
      //   return this.$store.state.chatMsgList
      // }
    },
    watch: {
      chatMsgList() {
        document.getElementById('chatPanel').scrollTop = document.getElementById('chatPanel').scrollHeight;
      }
    },
    created() {
      document.title = '房间 ' + this.$route.params.roomId
    },
    mounted() {
      this.initChessBoard();
      this.enterRoom();
    }
  }
</script>

<style scoped>
  canvas {
    display: block;
    margin: 50px auto;
    box-shadow: -2px -2px 2px #F3F2F2, 5px 5px 5px #6F6767;
  }

  body {
    background-color: #E9EEF3;
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .collapse-aside {
    float: right;
    margin-top: 10px;
    font-size: xx-large;
  }

  .collapse-aside:hover {
    cursor: pointer;
    transform: scale(1.2);
  }

  .proposeDraw {
    margin-top: 10px;
    margin-left: 40%;
    float: left;
  }

  .undo {
    margin-top: 10px;
    float: left;
  }

  .tabs {
    margin-top: 20px;
  }

  .chat-panel {
    height: 250px;
  }

  .emoji {
    color: blueviolet;
    font-size: small;
    float: left;
    margin-top: 10px;
    /*padding: 20px;*/
  }

  .sendBtn {
    text-align: center;
    margin-top: 10px;
    margin-right: 15px;
    float: right;
  }

  .emoji-span:hover {
    cursor: pointer;
  }

  .sound-dashboard {
    width: 300px;
    height: 126px;
    display: inline;
  }

  .adjust-sound {
    width: 130px;
    height: 160px;
    margin-left: 50px;
  }

  .quit {
    float: left;
    margin-top: 10px;
  }

  .quit:hover {
    font-size: larger;
  }

  .display-none {
    display: none;
  }

  #chatPanel {
    list-style-type: none;
  }

  #chatPanel li {
    text-align: left;
    line-height: 1rem;
    padding: 5px 20px;
    margin: 0;
    border-bottom: 1px solid #f4f4f4;
  }

  .chat-message {
    line-height: 1.5rem;
    padding-left: 68px;
    position: relative;
  }

  .chat-panel i {
    position: absolute;
    width: 32px;
    height: 32px;
    left: 0;
    line-height: 32px;
    display: inline-block;
    text-align: center;
    border-radius: 50%;
  }

</style>
