<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
    size="medium"
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <el-form-item label="服务器名称" prop="serverName">
        <el-input v-model="dataForm.serverName" placeholder="服务器名称"></el-input>
      </el-form-item>
      <el-form-item label="服务器类型" prop="serverType">
        <el-select v-model="dataForm.serverType" placeholder="请选择类型">
          <el-option label="请选择" value></el-option>
          <el-option label="类型一" value="0"></el-option>
          <el-option label="类型二" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务器标识" prop="serverCode">
        <el-input v-model="dataForm.serverCode" placeholder="服务器标识"></el-input>
      </el-form-item>
      <el-form-item label="服务器IP" prop="ip">
        <el-input v-model="dataForm.ip" placeholder="服务器IP"></el-input>
      </el-form-item>
      <el-form-item label="服务器端口" prop="port">
        <el-input v-model="dataForm.port" placeholder="服务器端口"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="medium">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" size="medium">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        serverId: 0,
        serverName: '',
        serverType: '',
        serverCode: '',
        ip: '',
        port: '',
        remark: '',
        createTime: '',
        updateTime: '',
        createId: '',
        updateId: ''
      },
      dataRule: {
        serverName: [
          { required: true, message: '服务器名称不能为空', trigger: 'blur' }
        ],
        serverType: [
          { required: true, message: '服务器类型不能为空', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '服务器IP不能为空', trigger: 'blur' },
          { pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/, message: 'ip输入有误' }
        ],
        port: [
          { required: true, message: '服务器端口不能为空', trigger: 'blur' },
          { pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, message: '端口输入有误' }
        ],
        remark:[
          
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.serverId = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.serverId) {
          this.$http({
            url: this.$http.adornUrl(`/business/servermanage/info/${this.dataForm.serverId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.serverName = data.serverManage.serverName
              this.dataForm.serverType = data.serverManage.serverType
              this.dataForm.serverCode = data.serverManage.serverCode
              this.dataForm.ip = data.serverManage.ip
              this.dataForm.port = data.serverManage.port
              this.dataForm.remark = data.serverManage.remark
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/business/servermanage/${!this.dataForm.serverId ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'serverId': this.dataForm.serverId || undefined,
              'serverName': this.dataForm.serverName,
              'serverType': this.dataForm.serverType,
              'serverCode': this.dataForm.serverCode,
              'ip': this.dataForm.ip,
              'port': this.dataForm.port,
              'remark': this.dataForm.remark,
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
