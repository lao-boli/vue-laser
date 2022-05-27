<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newScheme' }">演习</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/schemeManagement' }"
      >设备列表</el-breadcrumb-item
      >
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <h3>设备列表</h3>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
<!--          <el-input
              placeholder="请输入内容"
              v-model="queryInfo.name"
              clearable
              @clear="getUserList"
          >
            <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
            ></el-button>
          </el-input>-->
        </el-col>
      </el-row>
      <el-table :data="deviceList" border stripe style="width: 80%">
        <el-table-column prop="lastSeenAt" label="上次上线时间" >
        </el-table-column>
        <el-table-column prop="name" label="设备名称" >
        </el-table-column>
        <el-table-column prop="devEUI" label="设备编号" >
        </el-table-column>

      </el-table>
      <!--分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "DeviceTable",
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        name: "",
        // 当前页数
        page: 1,
        // 当前每页条数
        pageSize: 5,
      },
      deviceList:[],
      total:0,
    }
  },
  created() {
    this.getDeviceList()
  },
  methods: {
    async getDeviceList() {
      const { data: res } = await this.$http.post(
          "/chirpStack/get-devices",
          this.queryInfo,
      )
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("获取设备列表失败")
      } else {
        this.deviceList = res.data.deviceList
        //去除时间中的T和Z
        this.deviceList.forEach(device => {
          if (device.lastSeenAt != null){
            device.lastSeenAt = device.lastSeenAt.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' ')
          }

        })
        this.total = parseInt(res.data.total)
        this.$message.success("获取设备列表成功")
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getDeviceList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.page = newPage
      this.getDeviceList()
    },
  },
}
</script>

<style scoped>

</style>
