<template>
<!--地图部分-->
<section class="img_continar">
  <img :src="imgsrc" width="60%" height="100%" class="map">
    <el-button type="danger" circle size="mini" :style="reds[index]" v-for="(item, index) in soldierlist.red" :key="item.id" style="font-size: 3px">{{item.id}}</el-button>
    <el-button type="primary" circle size="mini" :style="blues[index]" v-for="(item,index) in soldierlist.blue" :key="item.id" style="font-size: 3px">{{item.id}}</el-button>
</section>
</template>