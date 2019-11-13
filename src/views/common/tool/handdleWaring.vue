<template>
    <div class="pageView">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="故障类型" prop="warningType">
            <el-radio-group v-model="form.warningType">
              <el-radio :label="i.value" v-for="(i,key) in options" :key="key">{{i.label}}</el-radio>
              <!-- <el-radio label="线下场地免费"></el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" prop="content">
            <el-input type="textarea" v-model="form.content" placeholder="填写故障内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
            <el-button  @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default{
    name:'handdleWaring',
    props:{
        warningId:{

        }
    },
    data(){
        return{
            form:{
                warningRecordId:this.warningId
            },
            options:[{value:11,label:'网络故障'},{value:12,label:'加油故障'},{value:13,label:'屏幕无显示'},{value:14,label:'其他'}],
            rules:{
                warningType:[{ required: true, message: '请选择故障类型', trigger: 'change' }],
                content:[{ min: 0, max: 200, message: '长度最大200个字符', trigger: 'blur' }]
            }
        }
    },
    methods:{
        onSubmit(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                console.log(this.form);
                this.$http({
                    url: this.$http.adornUrl(`/business/warning/dispose?warningRecordId=${this.form.warningRecordId}&warningType=${this.form.warningType}&content=${this.form.content}&ie=${new Date().getTime()}`),
                    method: "post",
                    data: JSON.stringify(this.form)
                  }).then(res => {
                    if(res.data.code !== 0){
                      this.$message.error(res.data.msg);
                      return;
                    }
                    this.$confirm(`保存成功`, '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'success'
                    }).then(() => {
                      this.$emit('refreshList');
                    }).catch(() => { })
                  })
                  .catch(err => {

                  })
              } else {

                return false;
              }
            });
        },
        cancel(){
            this.$emit('closeWaring');
        }
    }
}
</script>
