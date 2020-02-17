<template>
  <el-container>
    <el-header style="text-align: right; font-size: 20px; height: 75px">
      <el-button @click="createRoom" class="create-room">创建房间</el-button>
      <el-badge :value="'99+'" class="item">
        <el-button size="large" @click="openReplyNotification">回复</el-button>
      </el-badge>
      <el-badge :value="2" class="item" type="primary">
        <el-button size="large">系统消息</el-button>
      </el-badge>
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>do something</el-dropdown-item>
          <el-dropdown-item>修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--        <div class="demo-basic&#45;&#45;circle">-->
      <!--          <div class="block">-->
      <el-avatar :size="50" :src="circleUrl" @click="drawer = true"></el-avatar>
      <span @click="drawer = true" class="me">{{user.username}}</span>
      <!--          </div>-->
      <!--        </div>-->
    </el-header>
    <el-container>
      <el-aside style="background-color: #d3dce6">
        <el-table
          :data="rankingList"
          style="width: 100%"
          :default-sort="{prop: 'score', order: 'descending'}"
          max-height="700"
        >
          <!--          <el-table-column-->
          <!--            prop="rank"-->
          <!--            label="排行"-->
          <!--            sortable-->
          <!--            width="150"-->
          <!--            style="background-color: #d3dce6">-->
          <!--          </el-table-column>-->
          <el-table-column
            prop="username"
            label="玩家"
            sortable
            width="150"
            style="background-color: #d3dce6"
          ></el-table-column>
          <el-table-column
            prop="score"
            label="积分"
            sortable
            width="150"
            style="background-color: #d3dce6"
          ></el-table-column>
        </el-table>
      </el-aside>
      <el-container>
        <el-main style="background-color: rgb(238, 241, 246); height: 100vh;">
          <el-row :gutter="20" v-for="i in rows" :key="i">
            <el-col :span="6" v-for="j in 4" :key="j">
              <div class="grid-content bg-purple">
                <span @click="roomClicked((i-1)*4+j)" class="room-span">Room {{(i-1)*4+j}}</span>
                <!--                <route-link :to="'/room/'+roomId"></route-link>-->
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6" v-for="j in columns" :key="j">
              <div class="grid-content bg-purple">
                <span @click="roomClicked(4*(rows)+j)" class="room-span">Room {{(rows)*4+j}}</span>
                <!--                <route-link :to="'/room/'+roomId"></route-link>-->
              </div>
            </el-col>
          </el-row>
          <el-pagination background layout="prev, pager, next" :total="1000" class="pagination"></el-pagination>
          <!--TODO-->
        </el-main>
      </el-container>
      <el-drawer title="个人信息" :visible.sync="drawer" :direction="direction">
        <div>
          <span @click="userDetails">查看详细信息</span>
        </div>
        <span>我来了</span>
      </el-drawer>
      <!--      <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>-->
    </el-container>
  </el-container>
</template>

