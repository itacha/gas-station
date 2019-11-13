<template>
  <div v-loading="loading" style="background:#fff;padding:70px 30px 40px;">
    <el-form ref="form" :model="form" label-width="100px" size="medium">
      <el-col :span="12">
        <el-form-item label="油企编号">
          <el-input v-model="form.com" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="负责人">
          <el-input v-model="form.linker" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="油企名称">
          <el-input v-model="form.com_name" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系电话">
          <el-input v-model="form.linkerphone" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="油企类型">
          <el-radio v-model="form.com_cate" label="1" :disabled="true">国企</el-radio>
          <el-radio v-model="form.com_cate" label="2" :disabled="true">民企</el-radio>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电子邮件">
          <el-input v-model="form.email" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="入驻日期">
          <el-input v-model="form.signtime" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="办公地址">
          <el-input v-model="form.address" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="法人名称">
          <el-input v-model="form.com_legalperson" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="详细地址">
          <el-input v-model="form.address" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="法人电话">
          <el-input v-model="form.com_legaltel" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="对账单周期">
          <el-input v-model="form.com_dzdcycle" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <div style="text-align:center">
      <el-button type="primary" size="small" @click="search">更新</el-button>
    </div>
  </div>
</template>

<script>
import { handleDate } from "@/utils/tools";
export default {
  data() {
    return {
      loading: false,
      form: {}
    }
  },
  computed: {
    position: function () {
      return '' + (this.form.province || '') + (this.form.city || '') + (this.form.area || '')
    }
  },
  methods: {
    search(val) {
      let x
      if(val == 0){
        x = 'info'
      }else{
        x = 'update'
      }
      this.loading = true
      this.$http
        .get(this.$http.adornUrl(`/business/station/${x}?ie=${new Date().getTime()}`))
        .then(res => {
          console.log(res)
          this.loading = false
          this.form = res.data.data.gasInfo
          // var time=this.form.signtime*1000
          this.form.signtime=this.form.signtime?handleDate(new Date(+this.form.signtime*1000),'yyyy-MM-dd hh:mm:ss'):'暂无数据'
        })
        // .catch(err => {
        //   this.loading = false
        //   this.$message.error('数据查询失败')
        // })
    }
  },
  mounted() {
    this.search(0)
  }
}
</script>

<style>
</style>
