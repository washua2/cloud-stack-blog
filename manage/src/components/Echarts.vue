<template>
  <div class="echarts">
    <div id="main" style="height: 100%" ref="pie_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null
    }
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    drawLine() {
      var dom = document.getElementById("main");
      var myChart = this.$echarts.init(dom,);
      var day = new Date().getDay()
      var option;



      setTimeout(function () {
        option = {
          legend: {
            left: "right",
            top: 35,
            icon: "circle", // 修改形状
            itemHeight: 50,
            width: 10,
            height: 10,
            itemGap: 30,
            textStyle: {
              fontSize: 26,
              color: "#fff",
              padding: [0, 0, 0, 10], // 修改文字和图标距离
            },
          },
          tooltip: {
            trigger: 'axis',
            showContent: false
          },
          dataset: {
            source: [
              ['article', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
              ['发布文章数量', 56, 82, 887, 701, 534, 851, 0],
              ['发布图片数量', 51, 51, 551, 533, 738, 687, 0],
              ['留言板数量', 40, 62, 695, 364, 452, 325, 0],
              ['回复数量', 40, 62, 695, 364, 452, 325, 0],
              ['用户数量', 25, 37, 412, 18, 339, 491, 0]
            ]
          },
          xAxis: {
            type: 'category',
            boundaryGap: false
          },
          yAxis: {
            gridIndex: 0
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            top: '55%'
          },


          series: [{
            type: 'line',
            seriesLayoutBy: 'row',
            emphasis: {
              focus: 'series'
            },
            markPoint: {
              data: [{
                type: "max"
              }, {
                type: "min"
              }]
            },
            stack: "all",
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(58,132,255, 0.5)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(58,132,255, 0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
          }, {
            type: 'line',
            seriesLayoutBy: 'row',
            emphasis: {
              focus: 'series'
            },
            markPoint: {
              data: [{
                type: "max"
              }, {
                type: "min"
              }]
            },
            stack: "all",
               areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(145,204,117,.5)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(145,204,117,0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
          }, {
            type: 'line',
            seriesLayoutBy: 'row',
            emphasis: {
              focus: 'series'
            },
            markPoint: {
              data: [{
                type: "max"
              }, {
                type: "min"
              }]
            },
            stack: "all",
             areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(250,200,88,.5)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(250,200,88,0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },

          }, {
            type: 'line',
            seriesLayoutBy: 'row',
            emphasis: {
              focus: 'series'
            },
            markPoint: {
              data: [{
                type: "max"
              }, {
                type: "min"
              }]
            },
            stack: "all",
             areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(238,102,102,.5)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(238,102,102,0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
          }, {
            type: 'line',
            seriesLayoutBy: 'row',
            emphasis: {
              focus: 'series'
            },
            markPoint: {
              data: [{
                type: "max"
              }, {
                type: "min"
              }]
            },
            stack: "all",
             areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(115,192,222,.5)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(115,192,222,0)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
          }, {
            type: 'pie',
            id: 'pie',
            radius: '40%',
            center: ['50%', '25%'],
            emphasis: {
              focus: 'self'
            },

            tooltip: {
              trigger: 'item'
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    color: 'white',
                    fontSize: 14,

                  },
                  formatter: function (arg) {
                    if (day == 0) {
                      return arg.name + ": " + arg.data[7] + "\n" + arg.percent + "%"
                    }
                    return arg.name + ": " + arg.data[day] + "\n" + arg.percent + "%"
                  }
                },
                labelLine: {
                  lineStyle: {
                    fontWeight: 'bolder'
                  }
                }
              }
            },
            encode: {
              itemName: 'article',
              value: '周一',
              tooltip: '周一'
            }
          }]
        };
        myChart.on('updateAxisPointer', function (event) {
          const xAxisInfo = event.axesInfo[0];
          if (xAxisInfo) {
            const dimension = xAxisInfo.value + 1;
            myChart.setOption({
              series: {
                id: 'pie',
                label: {
                  formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                },
                encode: {
                  value: dimension,
                  tooltip: dimension
                }
              }
            });
          }
        });
        myChart.setOption(option);
      });

      if (option && typeof option === 'object') {
        myChart.setOption(option);
      }
      window.onresize = function () {
        myChart.resize()
      }
    }
  
  }

}
</script>

<style lang="less" scoped>
.echarts {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
}
</style>