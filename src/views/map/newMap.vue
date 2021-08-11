<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newMap' }">地图</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/newMap' }">新建地图</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <h3 >新建地图</h3>
      <el-form ref="form" :model="form" label-width="120px" enctype="multipart/form-data" :rules="rules">
        <el-form-item label="名称:" prop="name">
          <el-input class="mapinput" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="图片:" prop="pic" class="mapupload">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false"
            limit="1">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="左上角经度:" prop="leftTopLng">
          <el-input class="mapinput" v-model="form.leftTopLng"></el-input>
        </el-form-item>
        <el-form-item label="左上角纬度:" prop="leftTopLat">
          <el-input class="mapinput" v-model="form.leftTopLat"></el-input>
        </el-form-item>
        <el-form-item label="右下角经度:" prop="rightDownLng">
          <el-input class="mapinput" v-model="form.rightDownLng"></el-input>
        </el-form-item>
        <el-form-item label="右下角纬度:" prop="rightDownLat">
          <el-input class="mapinput" v-model="form.rightDownLat"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="mapinput" type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="resetForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--图片预览提示框-->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        path: "d:/",
        leftTopLng: "",
        leftTopLat: "",
        rightDownLng: "",
        rightDownLat: "",
        remark: "",
        time: "",
      },
      fileList: [],
      pic: new FormData(),
      // 图片预览
      dialogImageUrl: "",
      dialogVisible: false,
      // 表单验证
      rules: {
        name: [
          { required: true, message: "请输入地图名称", trigger: "blur" },
        ],
        leftTopLng: [
          { required: true, message: "请输入左上角经度", trigger: "blur" },
        ],
        leftTopLat: [
          { required: true, message: "请输入左上角纬度", trigger: "blur" },
        ],
        rightDownLng: [
          { required: true, message: "请输入右下角经度", trigger: "blur" },
        ],
        rightDownLat: [
          { required: true, message: "请输入右下角纬度", trigger: "blur" },
        ],
        pic: [
          { required: true, message: "请选择要上传的地图", trigger: "blur" },
        ],
      },
    }
  },
  methods: {
    async onSubmit() {
      console.log("submit!")
      console.log(this.form)
      console.log(this.pic)
      const time2 = new Date()
      this.form.time = `${time2.getFullYear()}-${time2.getMonth() + 1}-${time2.getDate()}`
      const image = new FormData()
      image.append("CreateMapRequest", JSON.stringify(this.form))
      image.append("map", this.pic)
      console.log(image)
      const { data: res } = await this.$http.post("map", image, { headers: { "Content-Type": "multipart/form-data" } })
      console.log(res)
      if (res.code !== 200) {
        this.$message.error("创建地图失败")
      } else if (res.code === 200) {
        this.$message.success("创建地图成功")
        this.$router.push("/mapManagement")
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.pic = file.raw
    },
    resetForm() {
      this.$refs.form.resetFields()
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
.mapinput{
  width:50%
}
.mapupload{
  width: 54%;
}
</style>
