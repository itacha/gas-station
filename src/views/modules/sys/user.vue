<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small" class="queryForm">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="请输入姓名或工号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item class="haddleRg">
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button
          v-if="isAuth('sys:user:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
      :header-cell-style="cm.theadStyle"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column
        prop="workNum"
        label="工号"
      ></el-table-column>
      <el-table-column prop="userName" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
            <span>{{scope.row.sex==0?'男':'女'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="岗位"></el-table-column>
      <!-- <el-table-column prop="email" label="邮箱"></el-table-column> -->
      <el-table-column prop="tel" label="电话">
        <template slot-scope="scope">
          <span v-if="scope.row.tel">{{scope.row.tel | phone}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="picture" label="照片">
        <template slot-scope="scope">
          <div>照片</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="loginName" label="系统账号"></el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column
        prop="createTime"
        width="180"
        label="录入日期"
      ></el-table-column>
      <el-table-column prop="status" label="账号状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="200" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:user:update')"
            size="mini"
            @click="addOrUpdateHandle(scope.row.userId)"
          >编辑</el-button>
          <el-button
            v-if="isAuth('sys:user:delete')"
            size="mini"
            @click="deleteHandle(scope.row)"
          >删除</el-button>
          <el-button
            v-if="isAuth('sys:user:update')"
            size="mini"
            @click="resetPass(scope.row)"
          >重置密码</el-button>
          <el-button
            v-if="isAuth('sys:user:update')&&scope.row.status==0"
            size="mini"
            style="margin-top:5px"
            @click="upStatus(scope.row)"
          >启用</el-button>
          <el-button
            v-if="isAuth('sys:user:update')&&scope.row.status==1"
            size="mini"
            style="margin-top:5px"
            @click="disable(scope.row)"
          >禁用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagesBox">
      <!-- <el-button
            v-if="isAuth('sys:user:update')"
            size="small"
            @click="exportExcel"
            class="exportBtn"
          >导出</el-button> -->
      <el-pagination
        background
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
export default {
  data() {
    return {
      dataForm: {
        userName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
    }
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList()
  },
  filters: {
      phone: function (value) {
        return value.substr(0, 3) + '****' + value.substr(7);
      },
  },
  methods: {
    exportExcel(){

    },
    indexMethod(index) {
      return index + 1
    },
    reset() {
      this.dataForm = {
        userName: ''
      }
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/user/list'),
        method: 'post',
        data: this.$http.adornData({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'userName': this.dataForm.userName
        }, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(row) {
      var userIds = row ? [row.userId] : this.dataListSelections.map(item => {
        return item.userId
      })
      this.$confirm(`确认删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/user/delete'),
          method: 'post',
          data: this.$http.adornData(userIds, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => { })
    },
    // 启用
    upStatus(row){
      this.$confirm('如果启用账号，账号将可用于登录使用系统功能。确定要启用该账号吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
         this.$http({
        url: this.$http.adornUrl('/sys/user/upStatus'),
        method: 'post',
        data: this.$http.adornData({
          'userId': row.userId,
          'status': 1
        }, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList()
        } else {
         
        }
      })
      })
     
    },
    // 禁用
    disable(row){
       this.$confirm('如果停用，账号将不可登录使用系统功能。确定要停用该账号吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.$http({
        url: this.$http.adornUrl('/sys/user/upStatus'),
        method: 'post',
        data: this.$http.adornData({
          'userId': row.userId,
          'status': 0
        }, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.getDataList()
        } else {
         
        }
      })
      })
       
    },
    // 重置密码
    resetPass(row){
      this.$http({
        url: this.$http.adornUrl('/sys/user/resetPassword'),
        method: 'post',
        data: this.$http.adornData({
          'userId': row.userId,
          'newPassword': '123456'
        }, false)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // this.getDataList()
          this.$message({
              message: '密码重置为123456',
              type: 'success',
              duration: 1500,
            })
        } else {
         
        }
      })
    }
  }
}
</script>
