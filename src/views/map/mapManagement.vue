<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newMap' }">地图</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/mapManagement' }">地图管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <h3>地图管理</h3>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="7" >
          <el-input placeholder="请输入内容" v-model="queeryInfo.name" clearable @clear="getUserList" @change="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :data="mapList"
        border
        stripe
        style="width: 50%">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="name"
          label="地图名称"
          width="360px">
        </el-table-column>
        <el-table-column label="操作" width="360px">
          <template slot-scope="scope">
            <!--显示按钮-->
            <el-button type="primary" icon="el-icon-view" size="mini" @click="showViewDialog(scope.row.id)"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queeryInfo.page"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queeryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="预览"
      :visible.sync="viewDialogVisible"
      width="50%"
      :before-close="handleClose">
      <img :src="imgsrc" width="100%" height="100%">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmView">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  basePort, baseURL, wsPath, fullBaseURL,
} from "../../global"

export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queeryInfo: {
        name: "",
        // 当前页数
        page: 1,
        // 当前每页条数
        pageSize: 5,
      },
      total: 2,
      // 地图列表
      mapList: [{ name: "嘉兴小区" }, { name: "万达广场" }],
      imgsrc: `${fullBaseURL}picture/`,
      viewDialogVisible: false,
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.post("map/querylist", this.queeryInfo)
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("获取地图列表失败")
      } else if (res.code === 200) {
        this.mapList = res.data.list
        this.total = res.data.total
        this.$message.success("获取地图列表成功")
      }
    },
    showViewDialog(id) {
      console.log(id)
      for (let i = 0; i < this.mapList.length; i++) {
        if (this.mapList[i].id === id) {
          this.imgsrc += this.mapList[i].path
          console.log(this.imgsrc)
        }
      }
      this.viewDialogVisible = true
    },
    async removeUserById(uid) {
      // this.mapList.splice(id, 1)
      console.log(uid)
      const { data: res } = await this.$http.delete(`map/${uid}`)
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("删除地图失败")
      } else if (res.code === 200) {
        this.$message.success("删除地图成功")
        this.getUserList()
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queeryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queeryInfo.page = newPage
      this.getUserList()
    },
    // 预览关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.imgsrc = `${fullBaseURL}picture/`
          done()
        })
        .catch((_) => {})
    },
    // 确认预览
    confirmView() {
      this.viewDialogVisible = false
      this.imgsrc = `${fullBaseURL}picture/`
    },
  },
}
</script>

<style scoped>
h3{
  margin: 10px;
  padding: 15px;
  border-bottom: 1px solid #606266;
}
</style>
