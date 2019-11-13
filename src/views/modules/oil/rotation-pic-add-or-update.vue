<template>
  <el-dialog
    :title="!dataForm.picSettingId ? '新增配置项信息' : isEdit == false?'修改配置项信息' : '查看配置项详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="880px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span = "24">
          <el-form-item label="配置项名称" prop="settingName">
            <el-input v-model="dataForm.settingName" placeholder="请输入配置项名称" :disabled="isEdit"></el-input>
          </el-form-item>
          <!-- <el-form-item label="配置项状态"  prop="settingStatus">
            <el-select v-model="dataForm.settingStatus" placeholder="请选择配置项状态" style="width:560px" :disabled="isEdit">
                <el-option label="禁用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dataForm.remark" placeholder="请输入备注" :disabled="isEdit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    
      
    </el-form>
    <div style = "padding-bottom:20px;">
      <span class = "tittleClass" style = " display:block;margin-bottom:10px">显示屏图片配置</span>
      <el-upload
        style="margin-left:40px"
        ref = "fileUpload"
        :limit = 5
        action = "/"
        :multiple = "true"
        :auto-upload="false"
        list-type="picture-card"
        :before-upload="beforeAvatarUpload"
        :on-change="progressUpload"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :disabled="isEdit"
        >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
    <div style= "align:center">
      <span class = "tittleClass" style = " display:block;margin-bottom:10px">选择加油机</span>
      <template>
        <el-transfer v-model="dataForm.fillingMachineIds" :data="machineData" :titles="machineTitiles" style="margin-left:40px" ></el-transfer>
      </template>
    </div>
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
        machineData:[],
        machineTitiles : ['待选列表', '已选列表'],
        deleteDetails: [],
         //文件队列
        fileList: [],
        isEdit: false,
        visible: false,
        dataForm: {
          picSettingId: '',
          settingName: '',
          settingStatus: '',
          remark: '',
          fillingMachineIds:[]
        },
        dialogImageUrl: '',
        dialogVisible: false,
        dataRule: {
          settingName: [
            { required: true, message: '配置项名称不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    // computed:{
    //   hiddenUploadFunction(){
    //       return this.fileList.length >=5
    //   },
    // },
    methods: {
        uploadHidden(fileList) {
          if(fileList.length >=5 ){
              let url = document.getElementsByClassName("el-upload--picture-card");
              console.log(url[0]);
              url[0].style.display="none";
            }else{
               let url = document.getElementsByClassName("el-upload--picture-card");
              console.log(url[0]);
              url[0].style.display="";
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
            const isLt4M = file.size / 1024 / 1024 < 4;

            if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 或 PNG格式!');
            }
            if (!isLt4M) {
            this.$message.error('上传图片大小不能超过 4MB!');
            }
            return isJPG && isLt4M;
        },
        progressUpload(file, fileList) {
            const isJPG = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png');
            const isLt4M = file.size / 1024 / 1024 < 4;

            if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 或 PNG格式!');
            }
            if (!isLt4M) {
            this.$message.error('上传图片大小不能超过 4MB!');
            }
            if( isJPG && isLt4M){
              //添加文件
              this.fileList.push(file);
            }else{
              fileList.splice(fileList.findIndex((element) => (element.uid === file.uid)), 1)
            }
            this.uploadHidden(fileList);
        },
       handleRemove(file, fileList) {
         //删除文件列表
        this.fileList.splice(this.fileList.findIndex((element) => (element.uid === file.uid)), 1);
        this.deleteDetails.push(file.uid);
        fileList.splice(fileList.findIndex((element) => (element.uid === file.uid)), 1);
        this.uploadHidden(this.fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      init (picSettingId) {
        this.dataForm.picSettingId = picSettingId || '';
        this.$http({
          url: this.$http.adornUrl('/business/fillingmachine/listAll'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          var dataM = [];
          if (data && data.code === 0) {
              var result = data.list
              for(var i=0;i<result.length;i++){
                if(this.isEdit == true){
                  dataM.push({
                    key: result[i].fillingMachineId,
                    label: result[i].machineName,
                    disabled: true
                  })
                }else{
                  dataM.push({  
                    key: result[i].fillingMachineId,
                    label: result[i].machineName
                  })
                }
              
              }
              this.machineData = [];
              this.machineData = dataM;
          } else {
              this.machineData = []
          }
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields();
            this.deleteDetails = [];
            this.fileList = [];
          })
        }).then(() => {
          if (this.dataForm.picSettingId) {
            this.$http({
              url: this.$http.adornUrl(`/business/rotationpicsetting/info/${this.dataForm.picSettingId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                //获取文件列表
                var details = data.rotationPicSetting.details;
                this.fileList = [];
                if(details.length>0){
                  for(var i=0; i<details.length; i++){
                    this.fileList.push({
                      uid: details[i].picId,
                      name: details[i].name,
                      url: details[i].picPath
                    });
                  }
                  this.uploadHidden(this.fileList);
                }
                this.dataForm.picSettingId = data.rotationPicSetting.picSettingId
                this.dataForm.settingName = data.rotationPicSetting.settingName
                this.dataForm.settingStatus = data.rotationPicSetting.settingStatus
                this.dataForm.remark = data.rotationPicSetting.remark
                this.dataForm.fillingMachineIds = data.rotationPicSetting.fillingMachineIds
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
            //组装参数
            let formData = new FormData();
            console.log(this.fileList[0])
            this.fileList.forEach((file) => {
              console.log(file);
              formData.append('file[]', file.raw);
            });
            formData.append('picSettingId',this.dataForm.picSettingId);
            formData.append('settingName',this.dataForm.settingName,);
            formData.append('settingStatus',this.dataForm.settingStatus,);
            formData.append('remark',this.dataForm.remark);
            formData.append('deleteDetails',this.deleteDetails);
            formData.append('fillingMachineIds',this.dataForm.fillingMachineIds);
            console.log(formData);
    
            this.$http.post(this.$http.adornUrl(`/business/rotationpicsetting/${!this.dataForm.picSettingId ? 'save' : 'update'}`),formData)
            .then(({data}) => {
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
<style scoped>
  .tittleClass {
    line-height: 24px;
    font-size: 18px;
    color: #303133;
  }
</style>

