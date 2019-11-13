<template>
  <div v-loading="loading">
    <el-form :inline="true" size="small" class="queryForm">
      <el-form-item label="对账单号">
        <el-input v-model="sn" placeholder="对账单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="申诉状态">
        <el-select v-model="status" placeholder="请选择" style="width:120px">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对账单生成时间">
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
    <el-table :data="dataList" :header-cell-style="cm.theadStyle">
      <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
      <el-table-column prop="sn" label="对账单号"></el-table-column>
      <el-table-column :formatter="formatTableTime" prop="createtime" label="对账单生成时间"></el-table-column>
      <el-table-column prop="number" label="销售记录条数"></el-table-column>
      <el-table-column prop="failnumber" label="异常条数">
        <template slot-scope="scope">
          {{scope.row.failnumber?scope.row.failnumber:0}}
        </template>
      </el-table-column>
      <el-table-column :formatter="formatTableNum" prop="money" label="对账单总金额（元）"></el-table-column>
      <el-table-column prop="complaintime" label="申述时间" :formatter="formatTableTime"></el-table-column>
      <!-- <el-table-column prop="facemoney" label="智慧油销售金额（元）"></el-table-column> -->
      <!-- <el-table-column prop="cardmoney" label="加油卡销售金额（元）"></el-table-column> -->
      <!-- <el-table-column prop="ptmoney" label="对账单优惠金额（元）"></el-table-column> -->
      <el-table-column prop="status" label="申诉状态" :formatter="formatStatus"></el-table-column>
      <!-- <el-table-column prop="complaindesc" label="申诉意见反馈"></el-table-column> -->
      <!-- <el-table-column prop="procperson" label="申诉处理人"></el-table-column> -->
      <!-- <el-table-column :formatter="formatTableTime" prop="proctime" label="处理时间"></el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagesBox">
      <!-- <el-button
            v-if="isAuth('sys:user:update')"
            size="small"
            @click="exportExcel"
            class="exportBtn"
      >导出</el-button>-->
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
import { handleDate } from "@/utils/tools";
import { handleStatusAppeal } from "@/utils/util";

export default {
  props: ["fun", "data"],
  data() {
    return {
      loading: false,
      statusList: [
        { value: "", label: "全部" },
        { value: "申诉中", label: "申诉中" },
        { value: "已同意", label: "已同意" },
        { value: "已驳回", label: "已驳回" }
      ],
      sn: "",
      status: "",
      time: "",
      dataList: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0
    };
  },
  computed: {
    dateFrom: function() {
      return this.time instanceof Array && this.time[0]
        ? new Date(this.time[0]).getTime() / 1000
        : "";
    },
    dateTo: function() {
      return this.time instanceof Array && this.time[1]
        ? new Date(this.time[1] + " 23:59:59").getTime() / 1000
        : "";
    }
  },
  methods: {
    reset() {
      this.sn = "";
      this.status = "";
      this.time = "";
      this.search();
    },
    search(param) {
      if (param == 0) {
        this.pageIndex = 1;
      }
      this.loading = true;
      this.$http(
        this.$http.adornUrl(
          "/business/account/manage/getComplainList?" +
            `sn=${this.sn}&status=${this.status}&page=${this.pageIndex}&pagesize=${this.pageSize}&` +
            `starttime=${this.dateFrom}&stoptime=${
              this.dateTo
            }&ie=${new Date().getTime()}`
        )
      )
        .then(res => {
          this.loading = false;
          if (res.data.message.status != 200) {
            this.$message.error(res.data.message.text);
            this.dataList = [];
            return;
          }
          console.log(res.data.data);
          this.dataList = res.data.data.complainlist;
          this.total = res.data.data.total;
        })
        .catch(err => {
          this.loading = false;
          this.dataList = [];
          this.$message.error("查询失败");
        });
    },
    formatTableTime(row, column, cellValue, index) {
      return cellValue?handleDate(new Date(+cellValue * 1000), "yyyy-MM-dd hh:mm:ss"):'暂无数据';
    },
    formatTableNum(row, column, cellValue, index) {
      return parseFloat(cellValue).toFixed(2);
    },
    formatStatus(row, column, cellValue, index) {
      let x;

      if (cellValue == "申诉中") {
        x = "申诉中";
      } else if (cellValue == "申诉成功") {
        x = "已同意";
      } else if (cellValue == "申诉失败") {
        x = "已驳回";
      } else {
        x = "数据异常";
      }
      return x;
    },
    pageChange(val) {
      this.pageIndex = val;
      this.search();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    //查看
    detail(val) {
      this.fun(val, 1);
    }
  },
  mounted() {
    this.search(0);
  }
};
</script>

<style>
</style>
