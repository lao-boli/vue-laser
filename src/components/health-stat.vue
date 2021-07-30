<template>
  <el-col :span="4">
  <div style="height:220px;width:200px;background-color:#fff; border: 2px solid rgba(0,0,0,0.5)" class="out">
  <!-- 这里的标签名称要和main.js文件中定义的组件名称保持一致 -->
  <happy-scroll color="rgba(0,0,0,0.5)" size="6">
  <!-- 内层盒子——内容区 -->
  <div class="con">
    <p>{{team_text}}</p>
    <p>正常：{{healthStat.normal}}</p>
    <p>轻伤：{{healthStat.minorWound}}</p>
    <p>中伤：{{healthStat.slander}}</p>
    <p>重伤：{{healthStat.seriousInjury}}</p>
    <p>死亡：{{healthStat.dead}}</p>
  </div>
  </happy-scroll>
  </div>
  </el-col>
</template>


<script lang="ts">
// I can use the fucking TypeScript in Vue Yeah!!!!!!!

import {Col, Table} from "element-ui"

//   (property) healthStat: {
//     normal: number;
//     outline: number;
//     minorWound: number;
//     slander: number;
//     seriousInjury: number;
//     dead: number;
// }

/**
 * Team Health Stat
 * red/blue in currentExercise
 * 

 @param {string} team
 only allow "red" and "blue"
 
 */
export default {
  name: "HealthStat",
  data (){
    return{
      healthStat:this.healthStat,
      team: this.team,
      /**
       * Used to get the correct Chinese text display
       * @type {string}
       */
      team_text: (this.team=="red") ? "红方" : "蓝方"
    }
  },
  props:{
    healthStat: {
      type: Object,
      default: ()=>{
        return {
          normal: 0,
          outline: 0,
          minorWound: 0,
          slander: 0,
          seriousInjury: 0,
          dead: 0
        }
      }
    },
    team:{
      type:String
    }
  }
}
</script>

