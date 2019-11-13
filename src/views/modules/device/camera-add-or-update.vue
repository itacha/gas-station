<template>
  <el-dialog
    :title="!dataForm.cameraId ? '新增摄像机' : isEdit == false?'修改摄像机' : '查看摄像机详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="720px">
    <el-form size="medium" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span = "24">
          <el-form-item label="摄像机名称" prop="cameraName">
            <el-input v-model="dataForm.cameraName" placeholder="请输入摄像机名称" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span = "12">
          <el-form-item label="摄像机类别"  prop="cameraType">
            <el-select v-model="dataForm.cameraType" placeholder="请选择摄像机类别" style="width:220px" :disabled="isEdit">
                <el-option label="加油站入口" value="1"></el-option>
                <el-option label="加油站出口" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="IP地址" prop="ip">
            <el-input v-model="dataForm.ip" placeholder="请输入IP地址" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span = "12">
          <el-form-item label="设备标识" prop="cameraCode">
            <el-input v-model="dataForm.cameraCode" placeholder="请输入设备标识" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="端口号" prop="port">
            <el-input v-model="dataForm.port" placeholder="请输入端口号" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span = "24">
          <el-form-item label="算法服务器" size="mini" prop="serverIdList">
            <el-checkbox-group v-model="dataForm.serverIdList" :disabled="isEdit">
              <el-checkbox v-for="server in serverList" :key="server.serverId" :label="server.serverId"  >{{ server.serverName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dataForm.remark" placeholder="请输入备注" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if= "isEdit == false" @click="visible = false" size="medium">取消</el-button>
      <el-button v-if= "isEdit == false" type="primary" @click="dataFormSubmit()" size="medium">确定</el-button>
      <el-button v-if="isEdit == true" type="primary" @click="visible = false" size="medium">关闭</el-button>
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
          cameraId: '',
          cameraName: '',
          cameraCode: '',
          cameraType: '',
          ip: '',
          port: '',
          serverIdList: [],
          remark: '',
          createTime: '',
          updateTime: ''
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
            { required: true, message: 'ip地址不能为空', trigger: 'blur' },
            { pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/, message: 'ip输入有误' }
          ],
           port: [
            { required: true, message: '端口号不能为空', trigger: 'blur' },
            { pattern: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, message: '端口输入有误' }
          ],
          remark:[
          ]
        }
      }
    },
    methods: {
      init (cameraId) {
        this.dataForm.cameraId = cameraId || 0;
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
          if (this.dataForm.cameraId) {
            this.$http({
              url: this.$http.adornUrl(`/business/cameramanage/info/${this.dataForm.cameraId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                Object.assign(this.dataForm, data.cameraManage);
                // this.dataForm.cameraName = data.cameraManage.cameraName
                // this.dataForm.cameraType = data.cameraManage.cameraType
                // this.dataForm.cameraCode = data.cameraManage.cameraCode
                // this.dataForm.ip = data.cameraManage.ip
                // this.dataForm.port = data.cameraManage.port
                // this.dataForm.serverIdList = data.cameraManage.serverIdList
                // this.dataForm.remark = data.cameraManage.remark
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
              url: this.$http.adornUrl(`/business/cameramanage/${!this.dataForm.cameraId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'cameraId': this.dataForm.cameraId || undefined,
                'cameraName': this.dataForm.cameraName,
                'cameraType': this.dataForm.cameraType,
                'cameraCode': this.dataForm.cameraCode,
                'ip': this.dataForm.ip,
                'port': this.dataForm.port,
                'remark': this.dataForm.remark,
                'serverIdList': this.dataForm.serverIdList,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
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
