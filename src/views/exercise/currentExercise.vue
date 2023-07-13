<template>
  <div class="content">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newScheme' }">演习</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/schemeManagement' }"
      >当前演习
      </el-breadcrumb-item
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
          >录屏未开启
          </el-button
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
          >录屏中
          </el-button
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

      <div class="war-situation">
        <!--占位-->
        <div></div>
        <scroll-tab
            :activities="activities"
            :redHealthStat="red"
            :blueHealthStat="blue"
        ></scroll-tab>
      </div>

      <div class="battle-data">
        <div class="option">
          <el-button type="primary" @click="startScheme"
          >开始演习
          </el-button>

          <el-button
              type="danger"
              @click="stopRecord"
          >结束演习
          </el-button>

          <el-button type="primary" @click="singleChargeVisible = true"
          >单兵装弹
          </el-button>

          <el-button type="primary" @click="fullChargeVisible = true"
          >全体装弹
          </el-button>
        </div>
        <div class="battle-info">
          <stat-tab :soldierListData="soldierlist.red" team="red"></stat-tab>
          <stat-tab :soldierListData="soldierlist.blue" team="blue"></stat-tab>
        </div>
      </div>

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
        >演习结束
        </el-button
        >
      </el-row>
    </el-card>

    <!--单兵装弹对话框-->
    <el-dialog
        class="charge-dialog"
        title="单兵装弹"
        :visible.sync="singleChargeVisible"
        width="22%"
        :before-close="handleClose"
    >
      <div class="item">
        <span>士兵id: </span>
        <el-input
            v-model="soldierId"
            style="width: 200px"
        >
        </el-input>
      </div>

      <div class="item">
        <span>装弹数: </span>
        <el-input
            v-model="chargingNumber"
            style="width: 200px"
        >
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="singleChargeVisible = false">取消</el-button>
        <el-button type="primary" @click="singleCharging">确认</el-button>
      </span>
    </el-dialog>
    <!--全体装弹对话框-->
    <el-dialog
        class="charge-dialog"
        title="全体装弹"
        :visible.sync="fullChargeVisible"
        width="22%"
        :before-close="handleClose"
    >
      <div class="item">
        <span>装弹数: </span>
        <el-input
            v-model="chargingNumber"
            style="width: 200px"
        >
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="fullChargeVisible = false">取消</el-button>
        <el-button type="primary" @click="fullCharging">确认</el-button>
      </span>
    </el-dialog>
    <!--演习结束对话框-->
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
        <el-table-column prop="id" label="id" width="180"></el-table-column>
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
        <el-table-column prop="id" label="id" width="180"></el-table-column>
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
import '../../utils/audio-play-util.js'
import RecordRTC from "recordrtc"
// import md5 from 'js-md5'
// import
import { getSeekableBlob } from "ebml"
import BMF from "browser-md5-file"
import ReconnectingWebSocket from "reconnecting-websocket"
import * as $ from "jquery"
import axios from "axios"
import {
  basePort,
  baseURL,
  wsPath,
  fullBaseURL,
  isGCJ,
  dynamicAudioURL,
  audioURL,
  latlngAudioURL,
  audioSaveURL,
  numberAudioURL,
} from "../../global"
// See stopRecordingCallback() method below
// I don't think We need jQuery anymore but I'm lazy to fix it.
import ScrollTab from "../../components/scroll-tab.vue"
import StatTab from "../../components/stat-tab.vue"
import MapView from "../../components/map-view.vue"
import { Coord, CoordSet } from "@/plugins/coord-util"
import { hitMap, hitPartMap } from "@/utils/audio-play-util"

// Code from https://github.com/hiwanz/wgs2mars.js/blob/master/lib/wgs2mars.js

interface MapDebug {
  left_top_lng: number
  left_top_lat: number
  right_down_lng: number
  right_down_lat: number
  target_lng: number
  target_lat: number
  width_map: number
  height_map: number
  height_diff: number
  width_diff: number
  ratio_width: number
  ratio_width_mod: number
  ratio_height: number
}

