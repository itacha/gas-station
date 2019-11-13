<template>
  <div v-loading="loading">
    <el-form :inline="true" size="small" class="queryForm">
      <el-form-item label="加油站销售量统计">
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
        <el-form-item>
          <el-button @click="search">查询</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-row :gutter="20" style="padding-top:20px;">
      <el-col :span="8">
        <div class="innerBg" style="min-height:650px;">
          <div class="chartTit">加油站油品销售占比图</div>
          <div id="pieChartA" :style="{width: '100%', height: '300px'}"></div>        
          <div class="tableData" v-if="tableDataA.length">
            <div
              class="tableItem"
              :class="{ tableItem1: key==tableDataA.length-1,'tableItem2':key%2==0&&key==tableDataA.length-2}"
              v-for="(i,key) in tableDataA"
              :key="key"
            >
              <div class="key" v-if="key < tableDataA.length-1">
                <span class="name" :style="{background:fontsA[key]}">{{i.name}}</span>
              </div>
              <div class="tip">
                <span v-if="key == tableDataA.length-1">销售总额</span>
                <span v-else>销售额</span>
              </div>
              <div class="num">
                <span class="val">{{i.value}}</span>
                <span class="unit">万元</span>
              </div>
            </div>
          </div>
           <el-table v-if="tableDataA.length" :data="tableDataA" border style="width: 100%">
            <el-table-column prop="name" label="油号"></el-table-column>
            <el-table-column prop="value" label="销售金额（万元）"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="innerBg">
          <div class="chartTit">加油站各类油品销售额统计图</div>
          <div id="lineChartA" :style="{width: '100%', height: '600px'}"></div>
        </div>
      </el-col>
    </el-row>
    <!-- <hr v-if="tableDataA.length"> -->
    <el-row :gutter="20" style="padding-top:20px;">
      <el-col :span="8">
        <div class="innerBg" style="min-height:650px;">
          <div class="chartTit">加油机销售占比图</div>
          <div id="pieChartB" :style="{width: '100%', height: '300px'}"></div>
          <div class="tableData" v-if="tableDataB.length">
            <div
              class="tableItem"
              :class="{ tableItem1: key==tableDataB.length-1,'tableItem2':key%2==0&&key==tableDataB.length-2}"
              v-for="(i,key) in tableDataB"
              :key="key"
            >
              <div class="key" v-if="key < tableDataB.length-1">
                <span class="name" :style="{background:fontsB[key]}">{{i.name}}</span>
              </div>
              <div class="tip">
                <span v-if="key == tableDataB.length-1">销售总额</span>
                <span v-else>销售额</span>
              </div>
              <div class="num">
                <span class="val">{{i.value}}</span>
                <span class="unit">万元</span>
              </div>
            </div>
          </div>
           <el-table v-if="tableDataB.length" :data="tableDataB" border style="width: 100%">
            <el-table-column prop="name" label="加油机名称"></el-table-column>
            <el-table-column prop="value" label="销售金额（万元）"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="innerBg">
          <div class="chartTit">加油站总销售额统计图</div>
          <div id="lineChartB" :style="{width: '100%', height: '600px'}"></div>
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
require("echarts/lib/component/legend");
import { statisticsGas } from "@/utils/util";
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
      tableDataA: [],
      tableDataB: [],
      pieChartA: null,
      pieChartB: null,
      lineChartA: null,
      lineChartB: null,
      colorListPie: colorListPie,
      fontsA: [],
      fontsB: []
    };
  },
  computed: {
    dateForm: function() {
      return this.time instanceof Array && this.time[0]
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
            `/business/report/stationReport?` +
              `type=${this.type}&startDate=${this.dateForm}&endDate=${
                this.dateTo
              }&ie=${new Date().getTime()}`
          )
        )
        .then(res => {
          console.log(res);
          this.loading = false;
          if (res.data && res.data.code != 0) {
            console.log(res.data.msg);
            this.$message.error(res.data.msg);
            this.fail();
            return;
          }
          this.draw(res.data.stationReportDto);
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("数据查询失败");
          this.fail();
        });
    },
    draw(val) {
      this.pieChartA.clear();
      this.pieChartB.clear();
      this.lineChartA.clear();
      this.lineChartB.clear();
      const data = statisticsGas(val, this.type);
      this.pieChartA.setOption(data[0]);
      // console.log(data[0].series[0].data);
      // 饼图1无数据
      if (data[0].series[0].data.length === 0) {
        let mockdata = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: [
                { value: 1000, name: "92号汽油" },
                { value: 1000, name: "95号汽油" }
              ]
            }
          ]
        };
        this.pieChartA.clear()
        this.pieChartA.setOption(mockdata);
        this.pieChartA.showLoading({
          text: "该时间段内暂无数据"
        });
      } else {
        this.pieChartA.clear()
        this.pieChartA.hideLoading();
        this.pieChartA.setOption(data[0]);
      }
      this.tableDataA = data[1];
      // console.log(data[1])
      this.pieChartB.setOption(data[2]);
      this.tableDataB = data[3];
      console.log(data[2],'aaaaaaaaaaaaaaaaaaa')
      // 饼图2无数据
      if (data[2].series[0].data.length===0) {
        let mockdata = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: [
                { value: 1000, name: "A加油机" },
                { value: 250, name: "B加油机" },
                { value: 250, name: "C加油机" },
                { value: 1000, name: "D加油机" }
              ]
            }
          ]
        };
        this.pieChartB.clear()
        this.pieChartB.setOption(mockdata);
        this.pieChartB.showLoading({
          text: "该时间段内暂无数据"
        });
      } else {
        this.pieChartB.hideLoading();
        this.pieChartB.setOption(data[2]);
      }
      // this.lineChartA.setOption(data[4]);
      // 折线图1无数据
      if(data[4].series[0].data.length===0&&data[4].series[1].data.length===0){
        this.lineChartA.clear()
        this.lineChartA.setOption(data[4]);          
          this.lineChartA.showLoading({
          text: "该时间段内暂无数据"
        });
      }else{
         this.lineChartA.hideLoading();
        this.lineChartA.setOption(data[4]);
      }
      // this.lineChartB.setOption(data[5]);
       // 折线图2无数据
      if(data[4].series[0].data.length===0&&data[4].series[1].data.length===0){
        this.lineChartB.clear()
        this.lineChartB.setOption(data[5]);          
          this.lineChartB.showLoading({
          text: "该时间段内暂无数据"
        });
      }else{
         this.lineChartB.hideLoading();
        this.lineChartB.setOption(data[5]);
      }
      this.getFonts(this.tableDataA, this.fontsA);
      this.getFonts(this.tableDataB, this.fontsB);
    },
    fail() {
      this.pieChartA.clear();
      this.pieChartB.clear();
      this.lineChartA.clear();
      this.lineChartB.clear();
      this.tableDataA = [];
      this.tableDataB = [];
    },
    getFonts(Arr, fontsArr) {
      let j = 0;
      for (let i = 0; i < Arr.length; i++) {
        if (j > this.colorListPie.length - 1) {
          j = 0;
        }
        fontsArr.push(this.colorListPie[j]);
        j++;
      }
    }
  },
  mounted() {
    this.pieChartA = echarts.init(document.getElementById("pieChartA"));
    this.pieChartB = echarts.init(document.getElementById("pieChartB"));
    this.lineChartA = echarts.init(document.getElementById("lineChartA"));
    this.lineChartB = echarts.init(document.getElementById("lineChartB"));
    this.time = [
      handleDate(new Date(), "yyyy-MM-01"),
      handleDate(new Date(), "yyyy-MM-dd")
    ];
    this.search();
  }
};
</script>
B
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
</style>
