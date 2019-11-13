<template>
  <div v-loading="loading">
    <el-form :inline="true" size="small" class="queryForm">
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
      <el-form-item label="结算时间">
        <!-- <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="-"
          value-format="yyyy/MM/dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
        ></el-date-picker>-->
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
      <el-form-item label="订单状态">
        <el-select v-model="status" placeholder="请选择" style="width:100px">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="search(0)">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" :header-cell-style="cm.theadStyle">
      <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
      <el-table-column prop="serialNum" label="流水编号"></el-table-column>
      <el-table-column prop="settlementTime" label="结算时间"></el-table-column>
      <el-table-column
        :formatter="formatGasolineNum"
        header-align="center"
        align="center"
        label="油品名称"
      ></el-table-column>
      <el-table-column prop="amount" label="金额（元）"></el-table-column>
      <el-table-column :formatter="formatAmount" prop="offerAmount" label="优惠金额（元）"></el-table-column>
      <el-table-column :formatter="formatPayType" width="180" label="消费类型"></el-table-column>
      <el-table-column prop="fillingName" label="加油机"></el-table-column>
      <el-table-column prop="userTel" label="用户手机号">
        <template slot-scope="scope">
          <span v-if="scope.row.userTel">{{scope.row.userTel | phone}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatStatus" label="订单状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="addOrUpdateHandle(scope.row.serialNum,false)">查看</el-button>
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
          <!-- <el-button
        size="small"
        @click="excel"
        v-if="dataList.length"
        class="exportBtn"
          >导出</el-button>-->
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
import { getCookie } from "@/utils/tools";
import { flowStatus } from "@/utils/util";
import { exportExcel } from "@/utils/excel";
export default {
  data() {
    return {
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
      exportFormDialogVisible: false,
      loading: false,
      statusList: [
        { label: "全部", value: "" },
        { label: "正常", value: 0 },
        { label: "异常", value: 1 }
      ],
      expenseList: [
        { label: "全部", value: "" },
        { label: "人脸支付", value: 1 },
        { label: "加油卡支付", value: 2 }
      ],
      serialNum: "",
      status: "",
      time: "",
      expense: "",
      fillingName: "",
      gunName: "",
      gasolineNum: "",
      phone: "",
      dataList: [],
      pageSize: 10,
      pageIndex: 1,
      // 总条数
      total: 0,
      totalPage: ""
    };
  },
  computed: {
    dateFrom: function() {
      return this.time instanceof Array && this.time[0]
        ? new Date(this.time[0]).getTime()
        : "";
    },
    dateTo: function() {
      return this.time instanceof Array && this.time[1]
        ? new Date(this.time[1]).getTime()
        : "";
    },
    date: function() {
      return this.time ? new Date(this.time).getTime() : "";
    }
  },
  filters: {
    phone: function(value) {
      // console.log(typeof value);
      return value.substr(0, 3) + "****" + value.substr(7);
    }
  },
  methods: {
    addOrUpdateHandle(data, flag) {
      this.$emit("changeFlag", data, flag);
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //     this.$refs.addOrUpdate.isEdit = flag;
      //     this.$refs.addOrUpdate.init(id)
      // })
    },
    search(param) {
      if (param == 0) {
        this.pageIndex = 1;
      }
      this.loading = true;
      console.log(this.date);
      this.$http(
        this.$http.adornUrl(
          `/business/account/manage/saleList?` +
            `page=${this.pageIndex}&limit=${this.pageSize}&serialNum=${this.serialNum}&status=${this.status}&` +
            `payType=${this.expense}&fillingName=${this.fillingName}&gunName=${this.gunName}&gasolineNum=${this.gasolineNum}&` +
            `settlementTime=${this.date}&ie=${new Date().getTime()}`
        )
      )
        .then(res => {
          this.loading = false;
          if (res.data.code != 0) {
            this.dataList = [];
            this.$message.error(res.data.msg);
            return;
          }
          // console.log(res.data)
          this.dataList = res.data.page.list;
          this.total = res.data.page.totalCount;
          this.totalPage = res.data.page.totalPage;
        })
        .catch(err => {
          this.loading = false;
          this.dataList = [];
          this.$message.error("获取数据失败");
        });
    },
    reset() {
      this.serialNum = "";
      this.status = "";
      this.time = "";
      this.expense = "";
      this.search();
    },
    formatGasolineNum(row) {
      return row.gasolineNum + "#";
    },
    formatStatus(row) {
      return flowStatus(row.status);
    },
    formatPayType(row) {
      return row.payType
        ? row.payType == 1
          ? "人脸支付"
          : "加油卡支付"
        : "数据异常";
    },
    formatAmount(row) {
      return row.offerAmount.toFixed(2);
    },
    formatTel(row) {
      return row.userTel.substr(0, 3) + "****" + row.userTel.substr(7);
    },
    pageChange(val) {
      this.pageIndex = val;
      this.search();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.search();
    },
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
        let a = document.createElement('a')
        a.download = '销售流水.xlsx'
        a.href = this.$http.adornUrl(`/business/account/manage/exportSales?`+
        `pageStart=${this.exportForm.startPage}&limit=${this.pageSize}&serialNum=${this.serialNum}&status=${this.status}&payType=${this.expense}&`+
        `settlementTime=${this.date}&fillingName=${this.fillingName}&gunName=${this.gunName}&gasolineNum=${this.gasolineNum}&token=${getCookie("token")}&type=2&ie=${new Date().getTime()}`)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } catch (e) {
        this.$message.error('导出失败')
      }
        } else {
          return false;
        }
      });
    },
    excel() {
      if (this.exportTytpe == 1) {
        // try {
        //   let data = {
        //     type: 1
        //   };
        //   this.$http({
        //     url: this.$http.adornUrl(`/business/export/consumeList`),
        //     method: "post",
        //     data: JSON.stringify(data),
        //     responseType: "blob", // 表明返回服务器返回的数据类型
        //     headers: {
        //       "Content-Type": "application/json"
        //     }
        //   }).then(res => {
        //     console.log(res);
        //     exportExcel(res);
        //   });
        // } catch (e) {
        //   this.$message.error("导出失败");
        // }
         try {
        let a = document.createElement('a')
        a.download = '销售流水.xlsx'
        a.href = this.$http.adornUrl(`/business/account/manage/exportSales?`+
        `token=${getCookie("token")}&type=1&ie=${new Date().getTime()}`)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } catch (e) {
        this.$message.error('导出失败')
      }
      } else if (this.exportTytpe == 3) {
        try {
        let a = document.createElement('a')
        a.download = '销售流水.xlsx'
        a.href = this.$http.adornUrl(`/business/account/manage/exportSales?`+
        `page=${this.pageIndex}&limit=${this.pageSize}&serialNum=${this.serialNum}&status=${this.status}&payType=${this.expense}&`+
        `settlementTime=${this.date}&fillingName=${this.fillingName}&gunName=${this.gunName}&gasolineNum=${this.gasolineNum}&token=${getCookie("token")}&type=3&ie=${new Date().getTime()}`)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } catch (e) {
        this.$message.error('导出失败')
      }
      } else if (this.exportTytpe == 2) {
        this.exportFormDialogVisible = true;
      }
    }
  },
  mounted() {
    this.search(0);
  }
};
</script>

<style>
</style>
