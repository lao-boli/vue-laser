<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newSchme' }">演习</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newSchme' }"
        >新建方案</el-breadcrumb-item
      >
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <h3>新建方案</h3>
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="演习名称:" prop="name">
          <el-input class="mapinput" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="演习地图:" prop="mapId">
          <el-select
            v-model="form.mapId"
            placeholder="请选择演习地图"
            popper-class="down"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in mapList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="红方人员:"
          v-for="item in form.redTeamList"
          :key="item.index"
          required
        >
          <el-col :span="3">
            <el-form-item>
              <el-input v-model="item.name" placeholder="如:张三"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性别：">
              <el-radio-group v-model="item.gender">
                <el-radio-button label="男"></el-radio-button>
                <el-radio-button label="女"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="人员编号:">
              <el-input v-model="item.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="年龄：">
              <el-input v-model="item.age"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="所属单位：">
              <el-input v-model="item.unit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="设备编号：">
              <el-input v-model="item.equipment"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addnewred">新增</el-button>
          <el-button type="danger" @click="deletered">删除</el-button>
        </el-form-item>
        <el-form-item
          label="蓝方人员:"
          v-for="item in form.blueTeamList"
          :key="item.index"
          required
        >
          <el-col :span="3">
            <el-form-item>
              <el-input v-model="item.name" placeholder="如:张三"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性别：">
              <el-radio-group v-model="item.gender">
                <el-radio-button label="男"></el-radio-button>
                <el-radio-button label="女"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="人员编号：">
              <el-input v-model="item.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="年龄：">
              <el-input v-model="item.age"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="所属单位：">
              <el-input v-model="item.unit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="设备编号：">
              <el-input v-model="item.equipment"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addnewblue">新增</el-button>
          <el-button type="danger" @click="deleteblue">删除</el-button>
        </el-form-item>
        <el-form-item label="演习模式:" prop="mode">
          <el-radio v-model="form.mode" label="0" border>训练模式</el-radio>
          <el-radio v-model="form.mode" label="1" border>演习模式</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        mapId: "",
        blueTeamList: [
          {
            age: 0,
            equipment: 0,
            gender: "",
            id: 0,
            name: "",
            unit: "",
          },
        ],
        mode: 0,
        redTeamList: [
          {
            age: 0,
            equipment: 0,
            gender: "",
            id: 0,
            name: "",
            unit: "",
          },
        ],
      },
      mapList: [
        { name: "嘉兴小区" },
        { name: "万达广场" },
        { name: "万达广场" },
        { name: "万达广场" },
        { name: "万达广场" },
        { name: "万达广场" },
        { name: "万达广场" },
        { name: "万达广场" },
      ],
      bluedata: [],
      reddata: [],
      // 表单验证规则
      rules: {
        name: [{ required: true, message: "请输入地图名称", trigger: "blur" }],
        mapId: [{ required: true, message: "请选择演习地图", trigger: "blur" }],
        mode: [
          { required: true, message: "请选择要进行的模式", trigger: "blur" },
        ],
      },
    }
  },
  created() {
    this.getMapList()
  },
  methods: {
    // 查询所有地图
    async getMapList() {
      const { data: res } = await this.$http.get("map/query")
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("获取地图列表失败")
      } else {
        this.mapList = res.data
        this.$message.success("获取地图列表成功")
      }
    },
    async onSubmit() {
      console.log(this.form)
      const { data: res } = await this.$http.post("newbattle/newset", this.form)
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("方案创建失败")
      } else {
        this.$message.success("方案创建成功")
        this.$router.push("/schemeManagement")
      }
    },
    // 新增红色马甲
    addnewred() {
      this.form.redTeamList.push({
        age: 0,
        equipment: 0,
        gender: "",
        id: 0,
        name: "",
        unit: "",
      })
    },
    deletered() {
      this.form.redTeamList.pop()
    },
    // 新增蓝色马甲
    addnewblue() {
      this.form.blueTeamList.push({
        age: 0,
        equipment: 0,
        gender: "",
        id: 0,
        name: "",
        unit: "",
      })
    },
    deleteblue() {
      this.form.blueTeamList.pop()
    },
  },
}
</script>

<style scoped>
h3 {
  margin: 10px;
  padding: 15px;
  border-bottom: 1px solid #606266;
}
.mapinput {
  width: 50%;
}
.idinput1 {
  width: 10%;
}
.idinput {
  width: 10%;
  margin-left: 10px;
}
.weponinput {
  width: 29%;
  margin-left: 10px;
}
</style>
