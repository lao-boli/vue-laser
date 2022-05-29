<!--FIXME 补充测试用例, 创建测试工具流程, 实现自动化测试
 https://cn.vuejs.org/v2/guide/testing.html -->
<!--COMPLETE 实装 ESLint 标准 -->
<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newScheme' }">演习</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/schemeManagement' }"
        >当前演习</el-breadcrumb-item
      >
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-row :gutter="20" class="title" style="position: relative">
        <el-col :span="2">
          <h3>当前演习</h3>
        </el-col>
        <el-col :span="2">
          <el-button
            type="danger"
            v-if="videoStart === false"
            size="mini"
            style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "
            @click="recordStart"
            >录屏未开启</el-button
          >
          <el-button
            type="success"
            icon="el-icon-video-camera"
            v-else
            size="mini"
            style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "
            >录屏中</el-button
          >
        </el-col>
      </el-row>
      <map-view
        v-if="mapinfo.leftTopLat !== null"
        :leftTopLat="mapinfo.leftTopLat"
        :leftTopLng="mapinfo.leftTopLng"
        :rightDownLat="mapinfo.rightDownLat"
        :rightDownLng="mapinfo.rightDownLng"
        :mapUrl="imgsrc"
        :redList="soldierlist.red"
        :blueList="soldierlist.blue"
        ref="mapViewInstance"
      >
      </map-view>

      <scroll-tab
        :activities="activities"
        :redHealthStat="red"
        :blueHealthStat="blue"
      ></scroll-tab>

      <stat-tab :soldierListData="soldierlist.red" team="red"></stat-tab>
      <stat-tab :soldierListData="soldierlist.blue" team="blue"></stat-tab>

      <h3 class="title">录屏</h3>
      <video
        controls
        autoplay
        playsinline
        ref="video"
        width="400"
        height="300"
      ></video>
      <el-row>
        <el-button
          type="primary"
          plain
          @click="stopRecord"
          id="btn-stop-recording"
          >演习结束</el-button
        >
      </el-row>
    </el-card>

    <!--演习结束对话框-->
    <!--TODO Make it components-->
    <el-dialog
      title="战场实况"
      :visible.sync="endVisible"
      width="50%"
      :before-close="handleClose"
      class="enddialog"
      :close-on-click-modal="false"
    >
      <h3 class="red">红方</h3>
      <el-table
        :data="redTotalData"
        style="width: 100%; margin-left: 10px; padding-left: 10px"
        class="total-red"
        stripe
      >
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="id" label="id" width="180"> </el-table-column>
        <el-table-column prop="shoot" label="击中数" width="180">
        </el-table-column>
        <el-table-column prop="beShooted" label="被击中数" width="180">
        </el-table-column>
        <el-table-column prop="kill" label="击杀数" width="180">
        </el-table-column>
      </el-table>
      <h3 class="blue">蓝方</h3>
      <el-table
        :data="blueTotalData"
        style="width: 100%; margin-left: 10px; padding-left: 10px"
        class="total-blue"
        stripe
      >
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="id" label="id" width="180"> </el-table-column>
        <el-table-column prop="shoot" label="击中数" width="180">
        </el-table-column>
        <el-table-column prop="beShooted" label="被击中数" width="180">
        </el-table-column>
        <el-table-column prop="kill" label="击杀数" width="180">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endVisible = false">取消</el-button>
        <el-button type="success" @click="clickEnd">结束</el-button>
        <el-button type="primary" @click="onClickDownDaily()"
          >结束并导出txt</el-button
        >
      </span>
    </el-dialog>
    <!--是否开启录屏-->
    <el-dialog
      title="是否开启录屏"
      :visible.sync="recordVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span> 开启录屏后可在演习回放界面回放录屏 </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recordVisible = false">取消</el-button>
        <el-button type="primary" @click="startRecording">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import * as $ from "jquery"
import ReconnectingWebSocket from "reconnecting-websocket"
import BMF from "browser-md5-file"
import { getSeekableBlob } from "ebml"
import RecordRTC from "recordrtc"
import { Coord, CoordSet } from "@/plugins/coord-util"
// import md5 from 'js-md5'
// import
import {
  basePort, baseURL, wsPath, fullBaseURL, isGCJ,
} from "../../global"
// See stopRecordingCallback() method below
// I don't think We need jQuery anymore but I'm lazy to fix it.
import ScrollTab from "../../components/scroll-tab.vue"
import StatTab from "../../components/stat-tab.vue"
import MapView from "../../components/map-view.vue"

