<template>
  <div v-loading="loading">
    <div style="background:#fff;padding:20px;">
      <div class="account-title">结算申请</div>
      <el-row :gutter="50" style="margin:20px 0;">
        <el-col :span="8" v-for="(item, index) in items" :key="index">
          <div class="header-box">
            <el-row style="height:100%;">
              <el-col :span="12" style="height:100%;position:relative;">
                <img src="~@/assets/img/xiaoshoushouru.png" alt v-if="index == 0" style />
                <img src="~@/assets/img/yijiesuanzonge.png" alt v-if="index == 1" />
                <img src="~@/assets/img/weijiesuanjine.png" alt v-if="index == 2" />
              </el-col>
              <el-col :span="12" style="height:100%;padding-top: 35px;">
                <p class="header-title">
                  <span></span>
                  <span>{{item.key}}（元）</span>
                </p>
                <p class="header-value">{{item.value}}</p>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="background:#fff;margin-top:20px;">
      <div class="account-title account-title1">待结算申请单</div>
      <el-table
        :data="dataList"
        @selection-change="selectionChange"
        :header-cell-style="cm.theadStyle"
      >
        <el-table-column
          type="selection"
          width="50"
          header-align="center"
          align="center"
          :selectable="selectable"
        ></el-table-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="sn" label="对账单号"></el-table-column>
        <el-table-column :formatter="formatStatus" prop="audit" label="结算状态"></el-table-column>
        <el-table-column :formatter="formatTableTime" prop="starttime" label="流水起始时间"></el-table-column>
        <el-table-column :formatter="formatTableTime" prop="stoptime" label="流水截止时间"></el-table-column>
        <el-table-column prop="createperiod" header-align="center" align="center" label="生成对账单周期"></el-table-column>
        <el-table-column :formatter="formatTableTime" prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="number" label="销售记录总条数"></el-table-column>
        <el-table-column prop="facemoney" label="智慧油销售金额（元）"></el-table-column>
        <el-table-column prop="cardmoney" label="加油卡销售金额（元）"></el-table-column>
        <el-table-column :formatter="formatTableNum" prop="money" label="对账单总金额（元）"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detail(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="oneBeforeSettle(scope.row)">结算</el-button>
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
      <div style="background:#fff;overflow:hidden;padding:20px;">
        <el-button
          type="primary"
          size="small"
          @click="beforeSettle"
          style="float:right;margin:16px 0 0 20px"
        >结算</el-button>
      </div>
    </div>
    <!-- 多选确认结算弹框 -->
    <el-dialog title="发起结算" :visible.sync="dialogVisible" width="30%">
      <div>
        <p>结算金额总共</p>
        <p style="font-size:24px;color:red;">{{selectMoney}}元</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="settleAccounts">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 单个确认结算弹框 -->
    <el-dialog title="发起结算" :visible.sync="onedialogVisible" width="30%">
      <div>
        <p>结算金额总共</p>
        <p style="font-size:24px;color:red;">{{selectOneMoney}}元</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="settleOneAccount">确 认</el-button>
      </span>
    </el-dialog>
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
import { handleDate } from "@/utils/tools";
import { handleStatusAccount } from "@/utils/util";
import { exportExcel } from "@/utils/excel";
export default {
  props: ["fun", "data"],
  data() {
    return {
      loading: false,
      items: [],
      dataList: [],
      selectData: "",
      selectMoney: "",
      selectOneMoney:'',
      selectOneData:'',
      dialogVisible: false,
      onedialogVisible:false,
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
    };
  },
  methods: {
    search() {
      this.loading = true;
      this.$http(
        this.$http.adornUrl(
          `/business/account/manage/getVerifyList?page=${this.pageIndex}&pagesize=${this.pageSize}`
        )
      )
        .then(res => {
          this.loading = false;
          if (res.data.message.status != 200) {
            this.dataList = [];
            this.$message.error(res.data.message.text);
            return;
          }
          this.items = [
            { key: "销售收入", value: res.data.data.allconsume },
            { key: "已结算金额", value: res.data.data.allbalance },
            { key: "未结算金额", value: res.data.data.nonbalance }
          ];
          this.dataList = res.data.data.verifyBills;
          console.log(this.dataList);
          this.total = res.data.data.total;
        })
        .catch(err => {
          this.dataList = [];
          this.$message.error("请求数据失败");
        });
    },
    sizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    pageChange(val) {
      this.pageIndex = val;
      this.search();
    },
    formatTableTime(row, column, cellValue, index) {
      return cellValue?handleDate(new Date(+cellValue * 1000), "yyyy-MM-dd hh:mm:ss"):'暂无数据';
    },
    formatStatus(row, column, cellValue, index) {
      return handleStatusAccount(cellValue);
    },
    formatTableNum(row, column, cellValue, index) {
      return parseFloat(cellValue).toFixed(2);
    },
    selectable(row) {
      if (row.audit == 31) {
        return true;
      }
    },
    selectionChange(val) {
      this.selectData = "";
      this.selectMoney = "";
      let str = "";
      val.forEach(item => {
        str += item.sn + ",";
        this.selectMoney += item.money;
      });
      this.selectData = str.slice(0, str.length - 1);
    },
    beforeSettle() {
      if (!this.selectData.length) {
        this.$message.warning("未选择对账单");
        return;
      }
      this.dialogVisible = true;
    },
    oneBeforeSettle(data) {
      this.selectOneMoney=data.money
      this.selectOneData=data.sn
      this.onedialogVisible = true;
    },
    // 单个结算
    settleOneAccount() {
      this.$http(
        this.$http.adornUrl(
          `/business/account/manage/createBalance?snList=` + this.selectOneData
        )
      )
        .then(res => {
          if (res.data.message.status != 200) {
            this.$message.error(res.data.message.text);
            return;
          }
          this.$message.success("结算成功");
          this.onedialogVisible=false;
          this.search();
        })
        .catch(err => {
          this.$message.error("结算操作失败");
        });
    },
    settleAccounts() {
      this.$http(
        this.$http.adornUrl(
          `/business/account/manage/createBalance?snList=${this.selectData}`
        )
      )
        .then(res => {
          if (res.data.message.status != 200) {
            this.$message.error(res.data.message.text);
            return;
          }
          this.$message.success("结算成功");
          this.dialogVisible=false;
          this.search();
        })
        .catch(err => {
          this.$message.error("结算操作失败");
        });
    },
    //查看
    detail(val) {
      this.fun(val, 1);
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
              // status:"31",
              pagesize: this.exportForm.exportNumber,
              pagestart: this.exportForm.startNumber
            };
            this.$http({
              url: this.$http.adornUrl(`/business/export/waitBalanceList`),
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
            // status:'31'
          };
          this.$http({
            url: this.$http.adornUrl(`/business/export/waitBalanceList`),
            method: "post",
            data: JSON.stringify(data),
            responseType: "blob", // 表明返回服务器返回的数据类型
            headers: {
              "Content-Type": "application/json"
            }
          }).then(res => {
            // console.log(res);
            exportExcel(res);
          });
        } catch (e) {
          this.$message.error("导出失败");
        }
      } else if (this.exportTytpe == 3) {
        try {
          let data = {
            type: 3,
            // status:"31",
            page: this.pageIndex,
            pagesize: this.pageSize
          };
          this.$http({
            url: this.$http.adornUrl(`/business/export/waitBalanceList`),
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
    this.search();
  }
};
</script>

<style>
.account-title {
  width: 100%;
  /*height: 40px;*/
  /*line-height: 40px;*/
  font-size: 18px;
  font-weight: bold;
}
.account-title1 {
  padding: 20px;
}
.header-box {
  /*width: 180px;
  height: 80px;*/
  /*border: 1px solid #ddd;*/
  height: 160px;
  margin: 0 auto;
  box-shadow: 0 0 15px #ddd;
  border-radius: 5px;
}
.header-box img {
  display: block;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.header-box p {
  width: 100%;
  height: 40px;
  /*text-align: center;*/
  padding: 0;
  margin: 0;
  line-height: 40px;
}
.header-title {
  color: #666666;
  font-size: 16px;
}
/*.header-title span:first-child {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgb(88, 163, 247);
  display: block;
  float: left;
  margin: 15px 10px 0 20px;
}
.header-title span:last-child {
  display: block;
  float: left;
  font-size: 16px;
}*/
.header-value {
  font-size: 26px;
  color: #000;
}
</style>
