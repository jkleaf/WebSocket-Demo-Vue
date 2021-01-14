<template>
  <div>
    <h1>statistics</h1>
    <div id="timeChart" :style="{ width: '1400px', height: '600px' }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "Statistics",
  data() {
    return {
      data: [],
      now: +new Date(2020, 9, 13),
      oneDay: 24 * 3600 * 1000,
      value: Math.random() * 10,
    };
  },
  methods: {
    randomData() {
      this.now = new Date(+this.now + this.oneDay);
      this.value = this.value + Math.random() * 21 - 10;
      return {
        name: this.now.toString(),
        value: [
          [
            this.now.getFullYear(),
            this.now.getMonth() + 1,
            this.now.getDate(),
          ].join("/"),
          Math.round(this.value),
        ],
      };
    },
    displayCharts() {
      for (var i = 0; i < 1000; i++) {
        this.data.push(this.randomData());
      }

      let option = {
        title: {
          text: "同时在线人数 & 时间坐标轴",
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear() +
              " : " +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false,
          },
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            name: "模拟数据",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: this.data,
          },
        ],
      };
      let timeChart = echarts.init(document.getElementById("timeChart"));   
      let _this = this;
      setInterval(function () {
        for (var i = 0; i < 5; i++) {
          _this.data.shift();
          _this.data.push(_this.randomData());
        }

        timeChart.setOption(/* {
          series: [
            {
              data: _this.data,
            },
          ],
        } */
          option
        );
      }, 1000);
    },
  },
  mounted() {
    this.displayCharts();
  },
};
</script>

<style scoped>
</style>
