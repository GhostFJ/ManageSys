<!-- 权限界面 -->
<template>
<div class=''>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
    <el-table :data="rightsList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template v-slot:default="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
import request from '@/network/request'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {

  },
  data() {
    return {
      rightsList: []
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
    getRightsList() {
      request.get('rights/list').then(res => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败')
        }
        this.rightsList = res.data
        console.log(this.rightsList)
      })
      // const { data: res } = await this.$http.get('rights/list')
      // console.log(res)
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取权限列表失败')
      // }
      // this.rightsList = res.data
      // console.log(this.rightsList)
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getRightsList()
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

</style>
