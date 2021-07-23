<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newScheme' }">演习</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/schemeManagement' }">当前演习</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-row :gutter="20" class="title" style="position: relative;">
        <el-col :span="2">
          <h3>当前演习</h3>
        </el-col>
        <el-col :span="2" >
          <el-button type="danger" v-if="videoStart === false" size="mini" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" @click="recordStart">录屏未开启</el-button>
          <el-button type="success" icon="el-icon-video-camera" v-else size="mini" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);">录屏中</el-button>
        </el-col>
      </el-row>
      <!--地图部分-->
      <div class="img_continar">
        <img :src="imgsrc" width="60%" height="100%" class="map">
          <el-button type="danger" circle size="mini" :style="reds[index]" v-for="(item, index) in soldierlist.red" :key="item.id" style="font-size: 3px">{{item.id}}</el-button>
          <el-button type="primary" circle size="mini" :style="blues[index]" v-for="(item,index) in soldierlist.blue" :key="item.id" style="font-size: 3px">{{item.id}}</el-button>
      </div>
      <div class="scroll_continar">
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
          <!--红方-->
          <el-col :span="4">
            <div style="height:220px;width:200px;background-color:#fff; border: 2px solid rgba(0,0,0,0.5)" class="out">
              <!-- 这里的标签名称要和main.js文件中定义的组件名称保持一致 -->
              <happy-scroll color="rgba(0,0,0,0.5)" size="6">
                <!-- 内层盒子——内容区 -->
                <div class="con">
                  <p>红方</p>
                  <p>正常：{{red.normal}}</p>
                  <p>轻伤：{{red.minorWound}}</p>
                  <p>中伤：{{red.slander}}</p>
                  <p>重伤：{{red.seriousInjury}}</p>
                  <p>死亡：{{red.dead}}</p>
                </div>
              </happy-scroll>
            </div>
          </el-col>
          <!--蓝方-->
          <el-col :span="4">
            <div style="height:220px;width:200px;background-color:#fff; border: 2px solid rgba(0,0,0,0.5)" class="out">
              <!-- 这里的标签名称要和main.js文件中定义的组件名称保持一致 -->
              <happy-scroll color="rgba(0,0,0,0.5)" size="6">
                <!-- 内层盒子——内容区 -->
                <div class="con">
                  <p>蓝方</p>
                  <p>正常：{{blue.normal}}</p>
                  <p>轻伤：{{blue.minorWound}}</p>
                  <p>中伤：{{blue.slander}}</p>
                  <p>重伤：{{blue.seriousInjury}}</p>
                  <p>死亡：{{blue.dead}}</p>
                </div>
              </happy-scroll>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" :offset="10">
            <el-input placeholder="初始弹量" v-model="batchCharging" clearable>
              <el-button slot="append" @click="batchCharge">批量充弹</el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <h3 class="red">红方</h3>
      <el-table
        :data="soldierlist.red"
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
        <el-table-column label="操作" width="360px">
          <template slot-scope="scope">
            <!--判死按钮-->
            <el-button type="danger" size="mini" @click="deathSentence(scope.row.id)" v-if="scope.row.hp > 0">判死</el-button>
            <!--判伤按钮-->
            <el-button type="warning" size="mini" @click="injury(scope.row.id)" v-if="scope.row.hp > 0">判伤</el-button>
            <!--充弹按钮-->
            <el-button type="primary" size="mini" @click="charge(scope.row.id)" v-if="scope.row.hp > 0">充弹</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--蓝方表格-->
      <h3 class="blue">蓝方</h3>
      <el-table
        :data="soldierlist.blue"
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
        <el-table-column label="操作" width="360px">
          <template slot-scope="scope">
            <!--判死按钮-->
            <el-button type="danger" size="mini" @click="deathSentence(scope.row.id)" v-if="scope.row.hp > 0">判死</el-button>
            <!--判伤按钮-->
            <el-button type="warning" size="mini" @click="injury(scope.row.id)" v-if="scope.row.hp > 0">判伤</el-button>
            <!--充弹按钮-->
            <el-button type="primary" size="mini" @click="charge(scope.row.id)" v-if="scope.row.hp > 0">充弹</el-button>
          </template>
        </el-table-column>
      </el-table>
      <h3 class="title">录屏</h3>
      <video controls autoplay playsinline ref="video" width="400" height="300"></video>
      <el-row>
        <el-button type="primary" plain @click="stopRecord" id="btn-stop-recording">演习结束</el-button>
      </el-row>
    </el-card>
    <!--判伤对话框-->
    <el-dialog
      title="受伤程度"
      :visible.sync="injuryVisible"
      width="30%"
      :before-close="handleClose">
      <el-radio-group v-model="radio1">
        <el-radio-button label="轻伤"></el-radio-button>
        <el-radio-button label="中伤"></el-radio-button>
        <el-radio-button label="重伤"></el-radio-button>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="injuryVisible = false">取 消</el-button>
        <el-button type="primary" @click="judgementOfInjury">确 定</el-button>
      </span>
    </el-dialog>
    <!--充弹对话框-->
    <el-dialog
      title="充弹数量"
      :visible.sync="chargeVisible"
      width="30%"
      :before-close="handleClose">
      <el-input placeholder="请输入所需弹量" v-model="Charging" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chargeVisible = false">取 消</el-button>
        <el-button type="primary" @click="chargebullet">确 定</el-button>
      </span>
    </el-dialog>
    <!--演习结束对话框-->
    <el-dialog
      title="战场实况"
      :visible.sync="endVisible"
      width="50%"
      :before-close="handleClose" class="enddialog" :close-on-click-modal="false">
      <h3 class="red">红方</h3>
      <el-table
        :data="redTotalData"
        style="width: 100%; margin-left: 10px; padding-left: 10px;"
        class="total-red"
        stripe>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="id"
          label="id"
          width="180">
        </el-table-column>
        <el-table-column
          prop="shoot"
          label="击中数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="beShooted"
          label="被击中数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="kill"
          label="击杀数"
          width="180">
        </el-table-column>
      </el-table>
      <h3 class="blue">蓝方</h3>
      <el-table
        :data="blueTotalData"
        style="width: 100%; margin-left: 10px; padding-left: 10px;"
        class="total-blue"
        stripe>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="id"
          label="id"
          width="180">
        </el-table-column>
        <el-table-column
          prop="shoot"
          label="击中数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="beShooted"
          label="被击中数"
          width="180">
        </el-table-column>
        <el-table-column
          prop="kill"
          label="击杀数"
          width="180">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endVisible = false">取 消</el-button>
        <el-button type="success" @click="clickEnd">结束</el-button>
        <el-button type="primary" @click="onClickDownDaily()">结束并导出txt</el-button>
      </span>
    </el-dialog>
    <!--是否开启录屏-->
    <el-dialog
      title="是否开启录屏"
      :visible.sync="recordVisible"
      width="30%"
      :before-close="handleClose">
      <span>
        (tips:开启录屏后可在演习回放界面回放录屏)
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recordVisible = false">取 消</el-button>
        <el-button type="primary" @click="startRecording">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import RecordRTC from 'recordrtc'
