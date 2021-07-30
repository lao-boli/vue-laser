  
<template>
  <el-container class="home_container">
    <el-header>
        <div>
          <span>激光模拟对抗系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
    <el-container>
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" unique-opened :collapse="isCollapse"
          :collapse-transition="false" router :default-active="activePath">
          <!-- <el-menu-item index="/setting" @click="saveNavState('/setting')">
            <i class="el-icon-setting"></i>
            <span slot="title">天线配置</span>
          </el-menu-item> -->
          <el-submenu index="/map">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>地图</span>
            </template>
            <el-menu-item index="/newMap" @click="saveNavState('/newMap')">
              <template slot="title">
              <!--图标-->
              <i class="el-icon-map-location"></i>
              <!--文本-->
              <span>新建地图</span>
            </template>
            </el-menu-item>
            <el-menu-item index="/mapManagement" @click="saveNavState('/mapManagement')">
              <template slot="title">
              <!--图标-->
              <i class="el-icon-picture"></i>
              <!--文本-->
              <span>地图管理</span>
            </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="/exercise">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>演习</span>
            </template>
            <el-menu-item index="/newScheme" @click="saveNavState('/newScheme')">
              <template slot="title">
              <!--图标-->
              <i class="el-icon-circle-plus"></i>
              <!--文本-->
              <span>新建方案</span>
            </template>
            </el-menu-item>
            <el-menu-item index="/schemeManagement" @click="saveNavState('/schemeManagement')">
              <template slot="title">
              <!--图标-->
              <i class="el-icon-bangzhu"></i>
              <!--文本-->
              <span>方案管理</span>
            </template>
            </el-menu-item>
            <el-menu-item index="/currentExercise" @click="saveNavState('/currentExercise')">
              <template slot="title">
              <!--图标-->
              <i class="el-icon-video-play"></i>
              <!--文本-->
              <span>当前演习</span>
            </template>
            </el-menu-item>
            <el-menu-item index="/exerciseReplay" @click="saveNavState('/exerciseReplay')">
              <template slot="title">
              <!--图标-->
              <i class="el-icon-refresh"></i>
              <!--文本-->
              <span>演习回放</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--内容主体-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 是否折叠
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse () {
      // 点击按钮折叠菜单
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      // 保存链接的激活状态
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style>
.el-header{
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div{
  display: flex;
  align-items: center;
}
.el-header span{
  margin-left: 15px;
}
.el-aside{
  background-color: #333744;
}
.el-menu{
      border-right: none;
    }
.el-main{
  background-color: #EAEDF1;
}
.home_container{
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>