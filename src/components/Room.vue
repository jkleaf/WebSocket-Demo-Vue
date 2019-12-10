<template>
  <div>
    <h1>
      房间
    </h1>
    <h2>Content</h2>
    <h2>{{roomId}}</h2>
    <el-progress type="dashboard" :percentage="percentage" :color="colors"></el-progress>
    <div>
      <h3>调节音量</h3>
      <el-button-group>
        <el-button icon="el-icon-minus" @click="decrease"></el-button>
        <el-button icon="el-icon-plus" @click="increase"></el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Room",
    data() {
      return {
        percentage: 10,
        colors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ]
      }
    },
    methods:{
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
      }
    },
    computed: {
      roomId() {
        return this.$route.params.roomId
      },
    },
    created() {
      document.title = '房间 ' + this.$route.params.roomId
    }
  }
</script>

<style scoped>

</style>
