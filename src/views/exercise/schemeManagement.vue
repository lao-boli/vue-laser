<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newScheme' }">演习</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/schemeManagement' }">方案管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <h3>方案管理</h3>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="7" >
          <el-input placeholder="请输入内容" v-model="queeryInfo.name" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
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
          prop="mapName"
          label="地图名称"
          width="180px">
        </el-table-column>
        <el-table-column
          prop="redTeamList.length"
          label="红方人数"
          width="180px">
        </el-table-column>
        <el-table-column
          prop="blueTeamList.length"
          label="蓝方人数"
          width="180px">
        </el-table-column>
        <el-table-column label="操作" width="500px">
          <template slot-scope="scope">
            <!--显示按钮-->
            <el-button type="primary" size="mini" @click="start(scope.row)">开始演习</el-button>
            <el-button type="success" size="mini" @click="resume_load(scope.row)">加载正在进行的演习</el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeSchemeById(scope.row.id)"></el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queeryInfo: {
        name: '',
        // 当前页数
        page: 1,
        // 当前每页条数
        pageSize: 5
      },
      schemeList: [
        {
          blueVestNumStr: '6,7,8,9,10,16,17,18,19,20',
          blueVestWeapon: '步枪,步枪,步枪,步枪,步枪,冲锋枪,冲锋枪,冲锋枪,冲锋枪,冲锋枪',
          id: 'c4cb6af9ec544080a6d881804bbeb563',
          mapId: '7bdfaf61ef894940af383dd64349e1fe',
          mapName: '万达广场',
          mode: null,
          name: 'test2',
          redVestNumStr: '1,2,3,4,5,11,12,13,14,15',
          redVestWeapon: '步枪,步枪,步枪,步枪,步枪,手枪,手枪,手枪,手枪,手枪'
        },
        {
          name: '测试2',
          map: '嘉兴小区',
          r_date: '1-5',
          b_date: '6-10'
        }
      ],
      total: 2
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.post('newbattle/set/newquerylist', this.queeryInfo)
      console.log(res)
      if (res.code !== 200) {
        this.$message.error('获取方案列表失败')
      } else {
        this.$message.success('获取方案列表成功')
        this.schemeList = res.data.list
        this.total = res.data.total
      }
    },
    async start (row) {
      console.log(row.id)
      console.log(row.mapId)
      const { data: res } = await this.$http.get('newbattle/newstart', {
        params: {
          id: row.id
        }
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error('开启对局失败')
      } else {
        window.sessionStorage.setItem('activePath', '/currentExercise')
        window.sessionStorage.setItem('mapId', row.mapId)
        this.$router.push('/currentExercise')
      }
      // window.sessionStorage.setItem('activePath', '/currentExercise')
      // this.$router.push('/currentExercise')
    },
    async resume_load (row) {
      console.log(row.id)
      console.log(row.mapId)
      window.sessionStorage.setItem('activePath', '/currentExercise')
      window.sessionStorage.setItem('mapId', row.mapId)
      this.$router.push('/currentExercise')
      // window.sessionStorage.setItem('activePath', '/currentExercise')
      // this.$router.push('/currentExercise')
    },
    async removeSchemeById (uid) {
      console.log(uid)
      const { data: res } = await this.$http.get('newbattle/set/newdelete', {
        params: {
          id: uid
        }
      })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error('删除方案失败')
      } else {
        this.$message.success('删除方案成功')
        this.getUserList()
      }
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queeryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queeryInfo.page = newPage
      this.getUserList()
    }
  }
}
</script>

<style scoped>
h3{
  margin: 10px;
  padding: 15px;
  border-bottom: 1px solid #606266;
}
</style>
