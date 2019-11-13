<template>
  <div v-loading="loading">
    <el-form :inline="true" size="small" class="queryForm">
      <el-form-item label="对账单号">
        <el-input v-model="dzdsn" placeholder="对账单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="-"
          value-format="yyyy/MM/dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="search(0)">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" style="width: 100%;" :header-cell-style="cm.theadStyle">
      <el-table-column type="index" width="50" label="序号" align='center'></el-table-column>
      <el-table-column prop="dzdsn" label="对账单号"></el-table-column>
      <el-table-column
        :formatter="formatTableTime"
        label="创建时间"
      ></el-table-column>
      <el-table-column :formatter="formatTableNum" prop="money" label="划账金额（元）"></el-table-column>
      <el-table-column prop="accmoney" label="账户余额（元）"></el-table-column>
    </el-table>
    <div class="pagesBox">
      <!-- <el-button
            v-if="isAuth('sys:user:update')"
            size="small"
            @click="exportExcel"
            class="exportBtn"
          >导出</el-button> -->
      <el-pagination
        background
        @size-change="sizeChange"
        @current-change="pageChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { handleDate } from '@/utils/tools'
export default {
  data() {
    return {
      loading: false,
      dzdsn: '',
      time: '',
      dataList: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0
    }
  },
  computed: {
    dateFrom: function () {
      return this.time instanceof Array && this.time[0] ? new Date(this.time[0]).getTime()/1000 : ''
    },
    dateTo: function () {
      return this.time instanceof Array && this.time[1] ? new Date(this.time[1]+' 23:59:59').getTime()/1000 : ''
    }
  },
  methods: {
    search(val) {
      if (val == 0) {
        this.pageIndex = 1
      }
      this.loading = true
      // alert(this.dateTo)
      this.$http(this.$http.adornUrl(`/business/account/manage/remitAccountList?` +
        `sn=${this.dzdsn}&page=${this.pageIndex}&pagesize=${this.pageSize}&starttime=${this.dateFrom}&` +
        `stoptime=${this.dateTo}&ie=${new Date().getTime()}`))
        .then(res => {
          this.loading = false
          if (res.data.message.status != 200) {
            this.$message.error(res.data.message.text)
            return
          }
          this.dataList = res.data.data.remitAccountList
          this.total = res.data.data.total
        })
        .catch(err => {
          this.loading = false
          this.dataList = []
          this.$message.error('查询失败')
        })
    },
    reset() {
      this.dzdsn = ''
      this.time = ''
      this.search()
    },
    formatTableTime(row) {
      return handleDate(new Date(+row.createtime * 1000), 'yyyy-MM-dd hh:mm:ss')
    },
    formatTableNum(row, column, cellValue, index){
      return parseFloat(cellValue).toFixed(2)
    },
    sizeChange(val) {
      this.pageSize = val
      this.search()
    },
    pageChange(val) {
      this.pageIndex = val
      this.search()
    }
  },
  mounted() {
    this.search(0)
  }
}
</script>

<style>
</style>