// import md5 from 'js-md5'
import { getSeekableBlob } from './ebml.util'
import BMF from 'browser-md5-file'
import ReconnectingWebSocket from 'reconnecting-websocket'
import {basePort,baseURL,wsPath,fullBaseURL,isGCJ} from '../../globle'

// Code from https://github.com/hiwanz/wgs2mars.js/blob/master/lib/wgs2mars.js

/**
 * @typedef {Object} Coord
 * @property {number} lat
 * @property {number} lng
 * /

/**
 * 
 * @param {number} wgLon
 * @param {number} wgLat
 * @returns {Coord} Object
 */
function transformFromWGSToGCJ(wgLon, wgLat) {
  // We are always in the Fucking China
  // const PI
  const PI = 3.14159265358979324
  // Krasovsky 1940
  // a = 6378245.0, 1/f = 298.3
  // b = a * (1 - f)
  // ee = (a^2 - b^2) / a^2
  const a = 6378245.0
  const ee = 0.00669342162296594323

  function transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))

    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
    return ret
  }

  function transformLon(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))

    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
    return ret
  }

  // World Geodetic System ==> Mars Geodetic System
  function transform(wgLon, wgLat) {
    let mgLoc = {}
    // if (!isInChina([wgLon, wgLat], chinaBorderData)) {
    //   mgLoc = {
    //     lat: wgLat,
    //     lng: wgLon
    //   }
    //   return mgLoc
    // }
    let dLat = transformLat(wgLon - 105.0, wgLat - 35.0)
    let dLon = transformLon(wgLon - 105.0, wgLat - 35.0)
    let radLat = wgLat / 180.0 * PI
    let magic = Math.sin(radLat)

    magic = 1 - ee * magic * magic

    let sqrtMagic = Math.sqrt(magic)

    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
    mgLoc = {
      lat: wgLat + dLat,
      lng: wgLon + dLon
    }
    return mgLoc
  }

  return transform(wgLon, wgLat)
}
/**
 * GPS coord dd.mmmmmm to dd.dddddd 
 * 
 * it's dd.mmmmmm not ddmm.mmmm
 * @param {number} dm
 * @returns {number}
 *  */
