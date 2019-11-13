<template>
  <div style="background:#fff;padding:10px;">
    <el-button icon="el-icon-back" circle @click="close" size="mini"></el-button>
    <el-form
      :inline="true"
      size="medium"
      label-width="120px"
      style="margin-top:20px"
      :disabled="true"
    >
      <el-form-item :label="item.label" v-for="(item, index) in keys" :key="index">
        <el-input v-model="data[item.value]"></el-input>
      </el-form-item>
    </el-form>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="10">
        <h4>异常原因：</h4>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="data.dzfaildesc"
          :disabled="true"
        ></el-input>
      </el-col>
      <el-col :span="10">
        <h4>申诉理由：</h4>
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="reason"></el-input>
      </el-col>
    </el-row>
    <div style="margin:20px auto;text-align:center">
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data', 'fun'],
  data() {
    return {
      keys: [
        { label: '对账单号', value: 'sn' },
        { label: '对账单状态', value: 'status' },
        { label: '对账单周期', value: 'createperiod' },
        { label: '创建时间', value: 'createtime' },
        { label: '销售记录总条数', value: 'number' },
        { label: '智慧油销售金额', value: 'facemoney' },
        { label: '加油卡销售金额', value: 'cardmoney' },
        { label: '对账单总额', value: 'oilstation' },
        { label: '对账单优惠总额', value: 'ptmoney' },
        { label: '流水开始时间', value: 'starttime' },
        { label: '流水截止时间', value: 'stoptime' }
      ],
      reason: ''
    }
  },
  methods: {
    submit() {
      this.$confirm('是否提交申诉?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.appeal()
      }).catch(() => {
        this.$message.info('已取消确认')
      })
    },
    close() {
      this.fun()
    },
    appeal() {
      if(this.reason == ''){
        this.$message.warning('申诉理由不能为空')
      }
      this.$http(this.$http.adornUrl(`/business/account/manage/complain?sn=${this.data.sn}&desc=${this.reason}&ie=${new Date().getTime()}`))
        .then(res => {
          this.fun('yes')
          this.$message.success('申诉已经提交!')
        })
        .catch(err => {
          this.$message.error('申诉失败')
        })
    }
  }
}
</script>

<style>
</style>
