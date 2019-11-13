<template>
  <el-dialog
    :title="!dataForm.oilTankId ? '新增油罐信息' : isEdit == false?'修改油罐信息' : '查看油罐分析详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="720px">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <!-- <el-col :span = "24">
          <el-form-item label="油罐名称" prop="oilTankName">
            <el-input v-model="dataForm.oilTankName" placeholder="请输入油罐名称" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span = "12">
          <el-form-item label="油罐名称" prop="oilTankName">
            <el-input v-model="dataForm.oilTankName" placeholder="请输入油罐名称" :disabled="isEdit"></el-input>
          </el-form-item> 
          <el-form-item label="油品种类"  prop="gasolineType">
            <!-- <el-select v-model="dataForm.gasolineType" placeholder="请选择油品种类" style="width:220px" :disabled="isEdit">
                <el-option label="加油站入口" value="1"></el-option>
                <el-option label="加油站出口" value="2"></el-option>
            </el-select> -->
            <el-input v-model="dataForm.gasolineType" placeholder="请选择油品种类" :disabled="isEdit"></el-input>
          </el-form-item>
           <el-form-item label="总容量吨数" prop="totalTon">
            <el-input v-model="dataForm.totalTon" placeholder="请输入总容量吨数" :disabled="isEdit"></el-input>
          </el-form-item>
            <el-form-item label="库存吨数" prop="storageTon">
            <el-input v-model="dataForm.storageTon" placeholder="请输入库存吨数" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="存油比例" prop="storageProportion">
            <el-input v-model="dataForm.storageProportion" placeholder="请输入存油比例" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span = "12">
          <el-form-item label="油品名称" prop="gasolineNum">
            <el-input v-model="dataForm.gasolineNum" placeholder="请输入油品名称" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="现单价" prop="unitPrice">
            <el-input v-model="dataForm.unitPrice" placeholder="请输入现单价" :disabled="isEdit"></el-input>
          </el-form-item>
         
          <el-form-item label="总容量升数" prop="totalLitre">
            <el-input v-model="dataForm.totalLitre" placeholder="请输入总容量升数" :disabled="isEdit"></el-input>
          </el-form-item>
        
          <el-form-item label="库存升数" prop="storageLitre">
            <el-input v-model="dataForm.storageLitre" placeholder="请输入库存升数" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="总价值" prop="totalValue">
            <el-input v-model="dataForm.totalValue" totalValue="请输入总价值" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span = "24">
          <el-form-item label="算法服务器" size="mini" prop="serverIdList">
            <el-checkbox-group v-model="dataForm.serverIdList" :disabled="isEdit">
              <el-checkbox v-for="server in serverList" :key="server.serverId" :label="server.serverId"  >{{ server.serverName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dataForm.remark" placeholder="请输入备注" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col> -->
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
          oilTankId: '',
          oilTankName: '',
          oilTankUnit: '',
          gasolineNum: '',
          gasolineType: '',
          unitPrice: 0,
          totalTon: 0,
          oilDensity: 0,
          storageProportion: 0,
          totalValue: 0,
          totalLitre: 0,
          storageTon: 0,
          storageLitre: 0
        },
        dataRule: {
         
        }
      }
    },
    methods: {
      init (oilTankId) {
        this.dataForm.oilTankId = oilTankId || 0;
          if (this.dataForm.oilTankId) {
            this.$http({
              url: this.$http.adornUrl(`/business/oiltankmanage/info/${this.dataForm.oilTankId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.visible = true
              if (data && data.code === 0) {
                Object.assign(this.dataForm, data.oilTankManage);
                this.dataForm.oilTankId  = data.oilTankManage.oilTankId
                this.dataForm.oilTankName = data.oilTankManage.oilTankName
                this.dataForm.oilTankUnit = data.oilTankManage.oilTankUnit
                this.dataForm.gasolineNum = data.oilTankManage.gasolineNum
                this.dataForm.gasolineType = data.oilTankManage.gasolineType
                this.dataForm.unitPrice = data.oilTankManage.unitPrice
                this.dataForm.totalTon = data.oilTankManage.totalTon
                this.dataForm.oilDensity = data.oilTankManage.oilDensity
                this.dataForm.storageProportion = data.oilTankManage.storageProportion
                this.dataForm.totalValue = data.oilTankManage.totalValue
                this.dataForm.totalLitre = data.oilTankManage.totalLitre
                this.dataForm.storageTon = data.oilTankManage.storageTon
                this.dataForm.storageLitre = data.oilTankManage.storageLitre

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
              url: this.$http.adornUrl(`/business/oiltankmanage/${!this.dataForm.oilTankId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'oilTankId': this.dataForm.oilTankId || undefined,
                'oilTankName': this.dataForm.oilTankName,
                'oilTankUnit': this.dataForm.oilTankUnit,
                'gasolineNum': this.dataForm.gasolineNum,
                'gasolineType': this.dataForm.gasolineType,
                'unitPrice': this.dataForm.unitPrice,
                'totalTon': this.dataForm.totalTon,
                'oilDensity': this.dataForm.oilDensity,
                'storageProportion': this.dataForm.storageProportion,
                'totalValue': this.dataForm.totalValue,
                'totalLitre': this.dataForm.totalLitre,
                'storageTon': this.dataForm.storageTon,
                'storageLitre': this.dataForm.storageLitre
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
