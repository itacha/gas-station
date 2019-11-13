<template>
  <div v-loading="loading">
    <el-form :inline="true" size="small" class="queryForm">
      <el-form-item label="对账单号">
        <el-input v-model="sn" placeholder="对账单号"></el-input>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="audit" placeholder="请选择" style="width:100px">
          <el-option
            v-for="item in auditList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      <el-form-item label="对账生成时间">
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
      <el-table-column :formatter="formatAudit" label="审核状态"></el-table-column>
      <el-table-column :formatter="formatStatus" label="对账单状态"></el-table-column>
      <el-table-column prop="starttime" :formatter="formatTableTime" width="160" label="流水起始时间">
        
      </el-table-column>
      <el-table-column prop="stoptime" :formatter="formatTableTime" width="160" label="流水截止时间"></el-table-column>
      <el-table-column prop="createperiod" label="生成对账单周期"></el-table-column>
      <el-table-column prop="createtime" :formatter="formatTableTime" width="160" label="创建时间"></el-table-column>
      <el-table-column prop="number" label="销售记录总条数"></el-table-column>
      <el-table-column prop="facemoney" label="智慧油销售金额（元）"></el-table-column>
      <el-table-column prop="cardmoney" label="加油卡销售金额（元）"></el-table-column>
      <el-table-column prop="money" label="对账单总金额（元）"></el-table-column>
      <el-table-column prop="ptmoney" label="对账单优惠总金额（元）"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <!-- <div>{{scope}}</div> -->
          <el-button type="text" size="small" @click="detail(scope.row)">查看</el-button>
          <el-button
            type="text"
            size="small"
            @click="sure(scope.row)"
            v-if="scope.row.audit == 51 || scope.row.audit == 52|| scope.row.audit == 500"
          >确认</el-button>
          <el-button
            type="text"
            size="small"
            @click="showDialog(scope.row)"
          v-if=" scope.row.audit == 51|| scope.row.audit == 52 && scope.row.complainstatus!==1"
          >申诉</el-button>
          <el-button
            type="text"
            size="small"
            @click="showAppealRecord(scope.row)"
            v-if="scope.row.complainstatus==1"
          >申诉纪录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagesBox">
      <!-- <el-button
      size="small"
      @click="exportExcel"
      class="exportBtn"
      >导出</el-button>-->
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
    <!-- 申述对话框 -->
    <el-dialog title="对账异常申诉" :visible.sync="dialogVisible" width="30%">
      申诉理由<el-input
        type="textarea"
        placeholder="请输入内容"
        :rows="8"
        v-model="appealReason"
        maxlength="200"
        show-word-limit
      ></el-input>      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="appeal(sn)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 申述纪录对话框 -->
    <el-dialog title="申诉纪录" :visible.sync="recordDialogVisible" width="30%">
      <div>
        <el-row v-if="appealRecord[0]">
            <el-col :span="2">{{appealRecord[0].complainperson}}</el-col>             
            <el-col :span="10" :push="2">{{appealRecord[0].createtime }}</el-col>
            <el-col :span="12" :push="2">发起申述</el-col>
            <el-col :span="22" :push="4">{{appealRecord[0].complaindesc}}</el-col>
          </el-row>
          <el-row v-if="appealRecord[0]&&appealRecord[0].procperson" style="margin-top:20px">
            <el-col :span="2">{{appealRecord[0].procperson}}</el-col>             
            <el-col :span="10" :push="2">{{appealRecord[0].proctime}}</el-col>
            <el-col :span="12" :push="2">{{appealRecord[0].status=='申诉失败'?'已驳回申诉':'已同意'}}</el-col>
            <el-col :span="22" :push="4">{{appealRecord[0].procdesc}}</el-col>
          </el-row>
      </div>      
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="recordDialogVisible = false">确 定</el-button>
        <el-button type="primary" @click="appeal(sn)">确 定</el-button>
      </span> -->
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
import { handleAudit, handleStatusStatement } from "@/utils/util";
import { exportExcel } from "@/utils/excel";
export default {
  props: ["fun", "data"],
  data() {
    return {
      dialogVisible: false,
      recordDialogVisible:false,
      appealRecord:[],
      appealReason:'',
      appealSn:'',
      loading: false,
      auditList: [
        { label: "全部", value: "" },
        { label: "审核中", value: "11,12,13" },
        // { label: "申诉中", value: "14" },
        { label: "待确认", value: "51" },
        // { label: "已确认", value: "200" },
        // { label: "申诉失败", value: "500" }
      ],
      statusList: [
        { label: "全部", value: "" },
        { label: "正常", value: 1 },
        { label: "异常", value: 2 }
      ],
      sn: "",
      audit: "",
      status: "",
      time: [],
      dataList: [],
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
      exportFormDialogVisible: false,
    };
  },
  watch: {
    data: {
      immediate: true,
      handler: function() {
        this.search();
      }
    }
  },
  computed: {
    dateFrom: function() {
      return this.time[0] ? new Date(this.time[0]).getTime() / 1000 : "";
    },
    dateTo: function() {
      return this.time[1]
        ? new Date(this.time[1] + " 23:59:59").getTime() / 1000
        : "";
    }
  },
  methods: {
    search(param) {
      if (param == 0) {
        this.pageIndex = 1;
      }
      this.loading = true;
      this.$http(
        this.$http.adornUrl(
          `/business/account/manage/statementList?` +
            `page=${this.pageIndex}&pagesize=${this.pageSize}&status=${this.status}&audit=${this.audit}&` +
            `sn=${this.sn}&starttime=${this.dateFrom}&stoptime=${
              this.dateTo
            }&ie=${new Date().getTime()}`
        )
      )
        .then(res => {
          this.loading = false;
          // console.log(res)
          if (res.data.message.status != 200) {
            this.$message.error(res.data.message.text);
            this.dataList = [];
            return;
          }
          this.dataList = res.data.data.verifyBills;
          // console.log(res.data.data)
          this.total = res.data.data.total;
        })
        .catch(err => {
          this.loading = false;
          this.dataList = [];
          this.$message.error("查询失败");
        });
    },
    reset() {
      this.sn = "";
      this.audit = "";
      this.status = "";
      (this.time = []), this.search();
    },
    //table数据处理
    formatTableTime(row, column, cellValue, index) {
      return cellValue?handleDate(new Date(+cellValue * 1000), "yyyy-MM-dd hh:mm:ss"):'暂无数据';
    },
    formatAudit(row) {
      return handleAudit(row.audit);
    },
    formatStatus(row) {
      return handleStatusStatement(row.status);
    },
    //确认
    sure(val) {
      this.$confirm("是否确认该对账单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http(
            this.$http.adornUrl(
              `/business/account/manage/entry?sn=${
                val.sn
              }&ie=${new Date().getTime()}`
            )
          )
            .then(res => {
              this.search();
              this.$message.success("已确认");
            })
            .catch(err => {
              this.$message.error("确认失败");
            });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    //查看
    detail(val) {
      this.fun(val, 1);
    },
    showDialog(row){
      this.dialogVisible=true
      this.appealSn=row.sn
    },
    //申诉
    appeal(val) {
      // this.fun(val, 2);
      if(this.appealReason == ''){
        this.$message.warning('申诉理由不能为空')
      }     
      this.$http(this.$http.adornUrl(`/business/account/manage/complain?sn=${this.appealSn}&desc=${this.appealReason}&ie=${new Date().getTime()}`))
        .then(res => {
          // this.fun('yes')
          this.$message.success('申诉已经提交!')
          this.search(0)
          this.dialogVisible=false
        })
        .catch(err => {
          this.$message.error('申诉失败')
        })
        this.appealSn=''
    },
    // 查看申述纪录
    checkAppealRecord(sn){
      this.$http(
        this.$http.adornUrl(
          `/business/account/manage/getComplainList?` +
            `sn=${sn}&ie=${new Date().getTime()}`
        )
      )
        .then(res => {
          if (res.data.message.status != 200) {
            this.$message.error(res.data.message.text);
            this.appealRecord=[]
            return;
          }
          this.appealRecord = res.data.data.complainlist;
           this.appealRecord[0].createtime?this.appealRecord[0].createtime=handleDate(
          new Date(+this.appealRecord[0].createtime * 1000),
          "yyyy-MM-dd hh:mm:ss"
          ):''
          this.appealRecord[0].proctime?this.appealRecord[0].proctime=handleDate(
          new Date(+this.appealRecord[0].proctime * 1000),
          "yyyy-MM-dd hh:mm:ss"
          ):''
        })
        .catch(err => {
          this.appealRecord = [];
          this.$message.error("查询失败");
        });
    },
    // 显示申述纪录弹框
     showAppealRecord(row){
      this.recordDialogVisible=true;
      this.checkAppealRecord(row.sn)
    },
    pageChange(val) {
      this.pageIndex = val;
      this.search();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    exportExcel() {},
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
              pagesize: this.exportForm.exportNumber,
              pagestart: this.exportForm.startNumber
            };
            this.$http({
              url: this.$http.adornUrl(`/business/export/balanceList`),
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
            url: this.$http.adornUrl(`/business/export/balanceList`),
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
            url: this.$http.adornUrl(`/business/export/balanceList`),
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
    this.search(0);
  }
};
</script>

<style>
</style>
