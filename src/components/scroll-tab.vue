<template>
  <section class="scroll_continar">
    <el-row :gutter="20">
      <el-col :span="7" :offset="5">
      <div style="height:220px;width:400px;background-color:#fff; border: 2px solid rgba(0,0,0,0.5)">
      <!-- 这里的标签名称要和main.js文件中定义的组件名称保持一致 -->
        <happy-scroll color="rgba(0,0,0,0.5)" size="6">
        <!-- 内层盒子——内容区 -->
          <div class="con">
            <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :timestamp="activity.timestamp">
            {{activity.content}}
            </el-timeline-item>
            </el-timeline>
          </div>
        </happy-scroll>
      </div>
      </el-col>
      <!-- colon (:) is short form of "v-bind:" -->
      <health-stat team="red" v-bind:healthStat="redHealthStat"></health-stat>
      <health-stat team="blue" v-bind:healthStat="blueHealthStat"></health-stat>
    </el-row>
  </section>
</template>


<script lang="ts">
import ElementUI from "element-ui";
import HealthStat from "./health-stat.vue";

/**
 * I'm a happy scroll tab, dispaly activities and health stats
 * @param {objcet} activities
 * @param {array} healStats
 */
export default {
  name: "ScrollTab",
  components: {
    // Custom HTML Tag for component
    // element UI has been import Globally
    // in src/plugins/element.js
    // See https://vuejs.org/v2/guide/components-registration.html#Local-Registration
    "health-stat": HealthStat,
  },
  data() {
    return {
      activities: this.activities,
      redHealthStat: this.healthStats[0],
      blueHealthStat: this.healthStats[1],
    };
  },
  props: {
    activities: {
      type: Object,
    },
    // First Elem in Array is red
    // Second Elem in Array is Blue
    healthStats: {
      type: Array,
    },
  },
};
</script>
