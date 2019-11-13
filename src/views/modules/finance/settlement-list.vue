<template>
  <div v-loading="loading">
    <el-form :inline="true" size="small" class="queryForm">
      <el-form-item label="结算单号">
        <el-input v-model="sn" placeholder="结算单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="结算状态">
        <el-select v-model="audit" placeholder="请选择" style="width:150px">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="-"
          value-format="yyyy/MM/dd HH:mm:ss"
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
    <el-table :data="dataList" :header-cell-style="cm.theadStyle" style="width: 100%;">
      <el-table-column type="index" width="50" label="序号" align='center'></el-table-column>
      <el-table-column prop="sn" label="结算单号"></el-table-column>
      <el-table-column :formatter="formatTableTime" prop="createtime" label="结算时间"></el-table-column>
      <el-table-column  label="结算账户">
        <template slot-scope="scope">
          {{scope.row.payeeacc?scope.row.payeeacc:''}}
        </template>
      </el-table-column>
      <el-table-column prop="station_name" label="加油站名称"></el-table-column>
      <el-table-column prop="money" label="结算金额（元）"></el-table-column>
      <el-table-column :formatter="formatAudit" prop="audit" label="结算状态"></el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
          <el-button type="text" size="mini"  @click="sure(scope.row)" v-if="scope.row.audit == 52">确认</el-button>
          <el-button type="text" size="mini" @click="detail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagesBox">
      <!-- <el-button
            v-if="isAuth('sys:user:update')"
            size="small"
            @click="exportExcel"
            class="exportBtn"
          >导出</el-button> -->
          <el-row>
            <el-col :span="20">
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
            </el-col>
            <el-col :span="4">
               <el-select v-model="exportTytpe" placeholder="导出数据" size="mini" @change="excel()" clearable>
            <el-option
              v-for="item in exportOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
            </el-col>
          </el-row>
    </div>
  </div>
</template>

<script>
import { handleDate } from '@/utils/tools'
import { handleStatusRecord } from '@/utils/util'
import { exportExcel } from "@/utils/excel";
export default {
  props: ["fun", "data"],
  data() {
    return {
      loading:false,
      statusList: [
        { value: '', label: '全部' },
        { value: '21,22,23,24', label: '审核中' },
        { value: '41', label: '待付款' },
        { value: '52', label: '待确认' },
        { value: '200', label: '已确认' },
        { value: '500', label: '审核失败' }
      ],
      sn: '',
      audit: '',
      time: '',
      dataList:[],
      pageSize:10,
      pageIndex:1,
      total:0,
      exportOptions: [
        {
          value: "1",
          label: "全部导出"
        },
        {
          value: "3",
          label: "当前页导出"
        },
        {
          value: "2",
          label: "自定义导出"
        }
      ],
      // 导出类型
      exportTytpe: "",
      // 指定页选择
      exportForm: {
        startPage: "",
        exportNumber: ""
      },
      // 自定义导出规则
      exportFormRules: {
        startNumber: [
          { required: true, message: "请输入起始条数", trigger: "blur" }
        ],
        exportNumber: [
          { required: true, message: "请输入导出数量", trigger: "blur" }
        ]
      },
      exportFormDialogVisible: false
    }
  },
  computed: {
    dateFrom: function () {
      return this.time instanceof Array && this.time[0] ? new Date(this.time[0]).getTime()/1000 : ''
    },
    dateTo: function () {
      return this.time instanceof Array && this.time[1] ? new Date(this.time[1]).getTime()/1000 : ''
    }
  },
  methods: {
    search(param) {
      if(param == 0){
        this.pageIndex = 1
      }
      this.loading = true
      // alert(this.dateFrom)
      console.log(status)
      this.$http(this.$http.adornUrl(`/business/account/manage/getBalanceList?`+
      `sn=${this.sn}&audit=${this.audit}&page=${this.pageIndex}&pagesize=${this.pageSize}&`+
      `starttime=${this.dateFrom}&stoptime=${this.dateTo}&ie=${new Date().getTime()}`))
      .then(res => {
        // console.log(res)
        this.loading = false
        if(res.data.message.status != 200){
          this.dataList = []
          this.$message.error(res.data.message.text)
          return
        }
        this.dataList = res.data.data.balanceBills
        console.log(this.dataList)
        this.total = res.data.data.total
      })
      .catch(err => {
        this.loading = false
        this.dataList = []
        this.$message.error('数据请求失败')
      })
    },
    reset(){
      this.sn = ''
      this.audit = ''
      this.starttime = ''
      this.stoptime = ''
      this.search()
    },
    formatTableTime(row, column, cellValue, index) {
      return handleDate(new Date(+cellValue * 1000), 'yyyy-MM-dd hh:mm:ss')
    },
    formatAudit(row, column, cellValue, index){
      return handleStatusRecord(cellValue)
    },
    sizeChange(val) {
      this.pageSize = val
      this.search()
    },
    pageChange(val) {
      this.pageIndex = val
      this.search()
    },
    sure(val){
      this.$http(this.$http.adornUrl(`/business/account/manage/balanceEntry?sn=${val.sn}`))
      .then(res => {
        console.log(res)
        if(res.data.message.status != 200){
          this.$message.error(res.data.message.text)
          return
        }
        this.$message.success('确认成功')
        this.search()
      })
      .catch(err => {
        this.$message.error('确认失败')
      })
    },
    // 查看
    detail(val){
        this.fun(val, 1);
    },
    // 处理导出
     custom(exportForm) {
      this.$refs["exportForm"].validate(valid => {
        if (valid) {
          if (this.exportForm.startNumber > this.total) {
            return this.$message.error("起始条数不能超过最大条数");
          }
          if (
            this.exportForm.exportNumber >
            this.total - this.exportForm.exportNumber
          ) {
            return this.$message.error("导出数量超出");
          }
          try {
            let data = {
              type: 2,
              pagesize: this.exportForm.exportNumber,
              pagestart: this.exportForm.startNumber
            };
            this.$http({
              url: this.$http.adornUrl(`/business/export/verifyList`),
              method: "post",
              data: JSON.stringify(data),
              responseType: "blob", // 表明返回服务器返回的数据类型
              headers: {
                "Content-Type": "application/json"
              }
            }).then(res => {
              exportExcel(res);
            });
          } catch (e) {
            this.$message.error("导出失败");
          }
        } else {
          return false;
        }
      });
    },
    excel() {
      // console.log(this.exportTytpe)
      if (this.exportTytpe == 1) {
        try {
          let data = {
            type: 1
          };
          this.$http({
            url: this.$http.adornUrl(`/business/export/verifyList`),
            method: "post",
            data: JSON.stringify(data),
            responseType: "blob", // 表明返回服务器返回的数据类型
            headers: {
              "Content-Type": "application/json"
            }
          }).then(res => {
            console.log(res);
            exportExcel(res);
          });
        } catch (e) {
          this.$message.error("导出失败");
        }
      } else if (this.exportTytpe == 3) {
        try {
          let data = {
            type: 3,
            page: this.pageIndex,
            pagesize: this.pageSize
          };
          this.$http({
            url: this.$http.adornUrl(`/business/export/verifyList`),
            method: "post",
            data: JSON.stringify(data),
            responseType: "blob", // 表明返回服务器返回的数据类型
            headers: {
              "Content-Type": "application/json"
            }
          }).then(res => {
            exportExcel(res);
          });
        } catch (e) {
          this.$message.error("导出失败");
        }
      } else if (this.exportTytpe == 2) {
        this.exportFormDialogVisible = true;
      }
    }

  },
  mounted() {
   this.search(0)
  }
};
</script>

<style>
</style>

