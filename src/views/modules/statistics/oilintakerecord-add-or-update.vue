<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span = "12">
          <el-form-item label="油罐名称" prop="oilTankName">
            <el-input v-model="dataForm.oilTankName" placeholder="油罐名称"></el-input>
          </el-form-item>
          <el-form-item label="油品" prop="serverType">
            <el-select v-model="dataForm.gasolineNum" placeholder="请选择油品">
              <el-option label="请选择" value=""></el-option>
              <el-option label="90#汽油" value="0"></el-option>
              <el-option label="97#汽油" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span = "12">
          <el-form-item label="数量" prop="count">
            <el-input v-model="dataForm.count" placeholder="数量（吨）"></el-input>
          </el-form-item>
          <el-form-item label="经办人" prop="handler">
            <el-input v-model="dataForm.handler" placeholder="经办人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span = "24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dataForm.remark" placeholder="备注"></el-input>
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
          recordId: 0,
          oilTankName: '',
          gasolineNum: '',
          count: '',
          handler: '',
          remark: ''
        },
        dataRule: {
          oilTankName: [
            { required: true, message: '油罐名称不能为空', trigger: 'blur' }
          ],
          gasolineNum: [
            { required: true, message: '油品不能为空', trigger: 'blur' }
          ],
          count: [
            { required: true, message: '数量（吨）不能为空', trigger: 'blur' }
          ],
          handler: [
            { required: true, message: '经办人不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.recordId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.recordId) {
            this.$http({
              url: this.$http.adornUrl(`/business/oilintakerecord/info/${this.dataForm.recordId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.oilTankName = data.oilIntakeRecord.oilTankName
                this.dataForm.gasolineNum = data.oilIntakeRecord.gasolineNum
                this.dataForm.count = data.oilIntakeRecord.count
                this.dataForm.handler = data.oilIntakeRecord.handler
                this.dataForm.remark = data.oilIntakeRecord.remark
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
              url: this.$http.adornUrl(`/business/oilintakerecord/${!this.dataForm.recordId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'recordId': this.dataForm.recordId || undefined,
                'oilTankName': this.dataForm.oilTankName,
                'gasolineNum': this.dataForm.gasolineNum,
                'count': this.dataForm.count,
                'handler': this.dataForm.handler,
                'remark': this.dataForm.remark,
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
