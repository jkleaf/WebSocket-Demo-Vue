<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="首页" name="first">
      <hall ref="hall"></hall>
      <!--        <router-link to="/hall">HALL</router-link>-->
    </el-tab-pane>
    <el-tab-pane label="数据统计" name="second">
      <statistics ref="statistics"></statistics>
      <!--        <router-link to="/statistics">STATISTICS</router-link>-->
    </el-tab-pane>
    <el-tab-pane label="讨论区" name="third">
      <forum ref="forum"></forum>
      <!--        <router-link to="/forum">FORUM</router-link>-->
    </el-tab-pane>

  </el-tabs>
</template>

<script>
  import Hall from "./Hall"
  import Statistics from "./Statistics";
  import Forum from "./Forum"

  export default {
    components: {
      Hall, Forum, Statistics
    },
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },

    }
  };
</script>

<style scoped>
  /*.el-tabs--bottom,*/
  /*.el-tabs__item.is-bottom:nth-child(2),*/
  /*.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),*/
  /*.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),*/
  /*.el-tabs--top .el-tabs__item.is-top:nth-child(2) {*/
  /*  padding-left: 0;*/
  /*  font-size: x-large;*/
  /*}*/
</style>
