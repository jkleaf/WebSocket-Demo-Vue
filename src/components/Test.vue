<template>
  <!--  <div>-->
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <!--    <div>-->
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
    <!--    <router-view/>-->
    <!--    </div>-->
  </el-tabs>
  <!--  </div>-->
</template>

<script>
  import Hall from "./Hall"
  import Statistics from "./Statistics";
  import Forum from "./Forum"

  export default {
    components: {Hall, Forum, Statistics},
    // name: "Test"
  }
</script>

<style scoped>

</style>