// IDK what this active means, maybe it's Websocket active
interface Active {
  content: string
  timestamp: string
  size: string
  type: string
  icon: string
  color?: string
}

interface HealthStatData {
  full: number
  normal: number
  outline: number
  minorWound: number
  slander: number
  seriousInjury: number
  dead: number
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
// ? But I think this is a good code, better than for loop
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

const teamEnToZh = (tean_name_en: string) => {
  if (tean_name_en === "red") {
    return "红队"
  }
  if (tean_name_en === "blue") {
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

const convertObjToDddd = (data: {
  lat: number
  lng: number
  [key: string]: unknown
}): {
  lat: number
  lng: number
  [key: string]: unknown
} => {
  const coord = new CoordSet(data.lat, data.lng)
  // console.log("Recv Coord", coord)
  if (isGCJ) {
    return {
      ...data,
      lat: coord.gsj.lat,
      lng: coord.gsj.lng,
    }
  }
  return {
    ...data,
    lat: coord.wgs.lat,
    lng: coord.wgs.lng,
  }
}

const synth = window.speechSynthesis
const msg = new SpeechSynthesisUtterance()

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
      // 默认装弹数
      chargingNumber: 10,
      // 单兵装弹对话框
      soldierId: 0,
      singleChargeVisible: false,
      // 全体装弹对话框
      fullChargeVisible: false,
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
      this.soldierlist.red = []
      this.soldierlist.blue = []
      const { data: res } = await this.$http.get("newvest/newlist")
      try {
        // COMPLETE Rewrite this part to make it immutable
        // TODO Provide a type interface for res data
        const modified: any[] = res.data.map(convertObjToDddd)
        modified.forEach((data) => {
          this.initNumberAudio(data.id)
          // team is a string
          // value is red or blue
          const { team } = data
          // Type 'String' cannot be used as an index type.
          // use small "string" and the compiler won't complaint
          // Always use small type in typescript
          this.soldierlist[team].push(data)
          if (data.lastReportTime !== null) {
            this[team].normal++
          }
          const cond = testHp(data.hp)
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
      console.log(mapId)
      const { data: res } = await this.$http.get("map/get", {
        params: {
          id: mapId,
        },
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("获取地图信息失败")
      } else {
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

      // const wsuri = `ws://${baseURL}:${basePort}/${wsPath}`
      const wsuri = `ws://localhost:10250`
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
      // console.log(redata)
      this.parseRecvData(redata)
    },
    // COMPLETE Refactor this method
    // TODO Write a method to tell whether this solider is dead
    // ! Refactor this function to reduce its Cognitive Complexity
    parseRecvData(in_data) {
      enum MsgType {
        Hit, // 0
        Ping, // 1
      }

      const teams = ["red", "blue"]
      const soldierId = in_data.num
      const shooter = in_data.shooterNum
      const victim = in_data.shooteeNum
      const part_hit = in_data.position
      const shooter_team = in_data.shooterTeam
      const victim_team = in_data.shooteeTeam
      const msg_mark = parseInt(in_data.mark, 10)
      console.log(in_data)
      // 移动信息
      // TODO define a interface of redata

      /*    lat: 24.563537
            lng: 118.381233
            mark: "1"
            num: "123"
            time: 1628773094161 */
      switch (msg_mark) {
        // Move Prompt
        case MsgType.Ping: {
          const redata = convertObjToDddd(in_data)
          teams.forEach((team) => {
            this.soldierlist[team].forEach((solider) => {
              if (solider.id === soldierId) {
                const active = (() => {
                  if (solider.lastReportTime === null) {
                    const msrc = `${soldierId}号上线`
                        + `坐标为 (${redata.lat.toFixed(3)}, ${redata.lng.toFixed(
                          3,
                        )})`
                    this.speakOnline(soldierId,redata.lat.toFixed(3),redata.lng.toFixed(3))
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
                  this.speakMove(soldierId,redata.lat.toFixed(3),redata.lng.toFixed(3))
                  return newActive(msrc)
                })()
                this.$message.success(active.content)
                this.activities.unshift(active)
                // this.handleSpeak(active.content)
                this.getExerciseData()
              }
            })
          })
          break
        }
        /* {
            "mark": "0",
            "position": "右脚",
            "shooteeNum": "456",
            "shooteeTeam": "blue",
            "shooterNum": "123",
            "shooterTeam": "red",
            "time": 1628774919894
        } */
        case MsgType.Hit: {
          // TODO Kill Prompt
          // Expected a `for-of` loop instead of a `for` loop with this simple iteration.
          teams.forEach((team) => {
            this.soldierlist[team].forEach((solider) => {
              if (solider.id === victim) {
                const active = (() => {
                  const msg_info = `${teamEnToZh(
                    shooter_team,
                  )}的${shooter}号击中了${teamEnToZh(
                    victim_team,
                  )}的${victim}号的${part_hit}`
                  if (shooter_team === victim_team) {
                    this.speakHit(teamEnToZh(shooter_team),shooter,teamEnToZh(victim_team),victim,part_hit,true)
                    return newActive(`友伤 ${msg_info}`, "danger")
                  }
                  this.speakHit(teamEnToZh(shooter_team),shooter,teamEnToZh(victim_team),victim,part_hit,false)
                  return newActive(msg_info, "warning")
                })()

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
      // that's why overridnig them

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
      stream.getTracks()
        .forEach((track) => {
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
      // this.endVisible = true
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

    // region audio
    /**
     * 播放语音音频
     * @param wavFiles 音频文件数组
     */
    playAudio(wavFiles) {
      // 创建用于顺序播放 WAV 文件的 Promise
      const playNextAudio = (index) => {
        if (index >= wavFiles.length) {
          // 播放完毕，结束
          return
        }

        // 创建 Audio 对象
        const audio = new Audio(wavFiles[index])

        // 当前音频播放完毕后，自动播放下一个音频
        audio.addEventListener('ended', () => {
          audio.pause() // 暂停当前音频
          playNextAudio(index + 1) // 播放下一个音频
        })

        // 播放当前音频
        audio.play()
      }

      // 开始播放第一个音频
      playNextAudio(0)
    },
    /**
     * 播放士兵上线语音 <br>
     * e.g: 12345号上线,坐标为 24.936, 118.640
     * @param shooterId 士兵编号
     * @param lat 上线纬度
     * @param lng 上线经度
     */
    speakOnline(shooterId,lat,lng) {
      let latArr = lat.toString().split('.')
      let lngArr = lng.toString().split('.')
      const wavFiles = [
        `${numberAudioURL}/${shooterId}.wav`,
        require('@/assets/audio/common/haoshangxian.wav'),
        require('@/assets/audio/common/zuobiaowei.wav'),
        `${latlngAudioURL}/${latArr[0]}.wav`,
        `${latlngAudioURL}/dian${latArr[1]}.wav`,
        `${latlngAudioURL}/${lngArr[0]}.wav`,
        `${latlngAudioURL}/dian${lngArr[1]}.wav`,
        ]
      this.playAudio(wavFiles)

    },
    /**
     * 播放士兵移动语音 <br>
     * e.g: 12345号移动至 24.936, 118.640
     * @param shooterId 士兵编号
     * @param lat 移动纬度
     * @param lng 移动经度
     */
    speakMove(shooterId,lat,lng) {
      let latArr = lat.toString().split('.')
      let lngArr = lng.toString().split('.')
      const wavFiles = [
        `${numberAudioURL}/${shooterId}.wav`,
        require('@/assets/audio/common/hoayidongzhi.wav'),
        `${latlngAudioURL}/${latArr[0]}.wav`,
        `${latlngAudioURL}/dian${latArr[1]}.wav`,
        `${latlngAudioURL}/${lngArr[0]}.wav`,
        `${latlngAudioURL}/dian${lngArr[1]}.wav`,
      ]
      this.playAudio(wavFiles)

    },
    /**
     * 播放击中语音 <br>
     * e.g: 红队的11111号击中了蓝队的12345号的腹部
     * @param shooter_team 射击队伍
     * @param shooter 射击者编号
     * @param victim_team 受击者队伍
     * @param victim 受击者编号
     * @param part_hit 受击部位
     * @param isFriend 是否是友伤
     */
    speakHit(shooter_team,shooter,victim_team,victim,part_hit,isFriend) {
      const wavFiles = [
        hitMap[shooter_team],
        `${numberAudioURL}/${shooter}.wav`,
        require('@/assets/audio/common/haojizhongle.wav'),
        hitMap[victim_team],
        `${numberAudioURL}/${victim}.wav`,
        require('@/assets/audio/common/haode.wav'),
        hitPartMap[part_hit]]
      if(isFriend){
        wavFiles.unshift(require('@/assets/audio/common/youshang.wav'))
      }
      this.playAudio(wavFiles)

    },
    /**
     * 在每次对局开始时,在服务器上生成本次对局士兵编号的音频数据
     * @param id 士兵编号
     */
    initNumberAudio(id){
      axios.get(`${audioSaveURL}/number`,{
        params: {
          input: id,
          filename:id
        }
      })
    },
    // endregion

    // 全体装弹
    async fullCharging() {
      const { chargingNumber } = this
      const { data: res } = await this.$http.get("newvest/newloadall", {
        params: {
          ammoNum: chargingNumber,
        },
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("全体装弹失败")
      } else {
        this.getExerciseData()
        this.$message.success("全体装弹成功")
      }
      this.fullChargeVisible = false
    },
    // 单个士兵装弹
    async singleCharging() {
      const { chargingNumber } = this
      const { soldierId } = this
      const { data: res } = await this.$http.get("newvest/newloadone", {
        params: {
          ammoNum: chargingNumber,
          vestNum: soldierId,
        },
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("单体装弹失败")
      } else {
        this.getExerciseData()
        this.$message.success("单体装弹成功")
      }
      this.singleChargeVisible = false
    },

    // 开始演习
    async startScheme() {
      const schemeId = window.sessionStorage.getItem("schemeId")
      const { data: res } = await this.$http.get("newbattle/newstart", {
        params: {
          id: schemeId,
        },
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("开启对局失败")
      } else {
        this.$message.success("开启演习成功")
        this.getMapData()
        await this.getExerciseData()
        console.log(this.soldierlist)
        const active = (() => {
          const msrc = '开始演习'
          return newActive(msrc)
        })()
        this.activities.unshift(active)
        new Audio(require('@/assets/audio/common/kaishixunlian.wav')).play()
      }
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
        const active = (() => {
          const msrc = '结束演习'
          return newActive(msrc)
        })()
        this.activities.unshift(active)
        new Audio(require('@/assets/audio/common/jieshuxunlian.wav')).play()
      }
    },
  },
}
</script>

<style scoped>
.el-button {
  font-size: 20px;
}

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

.war-situation {
  display: flex;
}

.war-situation div {
  width: 30%;
}

.scroll_continar {
  margin-top: 20px;
  width: 70%;
}

.out {
  float: left;
}

.battle-data {
  display: flex;
}

.battle-data .option {
  width: 30%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;

}

.battle-data .option .el-button {
  width: 35%;
  margin: 40px 25px 0px 25px;
  font-size: 30px;

}

.battle-data .battle-info {
  width: 70%;
}

.charge-dialog {
  font-family: "Microsoft YaHei";
  font-size: 30px;
  font-weight: bold;
}

.charge-dialog .item {
  display: inline-block;
  font-size: 30px;
  font-weight: bold;
  margin: 20px;

}

/deep/ .charge-dialog .el-input__inner {
  height: 50px;
  font-size: 30px;
}

.red {
  font-size: 25px;
  margin: 10px;
  padding: 15px;
  color: #f56c6c;
  border-bottom: 1px solid #f56c6c;
}

.blue {
  font-size: 25px;
  margin: 10px;
  padding: 15px;
  color: #409eff;
  border-bottom: 1px solid #409eff;
}

.enddialog {
  height: 600px !important;
}

/deep/ .enddialog .el-table {
  font-size: 25px;
}
</style>