// Active display beside HealthStats
interface Active {
  content: string
  timestamp: string
  size: string
  type: string
  icon: string
  color?: string
}

interface MapInfo {
  id: string
  leftTopLat: number
  leftTopLng: number
  rightDownLat: number
  rightDownLng: number
  name: string
  path: string
}

enum Color {
  CaribbeanGreen = "#0bbd87",
}

// ? This is a high Cyclomatic Complexity function
// ? But I think this is a good code, better than for-loop
const testHp = (hp: number) => {
  if (hp <= 0) {
    return "dead"
  }
  if (hp < 40) {
    return "seriousInjury"
  }
  if (hp < 70) {
    return "slander"
  }
  if (hp < 100) {
    return "minorWound"
  }
  if (hp >= 100) {
    return "full"
  }
  return "unknown"
}

const teamEnToZh = (team_en: string) => {
  if (team_en === "red") {
    return "红队"
  }
  if (team_en === "blue") {
    return "蓝队"
  }
  return "队伍"
}

const newTime = (): string => {
  const aData = new Date()
  return `${aData.getFullYear()}-${
    aData.getMonth() + 1
  }-${aData.getDate()}-${aData.getHours()}:${aData.getMinutes()}:${aData.getSeconds()}`
}

const newActive = (
  content = "",
  type: "warning" | "primary" | "danger" = "primary",
  icon = "el-icon-s-help",
  color: string = undefined,
): Active => ({
  content,
  timestamp: newTime(),
  size: "large",
  type,
  icon,
  color,
})

const convertObjToDddd = (data: { lat: number; lng: number }) => {
  const coord = new CoordSet(data.lat, data.lng)
  // console.log("Recv Coord", coord)
  if (isGCJ) {
    return { ...data, lat: coord.gsj.lat, lng: coord.gsj.lng }
  }
  return { ...data, lat: coord.wgs.lat, lng: coord.wgs.lng }
}

type PingMsg = {
  lat: number
  lng: number
  mark: string
  num: string
  time: number
}

type HitMsg = {
  mark: string
  position: string
  shooteeNum: string
  shooteeTeam: string
  shooterNum: string
  shooterTeam: string
  time: number
}

interface Soldier {
  age: number
  ammo: number
  equipment: string // DevEUI
  gender: string
  hp: number
  id: string
  lastReportTime: string
  lat: number
  lng: number
  name: string
  team: "red" | "blue"
  unit: string
}

