<template>
  <div class="pageView">
    <!-- <div style="background:#fff;padding:10px 10px;"> -->
    <div class="title">
      <div class="backBtn" @click="close"></div>
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
        <el-form-item :label="item.label" v-for="(item, index) in keys" :key="index" label-width="140px">
          <!-- <el-input v-model="selfData[item.value]" :title="selfData[item.value]"></el-input> -->
          <el-col style="width:200px">{{statementData[item.value]}}</el-col>
        </el-form-item>
        <el-form-item label="审核状态：" v-if="$route.name=='finance-statement-management'">
          <el-col style="width:200px">{{statementData.audit}}</el-col>
        </el-form-item>
      </el-form>
    </div>
    <div class="contentItem">
    <div class="titleTxt">销售流水信息</div>
    <el-table :data="dataList" :header-cell-style="cm.theadStyle" v-loading="loading">
      <el-table-column type="index" width="50" label="序号" align='center'></el-table-column>
      <el-table-column prop="ordersn" label="流水编号"></el-table-column>
      <el-table-column
        :formatter="formatConsumetype"
        prop="consumetype"
        label="消费类型"
      ></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
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
      <el-table-column prop="money" label="金额"></el-table-column>
      <el-table-column prop="dzfaildesc" label="异常原因"></el-table-column>
      <el-table-column prop="dzfaildesc" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="detail(scope.row.ordersn)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagesBox">
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
     <!-- 指定页选择 -->
    <el-dialog title="自定义导出条数" :visible.sync="exportFormDialogVisible" width="30%">
      <el-form ref="exportForm" :model="exportForm" label-width="80px" :rules="exportFormRules">
        <el-form-item label="起始条数" prop="startNumber">
          <el-input v-model="exportForm.startNumber"></el-input>
        </el-form-item>
        <el-form-item label="导出数量" prop="exportNumber">
          <el-input v-model="exportForm.exportNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="custom(exportForm)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { handleDate } from '@/utils/tools'
import { handleAudit, handleStatusStatement } from '@/utils/util'
import { exportExcel } from "@/utils/excel";
export default {
  props: ['data', 'fun'],
  data() {
    return {
      loading: false,
      keys: [
        { label: '对账单号：', value: 'sn' },
        { label: '对账单状态：', value: 'status' },
        { label: "油企名称：", value: "oilcomname" },
        { label: "油企品牌：", value: "oilcombrand" },
        { label: "加油站名称：", value: "station_name" },
        { label: "起始时间：", value: "starttime" },
        { label: "截止时间：", value: "stoptime" },
        { label: "创建时间：", value: "createtime" },
         { label: "销售记录条数：", value: "number" },
        { label: "对账单总金额：", value: "money" },
        { label: '智慧油销售金额：', value: 'facemoney' },
        { label: '加油卡销售金额：', value: 'cardmoney' },
        { label: '对账单优惠金额：', value: 'ptmoney' },
        { label: "对账单生成周期：", value: "createperiod" },
      ],
      statementData:{},
      dataList: [],
      selfData:[],
      pageSize: 10,
      pageIndex: 1,
      total: 0,
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
  filters: {
      phone: function (value) {
        return value.substr(0, 3) + '****' + value.substr(7);
      },
  },
  methods: {
    detail(id){
      this.$emit('getDetailId',id);
    },
    search(param) {
      if (param == 0) {
        this.pageIndex = 1
      }
      this.loading = true
      this.$http(this.$http.adornUrl(`/business/account/manage/verifyStreamBySnList?` +
        `sn=${this.data.sn}&page=${this.pageIndex}&pagesize=${this.pageSize}&ie=${new Date().getTime()}`))
        .then(res => {
          this.loading = false
          console.log(res)
          console.log(res.data.data.verifyStreams)
          if (res.data.message.status != '200') {
            this.$message.error(res.data.message.text)
            this.dataList = []
            return
          }
          this.dataList = res.data.data.verifyStreams
          this.total = res.data.data.total
        })
        // .catch(err => {
        //   this.loading = false
        //   this.dataList = []
        //   this.$message.error("获取数据失败")
        // })
    },
     getStatementInfo() {
       this.$http(
        this.$http.adornUrl(
          `/business/account/manage/statementList?sn=${this.selfData.sn}&page=${this.pageIndex}&pagesize=${this.pageSize}`
        )
      ).then(res=>{
        if(res.data.message.status!=200){
          this.$message.error(res.data.message.text)
          this.statementData={}
          return
        }
         this.statementData = res.data.data.verifyBills[0];
         for(var n in this.statementData){
           if(n == 'status'){
        this.statementData[n] = handleStatusStatement(this.statementData[n])
      }else if(n == 'createtime' || n == 'starttime' || n == 'stoptime'){
        this.statementData[n] =  handleDate(new Date(+ this.statementData[n] * 1000), 'yyyy-MM-dd hh:mm:ss')
      }else if(n == 'audit'){
        this.statementData[n] = handleAudit(this.statementData[n])
      }
    }
      this.statementData.complaintime = this.statementData.complaintime?handleDate(
        new Date(+this.selfData.complaintime * 1000),
        "yyyy-MM-dd hh:mm:ss"
      ):'';
      })    
    },
    formatTableTime(row) {
      return handleDate(new Date(+row.consumetime * 1000), 'yyyy-MM-dd hh:mm:ss')
    },
    formatConsumetype(row) {
      return row.consumetype ? (row.consumetype == 1 ? '人脸支付' : '加油卡支付') : '数据异常'
    },
    formatTel(row){
      return row.cusmobile.substr(0, 3) + '****' + row.cusmobile.substr(7);
    },
    pageChange(val) {
      this.pageIndex = val
      this.search()
    },
    sizeChange(val) {
      this.pageSize = val
      this.search()
    },
    close() {
      this.fun()
    },
    // 导出数据处理
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
              sn:this.selfData.sn,
              pagesize: this.exportForm.exportNumber,
              pagestart: this.exportForm.startNumber
            };
            this.$http({
              url: this.$http.adornUrl(`/business/export/verifyStreamList`),
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
            type: 1,
            sn:this.selfData.sn
          };
          this.$http({
            url: this.$http.adornUrl(`/business/export/verifyStreamList`),
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
            sn:this.selfData.sn,
            page: this.pageIndex,
            pagesize: this.pageSize
          };
          this.$http({
            url: this.$http.adornUrl(`/business/export/verifyStreamList`),
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
    this.selfData = JSON.parse(JSON.stringify(this.data))
    console.log(this.selfData)
    for(var n in this.selfData){
      if(n == 'status'){
        this.selfData[n] = handleStatusStatement(this.selfData[n])
      }else if(n == 'createtime' || n == 'starttime' || n == 'stoptime'){
        this.selfData[n] =  handleDate(new Date(+ this.selfData[n] * 1000), 'yyyy-MM-dd hh:mm:ss')
      }else if(n == 'audit'){
        this.selfData[n] = handleAudit(this.selfData[n])
      }
    }
    this.getStatementInfo()
  }
}
</script>

<style>
</style>
