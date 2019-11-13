<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span = "24">
          <el-form-item label="终端名称" prop="deviceName">
            <el-input v-model="dataForm.deviceName" placeholder="终端名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span = "12">
          <el-form-item label="终端标识" prop="deviceCode">
            <el-input v-model="dataForm.deviceCode" placeholder="终端标识"></el-input>
          </el-form-item>
          <el-form-item label="IP地址" prop="ip">
            <el-input v-model="dataForm.ip" placeholder="IP地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span = "12">
          <el-form-item label="端口号" prop="port">
            <el-input v-model="dataForm.port" placeholder="端口号"></el-input>
          </el-form-item>
          <el-form-item label="安装时间" prop="installTime">
            <el-date-picker
              v-model="dataForm.installTime"
              type="date"
              value-format = "yyyy-MM-dd"
              placeholder="安装时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span = "24">
          <el-form-item label="厂商" prop="manufacturer">
            <el-input v-model="dataForm.manufacturer" placeholder="厂商"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          deviceId: 0,
          deviceName: '',
          deviceCode: '',
          ip: '',
          port: '',
          manufacturer: '',
          installTime: ''
        },
        dataRule: {
          deviceName: [
            { required: true, message: '终端名称不能为空', trigger: 'blur' }
          ],
          deviceCode: [
            { required: true, message: '终端标识不能为空', trigger: 'blur' }
          ],
          ip: [
            { required: true, message: 'IP地址不能为空', trigger: 'blur' }
          ],
          port: [
            { required: true, message: '端口号不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.deviceId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.deviceId) {
            this.$http({
              url: this.$http.adornUrl(`/business/terminaldevice/info/${this.dataForm.deviceId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.deviceName = data.terminalDevice.deviceName
                this.dataForm.deviceCode = data.terminalDevice.deviceCode
                this.dataForm.ip = data.terminalDevice.ip
                this.dataForm.port = data.terminalDevice.port
                this.dataForm.manufacturer = data.terminalDevice.manufacturer
                this.dataForm.installTime = data.terminalDevice.installTime
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/business/terminaldevice/${!this.dataForm.deviceId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'deviceId': this.dataForm.deviceId || undefined,
                'deviceName': this.dataForm.deviceName,
                'deviceCode': this.dataForm.deviceCode,
                'ip': this.dataForm.ip,
                'port': this.dataForm.port,
                'manufacturer': this.dataForm.manufacturer,
                'installTime': this.dataForm.installTime
              })
            }).then(({data}) => {
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
