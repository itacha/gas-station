<template>
  <el-dialog
    :title="!dataForm.refuelingGunId ? '新增油枪信息' : isEdit == false?'修改油枪信息' : '查看油枪详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="720px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span = "24">
          <el-form-item label="油枪名称" prop="gunName">
            <el-input v-model="dataForm.gunName" placeholder="请输入油枪名称" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
           <el-form-item label="油品" prop="gasolineNum">
            <el-input v-model="dataForm.gasolineNum" placeholder="请输入油品" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="加油机名称" prop="machineName">
            <el-input v-model="dataForm.machineName" placeholder="请输入加油机名称" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="串口号" prop="serialPortNum">
            <el-input v-model="dataForm.serialPortNum" placeholder="请输入串口号" :disabled="isEdit?true:(!dataForm.refuelingGunId?false:true)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单价(升)" prop="price">
            <el-input v-model="dataForm.price" placeholder="请输入单价" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="油枪状态"  prop="gunStatus">
            <el-select v-model="dataForm.gunStatus" placeholder="请选择加油机状态" style="width:220px" :disabled="isEdit?true:(!dataForm.refuelingGunId?false:true)">
                <el-option label="闲置" value="0"></el-option>
                <el-option label="加油中" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="串口序号" prop="serialPortSort">
            <el-input v-model="dataForm.serialPortSort" placeholder="请输入串口序号" :disabled="isEdit?true:(!dataForm.refuelingGunId?false:true)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
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
          machineName:'',
          refuelingGunId: '',
          gunName: '',
          gasolineNum: '',
          serialPortNum: '',
          serialPortSort: '',
          price: '',
          gunStatus: '',
          fillingMachineId: '',
          remark: ''
        },
        dataRule: {
          // machineName: [
          //   { required: true, message: '加油机名称不能为空', trigger: 'blur' }
          // ],
        }
      }
    },
    methods: {
      init (refuelingGunId) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.dataForm.refuelingGunId = refuelingGunId || 0;
          if (this.dataForm.refuelingGunId) {
            this.$http({
              url: this.$http.adornUrl(`/business/refuelinggun/info/${this.dataForm.refuelingGunId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.machineName = data.refuelingGun.machineName
                this.dataForm.refuelingGunId = data.refuelingGun.refuelingGunId
                this.dataForm.gunName = data.refuelingGun.gunName
                this.dataForm.gasolineNum = data.refuelingGun.gasolineNum
                this.dataForm.serialPortNum = data.refuelingGun.serialPortNum
                this.dataForm.serialPortSort = data.refuelingGun.serialPortSort
                this.dataForm.price = data.refuelingGun.price
                this.dataForm.gunStatus = data.refuelingGun.gunStatus
                this.dataForm.fillingMachineId = data.refuelingGun.fillingMachineId
                this.dataForm.remark = data.refuelingGun.remark
              }
            })
          }else{
            this.dataForm.machineName = this.$route.params.machineName
            this.dataForm.fillingMachineId = this.$route.params.fillingMachineId
          }
      },
      // 表单提交
      dataFormSubmit () {
        console.log(this.dataForm);
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/business/refuelinggun/${!this.dataForm.refuelingGunId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'machineName' : this.dataForm.machineName,
                'refuelingGunId': this.dataForm.refuelingGunId  || undefined,
                'gunName': this.dataForm.gunName,
                'gasolineNum': this.dataForm.gasolineNum,
                'serialPortNum': this.dataForm.serialPortNum,
                'serialPortSort': this.dataForm.serialPortSort,
                'price': this.dataForm.price,
                'gunStatus': this.dataForm.gunStatus,
                'fillingMachineId': this.dataForm.fillingMachineId,
                'remark': this.dataForm.remark,
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
