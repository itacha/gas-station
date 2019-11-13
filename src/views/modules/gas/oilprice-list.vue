<template>
  <div class>
    <div style="background:#fff;border:1px solid #DEDEDE;">
      <div class="titleTxt">
        油价信息
        <span class="titleBtn" @click="changeFlag(true)">标准油价操作记录</span>
      </div>
      <el-row>
        <el-col :span="12" class="grid">
          <el-col :span="11">
            <img src="~@/assets/img/92haoqiyou.png" alt class="col-img"/>
          </el-col>
          <el-col :span="13">
            <!-- <div class="txt">标准油价：7.85 元/升</div> -->
            <div class="txt">
              标准油价：
              <el-input
                style="width:70px;"
                size="small"
                v-model="priceList.base92"
                v-if="edit92"
                clearable
              ></el-input>
              <span class="txt1" v-else>{{priceList.base92}}</span>
              <span class="txt2">元/升</span>
              <el-button size="small" @click="edit92 = true" v-if="!edit92">编辑</el-button>
              <el-button size="small" @click="changePrice('edit92','base92')" v-else>完成</el-button>
            </div>
            <div class="txt">
              结算油价：
              <span class="txt1">{{priceList.offer92?priceList.offer92:priceList.base92}}</span>
              <span class="txt2">元/升</span>
            </div>
          </el-col>
          <!-- <el-col :span="24">
            <div class="grid-content oilHeadBox">
              <p>优惠油价</p>
              <el-button size="small" type="primary" @click="openDialog('')">新增</el-button>
            </div>
          </el-col>
          <el-col :span="12" v-if="priceList.offer92">
            <div class="current-oil-price">
              <p class="current-oil-priceC">
                <span></span>
                <span>92#油价</span>
              </p>
              <p class="current-oil-priceP">{{priceList.offer92}}元/升</p>
            </div>
          </el-col>
          <el-col :span="12" v-if="priceList.offer95">
            <div class="current-oil-price">
              <p class="current-oil-priceC">
                <span></span>
                <span>95#油价</span>
              </p>
              <p class="current-oil-priceP">{{priceList.offer95}}元/升</p>
            </div>
          </el-col>
          <el-col :span="24" v-if="!priceList.offer92">
            <div class="current-oil-none">当前暂无活动</div>
          </el-col>-->
        </el-col>
        <el-col :span="12" class="grid">
          <el-col :span="11">
            <img src="~@/assets/img/95haoqiyou.png" alt class="col-img"/>
          </el-col>
          <el-col :span="13">
            <div class="txt">
              标准油价：
              <el-input
                style="width:70px;"
                v-if="edit95"
                size="small"
                v-model="priceList.base95"
                clearable
              ></el-input>
              <span class="txt1" v-else>{{priceList.base95}}</span>
              <span class="txt2">元/升</span>
              <el-button size="small" @click="edit95 = true" v-if="!edit95">编辑</el-button>
              <el-button size="small" @click="changePrice('edit95')" v-else>保存</el-button>
            </div>
            <div class="txt">
              结算油价：
              <span class="txt1">{{priceList.offer95?priceList.offer95:priceList.base95}}</span>
              <span class="txt2">元/升</span>
            </div>
          </el-col>
          <!-- <div class="grid-content bg-purple">
            <el-col :span="24">
              <div class="grid-content oilHeadBox">
                <p>正常油价</p>
                <el-button size="small" type="primary" @click="baseEditor()">编辑</el-button>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="current-oil-price">
                <p class="current-oil-priceC">
                  <span></span>
                  <span>92#油价</span>
                </p>
                <p class="current-oil-priceP" v-if="priceList.base92">{{priceList.base92}}元/升</p>
                <p class="current-oil-priceP" v-if="!priceList.base92">未设置</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <div class="current-oil-price">
                  <p class="current-oil-priceC">
                    <span></span>
                    <span>95#油价</span>
                  </p>
                  <p class="current-oil-priceP" v-if="priceList.base95">{{priceList.base95}}元/升</p>
                  <p class="current-oil-priceP" v-if="!priceList.base95">未设置</p>
                </div>
              </div>
            </el-col>
          </div>-->
        </el-col>
      </el-row>
    </div>
    <div class="titleTxt" style="margin-top:30px;">优惠活动</div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      size="small"
      class="queryForm"
    >
      <el-form-item label="启用日期：">
        <el-date-picker v-model="dataForm.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间：">
        <el-date-picker v-model="dataForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="创建日期：">
        <el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="dataForm.status" placeholder="全部">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="dataForm.userName" placeholder="状态" clearable></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item class="haddleRg">
        <el-button size="small" type="primary" @click="openDialog('')">添加时段油价</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      v-loading="loading"
      style="width: 100%;"
      id="oilPriceTable"
      :header-cell-style="cm.theadStyle"
    >
      <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
      <el-table-column prop="activityName" label="活动名称"></el-table-column>
      <el-table-column prop="price92" label="92#油价"></el-table-column>
      <el-table-column prop="price95" label="95#油价"></el-table-column>
      <el-table-column prop="startTime" label="启用时间"></el-table-column>
      <el-table-column prop="endTime" label="截止时间"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column :formatter="formatStatus" prop="status" width="180" label="状态"></el-table-column>
      <el-table-column fixed="right" width="150" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="openDialog(scope.row)" v-if="scope.row.status!='3'">修改</el-button>
          <el-button size="mini" @click="offerEnd(scope.row.id)" v-if="scope.row.status!='3'">结束</el-button>
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
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="closeDialog"
    >
      <el-form :inline="true" :model="offerForm" size="medium" label-width="100px">
        <el-form-item label="活动名称" v-if="dialog.title == '优惠活动油价设置'">
          <el-input v-model="offerForm.activityName" placeholder="活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="启用时间" v-if="dialog.title == '优惠活动油价设置'">
          <el-date-picker
            v-model="offerForm.startTime"
            type="datetime"
            placeholder="启用时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="offerForm.status == '1'"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" v-if="dialog.title == '优惠活动油价设置'">
          <el-date-picker
            v-model="offerForm.endTime"
            type="datetime"
            placeholder="截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="92#油价">
          <el-input v-model="offerForm.price92" placeholder="92#油价" clearable></el-input>
        </el-form-item>
        <el-form-item label="95#油价">
          <el-input v-model="offerForm.price95" placeholder="95#油价" clearable></el-input>
        </el-form-item>
        <br />
        <el-button
          size="medium"
          style="margin-left:100px"
          @click="updataPrice(dialog.title)"
        >{{dialog.btnName}}</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {handleDate} from '@/utils/tools'
