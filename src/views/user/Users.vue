<!-- 用户列表界面 -->
<template>
<div class=''>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 上方搜索区域 -->
  <el-card class="box-card">
    <el-row :gutter="30">
      <el-col :span="10 ">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          class="input-with-select"
          clearable
          @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogVisible" @close="addDialogClosed">
          <el-form
          status-icon
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input v-model="addForm.checkPass"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm()" >确定</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
    <!-- 用户列表区域 stripe启用隔行变色效果-->
    <el-table :data="userList" border stripe>
      <!-- 索引列 -->
      <el-table-column type="index">
      </el-table-column>
      <!-- 表格主体 -->
      <el-table-column label="姓名" prop="username">
      </el-table-column>
      <el-table-column label="邮箱" prop="email">
      </el-table-column>
      <el-table-column label="电话" prop="mobile">
      </el-table-column>
      <el-table-column label="角色" prop="role_name">
      </el-table-column>
      <el-table-column label="状态" v-slot="scope">
        <el-switch
          v-model="scope.row.mg_state"
          @change="stateChange(scope.row)"
          active-text="活跃"
          inactive-text="下线">
        </el-switch>
      </el-table-column>
      <el-table-column label="操作" width="180px" v-slot="scope">
        <!-- 修改按钮 -->
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
        <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
        <!-- 分配角色按钮 -->
        <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>

  <!-- 修改用户的对话框 -->
  <el-dialog
    @close="editDialogClosed"
    title="修改用户"
    :visible.sync="editDialogVisible"
    width="50%">
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
      <el-form-item label="用户名">
        <el-input :placeholder="editForm.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editUserInfo">确 定</el-button>
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
    // 密码验证功能
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.addForm.checkPass !== '') {
          this.$refs.addFormRef.validateField('checkPass')
        }
        callback()
      }
    }
    // 确认密码功能
    const checkValidePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 验证邮箱功能
    const checkEmail = (rule, value, callback) => {
      // 验证邮箱的表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
    }
    // 验证手机号功能
    const checkMobile = (rule, value, callback) => {
      // 验证邮箱的表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制对话框的显示
      dialogVisible: false,
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        checkPass: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单的规则验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度3~10字符', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: checkValidePass, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户表单的规则验证
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 查询到的用户信息对象
      editForm: {}
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
    getUserList() {
      request({
        url: 'users',
        params: this.queryInfo
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败！')
        }
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    // 每页显示数目
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 当前是哪一页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 保存开关状态信息
    stateChange(info) {
      request({
        url: `users/${info.id}/state/${info.mg_state}`,
        method: 'put'
      }).then(res => {
        if (res.meta.status !== 200) {
          info.mg_state = !info.mg_state
          return this.$message.error('更新失败')
        } else {
          this.$message.success('更新成功')
        }
      })
    },
    // 对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 确认和取消按钮的绑定事件
    submitForm() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          request({
            url: 'users',
            method: 'post',
            data: {
              username: this.addForm.username,
              password: this.addForm.password,
              email: this.addForm.email,
              mobile: this.addForm.mobile
            }
          }).then(res => {
            if (res.meta.status !== 201) {
              this.$message.error('请求失败')
            } else {
              this.$message.success('添加成功')
            }
          })
          // 重新获取用户列表
          this.getUserList()
          this.dialogVisible = false
        } else {
          this.$message.error('error submit!!')
          this.dialogVisible = false
          return false
        }
      })
    },
    // 展示编辑用户的对话框
    showEditDialog(id) {
      request({
        url: `users/${id}`,
        method: 'get'
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户失败')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      })
    },
    // 修改用户的对话框关闭重置
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户的表单预验证
    editUserInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        request({
          url: `users/${this.editForm.id}`,
          method: 'put',
          data: {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        }).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('更新用户信息失败')
          }
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('更新用户信息成功')
        })
      })
    },
    // 删除用户
    removeUserById(id) {
      // 弹框询问,点击确认会返回字符串confirm，取消返回 cancel
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(resolve => {
        request.delete('users/' + id).then(res => {
          if (res.meta.status !== 200) {
            this.$message.error('删除用户失败')
          }
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getUserList()
      }).catch(reject => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getUserList()
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