function dmToDd(dm){
  const d = Math.floor(dm)
  const m = dm - d
  const decimal_d = (m /60) * 100
  const dd = d + decimal_d
  return dd
}

export default {
  data () {
    return {
      // websocket
      websock: null,
      // 是否录屏dialog
      recordVisible: true,
      // 录屏
      video: null,
      videoStart: false,
      recorder: null,
      imgsrc: '', // require('../../assets/map/test1.png'),
      mapinfo: {
        // imgsrc: require('../../assets/map/test1.png'),
        // name: '万达广场',
        // leftTopLng: 118.999727,
        // leftTopLat: 25.430879,
        // rightDownLng: 119.007695,
        // rightDownLat: 25.426669
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
        dead: 0
      },
      // 蓝方
      blue: {
        normal: 0,
        outline: 0,
        minorWound: 0,
        slander: 0,
        seriousInjury: 0,
        dead: 0
      },
      // 充弹数据
      batchCharging: 0,
      // 士兵列表
      soldierlist: {
        red: [],
        blue: []
      },
      // 判伤对话框
      injuryVisible: false,
      injureId: 0,
      // 判伤参数
      radio1: '轻伤',
      radio2: 0,
      // 充弹对话框
      Charging: 0,
      chargeVisible: false,
      chargeId: 0,
      // 演习结束对话框
      endVisible: false,
      // 当前演习名称
      currentExerciseName: 'test',
      reds: [],
      blues: [],
      // 更新的个人数据
      newdata: {},
      // md5
      my_md5: '',
      // 统计数据
      blueTotalData: [],
      redTotalData: []
    }
  },
  created () {
    this.initWebSocket()
    this.getMapData()
    try{
      if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
        //const error = 'Your browser does NOT support the getDisplayMedia API.'
        //this.window.alert(error)
        throw new Error('Your browser does NOT support the getDisplayMedia API.')
      }
    } catch (err) {
      console.error(err)
      // this.$message.error("Error. Check insecure origin. ")
      this.$message.error("错误，请检查浏览器是否设置正确。录屏功能将被禁用。")
      this.recordVisible = false
    }
    // this.getExerciseData()
    // this.toPosition()
  },
  mounted () {
    this.video = document.querySelector('video')
    this.getExerciseData()
    // this.toPosition()
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  methods: {
    // 获取演习数据
    async getExerciseData () {
      this.red = {
        normal: 0,
        outline: 0,
        minorWound: 0,
        slander: 0,
        seriousInjury: 0,
        dead: 0
      }
      this.blue = {
        normal: 0,
        outline: 0,
        minorWound: 0,
        slander: 0,
        seriousInjury: 0,
        dead: 0
      }
      this.soldierlist.red = []
      this.soldierlist.blue = []
      const { data: res } = await this.$http.get('newvest/newlist')
      console.log('ExerciseData', res)
      if (res.code !== 200) {
        this.$message.error('获取演习信息失败')
      } else {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].team === 'red') {
            this.soldierlist.red.push(res.data[i])
            if (res.data[i].lastReportTime !== null) {
              this.red.normal += 1
              if (res.data[i].hp < 100 && res.data[i].hp >= 70) {
                this.red.minorWound += 1
              } else if (res.data[i].hp < 70 && res.data[i].hp >= 40) {
                this.red.slander += 1
              } else if (res.data[i].hp < 40 && res.data[i].hp > 0) {
                this.red.seriousInjury += 1
              } else if (res.data[i].hp <= 0) {
                this.red.dead += 1
              }
            }
          } else if (res.data[i].team === 'blue') {
            this.soldierlist.blue.push(res.data[i])
            if (res.data[i].lastReportTime !== null) {
              this.blue.normal += 1
              if (res.data[i].hp < 100 && res.data[i].hp >= 70) {
                this.blue.minorWound += 1
              } else if (res.data[i].hp < 70 && res.data[i].hp >= 40) {
                this.blue.slander += 1
              } else if (res.data[i].hp < 40 && res.data[i].hp > 0) {
                this.blue.seriousInjury += 1
              } else if (res.data[i].hp <= 0) {
                this.blue.dead += 1
              }
            }
          }
        }
        this.toPosition()
      }
    },
    // 获取地图数据
    async getMapData () {
      const mapId = window.sessionStorage.getItem('mapId')
      console.log(mapId)
      const { data: res } = await this.$http.get('map/get', {
        params: {
          id: mapId
        }
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error('获取地图信息失败')
      } else {
        this.mapinfo = res.data
        this.imgsrc = fullBaseURL+'picture/' + res.data.path
        console.log(this.mapinfo)
      }
    },
    // 根据马甲编号获取数据
    async getDataByNum (num) {
      console.log(num)
      const { data: res } = await this.$http.get('newvest/newget', {
        params: {
          vestNum: num
        }
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error('更新个人数据失败')
      } else {
        this.newdata = res.data
        console.log('更新个人数据成功')
        // this.toPosition()
      }
    },
    // 实时获取击杀数据
    initWebSocket () { // 初始化weosocket
    
      const wsuri = `ws://${baseURL}:${basePort}/${wsPath}`
      this.websock = new ReconnectingWebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      console.log('连接建立成功')
    },
    websocketonerror () { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage (e) { // 数据接收
      const redata = JSON.parse(e.data)
      // console.log(redata)
      var aData = new Date()
      var time = aData.getFullYear() + '-' + (aData.getMonth() + 1) + '-' + aData.getDate() + '-' + aData.getHours() + ':' + aData.getMinutes() + ':' + aData.getSeconds()
      console.log(time)
      var active = {
        content: '',
        timestamp: '',
        size: 'large',
        type: '',
        icon: '',
        color: ''
      }
      var msrc = ''
      // 移动信息
      // this.getDataByNum(redata.num)
      if (redata.mark === '1') {
        console.log('Before Modify Location')
        console.log(redata)
        redata.lng = dmToDd(redata.lng)
        redata.lat = dmToDd(redata.lat)
        console.log('After Modify Location')
        console.log(redata)
        console.log('士兵列表', this.soldierlist)
        //!Red Start
        for (let i = 0; i < this.soldierlist.red.length; i++) {
          if (this.soldierlist.red[i].id === redata.num) {
            if (this.soldierlist.red[i].lastReportTime === null) {
              msrc = redata.num + '号上线' + `坐标为 {${redata.lng}, ${redata.lat}} (WGS degrees)`
              const converted_coord=transformFromWGSToGCJ(redata.lng,redata.lat)
              console.log("GCJ is", converted_coord)
              this.$message.success(msrc)
              active.content = msrc
              active.timestamp = time
              active.color = '#0bbd87'

              console.log(active)
              this.activities.unshift(active)
              console.log('activities', this.activities)
              this.getExerciseData()
            } else {
              if(isGCJ==true){
                const converted_coord=transformFromWGSToGCJ(redata.lng,redata.lat)
                msrc = redata.num + '号移动至{' + converted_coord.lng + ',' + converted_coord.lat + '} (GCJ坐标)'
                const msrc_wgs = redata.num + '号移动至{' + redata.lng + ',' + redata.lat + '} (WGS)坐标'
                console.log(msrc_wgs)
              } else{
                msrc = redata.num + '号移动至{' + redata.lng + ',' + redata.lat + '} (WGS)坐标'
              }
              console.log('msrc', msrc)
              this.$message(msrc)
              active.content = msrc
              active.timestamp = time
              active.type = 'primary'
              console.log('active', active)
              this.activities.unshift(active)
              console.log('activities', this.activities)
              this.getExerciseData()
            }
          }
        }
        //! Red End
        //? Blue Start
        for (let j = 0; j < this.soldierlist.blue.length; j++) {
          if (this.soldierlist.blue[j].id === redata.num) {
            if (this.soldierlist.blue[j].lastReportTime === null) {
              msrc = redata.num + '号上线'
              console.log('msrc', msrc)
              this.$message.success(msrc)
              active.content = msrc
              active.timestamp = time
              active.color = '#0bbd87'

              console.log('active', active)
              this.activities.unshift(active)
              console.log('activities', this.activities)
              this.getExerciseData()
            } else {
              if(isGCJ==true){
                const converted_coord=transformFromWGSToGCJ(redata.lng,redata.lat)
                msrc = redata.num + '号移动至{' + converted_coord.lng + ',' + converted_coord.lat + '} (GCJ坐标)'
                const msrc_wgs = redata.num + '号移动至{' + redata.lng + ',' + redata.lat + '} (WGS)坐标'
                console.log(msrc_wgs)
              } else{
                msrc = redata.num + '号移动至{' + redata.lng + ',' + redata.lat + '} (WGS)坐标'
              }
              console.log('msrc', msrc)
              this.$message(msrc)
              active.content = msrc
              active.timestamp = time
              active.typr = 'primary'
              console.log('active', active)
              this.activities.unshift(active)
              console.log('activites', this.activities)
              this.getExerciseData()
            }
          }
        }
        //? Blue End
      } else if (redata.mark === '0') {
        console.log('击杀')
        this.getDataByNum(redata.shooteeNum)
        for (let i = 0; i < this.soldierlist.red.length; i++) {
          if (this.soldierlist.red[i].id === redata.shooteeNum) {
            if (this.soldierlist.red[i].hp > 34) {
              this.$message.warning(`蓝队的${redata.shooterNum}号击中了红队${redata.shooteeNum}号的${redata.position}`)
              active = {
                content: `蓝队的${redata.shooterNum}号击中了红队${redata.shooteeNum}号的${redata.position}`,
                timestamp: time,
                size: 'large',
                type: 'warning',
                icon: 'el-icon-s-help'
              }
              this.activities.unshift(active)
              console.log(this.activities)
              // this.soldierlist.red[i] = this.newdata
              // this.toPosition()
              this.getExerciseData()
            } else {
              this.$message.error(`蓝队的${redata.shooterNum}号击杀了红队的${redata.shooteeNum}号`)
              active = {
                content: `蓝队的${redata.shooterNum}号击杀了红队的${redata.shooteeNum}号`,
                timestamp: time,
                size: 'large',
                type: 'danger',
                icon: 'el-icon-close'
              }
              this.activities.unshift(active)
              console.log(this.activities)
              // this.soldierlist.red[i] = this.newdata
              // this.toPosition()
              this.getExerciseData()
            }
          }
        }
        for (let j = 0; j < this.soldierlist.blue.length; j++) {
          if (this.soldierlist.blue[j].id === redata.shooteeNum) {
            if (this.soldierlist.blue[j].hp > 34) {
              this.$message.warning(`红队的${redata.shooterNum}号击中了蓝队${redata.shooteeNum}号的${redata.position}`)
              active = {
                content: `红队的${redata.shooterNum}号击中了蓝队${redata.shooteeNum}号的${redata.position}`,
                timestamp: time,
                size: 'large',
                type: 'warning',
                icon: 'el-icon-s-help'
              }
              this.activities.unshift(active)
              console.log(this.activities)
              // this.soldierlist.blue[j] = this.newdata
              this.getExerciseData()
            } else {
              this.$message.error(`红队的${redata.shooterNum}号击杀了蓝队的${redata.shooteeNum}号`)
              active = {
                content: `红队的${redata.shooterNum}号击杀了蓝队的${redata.shooteeNum}号`,
                timestamp: time,
                size: 'large',
                type: 'danger',
                icon: 'el-icon-close'
              }
              this.activities.unshift(active)
              console.log(this.activities)
              // this.soldierlist.blue[j] = this.newdata
              // this.toPosition()
              this.getExerciseData()
            }
          }
        }
        // this.getExerciseData()
        // this.toPosition()
      } else {
        console.log('error')
      }
    },
    websocketsend (Data) {
      this.websock.send(Data)// 数据发送
    },
    websocketclose (e) { // 关闭
      console.log('断开连接', e)
      this.websock.close()
    },
    // 批量充弹
    async batchCharge () {
      console.log(this.batchCharging)
      const { data: res } = await this.$http.get('newvest/newloadall', {
        params: {
          ammoNum: this.batchCharging
        }
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error('批量充弹失败')
      } else {
        this.$message.success('批量充弹成功')
        this.getExerciseData()
      }
    },
    // 判死
    async deathSentence (id) {
      try{
        console.log(id)
        const { data: res } = await this.$http.get('newvest/newdie', {
          params: {
            vestNum: id
          }
        })
        console.log(res)
        if (res.code !== 200) {
          throw new Error(res.code)
        } else {
          this.$message.success('判定死亡成功')
          this.getExerciseData()
        }
      } catch(err){
        this.$message.error('判定死亡失败')
        this.getExerciseData()
      }

    },
    // 判伤
    async judgementOfInjury () {
      try{
        if (this.radio1 === '轻伤') {
          this.radio2 = 1
        } else {
          this.radio2 = 2
        }
        const { data: res } = await this.$http.get('newvest/newinjure', {
          params: {
            injure: this.radio2,
            vestNum: this.injureId
          }
        })
        console.log(res)
        if (res.code !== 200) {
          throw new Error(res.code)
        } else {
          this.$message.success('判定受伤成功')
          this.getExerciseData()
        }
      } catch(err){
        this.$message.error('判定受伤失败')
        this.getExerciseData()
      }
      this.injuryVisible = false
    },
    // 充弹
    charge (id) {
      console.log(id)
      this.chargeId = id
      this.chargeVisible = true
    },
    // 判伤对话框
    injury (id) {
      this.injureId = id
      this.injuryVisible = true
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 充弹对话框
    async chargebullet () {
      console.log(typeof this.Charging)
      console.log(typeof this.chargeId)
      try{
        const { data: res } = await this.$http.get('newvest/newloadone', {
          params: {
            ammoNum: Number.parseInt(this.Charging),
            vestNum: this.chargeId
          }
        })
        console.log(res)
        if (res.code !== 200) {
          throw new Error(res.code)
        } else {
          this.$message.success(`给${this.chargeId}号充弹成功`)
          this.getExerciseData()
          this.Charging = 0
          this.chargeVisible = false
        }
      } catch(err) {
        this.$message.error(`给${this.chargeId}号充弹失败`)
      }
    },
    onClickDownDaily () {
      var title = this.currentExerciseName
      var str = ''
      this.activities.forEach(item => {
        str += '事件:' + item.content + '   ' + '时间:' + item.timestamp + '\r\n'
      })
      var allStr = title + '\r\n' + '\r\n' + str
      var export_blob = new Blob([allStr])
      var save_link = document.createElement('a')
      save_link.href = window.URL.createObjectURL(export_blob)
      save_link.download = this.currentExerciseName + '.txt'
      this.fakeClick(save_link)
      this.endVisible = false
    },
    fakeClick (obj) {
      var ev = document.createEvent('MouseEvents')
      ev.initMouseEvent(
        'click',
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
        null
      )
      obj.dispatchEvent(ev)
    },
    toPosition () {
      this.reds = []
      this.blues = []
      const width_map = this.mapinfo.rightDownLng - this.mapinfo.leftTopLng
      const height_map = this.mapinfo.leftTopLat - this.mapinfo.rightDownLat
      //! Red Start
      for (let i = 0; i < this.soldierlist.red.length; i++) {
        let width_diff = 0
        let height_diff = 0
        if(isGCJ==true){
          const converted_coord = transformFromWGSToGCJ(this.soldierlist.red[i].lng, this.soldierlist.red[i].lat)
          width_diff = converted_coord.lng - this.mapinfo.leftTopLng
          height_diff = converted_coord.lat - this.mapinfo.rightDownLat
        } else{
          width_diff = this.soldierlist.red[i].lng - this.mapinfo.leftTopLng
          height_diff = this.soldierlist.red[i].lat - this.mapinfo.rightDownLat
        }
        // width_map is the width of map
        // width_diff is difference between actual coord to leftTop
        // ratio_width is the ratio diff/total
        let ratio_width = width_diff / width_map
        ratio_width = ratio_width * 0.6
        ratio_width += 0.2
        const ratio_width_pct = Number(ratio_width * 100).toFixed(4)
        const ratio_height = height_diff / height_map
        const ratio_height_pct = Number(ratio_height * 100).toFixed(4)
        const str = `position: absolute; left: ${ratio_width_pct}%; top: ${ratio_height_pct}%;`
        //* for debug
        const map={}
        map.width_map=width_map
        map.height_map=height_map
        map.height_diff=height_diff
        map.width_diff=width_diff
        map.ratio_width = width_diff / width_map
        map.ratio_width_mod=ratio_width
        map.ratio_height=ratio_height
        //* endmap
        console.log("red", str, map)
        this.reds.push(str)
      }
      //! Red End
      //? Blue Start
      for (let j = 0; j < this.soldierlist.blue.length; j++) {
        let width_diff = 0
        let height_diff = 0
        if(isGCJ==true){
          // console.log("GCJ is enabled for blue")
          const converted_coord = transformFromWGSToGCJ(this.soldierlist.blue[j].lng, this.soldierlist.blue[j].lat)
          width_diff = converted_coord.lng - this.mapinfo.leftTopLng
          height_diff = converted_coord.lat - this.mapinfo.rightDownLat
        } else{
          width_diff = this.soldierlist.blue[j].lng - this.mapinfo.leftTopLng
          width_diff = this.soldierlist.blue[j].lat - this.mapinfo.rightDownLat
        }
        let ratio_width = width_diff / width_map
        ratio_width = ratio_width * 0.6
        ratio_width += 0.2
        const ratio_width_pct = Number(ratio_width * 100).toFixed(4)
        const ratio_height = height_diff / height_map
        const ratio_height_pct = Number(ratio_height * 100).toFixed(4)
        const str = `position: absolute; left: ${ratio_width_pct}%; top: ${ratio_height_pct}%;`
        //* for debug
        const map={}
        map.width_map=width_map
        map.height_map=height_map
        map.height_diff=height_diff
        map.width_diff=width_diff
        map.ratio_width = width_diff / width_map
        map.ratio_width_mod=ratio_width
        map.ratio_height=ratio_height
        //* endmap
        console.log("blue", str, map)
        this.blues.push(str)
      }
      //? Blue Start
    },
    // 打开录屏提示框
    recordStart () {
      this.recordVisible = true
    },
    // 录屏必要函数
    invokeGetDisplayMedia (success, error) {
      let displaymediastreamconstraints = {
        video: {
          displaySurface: 'monitor', // monitor, window, application, browser
          logicalSurface: true,
          cursor: 'always' // never, always, motion
        }
      }
      // above constraints are NOT supported YET
      // that's why overridnig them
      displaymediastreamconstraints = {
        video: true
      }
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error)
      } else {
        navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error)
      }
    },
    captureScreen (callback) {
      try{
        this.invokeGetDisplayMedia((screen) => {
          this.addStreamStopListener(screen, () => {
            //
          })
          callback(screen)
        }, function (error) {
          console.error(error)
          //alert('Unable to capture your screen. Please check console logs.\n' + error)
        })
      } catch(err){
        console.error(err)
        this.$message.error(err)
      }
    },
    addStreamStopListener (stream, callback) {
      stream.addEventListener('ended', function () {
        callback()
        callback = function () { }
      }, false)
      stream.addEventListener('inactive', function () {
        callback()
        callback = function () { }
      }, false)
      stream.getTracks().forEach(function (track) {
        track.addEventListener('ended', function () {
          callback()
          callback = function () { }
        }, false)
        track.addEventListener('inactive', function () {
          callback()
          callback = function () { }
        }, false)
      })
    },
    startRecording () {
      this.recordVisible = false
      this.captureScreen(screen => {
        this.video.srcObject = screen
        this.recorder = RecordRTC(screen, {
          type: 'video',
          mimeType: 'video/webm\;codecs=vp8',
          disableLogs: false,
          getNativeBlob: false
        })
        this.recorder.startRecording()
        // release screen on stopRecording
        this.recorder.screen = screen
        this.videoStart = true
      })
    },
    stopRecordingCallback () {
      this.video.src = this.video.srcObject = null
      this.video.src = URL.createObjectURL(this.recorder.getBlob())
      // this.download()
      this.recorder.screen.stop()
      const blob = this.recorder.getBlob()
      console.log('blob', blob)
      this.recorder.destroy()
      this.recorder = null
      this.videoStart = false
      // console.log(this.video.src)
      const bmf = new BMF()
      const sliceSize = 5 * 1024 * 1024 // 每个文件切片大小定为5MB
      const fileSize = blob.size// 文件大小
      const fileName = Date.now() + '.webm'// 文件名
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
          chunk = blob.slice((i - 1) * sliceSize, fileSize - 1)// 切割文件
          console.log(chunk)
        } else {
          chunk = blob.slice((i - 1) * sliceSize, i * sliceSize)
          // console.log(chunk)
        }
        const videoData = new FormData()
        videoData.append('file', chunk)
        bmf.md5(
          blob,
          (err, md5) => {
            console.log('err:', err)
            console.log('md5 string:', md5) // 97027eb624f85892c69c4bcec8ab0f11
            this.my_md5 = md5
            console.log(this.my_md5)
          },
          progress => {
            console.log('progress number:', progress)
          }
        )
        videoData.append('md5', this.my_md5)
        // console.log(this.$md5(blob))
        videoData.append('VideoName', fileName)
        videoData.append('BattleName', 'totalSlice')
        videoData.append('size', fileSize)
        videoData.append('chunks', totalSlice)
        videoData.append('chunk', i)
        console.log(videoData)
        $.ajax({
          url: fullBaseURL+'newrecord/upload',
          type: 'POST',
          cache: false,
          data: videoData,
          processData: false,
          contentType: false,
          async: false
        })
      }
      this.$message({
        showClose: true,
        message: '回放上传成功',
        type: 'success',
        duration: 3000
      })
    },
    // 演习结束对话框
    async stopRecord () {
      this.endVisible = true
      this.redTotalData = []
      this.blueTotalData = []
      const { data: res } = await this.$http.get('newrecord/recordlist')
      console.log(res)
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].team === 'blue') {
          this.blueTotalData.push(res.data[i])
        } else {
          this.redTotalData.push(res.data[i])
        }
      }
      console.log('红方统计数据', this.redTotalData)
      console.log('蓝方统计数据', this.blueTotalData)
    },
    // 演习结束自动停止录屏
    stopRecording () {
      // this.endVisible = true
      this.recorder.stopRecording(this.stopRecordingCallback)
      console.log(this.video)
      console.log(this.recorder)
    },
    download () {
      getSeekableBlob(this.recorder.getBlob(), function (seekableBlob) {
        const url = window.URL.createObjectURL(seekableBlob)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        const fileName = Date.now() + '.webm'
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 结束演习
    async clickEnd () {
      const { data: res } = await this.$http.get('newbattle/newend')
      if (res.code !== 200) {
        this.$message.error('结束演习失败')
      } else {
        this.$message({
          showClose: true,
          message: '演习结束成功，正在上传演习回放，请勿关闭页面',
          type: 'success',
          duration: 3000
        })
        this.endVisible = false
        if (this.videoStart === false) {
          setTimeout(() => {
            this.$message({
              showClose: true,
              message: '无演习回放，无需上传',
              type: 'success',
              duration: 3000
            })
          }, 3000)
        } else {
          this.stopRecording()
        }
        // window.sessionStorage.setItem('activePath', '/exerciseReplay')
        // this.$router.push('/exerciseReplay')
      }
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
