<template>
<section class="stat-tab">
  <h3 :class="team">{{team_text}}</h3>
  <el-table
    :data="soldierListData"
    border
    stripe
    style="width: 100%">
    <el-table-column
      prop="id"
      label="id"
      width="90px">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="90px">
    </el-table-column>
    <el-table-column
      prop="age"
      label="年龄"
      width="90px">
    </el-table-column>
    <el-table-column
      prop="equipment"
      label="设备编号"
      width="90px">
    </el-table-column>
    <el-table-column
      prop="unit"
      label="所属单位"
      width="180px">
    </el-table-column>
    <el-table-column
      prop="hp"
      label="生命值"
      width="180px">
    </el-table-column>
    <el-table-column
      prop="ammo"
      label="弹药量"
      width="180px">
    </el-table-column>
    <el-table-column label="状态" width="240px">
      <template slot-scope="scope">
        <span style="color: #67C23A" v-if="scope.row.lastReportTime !== null">正常</span>
        <span style="color: #F56C6C" v-else>离线</span>
        <span style="color: #f5af19" v-if="scope.row.hp < 100 && scope.row.hp >= 70"> 轻伤</span>
        <span style="color: #E6A23C" v-else-if="scope.row.hp < 70 && scope.row.hp >= 40"> 中伤</span>
        <span style="color: #f12711" v-else-if="scope.row.hp < 40 && scope.row.hp > 0"> 重伤</span>
        <span style="color: #000000" v-else-if="scope.row.hp === 0"> 死亡</span>
      </template>
    </el-table-column>
    <!-- Three Button is Useless -->
    <!-- <el-table-column label="操作" width="360px">
      <template slot-scope="scope">
        <el-button type="danger" size="mini" @click="deathSentence(scope.row.id)" v-if="scope.row.hp > 0">判死</el-button>
        <el-button type="warning" size="mini" @click="injury(scope.row.id)" v-if="scope.row.hp > 0">判伤</el-button>
        <el-button type="primary" size="mini" @click="charge(scope.row.id)" v-if="scope.row.hp > 0">充弹</el-button>
      </template>
    </el-table-column> -->
  </el-table>
</section>
</template>
<script lang="ts">

/**
 * I'm a happy stat tab, dispaly soldier list
 * @param {array} soldierListData
 * @param {string} team
 */
export default {
  name:"StatTab",
  data(){
    return{
      /**
       * Used to get the correct Chinese text display
       * @type {string}
       */
      team_text: (this.team=="red") ? "红方" : "蓝方"
    }
  },
  props:{
    soldierListData:{
      type:Array
    },
    team:{
      type:String
    }
  }
}
</script>

<style scoped lang="less">
.title{
  margin: 10px;
  //padding: 15px;
  border-bottom: 1px solid #606266;
}
.img_continar{
  display: flex;
  justify-content: center;
  height: 600px;
  position: relative;
}
.scroll_continar{
  margin-top: 20px;
}
.out{
  float: left;
}
.red{
  margin: 10px;
  padding: 15px;
  color: #F56C6C;
  border-bottom: 1px solid #F56C6C;
}
.blue{
  margin: 10px;
  padding: 15px;
  color: #409EFF;
  border-bottom: 1px solid #409EFF;
}
.enddialog{
  height: 600px !important;
}
</style>