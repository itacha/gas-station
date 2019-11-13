<template>
  <div style="padding:20px;background:#fff;">
    <el-row style="padding:20px;">
      <el-col :span="12">
        <el-button type="primary" size="small" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" size="small" @click="deleteHandle()">删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          @node-click="handleNodeClick"
          :default-expand-all="true">
        </el-tree>
      </el-col>
      <el-col :span="8" class="box4" v-if="updateVisible">
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import AddOrUpdate from './menu-add-or-update'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        menuList: [],
        updateVisible: false,
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      treeDataTranslate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.menuList = treeDataTranslate(data, 'menuId')
        })
      },
      handleNodeClick (data) {
        console.log(data)
        this.addOrUpdateHandle(data.menuId)
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.updateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle () {
        let keys = this.$refs.menuListTree.getCurrentKey()
        this.$confirm(`确定操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/delete/${keys}`),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
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
        }).catch(() => {})
      }
    }
  }
</script>
<style>
  .box4{
    margin: 20px auto;
    width: 540px;
    padding: 37px;
    position:relative;
    border: 1px solid #ccc;
    -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  }

</style>
