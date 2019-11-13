<template>
  <div v-loading="loading">
    <el-form :inline="true" size="small" class="queryForm">
      <el-form-item label="加油机销售量统计">
        <el-radio-group v-model="type" @change="search">
          <el-radio-button
            v-for="item in typeList"
            :key="item.value"
            :label="item.value"
          >{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div class="haddleRg">
        <el-form-item label="时间选择" v-if="type == 1">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :unlink-panels="true"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="加油机选择">
          <el-select v-model="machineId" style="width:150px">
            <el-option
              v-for="item in machineIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="8">
        <div class="innerBg pieZone" style="min-height:650px;">
          <div class="chartTit">加油枪销售占比图</div>
          <div id="pieChart" :style="{width: '100%', height: '370px'}"></div>
          <div class="nodata"></div>
          <div class="tableData" v-if="tableData.length">
            <div
              class="tableItem"
              :class="{ tableItem1: key==tableData.length-1,'tableItem2':key%2==0&&key==tableData.length-2}"
              v-for="(i,key) in tableData"
              :key="key"
            >
              <div class="key" v-if="key < tableData.length-1">
                <span class="name" :style="{background:fonts[key]}">{{i.name}}</span>
              </div>
              <div class="tip">
                <span v-if="key == tableData.length-1">销售总额</span>
                <span v-else>销售额</span>
              </div>
              <div class="num">
                <span class="val">{{i.value}}</span>
                <span class="unit">万元</span>
              </div>
            </div>
          </div>
          <el-table v-if="tableData.length" :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="加油枪"></el-table-column>
            <el-table-column prop="value" label="销售金额（万元）"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="innerBg">
          <div class="chartTit">加油机销售额统计图</div>
          <div id="lineChart" :style="{width: '100%', height: '600px'}"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie");
require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/dataZoom");
import { sellTankerOption } from "@/utils/util";
import { colorListPie } from "@/utils/util";
import { handleDate } from "@/utils/tools";
export default {
  data() {
    return {
      loading: false,
      typeList: [
        { label: "今日", value: "2" },
        { label: "本周", value: "3" },
        { label: "本月", value: "4" },
        { label: "本季", value: "5" },
        { label: "近半年", value: "6" },
        { label: "本年", value: "7" },
        { label: "累计", value: "1" }
      ],
      type: "2",
      time: "",
      machineId: "",
      machineIdList: [],
      tableData: [],
      tableDataTest: [
        { name: "1号油枪", value: 158 },
        { name: "1号油枪", value: 158 },
        { name: "1号油枪", value: 158 },
        { name: "1号油枪", value: 158 },
        { name: "1号油枪", value: 158 },
        { name: "1号油枪", value: 158 },
        { name: "1号油枪", value: 158 },
        { name: "1号油枪", value: 158 }
      ],
      pieChart: null,
      lineChart: null,
      colorListPie: colorListPie,
      fonts: []
    };
  },
  computed: {
    dateForm: function() {
      return this.time instanceof Array && this.time[0] && this.type == "1"
        ? this.time[0] + " 00:00:00"
        : "";
    },
    dateTo: function() {
      return this.time instanceof Array && this.time[1]
        ? this.time[1] + " 23:59:59"
        : "";
    }
  },
  methods: {
    search() {
      this.loading = true;
      this.$http
        .get(
          this.$http.adornUrl(
            `/business/report/machine/sale-statistics?` +
              `type=${this.type}&machineId=${this.machineId}&startDate=${
                this.dateForm
              }&endDate=${this.dateTo}&ie=${new Date().getTime()}`
          )
        )
        .then(res => {
          this.loading = false;
          if (res.data && res.data.code != 0) {
            this.$message.error(res.data.msg);
            this.tableData = [];
            this.pieChart.clear();
            this.lineChart.clear();
            return;
          }
          this.draw(res.data.saleStatistics);
          let j = 0;
          for (let i = 0; i < this.tableData.length; i++) {
            if (j > this.colorListPie.length - 1) {
              j = 0;
            }
            this.fonts.push(this.colorListPie[j]);
            j++;
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("数据加载失败");
          this.tableData = [];
          this.pieChart.clear();
          this.lineChart.clear();
        });
    },
    draw(val) {
      const data = sellTankerOption(val, this.type);
      this.tableData = data[0];
      // console.log(data[1])
      var nodata = document.querySelector(".nodata");
      if (data[1].series[0].data.length == 0) {
        let mockdata = {
          title: {
            text: "",
            subtext: "",
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },

          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: {
                show: true,
                type: ["pie", "funnel"],
                option: {
                  funnel: {
                    x: "25%",
                    width: "50%",
                    funnelAlign: "left",
                    max: 1548
                  }
                }
              },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          series: [
            {
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: [
                { value: 335, name: "1号枪" },
                { value: 310, name: "2号枪" },
                { value: 234, name: "3号枪" },
                { value: 135, name: "4号枪" }
              ]
            }
          ]
        };
        this.pieChart.clear();
        this.pieChart.setOption(mockdata);
        this.pieChart.showLoading({
          text: "该时间段内暂无数据"
        });
      } else {
        this.pieChart.hideLoading();
        this.pieChart.clear();
        this.pieChart.setOption(data[1]);
      }
      // this.lineChart.clear();
      // this.lineChart.setOption(data[2]);
      // console.log(data[2])
      if (
        data[2].series[0].data.length === 0 &&
        data[2].series[1].data.length === 0
      ) {
        this.lineChart.clear();
        this.lineChart.setOption(data[2]);
        this.lineChart.showLoading({
          text: "该时间段内暂无数据"
        });
      } else {
        this.lineChart.hideLoading();
        this.lineChart.clear();
        this.lineChart.setOption(data[2]);
      }
    }
  },
  mounted() {
    this.loading = true;
    this.pieChart = echarts.init(document.getElementById("pieChart"));
    this.lineChart = echarts.init(document.getElementById("lineChart"));
    this.time = [
      handleDate(new Date(), "yyyy-MM-01"),
      handleDate(new Date(), "yyyy-MM-dd")
    ];
    this.$http
      .get(
        this.$http.adornUrl(
          `/business/fillingmachine/all?ie=${new Date().getTime()}`
        )
      )
      .then(res => {
        this.loading = false;
        if (res.data && res.data.code != 0) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.machines instanceof Array && res.data.machines.length) {
          res.data.machines.forEach((item, index) => {
            this.machineIdList.push({
              label: item.machineName,
              value: item.refuelingMachineId
            });
          });
          this.machineId = this.machineIdList[0].value;
          this.search();
        }
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("加油机列表获取失败");
      });
  }
};
</script>
<style>
</style>
<style>
.innerBg {
  background: #fff;
}
.chartTit {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #dededf;
  padding-left: 25px;
  font-size: 16px;
  font-weight: 600;
}
.tableData {
  overflow: hidden;
  padding: 0 40px;
  box-sizing: border-box;
}
.tableItem {
  width: 50%;
  float: left;
  border-bottom: 1px solid #d2d2d2;
  margin-bottom: 10px;
}
.tableItem1 {
  width: 100%;
  border: none;
}
.tableItem2 {
  width: 100%;
}
.tableItem div {
  margin-bottom: 10px;
}
.tableItem .name {
  font-size: 12px;
  color: #fff;
  background: #46d695;
  display: inline-block;
  height: 20px;
  line-height: 20px;
  padding: 0 15px;
  border-radius: 2px;
}
.tableItem .tip {
  color: #444;
  font-size: 14px;
}
.tableItem .val {
  color: #000;
  font-size: 22px;
}
.tableItem1 .val {
  color: #ff5853;
}
.tableItem .unit {
  color: #666;
  font-size: 14px;
  margin-left: 10px;
}
.nodata {
  position: absolute;
  height: 310px;
  top: 82px;
  font-size: 20px;
  left: 227px;
  display: none;
}
</style>
