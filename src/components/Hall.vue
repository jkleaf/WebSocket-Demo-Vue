<template>
  <el-container>
    <el-header style="text-align: right; font-size: 20px; height: 75px">
      <el-button @click="createRoom" class="create-room">创建房间</el-button>
      <el-badge :value="'99+'" class="item">
        <el-button size="large" @click="openReplyNotification">回复</el-button>
      </el-badge>
      <el-badge :value="2" class="item" type="primary">
        <el-button size="large" @click="">系统消息</el-button>
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
            style="background-color: #d3dce6">
          </el-table-column>
          <el-table-column
            prop="score"
            label="积分"
            sortable
            width="150"
            style="background-color: #d3dce6">
          </el-table-column>
        </el-table>
      </el-aside>
      <el-container>
        <el-main style="background-color: rgb(238, 241, 246); height: 100vh;">
          <el-row :gutter="20" v-for="i in rows-1" :key="i">
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
                <span @click="roomClicked(4*(rows-1)+j)" class="room-span">Room {{(rows-1)*4+j}}</span>
                <!--                <route-link :to="'/room/'+roomId"></route-link>-->
              </div>
            </el-col>
          </el-row>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="1000" class="pagination">
          </el-pagination> <!--TODO-->
        </el-main>
      </el-container>
      <el-drawer
        title="个人信息"
        :visible.sync="drawer"
        :direction="direction">
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
  export default {
    data() {
      return {
        stompClient: this.$store.state.stomp,
        roomId: '1',
        user: {
          username: sessionStorage['username'],
          //todo
        },
        drawer: false,
        direction: 'rtl',
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        rankingList: [],
        rows: 6,
        columns: 2
      }
    },
    methods: {
      logout: function () {
        const _this = this;
        this.$confirm("确认退出吗?", "提示", {
          //type: 'warning'
        }).then(() => {
          sessionStorage.removeItem("user");
          _this.$router.replace("/");
        }).catch(() => {
        });
      },
      openReplyNotification: function () {
        this.$notify.info({
          title: '消息',
          message: this.$createElement('i', {style: 'color: teal'}, '哦吼！你有一条未读新消息'),
          position: 'bottom-right'
        });
      },
      roomClicked: function (roomId) {
        console.log(roomId);
        this.$router.push('/room/' + roomId)
      },
      userDetails: function () {//todo
        this.$router.push('/user/info')
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
        const roomId = this.getCurMaxRoomId();

        //todo post create room (roomId+1) (create+cache)
        api.requestWithToken("/room"+this.roomUid,"post",{},res=>{

        },err=>{

        })


        //rows<=11
        if (roomId % 4 === 0) {
          this.rows++;
          this.columns = 1;
        } else {
          this.columns++;
        }
      },
      getCurMaxRoomId() { //todo get in real time
        return 4 * this.rows + this.columns;
      }
    },
    mounted() {
      this.ranking();
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
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