export default {
  data() {
    return {
      loading: false,
      priceList: {},
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      offerForm: {},
      dialog: {},
      dataForm: {
        createTime:'',
      endTime:'',
      status:'',
      startTime:''
      },
      edit92: false,
      edit95: false,
      base92: 0,
      options:[{
          value: '1',
          label: '使用中'
        }, {
          value: '2',
          label: '未开始'
        }, {
          value: '3',
          label: '结束'
        }]
      // price92:0,
      // price95:0
    };
  },
  methods: {
    exportExcel() {},
    reset() {
      this.dataForm.createTime = "";
      this.dataForm.endTime = "";
      this.dataForm.status = "";
      this.dataForm.startTime = "";      
      this.getDataList();
    },
    formatStatus(row) {
      return row.status == 1 ? "使用中" : row.status == 2 ? "未开始" : "已结束";
    },
    pageChange(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getDataList();
    },
    openDialog(param) {
      this.dialogVisible = true;
      const { id, price92, price95, startTime, endTime, status } = param;
      this.offerForm = { id, price92, price95, startTime, endTime, status };
      this.offerForm.id ? "" : (this.offerForm.id = "");
      this.dialog.title = "优惠活动油价设置";
      this.dialog.btnName = param.id ? "修改" : "添加";
    },
    baseEditor() {
      this.dialogVisible = true;
      const { base92, base95 } = this.priceList;
      this.offerForm = { price92: base92, price95: base95 };
      this.dialog.title = "基础油价";
      this.dialog.btnName = "修改";
    },
    closeDialog() {
      this.dialogVisible = false;
      this.offerForm = {};
    },
    changePrice(param, value) {
      let parten = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
      // console.log(this.price92);
      // if(!this[value]){
      //   this.$message.error('请输入油价');
      //   return;
      // }else if(!parten.test(this[value])){
      //   this.$message.error('请输入数字');
      //   return;
      // }
      let data = {
        id: this.priceList.id,
        price92: this.priceList.base92,
        price95: this.priceList.base95
      };
      // console.log(data);
      this.$http({
        url: this.$http.adornUrl(
          `/business/price/baseSave?ie=${new Date().getTime()}`
        ),
        method: "post",
        data: JSON.stringify(data)
      }).then(res => {
        if (res.data.code != 0) {
          this.$message.error(res.data.msg);
          this.closeDialog();
          // return
        }
        this.closeDialog();
        this.$http
          .get(
            this.$http.adornUrl(
              `/business/price/manageInfo?ie=${new Date().getTime()}`
            )
          )
          .then(res => {
            this.priceList.base92 = res.data.oilBasePrice.price92;
            this.priceList.base95 = res.data.oilBasePrice.price95;
            this.priceList.offer92=res.data.offerPrice.price92;
            this.priceList.offer95 = res.data.offerPrice.price95;
          });
      });
      this[param] = false;
    },
    updataPrice(param) {
      if (param == "优惠活动油价设置") {
        if (
          +this.offerForm.price92 > +this.priceList.base92 ||
          +this.offerForm.price95 > +this.priceList.base95
        ) {
          this.$message.warning("优惠价格不能高于基础价格");
          return;
        }
        this.$http({
          url: this.$http.adornUrl(
            `/business/price/offerSave?ie=${new Date().getTime()}`
          ),
          method: "post",
          data: JSON.stringify(this.offerForm)
        }).then(res => {
          if (res.data.code != 0) {
            this.$message.error(res.data.msg);
            this.closeDialog();
            return;
          }
          this.getDataList();
          this.closeDialog();
          this.$http
            .get(
              this.$http.adornUrl(
                `/business/price/manageInfo?ie=${new Date().getTime()}`
              )
            )
            .then(res => {
              this.handleInfo(res.data);
            });
        });
      } else {
        const data = {
          id: this.priceList.id,
          price92: this.offerForm.price92,
          price95: this.offerForm.price95
        };
        this.$http({
          url: this.$http.adornUrl(
            `/business/price/baseSave?ie=${new Date().getTime()}`
          ),
          method: "post",
          data: JSON.stringify(data)
        }).then(data => {
          this.closeDialog();
          this.$http
            .get(
              this.$http.adornUrl(
                `/business/price/manageInfo?ie=${new Date().getTime()}`
              )
            )
            .then(res => {
              this.priceList.base92 = res.data.oilBasePrice.price92;
              this.priceList.base95 = res.data.oilBasePrice.price95;
            });
        });
      }
    },
    offerEnd(param) {
      this.$confirm("此操作将结束该活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              `/business/price/endPrice/${param}?ie=${new Date().getTime()}`
            ),
            method: "post"
          })
            .then(res => {
              this.getDataList();
              this.$http
                .get(
                  this.$http.adornUrl(
                    `/business/price/manageInfo?ie=${new Date().getTime()}`
                  )
                )
                .then(res => {
                  this.handleInfo(res.data);
                });
              this.$message.success("操作成功");
            })
            .catch(err => {
              this.$message.info("操作失败");
            });
        })
        .catch(() => {
          this.$message.info("操作取消");
        });
    },
    getDataList() {
      this.loading = true;
      this.$http
        .get(
          this.$http.adornUrl(
            `/business/price/list?` +
              `page=${this.pageIndex}&limit=${
                this.pageSize
              }&ie=${new Date().getTime()}`
          )
        )
        .then(res => {
          this.loading = false;
          this.handleList(res.data);
        })
        .catch(err => {
          this.loading = false;
          this.dataList = [];
        });
    },
    // 查询
    search(){
      this.loading = true;
      // console.log(this.startTime)
      this.$http
        .get(
          this.$http.adornUrl(
            `/business/price/list?` +
              `page=${this.pageIndex}&limit=${
                this.pageSize
              }${this.dateCreate?`&createTime=${this.dateCreate}`:''}${this.dateEnd?`&endTime=${this.dateEnd}`:''}`+
              `${this.dateStart?`&startTime=${this.dateStart}`:''}&status=${this.dataForm.status}&ie=${new Date().getTime()}`
          )
        )
        .then(res => {
          this.loading = false;
          // this.dataList=res.data;
          this.handleList(res.data);
        })
        .catch(err => {
          this.loading = false;
          this.dataList = [];
        });
    },
    handleInfo(val) {
      if (val.code != 0) {
        this.priceList = {};
        return;
      }
      this.priceList = {
        id: val.oilBasePrice ? val.oilBasePrice.id : "",
        base92: val.oilBasePrice ? val.oilBasePrice.price92 : "",
        base95: val.oilBasePrice ? val.oilBasePrice.price95 : "",
        offer92:
          val.offerPrice 
            ? val.offerPrice.price92
            : "",
        offer95:
          val.offerPrice
            ? val.offerPrice.price95
            : ""
      };
    },
    handleList(val) {
      if (val.code != 0) {
        this.dataList = [];
      }
      this.total = val.page.totalCount;
      this.dataList = val.page.list;
      // console.log(this.dataList)
    },
    changeFlag(flag) {
      this.$emit("changeFlag", flag);
    }
  },
  computed: {
    dateStart: function() {
      return this.dataForm.startTime ? handleDate(new Date(this.dataForm.startTime ) ,'yyyy-MM-dd hh:mm:ss') : "";
    },
    dateEnd: function() {
      return this.dataForm.endTime
        ? handleDate(new Date(this.dataForm.endTime),'yyyy-MM-dd hh:mm:ss') 
        : "";
    },
    dateCreate: function() {
      return this.dataForm.createTime? handleDate(new Date(this.dataForm.createTime),'yyyy-MM-dd hh:mm:ss') : "";
    }
  },
  mounted() {
    this.loading = true;
    const p1 = new Promise((resolve, reject) => {
      this.$http
        .get(
          this.$http.adornUrl(
            `/business/price/manageInfo?ie=${new Date().getTime()}`
          )
        )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
    const p2 = new Promise((resolve, reject) => {
      this.$http
        .get(
          this.$http.adornUrl(
            `/business/price/list?page=${this.pageIndex}&limit=${
              this.pageSize
            }&ie=${new Date().getTime()}`
          )
        )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
    Promise.all([p1, p2])
      .then(res => {
        this.loading = false;
        this.handleInfo(res[0].data);
        console.log(this.priceList)
        this.handleList(res[1].data);
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("数据查询失败");
      });
  }
};
</script>

<style>
.oilHeadBox {
  text-align: center;
}
.oilHeadBox p {
  width: 80px;
  height: 32px;
  display: inline-block;
}
.current-oil-price {
  width: 200px;
  height: 80px;
  border: 1px solid #ddd;
  margin: 0 auto;
}
.current-oil-price p {
  width: 100%;
  height: 40px;
  text-align: center;
  padding: 0;
  margin: 0;
  line-height: 40px;
}
.current-oil-priceC span:first-child {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgb(88, 163, 247);
  display: block;
  float: left;
  margin: 15px 10px 0 60px;
}
.current-oil-priceC span:last-child {
  display: block;
  float: left;
  font-size: 16px;
}
.current-oil-priceP {
  font-size: 16px;
  color: red;
}
.current-oil-none {
  width: 100%;
  height: 80px;
  text-align: center;
  line-height: 80px;
  font-weight: bold;
  font-size: 18px;
}
#oilPriceTable {
  /*margin-top: 30px;*/
}
.titleTxt {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: 600;
  background: #f6f6f8;
  border-bottom: 1px solid #dedede;
  padding: 0 30px;
}
.titleBtn {
  color: #5c6be8;
  font-weight: 100;
  float: right;
  font-size: 14px;
  cursor: pointer;
}
.grid {
  padding: 30px 40px;
}
.grid .el-col-13 {
  padding-top: 20px;
}
.grid .txt {
  font-size: 16px;
  /*font-weight: 600;*/
  line-height: 40px;
  display: inline-block;
  height: 46px;
}
.grid .txt .txt1 {
  font-weight: 700;
  font-size: 32px;
  margin-left: 5px;
  width: 70px;
  display: inline-block;
}
.grid .txt .txt2 {
  color: #666;
  margin-left: 10px;
  margin-right: 25px;
}
@media screen and (max-width:1366px) {
  .col-img{
  width:100%;
  height:100%;
  padding-right: 10px;
  margin-top: 27px;
}
}
</style>
