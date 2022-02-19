<template>
    <div class="visualization">
        <echarts ></echarts>
        <clock class="clock"/>
    </div>
</template>

<script>
import Clock from '../components/Clock.vue'
import Echarts from '../components/Echarts.vue'
export default {

    name:"Visualization",
      components: { 
          Echarts,
            Clock,
        },
    data(){
        return{

        }
    },
   mounted() {
     

  },

  methods: {
      add(){

      },
   
  }
}
</script>
<style lang="less" scoped>
.visualization{
    position: relative;
    width: 100%;
    height: 100%;
    .clock{
        position: absolute;
        top: 3%;
        left: 3%;
        z-index: 99;
    }
}

</style>