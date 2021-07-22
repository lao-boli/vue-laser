<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/setting' }">天线配置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="天线接口">
          <el-select v-model="formInline.com" placeholder="天线接口" :disabled="link">
            <el-option :label="item" :value="item" v-for="(item, index) in formList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" v-if="link === false">连接</el-button>
          <el-button type="danger" @click="onCancel" v-else>断开</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formList: [],
      formInline: {
        com: '',
        baudRate: 9600
      },
      portInfo: [],
      // 连接或断开
      link: false
    }
  },
  created () {
    this.getPortList()
    this.getPortInfo()
    // this.onCancel()
  },
  methods: {
    // 获取所有可用串口
    async getPortList () {
      const { data: res } = await this.$http.get('serialPort/list')
      console.log(res)
      if (res.code !== 200) {
        this.$message.error('获取串口列表失败')
      } else if (res.code === 200) {
        this.formList = res.data
        console.log(this.formList)
        this.$message.success('获取串口列表成功')
      }
    },
    // 获取所有串口信息
    async getPortInfo () {
      const { data: res } = await this.$http.get('serialPort/getnew')
      console.log(res)
    },
    // 连接
    async onSubmit () {
      const { data: res } = await this.$http.get('serialPort/open', {
        params: {
          baudRate: this.formInline.baudRate,
          portName: this.formInline.com
        }
      })
      console.log(res)
      if (res.code !== 200) {
        if (res.code === 400002) {
          this.$message.info('该串口已是开启状态')
          this.link = !this.link
        } else {
          this.$message.error('连接指定端口设备失败')
        }
      } else if (res.code === 200) {
        this.$message.success(res.msg)
        this.link = !this.link
        console.log('submit!')
      }
    },
    // 断开连接
    async onCancel () {
      const { data: res } = await this.$http.get('serialPort/close')
      console.log(res)
      if (res.code !== 200) {
        this.$message.error('关闭串口失败')
      } else if (res.code === 200) {
        this.$message.success('关闭串口成功')
        this.link = !this.link
        console.log('cancel')
      }
    }
  }
}
</script>

<style scoped lang="less">
.el-select{
  width: 200px;
}
.el-button--primary:focus{
  background-color: #409EFF;
}
</style>
