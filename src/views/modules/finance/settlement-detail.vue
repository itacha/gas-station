<template>
  <div class="pageView">
    <!-- <div style="background:#fff;padding:10px 10px;"> -->
    <div class="title">
      <div class="backBtn" @click="close"></div>
      <div class="rgTips">
        <span style="margin-right:20px">结算金额：{{selfData.money}}元</span>
        <span>结算状态：{{auditStatus}}</span>
      </div>
    </div>

    <div class="contentItem">
      <div class="titleTxt">结算单信息</div>
      <el-form
        :inline="true"
        size="medium"
        label-width="120px"
        style="padding-top:20px"
        :disabled="true"
        class="queryForm"
      >
        <el-form-item :label="item.label" v-for="(item, index) in keys" :key="index">
          <el-col style="width:200px">{{selfData[item.value]}}</el-col>
          <!-- <el-input v-model="selfData[item.value]" :title="selfData[item.value]"></el-input> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="contentItem" v-if="selfData.audit==52||selfData.audit==200||selfData.audit==500">
      <div class="titleTxt">审核结果</div>
      <div v-for="item in selfData.auditrecords" :key="item.id" style="padding:20px 60px;color:#606266;font-size:14px">
          <el-row :gutter="20" >
            <el-col :span="2">{{item.personname}}</el-col>
            <el-col :span="4">{{item.audittime|dateto}}</el-col>
            <el-col :span="8">{{item.type+item.auditresult}}</el-col>
            <el-col :offset="2" style="margin-top:20px">{{item.auditdesc}}</el-col>
          </el-row>
      </div>

    </div>
    <div class="contentItem">
      <div class="titleTxt">对账单列表</div>
      <el-form :inline="true" size="small" class="queryForm">
        <el-form-item label="对账单号">
          <el-input v-model="sn" placeholder="对账单号"></el-input>
        </el-form-item>
        <el-form-item label="对账单状态">
          <el-select v-model="status" placeholder="请选择" style="width:100px">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流水生成时间">
          <!-- <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="-"
          value-format="yyyy/MM/dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
          ></el-date-picker>-->
          <el-date-picker v-model="starttime" type="date" placeholder="流水生成时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="createtime" type="date" placeholder="创建时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="search(0)">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" :header-cell-style="cm.theadStyle" v-loading="loading">
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column prop="sn" label="对账单号"></el-table-column>
        <el-table-column prop="status" label="对账单状态" :formatter="formatStatus"></el-table-column>
         <el-table-column prop="starttime" :formatter="formatTableTime" width="160" label="流水起始时间"></el-table-column>
      <el-table-column prop="stoptime" :formatter="formatTableTime" width="160" label="流水截止时间"></el-table-column>
        <el-table-column prop="createperiod" label="生成对账单周期"></el-table-column>
        <el-table-column
          :formatter="formatTableTime"
          header-align="center"
          width="160"
          align="center"
          prop="createtime"
          label="创建时间"
        ></el-table-column>
        <el-table-column prop="number" label="销售记录总条数"></el-table-column>
        <el-table-column prop="failnumber" label="异常流水条数"></el-table-column>
        <el-table-column prop="money" label="对账单总金额（元）"></el-table-column>
        <el-table-column prop="dzfaildesc" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="detail(scope.row.sn)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagesBox">
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
  </div>
</template>

<script>
import { handleDate } from "@/utils/tools";
import { handleAudit, handleStatusStatement,handleStatusRecord } from "@/utils/util";
export default {
  props: ["data", "fun"],
  data() {
    return {
      loading: false,
      keys: [
        { label: "结算编号", value: "sn" },
        { label: "结算时间", value: "createtime" },
        { label: "结算账户", value: "payeeacc" },
        { label: "加油站名称", value: "station_name" }
      ],
      dataList: [],
      selfData: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      //   对账单状态选项
      statusList: [
        { label: "全部", value: "" },
        { label: "正常", value: 1 },
        { label: "异常", value: 2 }
      ],
    //   对账单状态
      status:'',
      //   对账单号
      sn: "",
      // 流水生成时间
      starttime: "",
      // 创建时间
      createtime: ""
    };
  },
  filters: {
    phone: function(value) {
      return value.substr(0, 3) + "****" + value.substr(7);
    },
     dateto:function(value){
        return handleDate(new Date(+value * 1000), "yyyy-MM-dd hh:mm:ss");
      }
  },
  methods: {
    detail(id) {
      this.$emit("getDetailId", id);
    },
    search(param) {
      if (param == 0) {
        this.pageIndex = 1;
      }
      this.loading = true;
      this.$http(
        this.$http.adornUrl(
          `/business/account/manage/statementList?` +
            `page=${this.pageIndex}&pagesize=${
              this.pageSize
            }&ie=${new Date().getTime()}`
        )
      )
        .then(res => {
          this.loading = false;
          // console.log(res);
          if (res.data.message.status != 200) {
            this.$message.error(res.data.message.text);
            this.dataList = [];
            return;
          }
          this.dataList = res.data.data.verifyBills;
          this.total = res.data.data.total;
        })
        .catch(err => {
          this.loading = false;
          this.dataList = [];
          this.$message.error("获取数据失败");
        });
    },
    // formatTableTime(row) {
    //   return handleDate(
    //     new Date(+row.consumetime * 1000),
    //     "yyyy-MM-dd hh:mm:ss"
    //   );
    // },
    formatStatus(row,cellValue){
      return handleStatusStatement(row.status)
    },
    formatTableTime(row, column, cellValue, index) {
      return handleDate(new Date(+cellValue * 1000), "yyyy-MM-dd hh:mm:ss");
    },
    formatConsumetype(row) {
      return row.consumetype
        ? row.consumetype == 1
          ? "人脸支付"
          : "加油卡支付"
        : "数据异常";
    },
    formatTel(row) {
      return row.cusmobile.substr(0, 3) + "****" + row.cusmobile.substr(7);
    },
    pageChange(val) {
      this.pageIndex = val;
      this.search();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    close() {
      this.fun();
    },
    reset() {
      this.sn = "";
      this.audit = "";
      this.status = "";
      (this.time = []), this.search();
    },
  },
  mounted() {
    this.search(0);
    this.selfData = JSON.parse(JSON.stringify(this.data));
    console.log(this.selfData)
    for (var n in this.selfData) {
      if (n == "status") {
        this.selfData[n] = handleStatusStatement(this.selfData[n]);
      } else if (n == "createtime" || n == "starttime" || n == "stoptime" ) {
        this.selfData[n] = handleDate(
          new Date(+this.selfData[n] * 1000),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      // else if(n=='auditrecords'){
      //   this.selfData[n]=this.selfData[n].forEach((item)=>{
      //    item.audittime= handleDate(
      //     new Date(+item.audittime * 1000),
      //     "yyyy-MM-dd hh:mm:ss"
      //   )
      //   })
      // }
    }


  },
  computed:{
    auditStatus:function(){
      let str=''
      // return status= handleStatusRecord(this.selfData.audit)
      if(this.selfData.audit==21||this.selfData.audit==22||this.selfData.audit==23||this.selfData.audit==24){
        str='审核中'
      }else if(this.selfData.audit==41){
        str='待付款'
      }else if(this.selfData.audit==52){
        str='待确认'
      }else if(this.selfData.audit==200){
        str='已确认'
      }else if(this.selfData.audit==500){
        str='审核失败'
      }
      return str
    }
  }
};
</script>

<style>
.rgTips {
  text-align: left;
  margin-left: 50px;
  font-size: 16px;
  font-weight: 700;
}
</style>
