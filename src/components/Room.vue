<template>
  <div>
    <el-container>
      <el-header height="60px">
        <el-button type="info" @click="quit" :disabled="!gameOver" class="quit">退出</el-button>
        <el-button type="primary" @click="chooseP1" :disabled="player1!==''" class="quit">{{p1Choose?'取消选择':'选择P1'}}</el-button>
        <!--Test-->
        <el-button type="primary" @click="chooseP2" :disabled="player2!==''" class="quit">{{p2Choose?'取消选择':'选择P2'}}</el-button>
        <el-button type="primary" @click="readyForP1" :disabled="player1!=currentUsername" class="quit">{{p1Ready?'取消准备':'P1准备'}}</el-button>
        <el-button type="primary" @click="readyForP2" :disabled="player2!=currentUsername" class="quit">{{p2Ready?'取消准备':'P2准备'}}</el-button>
        <el-button type="primary" @click.once="startGame" :disabled="gameStart">{{gameStart?'取消':'开始游戏'}}</el-button>
        <!--Test-->
        <i class="fa fa-align-justify icon-2x collapse-aside" aria-hidden="true" @click="hideAside"></i>
      </el-header>
      <el-container>
        <el-main>
          <span></span>
          <canvas id="chessboard" width="510px" height="510px"></canvas> <!--todo dynamically change-->
        </el-main>
        <el-aside width="550px" :class="{'display-none':asideHidden}">
          <div style="height: 200px; border-bottom: 5px dashed #E9EEF3; margin-top: 15px">
            <el-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" :size="150"
                       style="margin-right: 30px"></el-avatar>
            <el-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" :size="150"
                       style="margin-left: 30px"></el-avatar>
          </div>
          <div style="height: 60px;">
            <el-button type="warning" class="proposeDraw" @click="proposeDraw">求和</el-button>
            <el-button type="danger" class="undo" @click="undo">悔棋</el-button>
            <el-button type="primary" class="sente" @click="sente=!sente">先手切换</el-button>
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
                <div style="height: 200px;">
                  <ul id="chessRecordPanel" style="height: 200px; overflow-y: scroll;">
                    <li v-for="record in chessRecordList" class="chess-record">
                      <!--                    <i style="background-color: rgb(255, 193, 7);">o</i>-->
                      <!--                    <img :src=""/>-->
                      <span style="font-size: 10px; color: #7600ff; font-weight: bold;">
                        {{record.player}} : ({{record.x}},{{record.y}}) [{{chessBox[record.x][record.y]}}]
                      </span>
                    </li>
                  </ul>
                </div>
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
        chessList: [], //todo
        chatMsgList: [],
        chessBoard: '',
        chessRecordList: [],
        lineWidth: 34,
        lineHeight: 34,
        chessBoardWidth: '', //todo 调整棋盘大小
        chessBoardHeight: '',
        context: '',
        chessBox: [],
        selfTurn: false, //todo
        undoTimes: 1,
        gameOver: true,
        msg: '',
        asideHidden: false,
        soundDrawer: false,
        currentUser: this.$store.state.user,
        currentUsername: sessionStorage['username'],
        currentUserAvatar: '',
        stompClient: this.$store.state.stomp,
        inputText: '',
        player1: '',
        player2: '',
        isP1: false,
        isP2: false,
        p1Avatar: this.defaultAvatarUrl,
        p2Avatar: this.defaultAvatarUrl,
        p1Choose: false,
        p2Choose: false,
        p1Ready: false,
        p2Ready: false,
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
        defaultAvatarUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        sente: false,
        winner: '',
        turn: false,
        roomOwner: '',
        gameStart: false,
        gameReady: false,
      }
    },
    methods: {
      chooseP1() { //set disabled
        this.p1Choose=!this.p1Choose;
        this.isP1 = true;
        this.isP2 = false;
        //todo assume p1 sente
        this.sente = true;
        //todo assume init p1's selfTurn true when game start
        this.selfTurn = true;
        this.player1 = this.currentUsername;
        // this.player2='';
        const flag = this.player1 === this.player2;
        this.choosePlayers('1', this.player1,this.p1Choose);
        // this.choosePlayers('2','');
      },
      chooseP2() { //set disabled
        this.p2Choose=!this.p2Choose;
        this.isP2 = true;
        this.isP1 = false;
        //todo
        this.sente = false;
        this.player2 = this.currentUsername;
        // this.player1='';
        const flag = this.player1 === this.player2;
        this.choosePlayers('2', this.player2,this.p2Choose);
        // this.choosePlayers('1','');
      },
      readyForP1(){
        this.p1Ready=!this.p1Ready;
        this.ready(this.p1Ready);
      },
      readyForP2(){
        this.p2Ready=!this.p2Ready;
        this.ready(this.p2Ready);
      },
      ready(ready) { //TODO
        this.stompClient.send('/ws/' + this.roomUid + '/game/choice', {},JSON.stringify({
          type: 'READY',
          content: JSON.stringify({
            ready: ready,
            username: this.currentUsername
          })
        }))
      },
      checkReady(){
        return this.p1Ready && this.p2Ready;
      },
      startGame() { //TODO
        if (this.ready && this.roomOwner === this.currentUsername) {
          this.stompClient.send('/ws/' + this.roomUid + '/game/common/notification', {
            type: 'START', content: this.currentUsername
          })
          this.gameStart = true;
        } else {
          //TODO show no-prepared message or disable the btn then hint owner
        }
      },
      async choosePlayers(player, username,confirm) { //TODO cancel
        await this.stompClient.send('/ws/' + this.roomUid + '/game/choice', {}, JSON.stringify({
          type: 'CHOICE',
          content: JSON.stringify({
            player: player,
            username:username,
            confirm: confirm
          })
        }));
      },
      sendMsg() { //TODO
        // let historyMsg = localStorage.getItem(this.$store.state.user.username + '#room_all');
        // if (historyMsg == null) {
        //   historyMsg = [];
        //   historyMsg.push({})
        // } else {
        //
        // }
        const chatMsg = {type: 'CHAT', content: this.inputText, sender: this.currentUsername};
        this.stompClient.send('/ws/' + this.roomUid + '/game/chat', {}, JSON.stringify(chatMsg));
        // this.msg = '';
        // this.updateChatPanel();
        // this.$store.state.stomp.send('/ws/sys', {}, 'fuck you'); //body: JSON
        this.updateChatPanel(chatMsg);
        this.inputText = '';
      },
      updateChatPanel(chatMsg) { //TODO
        if (chatMsg !== '') {
          this.chatMsgList.push(chatMsg);
        }
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
      createRoom() { //TODO
        api.requestWithToken("/room/" + this.roomUid, "post", {}, res => {
          if (res.data.code === 200) {
            this.roomOwner = this.currentUsername;
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
          if (_this.selfTurn && (_this.isP1 || _this.isP2)) {
            let x = e.offsetX;
            let y = e.offsetY;
            let i = Math.floor(x / this.lineWidth);
            let j = Math.floor(y / this.lineHeight);
            if (_this.chessBox[i][j] === 0) {
              _this.step(i, j, true, this.currentUsername);
              _this.selfTurn = false;
              const chessMsg = {
                type: this.judgeSuccess(i, j) ? 'OVER' : 'COORDINATE',
                content: JSON.stringify({x: i, y: j}),
                sender: _this.currentUsername
              };
              this.stompClient.send("/ws/" + this.roomUid + "/game/chess", {}, JSON.stringify(chessMsg)); // i j
            }
          }
        })
      },
      step(i, j, flag, player) {
        this.context.beginPath();
        //todo
        this.context.arc(this.lineWidth / 2 + i * this.lineWidth, this.lineHeight / 2 + j * this.lineHeight, 13, 0, 2 * Math.PI);
        let g = this.context.createRadialGradient(
          this.lineWidth / 2 + i * this.lineWidth, this.lineHeight / 2 + j * this.lineHeight, 13,
          this.lineWidth / 2 + i * this.lineWidth, this.lineHeight / 2 + j * this.lineHeight, 0);
        if (flag) {
          if (this.isP1) { // p1
            this.chessBox[i][j] = 1;
          } else { // p2
            this.chessBox[i][j] = 2;
          }
          if (this.sente) {
            g.addColorStop(0, '#0A0A0A');// black
            g.addColorStop(1, '#636766');
          } else {
            g.addColorStop(0, '#D1D1D1');// white
            g.addColorStop(1, '#F9F9F9');
          }
        } else {
          if (!this.isP1) {
            this.chessBox[i][j] = 1;
          } else {
            this.chessBox[i][j] = 2;
          }
          if (!this.sente) {
            g.addColorStop(0, '#0A0A0A');
            g.addColorStop(1, '#636766');
          } else {
            g.addColorStop(0, '#D1D1D1');
            g.addColorStop(1, '#F9F9F9');
          }
        }
        this.context.fillStyle = g;
        this.context.fill();
        this.context.closePath();
        this.chessList.push({x: i, y: j}); //todo
        this.chessRecordList.push({
          player: player,
          x: i,
          y: j
        });
      },
      updateRecordPanel(chessRecord) { //todo
        this.chessRecordList.push(chessRecord);
      },
      proposeDraw() {
        this.$confirm("确定发起求和吗？", "提示", {}).then(() => {
          const chessMsg = {
            type: 'SENTE',
            content: '玩家' + (this.isP1 ? '1' : '2') + '发起求和',
            sender: this.currentUsername
          };
          this.stompClient.send('', {}, JSON.stringify(chessMsg));
          this.$loading({
            lock: true,
            text: '正在等待对方回应...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        });
      },
      undo() {
        const _this = this;
        if (this.undoTimes === 0) {
          this.$message({
            message: '悔棋次数已用尽！',
            type: 'warning'
          })
        }
        const chessMsg = {
          type: 'UNDO',
          content: '玩家' + (this.isP1 ? '1' : '2') + '发起悔棋',
          sender: this.currentUsername
        };
        this.stompClient.send('/ws/' + this.roomUid + '/game/chess', {}, JSON.stringify(chessMsg));
        this.$confirm("确定要悔棋吗？", "提示", {}).then(() => {
          this.undoTimes--;
          //todo chessbox
          const lastChess = _this.chessList.pop();
          _this.chessBox[lastChess.x][lastChess.y] = 0;
          //repaint()
        });
      },
      yield() {
        this.$confirm("确定要放弃吗？", "提示", {}).then(() => {
          const chessMsg = {
            type: 'YIELD',
            content: '玩家' + (this.isP1 ? '1' : '2') + '放弃',
            sender: this.currentUsername
          };
          this.stompClient.send('', {}, JSON.stringify(chessMsg));
        });
      },
      disableBtns() { //after game start

      },
      judgeSuccess(x, y) {
        const decision = this.chessBox[x][y];
        let cnt = 1, row = x, col = y;
        while (--row >= 0 && this.chessBox[row][col] === decision) ++cnt;
        row = x;
        while (++row < 15 && this.chessBox[row][col] === decision) ++cnt;
        if (cnt >= 5) {
          this.gameover();
          return true;
        }
        cnt = 1, row = x, col = y;
        while (--col >= 0 && this.chessBox[row][col] === decision) ++cnt;
        col = y;
        while (++col < 15 && this.chessBox[row][col] === decision) ++cnt;
        if (cnt >= 5) {
          this.gameover();
          return true;
        }
        cnt = 1, row = x, col = y;
        while (--col >= 0 && --row >= 0 && this.chessBox[row][col] === decision) ++cnt;
        row = x, col = y;
        while (++col < 15 && ++row < 15 && this.chessBox[row][col] === decision) ++cnt;
        if (cnt >= 5) {
          this.gameover();
          return true;
        }
        cnt = 1, row = x, col = y;
        while (++row < 15 && --col >= 0 && this.chessBox[row][col] === decision) ++cnt;
        row = x, col = y;
        while (--row >= 0 && ++col < 15 && this.chessBox[row][col] === decision) ++cnt;
        if (cnt >= 5) {
          this.gameover();
          return true;
        }
      },
      gameover() { //todo
        this.gameOver = true;
        // this.stompClient.send('/ws/' + this.roomUid + '/game/common/notification', {
        //   type: 'FINISH', content: this.winner
        // })
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
          this.sendLeaveMsg();
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
          this.clearRoomInfo();
          this.$router.replace({path: '/home'});
        })
      },
      sendLeaveMsg() {
        this.stompClient.send('/ws/' + this.roomUid + '/game/chat', {}, JSON.stringify({
          type: 'LEAVE', content: '', sender: this.currentUsername
        }));
      },
      clearRoomInfo() {
        //todo after room initialized or game finished
        this.gameOver = false;
        //this.isP1=''; //if quit

      },
      hideAside() {
        this.asideHidden = !this.asideHidden;
      },
      changeSound() {
        this.soundDrawer = !this.soundDrawer;
      },
      genUniqRoomId() {
        if (this.currentUsersCount === 0) { //TODO check room owner from server
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
            const msg = JSON.parse(frame.body);
            console.log('this.currentUser.username => ' + this.currentUsername/*this.currentUser.username*/);
            console.log('msg.sender => ' + msg.sender);
            if (msg.type === 'CHAT') {
              if (this.currentUsername !== msg.sender) {
                this.updateChatPanel(msg); //todo get list from redis or sessionStorage...
              }
            } else if (msg.type === 'JOIN') {
              console.log(msg.sender + 'join');
              if (this.currentUsername !== msg.sender) {
                this.$message({
                  message: msg.sender + '加入了房间',
                  type: 'success'
                })
              }
            } else if (msg.type === 'LEAVE') {
              console.log(msg.sender + ' leave');
              this.$message({
                message: (this.currentUsername === msg.sender ? '你' : msg.sender) + '离开了房间',
                type: 'success',
              });
            }
          }, fail => {
          });
          this.stompClient.subscribe('/topic/' + this.roomUid + '/game/chess', frame => {
            const msg = JSON.parse(frame.body);
            const content = JSON.parse(msg.content);
            const isOver = this.declareOver(msg);
            console.log('selfTurn => ' + this.selfTurn);
            console.log('over => ' + isOver);
            if (this.currentUsername !== msg.sender) {
              if (!this.selfTurn && (this.isP1 || this.isP2)) {
                this.step(content.x, content.y, false, msg.sender);
                if (!isOver) {
                  this.selfTurn = true;
                  this.$message({
                    message: '轮到你了',
                    type: 'success'
                  })
                }
              } else {
                this.step(content.x, content.y, this.turn, msg.sender);
                this.turn = !this.turn;
                if (!isOver) {
                  this.$message({
                    message: '等待玩家' + msg.sender + '下子',
                    type: 'success'
                  })
                }
              }
            }
          }, fail => {
          });
          this.stompClient.subscribe('/topic/' + this.roomUid + '/game/choice', frame => { //async
            const msg = JSON.parse(frame.body);
            if(msg.type==='CHOICE'){
            const choice = JSON.parse(msg.content);
            //TODO cancel selection
            if (choice.player === '1') {
              this.player1 = choice.username;
              if(this.player2===choice.username){
                this.player2='';
              }
                this.$message({
                  message: '玩家' + this.player1 + '选择了1P',
                  type: 'success'
                });
            } else if (choice.player === '2') {
              this.player2 = choice.username;
              if(this.player1===choice.username){
                this.player1='';
              }
                this.$message({
                  message: '玩家' + this.player2 + '选择了2P',
                  type: 'success'
                });
            }
          }else if(msg.type==='READY'){ //p1 || p2
            const content=JSON.parse(msg.content);
            if(content.ready==='true'){
              if(this.player1===content.username){
                this.p1Ready=true;
              }else{
                this.p2Ready=true;
              }
            }else if(content.ready==='false'){
              if(this.player1===content.username){
                this.p1Ready=false;
              }else{
                this.p2Ready=false;
              }
            }
          }
          });
          this.stompClient.subscribe('/topic/' + this.roomUid + '/game/common/notification', frame => {
            const notification = frame.body;
            //TODO
            //if(notification==='')

          }, fail => {

          })
        }, fail => {

        });
        // TODO join
        // this.stompClient.send('/ws/'+this.roomUid+'/topic/game/chat',{},JSON.stringify({
        //   type: 'JOIN',
        //   content: '',
        //   sender: this.currentUsername
        // }));
      },
      declareOver(msg) {
        if (msg.type === 'OVER') {
          const winner = msg.sender;
          this.winner = winner;
          const flag = this.currentUsername !== winner;
          if (flag) {
            this.gameover();
          }
          this.$message({
            message: '游戏结束,' + (flag ? '玩家' + winner : '恭喜你') + '取得了胜利！',
            type: 'success'
          });
          return true;
        } else {
          return false;
        }
      },
      onChatMessageReceived() { //callback

      },
      onChessMessageReceived() {

      },
      setPlayer(option) {
        if (option === 1 && this.player1 !== '') {
          this.player1 = this.currentUsername;
          this.p1Avatar = this.currentUserAvatar;
        } else if (option === 2 && this.player2 !== '') {
          this.player2 = this.currentUsername;
          this.p2Avatar = this.currentUserAvatar;
        }
      },
      rmPlayer(option) { //todo
        if (option === 1) {
          this.player1 = '';
          this.p1Avatar = this.defaultAvatarUrl;
        } else if (option === 2) {
          this.player2 = '';
          this.p2Avatar = this.defaultAvatarUrl;
        }
      },
      render() { //todo

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
        this.$nextTick(() => {
          document.getElementById('chatPanel').scrollTop = document.getElementById('chatPanel').scrollHeight;
        })
      }
    },
    created() {
      document.title = '房间 ' + this.$route.params.roomId
    },
    mounted() {
      this.initChessBoard();
      this.enterRoom(); //todo in hall page
      this.render();
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

  .sente {
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

  #chessRecordPanel {
    list-style-type: none;
  }

  #chessRecordPanel li {
    text-align: left;
    line-height: 1rem;
    padding: 5px 20px;
    margin: 0;
    border-bottom: 1px solid #f4f4f4;
  }

  .chess-record {
    line-height: 1.5rem;
    padding-left: 68px;
    position: relative;
  }
</style>
