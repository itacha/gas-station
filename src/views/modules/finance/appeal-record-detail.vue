<template>
  <div class="pageView">
    <!-- <div style="background:#fff;padding:10px 10px;"> -->
    <div class="title" style="display:flex">
      <div class="backBtn" @click="close"></div>
      <div class="title-item">申诉状态：{{selfData.status}}</div>
      <div class="title-item">异常条数：{{selfData.failnumber}}</div>
    </div>
    <div class="contentItem">
      <div class="titleTxt">对账单信息</div>
      <el-form
        :inline="true"
        size="medium"
        label-width="120px"
        style="padding-top:20px"
        :disabled="true"
        class="queryForm"
      >
        <el-form-item
          :label="item.label"
          v-for="(item, index) in keys"
          :key="index"
          label-width="150px"
        >
          <el-col
            v-model="statementData[item.value]"
            :title="statementData[item.value]"
            style="width:200px"
          >{{statementData[item.value]}}</el-col>
        </el-form-item>
      </el-form>
    </div>
    <div class="contentItem">
      <el-tabs type="border-card">
        <el-tab-pane label="异常流水列表">
          <!-- 表单查询区域 -->
          <el-form :inline="true" size="small" class="queryForm">
            <el-row>
              <el-col :span="20">
                <el-form-item label="流水编号：">
                  <el-input v-model="serialNum" clearable placeholder="流水编号"></el-input>
                </el-form-item>
                <el-form-item label="加油机名称：">
                  <el-input clearable placeholder="加油机名称" v-model="fillingName"></el-input>
                </el-form-item>
                <el-form-item label="加油枪名称：">
                  <el-input clearable placeholder="加油枪名称" v-model="gunName"></el-input>
                </el-form-item>
                <el-form-item label="油品名称：">
                  <el-input clearable placeholder="油品名称" v-model="gasolineNum"></el-input>
                </el-form-item>
                <el-form-item label="流水生成时间">
                  <el-date-picker
                    v-model="time"
                    type="datetime"
                    range-separator="-"
                    value-format="yyyy/MM/dd HH:mm:ss"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="支付方式：">
                  <el-select v-model="expense" placeholder="请选择" style="width:150px">
                    <el-option
                      v-for="item in expenseList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="用户手机号：">
                  <el-input clearable placeholder="用户手机号" v-model="phone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button @click="search()" type="primary">查询</el-button>
                  <el-button @click="reset()">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table :data="dataList" :header-cell-style="cm.theadStyle" v-loading="loading">
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column prop="ordersn" label="流水编号"></el-table-column>
            <el-table-column prop="machinesn" label="加油机名称"></el-table-column>
            <el-table-column prop="portsn" label="加油枪名称"></el-table-column>
            <el-table-column prop="oilcate" label="油品名称"></el-table-column>
            <el-table-column prop="money" label="金额"></el-table-column>
            <el-table-column :formatter="formatConsumetype" prop="consumetype" label="支付方式"></el-table-column>
            <el-table-column
              :formatter="formatTableTime"
              header-align="center"
              width="160"
              align="center"
              label="流水生成时间"
            ></el-table-column>
            <el-table-column prop="cusmobile" label="用户手机号">
              <template slot-scope="scope">
                <span v-if="scope.row.cusmobile">{{scope.row.cusmobile | phone}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="流水状态"></el-table-column>
            <el-table-column prop="dzfaildesc" label="异常原因"></el-table-column>
            <el-table-column prop="dzfaildesc" label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="detail(scope.row.ordersn)">查看</el-button>
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
        </el-tab-pane>
        <el-tab-pane label="申述处理结果">
          <el-row v-if="complainData[0]">
            <el-col :span="2">{{complainData[0].complainperson}}</el-col>
            <el-col :span="22">{{complainData[0].createtime}}</el-col>
            <el-col :span="22" :push="2">{{complainData[0].complaindesc}}</el-col>
          </el-row>
          <el-row v-if="complainData[0]&&complainData[0].procperson" style="margin-top:20px">
            <el-col :span="2">{{complainData[0].procperson}}</el-col>
            <el-col :span="22">{{complainData[0].proctime }}</el-col>
            <el-col :span="22" :push="2">{{complainData[0].procdesc}}</el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { handleDate } from "@/utils/tools";
import {
  handleAudit,
  handleStatusStatement,
  handleStatusAppeal
} from "@/utils/util";
export default {
  props: ["data", "fun"],
  data() {
    return {
      loading: false,
      // 申述处理结果
      complainData: [],
      keys: [
        { label: "对账单号：", value: "sn" },
        { label: "对账单状态：", value: "status" },
        { label: "油企名称：", value: "oilcomname" },
        { label: "油企品牌：", value: "oilcombrand" },
        { label: "加油站名称：", value: "oilstationname" },
        { label: "起始时间：", value: "starttime" },
        { label: "截止时间：", value: "stoptime" },
        { label: "创建时间：", value: "createtime" },
        { label: "销售记录条数：", value: "number" },
        { label: "对账单总金额：", value: "money" },
        { label: "智慧油销售金额：", value: "facemoney" },
        { label: "加油卡销售金额：", value: "cardmoney" },
        { label: "对账单优惠总额：", value: "ptmoney" },
        { label: "对账单生成周期：", value: "createperiod" },
        { label: "申诉时间：", value: "complaintime" }
      ],
      dataList: [],
      selfData: [],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      expenseList: [
        { label: "全部", value: "" },
        { label: "人脸支付", value: 1 },
        { label: "加油卡支付", value: 2 }
      ],
      serialNum: "",
      fillingName: "",
      gunName: "",
      gasolineNum: "",
      // 流水生成时间？
      time: "",
      expense: "",
      phone: "",
      unusual: 0,
      statementData: {
        sn:'',
        status:'',
        oilcom:'',
        oilcombrand:'',
        oilstation:'',
        starttime:'',
        stoptime:'',
        createtime:'',
        number:'',
        oilstation:'',
        facemoney:'',
        cardmoney:'',
        ptmoney:'',
        createperiod:'',
        complaintime:''
      }
    };
  },
  filters: {
    phone: function(value) {
      return value.substr(0, 3) + "****" + value.substr(7);
    }
  },
  methods: {
    detail(id) {
      this.$emit("getDetailId", id);
    },
    async getStatementInfo() {
      const { data: res } = await this.$http(
        this.$http.adornUrl(
          `/business/account/manage/verifyDetail?sn=${this.selfData.sn}&page=${this.pageIndex}&pagesize=${this.pageSize}`
        )
      );
      if(res.data.verifyDetail){
      this.statementData = res.data.verifyDetail;
      }
      for (var n in this.statementData) {
        if (n == "status") {
        this.statementData[n] = this.statementData[n]?handleStatusStatement(this.statementData[n]):'';
      }
      else if (n == "createtime" || n == "starttime" || n == "stoptime") {
        this.statementData[n] = this.statementData[n]?handleDate(
          new Date(+this.statementData[n] * 1000),
          "yyyy-MM-dd hh:mm:ss"
        ):'';
      }
    }
      this.statementData.complaintime = this.selfData.complaintime?handleDate(
        new Date(+this.selfData.complaintime * 1000),
        "yyyy-MM-dd hh:mm:ss"
      ):'';
    },
    search(param) {
      if (param == 0) {
        this.pageIndex = 1;
      }
      this.loading = true;
      this.$http(
        this.$http.adornUrl(
          `/business/account/manage/verifyStreamBySnList?` +
            `sn=${this.selfData.sn}&page=${this.pageIndex}&pagesize=${
              this.pageSize
            }&ie=${new Date().getTime()}`
        )
      ).then(res => {
        this.loading = false;
        // console.log(res);
        if (res.data.message.status !== '200') {
          this.$message.error(res.data.message.text);
          this.dataList = [];
          return;
        }
        console.log(res.data.data.verifyStreams)
        this.dataList = res.data.data.verifyStreams;
        this.dataList = this.dataList.filter(item => {
          item.status == "异常" ? this.unusual++ : this.unusual + 0;
          return item.status == "异常";
        });
        this.total = res.data.data.total;
      })
      // .catch(err => {
      //   this.loading = false;
      //   this.dataList = [];
      //   this.$message.error("获取数据失败");
      // });
    },
    // 重置表单
    reset() {},
    // 获取申述处理结果
    getComplainList() {
      this.$http(
        this.$http.adornUrl(
          `/business/account/manage/getComplainList?` +
            `sn=${this.selfData.sn}&ie=${new Date().getTime()}`
        )
      )
        .then(res => {
          // console.log(res);
          if (res.status !== 200) {
            this.$message.error(res.statusText);
            this.complainData = [];
            return;
          }
          // console.log(res.data.data.verifyBills)
          this.complainData = res.data.data.complainlist;
          this.complainData[0].createtime = handleDate(
            new Date(+this.complainData[0].createtime * 1000),
            "yyyy-MM-dd hh:mm:ss"
          );
          this.complainData[0].proctime
            ? (this.complainData[0].proctime = handleDate(
                new Date(+this.complainData[0].proctime * 1000),
                "yyyy-MM-dd hh:mm:ss"
              ))
            : "";
        })
        .catch(err => {
          this.complainData = [];
          this.$message.error("获取数据失败");
        });
    },
    formatTableTime(row) {
      return handleDate(
        new Date(+row.consumetime * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
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
    }
  },
  mounted() {
    this.selfData = JSON.parse(JSON.stringify(this.data));
    // console.log(this.selfData);
    this.search(0);

    for (var n in this.selfData) {
      if (n == "status") {
        this.selfData[n] = handleStatusAppeal(this.selfData[n]);
      } else if (n == "createtime" || n == "starttime" || n == "stoptime") {
        this.selfData[n] = handleDate(
          new Date(+this.selfData[n] * 1000),
          "yyyy-MM-dd hh:mm:ss"
        );
      }
    }
    this.getStatementInfo();
    this.getComplainList();
  }
};
</script>

<style>
.title-item {
  margin-left: 100px;
  font-weight: 600;
  font-size: 20px;
}
</style>
