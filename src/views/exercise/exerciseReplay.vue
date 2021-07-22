<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newScheme' }">演习</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/exerciseReplay' }">演习回放</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <h3>演习回放</h3>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="7" >
          <el-input placeholder="请输入内容" v-model="queryInfo.name" clearable @clear="getSchemeList">
            <el-button slot="append" icon="el-icon-search" @click="getSchemeList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :data="schemeList"
        border
        stripe
        style="width: 80%">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="name"
          label="方案名称"
          width="180px">
        </el-table-column>
        <el-table-column
          prop="beginTime"
          label="开始时间"
          width="360px">
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间"
          width="360px">
        </el-table-column>
        <el-table-column label="操作" width="360px">
          <template slot-scope="scope">
            <!--显示按钮-->
            <el-button type="primary" size="mini" @click="start(scope.row.id)">开始回放</el-button>
            <!--统计按钮-->
            <el-button type="success" size="mini" @click="showTotalDialog(scope.row)">统计信息</el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeReplayById(scope.row.name)"></el-button>
          </template>
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
        :total="total">
      </el-pagination>
      <!--开启回放-->
      <el-dialog
      title="回放"
      :visible.sync="replayVisible"
      width="50%"
      :before-close="handleClose">
      <span>
        <video class="replay" controls :autoplay="true" playsinline :muted="true" :src="replaypath" width="400" height="300"></video>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replayVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="统计信息"
      :visible.sync="totalVisible"
      width="50%"
      :before-close="handleClose">
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
        <el-button @click="totalVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {basePort,baseURL,wsPath,fullBaseURL} from '../../globle'
export default {
  data () {
    return {
      // 开启统计信息对话框
      totalVisible: false,
      // 开启回放对话框
      replayVisible: false,
      replaypath: fullBaseURL+'newrecord/play',
      // 获取用户列表的参数对象
      queryInfo: {
        name: '',
        // 当前页数
        page: 1,
        // 当前每页条数
        pageSize: 5
      },
      schemeList: [
        {
          name: '测试',
          start: '2021/02/09/19:00:00',
          end: '2021/02/09/20:00:00'
        },
        {
          name: '测试2',
          start: '2021/02/02/19:00:00',
          end: '2021/02/02/20:00:00'
        }
      ],
      total: 2,
      // 统计信息
      blueTotalData: [],
      redTotalData: []
    }
  },
  created () {
    this.getSchemeList()
  },
  methods: {
    async getSchemeList () {
      const { data: res } = await this.$http.post('newrecord/querylist', this.queryInfo)
      console.log('返回数据', res)
      if (res.code !== 200) {
        this.$message.error('获取回放列表失败')
      } else {
        this.$message.success('获取回放列表成功')
        this.total = res.data.total
        this.schemeList = res.data.list
        console.log('回放列表', this.schemeList)
      }
    },
    start (uid) {
      // window.sessionStorage.setItem('activePath', '/currentExercise')
      // this.$router.push('/currentExercise')
      this.replaypath = fullBaseURL+'newrecord/play'
      this.replayVisible = true
      this.replaypath = this.replaypath + '?id=' + uid
    },
    removeReplayById (name) {
      console.log(name)
      for (let i = 0; i < this.schemeList.length; i++) {
        if (this.schemeList[i].name === name) { this.schemeList.splice(i, 1) }
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getSchemeList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.page = newPage
      this.getSchemeList()
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    showTotalDialog (row) {
      this.blueTotalData = []
      this.redTotalData = []
      for (let i = 0; i < row.newRecordEntityList.length; i++) {
        if (row.newRecordEntityList[i].team === 'blue') {
          this.blueTotalData.push(row.newRecordEntityList[i])
        } else {
          this.redTotalData.push(row.newRecordEntityList[i])
        }
      }
      this.totalVisible = true
    }
  }
}
</script>

<style scoped lang="less">
h3{
  margin: 10px;
  padding: 15px;
  border-bottom: 1px solid #606266;
}
.replay{
  position: relative;
  left: 50%;
  transform: translate(-50%,0);
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
</style>
