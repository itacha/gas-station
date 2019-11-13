<template>
  <el-dialog
    :title="!dataForm.fillingMachineId ? '新增加油机信息' : isEdit == false?'修改加油机信息' : '查看加油机详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="720px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span = "24">
          <el-form-item label="加油机名称" prop="machineName">
            <el-input v-model="dataForm.machineName" placeholder="请输入加油机名称" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="加油机状态"  prop="machineStatus">
            <el-select v-model="dataForm.machineStatus" placeholder="请选择加油机状态" style="width:560px" :disabled="isEdit">
                <el-option label="正常" value="0"></el-option>
                <el-option label="断电报警" value="1"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="算法服务器" size="mini" prop="serverIdList">
            <el-checkbox-group v-model="dataForm.serverIdList" :disabled="isEdit">
              <el-checkbox v-for="server in serverList" :key="server.serverId" :label="server.serverId"  >{{ server.serverName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dataForm.remark" placeholder="请输入备注" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if= "isEdit == false" @click="visible = false">取消</el-button>
      <el-button v-if= "isEdit == false" type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button v-if="isEdit == true" type="primary" @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      return {
        isEdit: false,
        visible: false,
        dataForm: {
          fillingMachineId: '',
          machineName: '',
          machineStatus: '',
          remark: ''
        },
        dataRule: {
          machineName: [
            { required: true, message: '加油机名称不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      init (fillingMachineId) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.dataForm.fillingMachineId = fillingMachineId || 0;
          if (this.dataForm.fillingMachineId) {
            this.$http({
              url: this.$http.adornUrl(`/business/fillingmachine/info/${this.dataForm.fillingMachineId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                //Object.assign(this.dataForm, data.fillingMachine);
                this.dataForm.fillingMachineId = data.fillingMachine.fillingMachineId
                this.dataForm.machineName = data.fillingMachine.machineName
                this.dataForm.machineStatus = data.fillingMachine.machineStatus
                this.dataForm.remark = data.fillingMachine.remark
              }
            })
          }
      },
      // 表单提交
      dataFormSubmit () {
        console.log(this.dataForm);
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/business/fillingmachine/${!this.dataForm.fillingMachineId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'fillingMachineId': this.dataForm.fillingMachineId || undefined,
                'machineName': this.dataForm.machineName,
                'machineStatus': this.dataForm.machineStatus,
                'remark': this.dataForm.remark
              }, false)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: data.msg,
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