export default {
  components: {
    "scroll-tab": ScrollTab,
    "stat-tab": StatTab,
    "map-view": MapView,
  },
  data() {
    return {
      // websocket
      websock: null,
      // 是否录屏dialog
      recordVisible: true,
      // 录屏
      video: null,
      videoStart: false,
      recorder: null,
      imgsrc: "",
      // mapinfo should be GSJ dddd
      mapinfo: {
        id: null,
        leftTopLat: null,
        leftTopLng: null,
        rightDownLat: null,
        rightDownLng: null,
        name: null,
      },
      // 时间线
      activities: [],
      // 红方
      red: {
        normal: 0,
        outline: 0,
        minorWound: 0,
        slander: 0,
        seriousInjury: 0,
        dead: 0,
        full: 0,
      },
      // 蓝方
      blue: {
        normal: 0,
        outline: 0,
        minorWound: 0,
        slander: 0,
        seriousInjury: 0,
        dead: 0,
        full: 0,
      },
      // 充弹数据
      batchCharging: 0,
      // 士兵列表
      soldierlist: {
        red: [],
        blue: [],
      },
      // 判伤对话框
      injuryVisible: false,
      injureId: 0,
      // 判伤参数
      radio1: "轻伤",
      radio2: 0,
      // 充弹对话框
      Charging: 0,
      chargeVisible: false,
      chargeId: 0,
      // 演习结束对话框
      endVisible: false,
      // 当前演习名称
      currentExerciseName: "test",
      reds: [],
      blues: [],
      // 更新的个人数据
      newdata: {},
      // md5
      my_md5: "",
      // 统计数据
      blueTotalData: [],
      redTotalData: [],
    }
  },
  created() {
    this.initWebSocket()
    this.getMapData()
    try {
      if (
        // @ts-ignore: We have the get DisplayMedia
        !navigator.getDisplayMedia
        // @ts-ignore: We have the get DisplayMedia
        && !navigator.mediaDevices.getDisplayMedia
      ) {
        throw new Error(
          "Your browser does NOT support the getDisplayMedia API.",
        )
      }
    } catch (err) {
      console.error(err)
      this.$message.error("错误，请检查浏览器是否设置正确。录屏功能将被禁用。")
      this.recordVisible = false
    }
  },
  mounted() {
    this.video = document.querySelector("video")
    this.getExerciseData()
    // this.toPosition()
  },
  destroyed() {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  methods: {
    // 获取演习数据
    async getExerciseData() {
      this.red = {
        normal: 0,
        outline: 0,
        minorWound: 0,
        slander: 0,
        seriousInjury: 0,
        dead: 0,
        full: 0,
      }
      this.blue = {
        normal: 0,
        outline: 0,
        minorWound: 0,
        slander: 0,
        seriousInjury: 0,
        dead: 0,
        full: 0,
      }
      // TODO Provide type for soldierlist
      this.soldierlist.red = []
      this.soldierlist.blue = []
      const { data: res } = await this.$http.get("newvest/newlist")
      try {
        const modified: Soldier[] = res.data.map(convertObjToDddd)
        console.log("Msg from HTTP API", modified)
        modified.forEach((data) => {
          const { team } = data
          this.soldierlist[team].push(data)
          if (data.lastReportTime !== null) {
            this[team].normal++
          }
          const cond = testHp(data.hp as number)
          this[team][cond]++
        })
        this.toPosition()
      } catch (err) {
        console.warn(err)
      }
    },
    // 获取地图数据
    async getMapData() {
      const mapId = window.sessionStorage.getItem("mapId")
      const { data: res } = await this.$http.get("map/get", {
        params: {
          id: mapId,
        },
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("获取地图信息失败")
      } else {
        // COMMENT res.data as MapInfo
        this.mapinfo = res.data
        this.imgsrc = `${fullBaseURL}picture/${res.data.path}`
      }
    },
    // 根据马甲编号获取数据
    async getDataByNum(num) {
      console.log(num)
      const { data: res } = await this.$http.get("newvest/newget", {
        params: {
          vestNum: num,
        },
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("更新个人数据失败")
      } else {
        // this.newdata = res.data
      }
    },
    // 实时获取击杀数据
    initWebSocket() {
      // 初始化weosocket

      const wsuri = `ws://${baseURL}:${basePort}/${wsPath}`
      this.websock = new ReconnectingWebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() {
      // 连接建立之后执行send方法发送数据
      console.log("连接建立成功")
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) {
      // 数据接收
      const redata = JSON.parse(e.data)
      this.parseRecvData(redata as PingMsg | HitMsg)
    },
    // TODO Refactor this method (again)
    // ! Refactor this function to reduce its Cognitive Complexity
    parseRecvData(in_data: PingMsg | HitMsg): void {
      enum MsgType {
        Hit, // 0
        Ping, // 1
      }
      const teams = ["red", "blue"]
      const msg_mark = parseInt(in_data.mark, 10)
      // 移动信息

      switch (msg_mark) {
        // Move Prompt
        case MsgType.Ping: {
          // COMMENT I'm sure it will be a PingMsg.
          const redata = convertObjToDddd(in_data as PingMsg) as PingMsg
          const soldierId = redata.num
          teams.forEach((team) => {
            this.soldierlist[team].forEach((soldier) => {
              if (soldier.id === soldierId) {
                /* COMMENT It's not a pure function.
                 * But it will return a Active instance
                 */
                // TODO Make it pure and move it out of this method
                const active = (() => {
                  if (soldier.lastReportTime === null) {
                    const msrc = `${soldierId}号上线`
                      + `坐标为 (${redata.lat.toFixed(3)}, ${redata.lng.toFixed(
                        3,
                      )})`
                    return newActive(
                      msrc,
                      undefined,
                      undefined,
                      Color.CaribbeanGreen,
                    )
                  } // else / default
                  const msrc = `${soldierId} 号移动至 (${redata.lat.toFixed(
                    3,
                  )}, 
                    ${redata.lng.toFixed(3)})`
                  return newActive(msrc)
                })()
                // ? END

                this.$message.success(active.content)
                this.activities.unshift(active)
                this.getExerciseData()
              }
            })
          })
          break
        }

        case MsgType.Hit: {
          // TODO  Prompt when someone get killed
          // Expected a `for-of` loop instead of a `for` loop with this simple iteration.
          const redata = in_data as HitMsg
          const shooter = redata.shooterNum
          const victim = redata.shooteeNum
          const part_hit = redata.position
          const shooter_team = redata.shooterTeam
          const victim_team = redata.shooteeTeam
          teams.forEach((team) => {
            this.soldierlist[team].forEach((soldier) => {
              if (soldier.id === victim) {
                /* It's not a pure function.
                 * But it will return a Active instance
                 */
                // TODO Make it pure and move it out of this method
                const active = (() => {
                  const msg_info = `${teamEnToZh(
                    shooter_team,
                  )}的${shooter}号击中了${teamEnToZh(
                    victim_team,
                  )}的${victim}号的${part_hit}`
                  if (shooter_team === victim_team) {
                    return newActive(`友伤 ${msg_info}`, "danger")
                  }
                  return newActive(msg_info, "warning")
                })()
                // ? END

                this.activities.unshift(active)
                this.getExerciseData()
              }
            })
          })
          break
        }
        default:
          console.warn("MsgType Error")
      }
    },
    websocketsend(Data) {
      this.websock.send(Data) // 数据发送
    },
    websocketclose(e) {
      // 关闭
      console.log("断开连接", e)
      this.websock.close()
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
    },
    onClickDownDaily() {
      const title = this.currentExerciseName
      let str = ""
      this.activities.forEach((item) => {
        str += `事件:${item.content}  时间:${item.timestamp}\r\n`
      })
      const allStr = `${title}\r\n \r\n${str}`
      const export_blob = new Blob([allStr])
      const save_link = document.createElement("a")
      save_link.href = window.URL.createObjectURL(export_blob)
      save_link.download = `${this.currentExerciseName}.txt`
      this.fakeClick(save_link)
      this.endVisible = false
    },
    fakeClick(obj) {
      const ev = document.createEvent("MouseEvents")
      ev.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null,
      )
      obj.dispatchEvent(ev)
    },
    toPosition() {
      this.$refs.mapViewInstance.updateMarkers(
        this.soldierlist.red,
        this.soldierlist.blue,
      )
    },
    // 打开录屏提示框
    recordStart() {
      this.recordVisible = true
    },
    // 录屏必要函数
    invokeGetDisplayMedia(success, error) {
      const displaymediastreamconstraints = {
        video: true,
      }
      // above constraints are NOT supported YET
      // that's why overriding them

      // @ts-ignore: We have the property
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          // @ts-ignore: We have the property
          .getDisplayMedia(displaymediastreamconstraints)
          .then(success)
          .catch(error)
      } else {
        navigator
          // @ts-ignore: We have the property
          .getDisplayMedia(displaymediastreamconstraints)
          .then(success)
          .catch(error)
      }
    },
    captureScreen(callback) {
      try {
        this.invokeGetDisplayMedia(
          (screen) => {
            this.addStreamStopListener(screen, () => {
              //
            })
            callback(screen)
          },
          (error) => {
            console.error(error)
          },
        )
      } catch (err) {
        console.error(err)
        this.$message.error(err)
      }
    },
    addStreamStopListener(stream, callback) {
      stream.addEventListener(
        "ended",
        () => {
          // Do nothing
          // I don't know what this shit is doing though
        },
        false,
      )
      stream.addEventListener(
        "inactive",
        () => {
          // Do nothing
          // I don't know what this shit is doing though
        },
        false,
      )
      stream.getTracks().forEach((track) => {
        track.addEventListener(
          "ended",
          () => {
            // Do nothing
            // I don't know what this shit is doing though
          },
          false,
        )
        track.addEventListener(
          "inactive",
          () => {
            // Do nothing
            // I don't know what this shit is doing though
          },
          false,
        )
      })
    },
    startRecording() {
      this.recordVisible = false
      this.captureScreen((screen) => {
        this.video.srcObject = screen
        this.recorder = RecordRTC(screen, {
          type: "video",
          mimeType: "video/webm;codecs=vp8",
          disableLogs: false,
          getNativeBlob: false,
        })
        this.recorder.startRecording()
        // release screen on stopRecording
        this.recorder.screen = screen
        this.videoStart = true
      })
    },
    stopRecordingCallback() {
      this.video.src = URL.createObjectURL(this.recorder.getBlob())
      // this.download()
      this.recorder.screen.stop()
      const blob = this.recorder.getBlob()
      console.log("blob", blob)
      this.recorder.destroy()
      this.recorder = null
      this.videoStart = false
      // console.log(this.video.src)
      const bmf = new BMF()
      const sliceSize = 5 * 1024 * 1024 // 每个文件切片大小定为5MB
      const fileSize = blob.size // 文件大小
      const fileName = `${Date.now()}.webm` // 文件名
      console.log(fileName)
      console.log(fileSize)
      // 计算文件切片总数
      const totalSlice = Math.ceil(fileSize / sliceSize)
      console.log(totalSlice)
      // 循环上传
      for (let i = 1; i <= totalSlice; i++) {
        let chunk
        if (i === totalSlice) {
          // 最后一片
          chunk = blob.slice((i - 1) * sliceSize, fileSize - 1) // 切割文件
          console.log(chunk)
        } else {
          chunk = blob.slice((i - 1) * sliceSize, i * sliceSize)
          // console.log(chunk)
        }
        const videoData = new FormData()
        videoData.append("file", chunk)
        bmf.md5(
          blob,
          (err, md5) => {
            console.log("err:", err)
            console.log("md5 string:", md5) // 97027eb624f85892c69c4bcec8ab0f11
            this.my_md5 = md5
            console.log(this.my_md5)
          },
          (progress) => {
            console.log("progress number:", progress)
          },
        )
        videoData.append("md5", this.my_md5)
        // console.log(this.$md5(blob))
        videoData.append("VideoName", fileName)
        videoData.append("BattleName", "totalSlice")
        videoData.append("size", fileSize)
        videoData.append("chunks", totalSlice.toString())
        videoData.append("chunk", i.toString())
        // IDK why he's still using jQuery for a simple HTTP POST
        // But I don't want to touch this part
        $.ajax({
          url: `${fullBaseURL}newrecord/upload`,
          type: "POST",
          cache: false,
          data: videoData,
          processData: false,
          contentType: false,
          async: false,
        })
      }
      this.$message({
        showClose: true,
        message: "回放上传成功",
        type: "success",
        duration: 3000,
      })
    },
    // 演习结束对话框
    async stopRecord() {
      this.endVisible = true
      this.redTotalData = []
      this.blueTotalData = []
      const { data: res } = await this.$http.get("newrecord/recordlist")
      console.log(res)
      // TODO Refactor (Maybe?)
      // Expected a `for-of` loop instead of a `for` loop with this simple iteration.
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].team === "blue") {
          this.blueTotalData.push(res.data[i])
        } else {
          this.redTotalData.push(res.data[i])
        }
      }
      console.log("红方统计数据", this.redTotalData)
      console.log("蓝方统计数据", this.blueTotalData)
    },
    // 演习结束自动停止录屏
    stopRecording() {
      this.recorder.stopRecording(this.stopRecordingCallback)
      console.log(this.video)
      console.log(this.recorder)
    },
    download() {
      getSeekableBlob(this.recorder.getBlob(), (seekableBlob) => {
        const url = window.URL.createObjectURL(seekableBlob)
        const link = document.createElement("a")
        link.style.display = "none"
        link.href = url
        const fileName = `${Date.now()}.webm`
        link.setAttribute("download", fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 结束演习
    async clickEnd(): Promise<void> {
      const { data: res } = await this.$http.get("newbattle/newend")
      if (res.code !== 200) {
        this.$message.error("结束演习失败")
      } else {
        this.$message({
          showClose: true,
          message: "演习结束成功，正在上传演习回放，请勿关闭页面",
          type: "success",
          duration: 3000,
        })
        this.endVisible = false
        if (this.videoStart === false) {
          setTimeout(() => {
            this.$message({
              showClose: true,
              message: "无演习回放，无需上传",
              type: "success",
              duration: 3000,
            })
          }, 3000)
        } else {
          this.stopRecording()
        }
      }
    },
  },
}
</script>

<style scoped>
.title {
  margin: 10px;
  border-bottom: 1px solid #606266;
}
.img_continar {
  display: flex;
  justify-content: center;
  height: 600px;
  position: relative;
}
.scroll_continar {
  margin-top: 20px;
}
.out {
  float: left;
}
.red {
  margin: 10px;
  padding: 15px;
  color: #f56c6c;
  border-bottom: 1px solid #f56c6c;
}
.blue {
  margin: 10px;
  padding: 15px;
  color: #409eff;
  border-bottom: 1px solid #409eff;
}
.enddialog {
  height: 600px !important;
}
</style>