<script>
import api from "../utils";
import { hex_md5 } from "../utils/md5";
export default {
  data() {
    return {
      stompClient: this.$store.state.stomp,
      user: {
        username: sessionStorage["username"]
        //todo
      },
      drawer: false,
      direction: "rtl",
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      squareUrl:
        "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      rankingList: [],
      rows: 0,
      columns: 0,
      curRoomsCount: 0,
      roomUid: "",
      roomId: "",
      curRooms: []
    };
  },
  methods: {
    getHistoryData(){
      //sessionStorage      
    },
    logout: function() {
      const _this = this;
      this.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          _this.$router.replace("/");
        })
        .catch(() => {});
    },
    openReplyNotification: function() {
      this.$notify.info({
        title: "消息",
        message: this.$createElement(
          "i",
          { style: "color: teal" },
          "哦吼！你有一条未读新消息"
        ),
        position: "bottom-right"
      });
    },
    roomClicked: function(roomId) {
      //TODO check owner and roomUid
      console.log(roomId);
      api.requestWithToken(
        "/room/" + roomId,
        "get",
        {},
        res => {
          //get Room Info
          if (res.data.code === 200) {
            //...
            const status = res.data.data.status;
            if (status === "FULL") {
            } else {
              //empty and in-game
              this.$router.push("/room/" + roomId);
            }
          }
        },
        err => {}
      );
    },
    userDetails: function() {
      //todo
      this.$router.push("/user/info");
    },
    ranking() {
      // this.stompClient.connect({}, success => {
      //   this.stompClient.subscribe('/topic/ranking', frame => {
      //     this.rankingList = JSON.parse(frame.body); //ranking({rank,username,score})
      //   });
      // }, failed => {
      //
      // });
    },
    createRoom() {
      // const roomId = this.getCurMaxRoomId();
      this.genUniqRoomId();
      //todo post create room (roomId+1) (create+cache)
    },
    genUniqRoomId() {
      //todo get in real time
      api.requestWithToken(
        "/room/cur/count",
        "get",
        {},
        res => {
          if (res.data.code === 200) {
            console.log(res.data);
            this.curRoomsCount = parseInt(res.data.data);
            this.roomId = (this.curRoomsCount + 1).toString();
            // this.curRoomsCount = 10;
            this.roomUid = hex_md5(Date.now().toString()) + "$" + this.roomId;
            console.log(this.roomUid);
            api.requestWithToken(
              "/room/" + this.roomUid,
              "post",
              {
                roomStatus: "EMPTY"
              },
              res => {
                console.log(res.data);
                if (res.data.code === 200) {
                  //rows<=11
                  // if (this.roomId % 4 === 0) {
                  //   this.rows++;
                  //   this.columns = 1;
                  // } else {
                  //   this.columns++;
                  // }
                  this.rows = Math.floor(this.curRoomsCount / 4);
                  this.columns = this.curRoomsCount % 4;
                  this.$message({
                    message: "你已成为房主",
                    type: "success"
                  });
                  this.$router.replace({
                    path: "/room/" + this.roomId,
                    query: { roomUid: this.roomUid }
                  });
                } else {
                }
              },
              err => {
                this.$message({
                  message: err.data,
                  type: "error"
                });
              }
            );
          }
        },
        err => {}
      );
      // return 4 * this.rows + this.columns;
    },
    setRowsCols() {
      this.$nextTick(()=>{
        this.curRoomsCount = this.curRooms.length;
        this.roomId = (this.curRoomsCount + 1).toString();
        this.rows = Math.floor(this.curRoomsCount / 4);
        this.columns = this.curRoomsCount % 4;
      })      
    },
    getCurRoomsInfo() {
      api.requestWithToken(
        "/room/cur/rooms",
        "get",
        {},
        res => {
          this.curRooms = res.data.data;
          this.setRowsCols();
        },
        err => {}
      );
    },
    enterHall() {
      //sovle concurrent
      console.log("enter hall");
      this.getCurRoomsInfo(); //TODO reload page when back to home
      this.stompClient.connect(
        {},
        success => {
          this.stompClient.subscribe("/topic/hall/rooms", frame => {
            //todo create room
            this.curRooms = JSON.parse(frame.body);
            if (this.curRooms != null) {
              console.log(typeof this.curRooms);
              console.log(this.curRooms.length);
              if (
                this.curRooms.filter(
                  room => room.owner == this.user.username
                ) == ''
              ) {
                this.setRowsCols();
              }
              //push into sessionStorage
            }
          });
        },
        fail => {}
      );
    }
    // genUniqRoomId() {
    //     // if (this.currentUsersCount === 0) { //TODO check room owner from server
    //       this.roomUid = hex_md5(Date.now()) + '$' + this.curRoomsCount;
    //       console.log(this.roomUid);
    //     // }
    //     // this.currentUsersCount++;
    //     // this.maxUsersCount = this.currentUsersCount > this.maxUsersCount ? this.currentUsersCount : this.maxUsersCount;
    //   },
  },
  mounted() {
    this.enterHall();
    this.ranking();
  },
  watch: {
    // "$route": "getCurRoomsInfo"
  }
};
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.item {
  margin-top: 10px;
  margin-right: 60px;
}

.me:hover {
  cursor: pointer;
}

.el-row {
  margin-bottom: 20px;
}

:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  text-align: center;
  vertical-align: middle;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-icon-setting:before {
  content: "\E6CA";
  font-size: x-large;
}

.room-span:hover {
  cursor: pointer;
  font-size: larger;
}

.create-room {
  float: left;
  margin-top: 10px;
}

.pagination {
  position: absolute;
  bottom: 10px;
  margin-left: 25%;
  margin-top: 10px;
}
</style>
