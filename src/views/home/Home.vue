<!-- 主页面 -->
<template>
  <!-- 借助Contaiiner布局容器完成页面基本结构 -->
  <!-- 外层容器 -->
  <el-container class="home-container">
    <!-- 顶栏容器 -->
    <el-header height="80px">
      <div class="manageDiv">
        <img src="@/assets/img/heima.png" alt="">
        <span>电商后台管理</span>
      </div>
      <el-button @click="logOut()">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏容器 -->
      <el-aside :width="iscollapse ? '64px' : '180px'">
        <!-- 控制侧边栏的展开与隐藏 -->
        <div class="fold-button" @click="foldAside">
          <i v-if="!iscollapse" class="el-icon-s-fold"></i>
          <i v-else class="el-icon-s-unfold"></i>
        </div>
        <!-- 侧边栏菜单区域 unique-opened只保持一个子菜单的展开，-->
        <el-menu
          :default-active="navState"
          router
          :collapse-transition="false"
          :collapse="iscollapse"
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu v-for="(item, index) in menulist" :key="item.id" :index="item.id + ''" >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconList[index]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/home/'+subItem.path"
              @click="saveNavState('/home/'+subItem.path)">

              <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">其他</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主要区域容器 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 底栏容器 -->
  </el-container>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 导入封装的axios网络模块
import request from '@/network/request'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {

  },
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 对应图标
      iconList: [
        'el-icon-s-custom',
        'el-icon-s-management',
        'el-icon-s-goods',
        'el-icon-s-order',
        'el-icon-s-platform'
      ],
      iscollapse: false,
      // 高亮激活的二级菜单标签
      navState: ''
    }
  },
  // 监听属性 类似于data概念
  computed: {

  },
  // 监控data中的数据变化
  watch: {

  },
  // 方法集合
  methods: {
    logOut() {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
    // 获取所有的菜单
    getMenuList() {
      request({
        url: 'menus',
        type: 'get'
      }).then(resolve => {
        if (resolve.meta.status !== 200) {
          return this.$message.error(resolve.meta.msg)
        }
        this.menulist = resolve.data
      })
    },
    // 点击按钮，隐藏显示侧边栏
    foldAside() {
      this.iscollapse = !this.iscollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      this.navState = activePath
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getMenuList()
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #697175;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
}
.manageDiv {
  display: flex;
  align-items: center;
}
.manageDiv span {
  margin-left: 15px;
}
.el-aside {
  background-color: #545c64;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
.fold-button {
  cursor: pointer;
  height:25px;
  background-color: #b2b9c0;
}
.fold-button i {
  position: relative;
  left: 40%;
}
</style>
