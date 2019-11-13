<template>
  <el-dialog
    :title="!dataForm.salesRecordsId ? '新增订单' : isEdit == false?'修改订单' : '查看订单详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="720px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-row>
            <el-col :span = "12">
                <el-form-item label="流水编号" prop="serialNum">
                    <el-input v-model="dataForm.serialNum" placeholder="请输入流水编号" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="车牌号" prop="plateNumber">
                    <el-input  v-model="dataForm.plateNumber" placeholder="请输入车牌号" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="单价" prop="unitPrice">
                    <el-input-number v-model="dataForm.unitPrice" :precision="2" :step="0.1" :max="100" :disabled="isEdit"  placeholder="请输入单价" style="width:220px"></el-input-number>
                    <!-- <el-input v-model="dataForm.amount" placeholder="请输入金额" :disabled="isEdit"></el-input> -->
                </el-form-item>
                <el-form-item label="实付金额" prop="amount">
                    <el-input-number v-model="dataForm.amount" :precision="2" :step="0.1" :max="1000000" :disabled="isEdit"  placeholder="请输入金额" style="width:220px"></el-input-number>
                    <!-- <el-input v-model="dataForm.amount" placeholder="请输入金额" :disabled="isEdit"></el-input> -->
                </el-form-item>
                <el-form-item label="油枪名称"  prop="gunName">
                    <el-input v-model="dataForm.gunName" placeholder="请输入选择油枪" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="加油机名称" prop="fillingName">
                    <el-input v-model="dataForm.fillingName" placeholder="请输入加油机名称" :disabled="isEdit"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span = "12">
                <el-form-item label="结算时间" prop="settlementTime">
                    <el-date-picker  :disabled="isEdit" type="datetime" placeholder="请选择结算时间" v-model="dataForm.settlementTime" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    <!-- <el-input v-model="dataForm.settlementTime" placeholder="请选择结算时间" :disabled="isEdit"></el-input> -->
                </el-form-item>
                <el-form-item label="用户手机号" prop="userTel">
                    <el-input  v-model="dataForm.userTel" placeholder="请输入用户手机号" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="quantity">
                    <el-input-number v-model="dataForm.quantity" :precision="2" :step="0.1" :max="1000" :disabled="isEdit"  placeholder="请输入数量" style="width:220px"></el-input-number>
                    <!-- <el-input v-model="dataForm.amount" placeholder="请输入金额" :disabled="isEdit"></el-input> -->
                </el-form-item>
                <el-form-item label="税金" prop="taxes">
                    <el-input-number v-model="dataForm.taxes" :precision="2" :step="0.1" :max="10000" :disabled="isEdit"  placeholder="请输入税金" style="width:220px"></el-input-number>
                    <!-- <el-input v-model="dataForm.taxes" placeholder="请输入税金" :disabled="isEdit"></el-input> -->
                </el-form-item>
                <el-form-item label="油品名称" prop="gasolineNum">
                    <el-input v-model="dataForm.gasolineNum" placeholder="请输入油品名称" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="订单状态"  prop="recordsStatus">
                    <el-select v-model="dataForm.recordsStatus" placeholder="请选择订单状态" style="width:220px" :disabled="isEdit">
                        <el-option label="创建" value="0"></el-option>
                        <el-option label="完成" value="1"></el-option>
                    </el-select>
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
        serverList: [],
        dataForm: {
          salesRecordsId: '',
          fillingMachineId: '',
          fillingName: '',
          refuelingGunId: '',
          gunName: '',
          gasolineNum: '',
          amount: 0,
          taxes: 0,
          unitPrice: 0,
          quantity: 0,
          userTel: '',
          recordsStatus: '',
          serialNum: '',
          settlementTime: '',
          createTime: '',
          updateTime: '',
          delFlag: '',
          plateNumber: ''
        },
        dataRule: {
          cameraName: [
            { required: true, message: '摄像机名称不能为空', trigger: 'blur' }
          ],
          cameraCode: [
            { required: true, message: '摄像机标识不能为空', trigger: 'blur' }
          ],
           cameraType: [
            { required: true, message: '摄像机类别不能为空', trigger: 'blur' }
          ],
           ip: [
            { required: true, message: 'ip地址不能为空', trigger: 'blur' }
          ],
           port: [
            { required: true, message: '端口号不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      init (salesRecordsId) {
        this.dataForm.salesRecordsId = salesRecordsId || 0;
        this.$http({
          url: this.$http.adornUrl('/business/servermanage/listAll'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.serverList = data && data.code === 0 ? data.servers : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.salesRecordsId) {
            this.$http({
              url: this.$http.adornUrl(`/business/salesrecords/info/${this.dataForm.salesRecordsId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                Object.assign(this.dataForm, data.salesRecords);
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        console.log(this.dataForm);
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/business/salesrecords/${!this.dataForm.salesRecordsId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'salesRecordsId': this.dataForm.salesRecordsId || undefined,
                'fillingMachineId': this.dataForm.fillingMachineId,
                'fillingName': this.dataForm.fillingName,
                'refuelingGunId': this.dataForm.refuelingGunId,
                'gunName': this.dataForm.gunName,
                'gasolineNum': this.dataForm.gasolineNum,
                'amount': this.dataForm.amount,
                'taxes': this.dataForm.taxes,
                'userTel': this.dataForm.userTel,
                'recordsStatus': this.dataForm.recordsStatus,
                'serialNum': this.dataForm.serialNum,
                'settlementTime': this.dataForm.settlementTime,
                'delFlag': this.dataForm.delFlag,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'unitPrice': this.dataForm.unitPrice,
                'quantity': this.dataForm.quantity,
                'plateNumber': this.dataForm.plateNumber
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
