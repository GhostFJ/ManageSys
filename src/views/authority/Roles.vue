<!-- 角色列表 -->
<template>
<div class=''>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表 -->
    <el-table :data="rolesList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightsById(scope.row, item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">
              <el-row :class="{bdtop: (index2 !== 0), 'vcenter': true}" v-for="(item2, index2) in item1.children" :key="item2.id">
                <!-- 二级权限 -->
                <el-col :span="6">
                  <el-tag type="success" closable @close="removeRightsById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="18">
                  <el-tag
                    v-for="(item3) in item2.children"
                    :key="item3.id"
                    type="warning"
                    closable
                    @close="removeRightsById(scope.row, item3.id)">
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作" v-slot="scope" width="360px">
        <!-- 修改按钮 -->
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
        <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDelteDialog()">删除</el-button>
        <!-- 分配角色按钮 -->
        <el-button type="warning" icon="el-icon-setting" size="mini"  @click="showSetDialog(scope.row)">分配权限</el-button>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 分配权限对话框 -->
  <el-dialog
    title="权限分配"
    :visible.sync="setDialogVisible"
    width="50%"
    @close="defKeys = []">
    <!-- 树形控件 -->
    <el-tree
      :data="rightsList"
      :props="treetProps"
      node-key="id"
      show-checkbox
      default-expand-all
      :default-checked-keys="defKeys"
      ref="treeRef">
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRights">确 定</el-button>
    </span>
  </el-dialog>
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
      rolesList: [],
      // 即将分配角色的id
      roleId: '',
      setDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treetProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defKeys: []
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
    getRolesList() {
      request.get('roles').then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('获取角色列表失败')
        }
        this.rolesList = res.data
      })
    },
    // 根据id删除权限
    removeRightsById(role, rightId) {
      this.$confirm('此操作将永久删除该权限，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        request.delete(`roles/${role.id}/rights/${rightId} `)
          .then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('删除权限失败')
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // this.getRolesList() 会重新渲染界面
            role.children = res.data
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 控制分配权限的对话框
    showSetDialog(role) {
      // 保存角色id
      this.roleId = role.id
      // 获取所有权限的数据
      request.get('rights/tree').then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取失败')
        }
        this.rightsList = res.data
      })
      // 获取 三级权限id
      this.getLeafKeys(role, this.defKeys)
      this.setDialogVisible = true
    },
    // 递归获取所有三级权限的id保存
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 为角色分配权限
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      request.post(`roles/${this.roleId}/rights`, { rids: idStr })
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('分配权限失败')
          }
          this.$message.success('分配权限成功')
          this.getRolesList()
        })
      this.setDialogVisible = false
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getRolesList()
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
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid rgb(218, 218, 218);
}
.bdbottom {
  border-bottom: 1px solid rgb(218, 218, 218);
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
