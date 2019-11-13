<template>
    <div id="home" class="home" :class="{homeFixed:fullScreen}">
        <div class="title">
            <img src="~@/assets/img/home/zhedie.png" alt="" class="checkMode" @click="checkMode">
            <img src="~@/assets/img/home/logo.png" alt="" class="logo">
            <img src="~@/assets/img/home/guang.png" alt="" class="guang">
            <img src="~@/assets/img/home/jiange.png" alt="" class="jiange">
            <div class="contName">{{com_name}}</div>
            <div class="datetime">
                <span class="tmfamily" style="width:100px;">{{date}}</span>
                <span class="tmfamily" style="width:90px;">{{time}}</span>
                <span style="font-size:21px;">{{week}}</span>
            </div>
        </div>
        <div class="contentBox">
            <div class="leftTips">
                <div class="itemBox itemBoxLeftTop">
                    <div class="tit">今日油价</div>
                    <div class="items itemsLTop">
                        <div class="item itemL">
                            <div class="tir number">92#</div>
                            <div class="txt tx1 number">
                                <span class="txt1">{{prices.price92}}</span>
                                <span class="txt2">元</span>
                            </div>
                        </div>
                        <div class="item itemR">
                            <div class="tir number">95#</div>
                            <div class="txt tx1 number">
                                <span class="txt1">{{prices.price95}}</span>
                                <span class="txt2">元</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="itemBox itemBoxLeftTop">
                    <div class="tit">今日销量</div>
                    <div class="items itemsLTop">
                        <div class="item itemL">
                            <div class="tir number">92#</div>
                            <div class="txt number">
                                <span class="txt1">{{salesItems.oils92SalesQuantity}}</span>
                                <span class="txt2">升</span>
                            </div>
                        </div>
                        <div class="item itemR">
                            <div class="tir number">95#</div>
                            <div class="txt number">
                                <span class="txt1">{{salesItems.oils95SalesQuantity}}</span>
                                <span class="txt2">升</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="itemBox itemBoxTable">
                    <div class="tit">站内车辆数量 <span class="number" style="margin-left:25px;">{{stationInCars.length}} 辆</span> <div class="more" @click="more('visibleCars')">更多</div></div>
                    <div class="items itemList">
                        <div class="itemListTable">
                            <table>
                                <thead>
                                    <th>序号</th>
                                    <th>进站时间</th>
                                    <th>车牌号</th>
                                    <th>车辆状态</th>
                                </thead>
                                <tbody>
                                    <tr v-for="(i,key) in stationInCars">
                                        <td>{{key+1}}</td>
                                        <td>{{i.inTime}}</td>
                                        <td>{{i.carNo}}</td>
                                        <td>{{i.statusDescription}}</td>
                                    </tr>
                                </tbody>
                                <div v-if="stationInCars.length<1" style="width:330px;text-align:center;color:#fff;position:absolute;line-height:49px;">暂无数据</div>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
                <div class="machineBox">
                    <el-row :gutter="10" class="machineRow">
                        <div>{{machineAllInfo}}</div>
                        <el-col :span="8" class="machineItem" v-for="(i,key) in machineAllInfo" :key="key">
                            <div>{{i.machineEntities[0].guns[0].gunName}}</div>
                            <div class="machineM">
                                <div class="titTop">
                                    <div class="lfTip" v-if="i.machineStatus != 0"><img src="~@/assets/img/home/guzhang1.png" alt=""><span>故障</span></div>
                                    <span>{{i.machineName}}</span>
                                    <span class="rgTip number" v-if="i.machineNo">ID:{{i.machineNo}}</span>
                                </div>
                                <div class="machineIn">
                                    <div class="machineItem machineItemL">
                                        <div class="itemBg">
                                            <div class="oil">
                                                <div class="txtRow number">
                                                    <!-- <div>{{i.guns[0].gunName}}</div>
                                                    <div>{{i.guns[1].gunName}}</div> -->
                                                    <div>{{i.machineEntities[0].guns[0].gunName}}</div>
                                                    <div>{{i.machineEntities[0].guns[1].gunName}}</div>
                                                </div>
                                                <div class="txtRow number" v-if="i.machineEntities[1].guns[0].gasolineNum">
                                                    <!-- <div>{{i.guns[0].gasolineNum}}#</div>
                                                    <div>{{i.guns[1].gasolineNum}}#</div> -->
                                                     <div>{{i.machineEntities[0].guns[0].gasolineNum}}</div>
                                                    <div>{{i.machineEntities[0].guns[1].gasolineNum}}</div>
                                                </div>
                                            </div>
                                            <!-- <img src="~@/assets/img/home/weiguaqiang.png" alt="" class="left" v-if="i.guns[0].gunStatus == 3">
                                            <img src="~@/assets/img/home/zhengzaijiayou.png" alt="" class="left jiayou" v-if="i.guns[1].gunStatus == 2">
                                            <img src="~@/assets/img/home/weiguaqiang.png" alt="" class="right" v-if="i.guns[1].gunStatus == 3">
                                            <img src="~@/assets/img/home/zhengzaijiayou.png" alt="" class="right jiayou" v-if="i.guns[1].gunStatus == 2"> -->
                                             <img src="~@/assets/img/home/weiguaqiang.png" alt="" class="left" v-if="i.machineEntities[0].guns[0].gunStatus == 3">
                                            <img src="~@/assets/img/home/zhengzaijiayou.png" alt="" class="left jiayou" v-if="i.machineEntities[0].guns[1].gunStatus == 2">
                                            <img src="~@/assets/img/home/weiguaqiang.png" alt="" class="right" v-if="i.machineEntities[1].guns[1].gunStatus == 3">
                                            <img src="~@/assets/img/home/zhengzaijiayou.png" alt="" class="right jiayou" v-if="i.machineEntities[1].guns[1].gunStatus == 2">
                                        </div>
                                        <div class="carIn"><span class="carInTx1">{{i.machineEntities[0].guns[0].carNo}}</span><span class="carInTx2">{{i.machineEntities[0].guns[1].carNo}}</span></div>
                                        <!-- <div class="carIn"><span class="carInTx1" v-if="i.guns[0].gunStatus == 2">川A·567EG</span><span class="carInTx2" v-if="i.guns[1].gunStatus == 2">川A·550EG</span></div> -->
                                    </div>
                                    <div class="machineItem machineItemR" v-if="i.machineEntities[0].guns.length>=2">
                                        <div class="itemBg">
                                            <div class="oil">
                                                <div class="txtRow number">
                                                    <!-- <div>{{i.machineEntities[0].guns[2].gunName}}</div>
                                                    <div>{{i.machineEntities[0].guns[3].gunName}}</div> -->
                                                     <div>{{i.machineEntities[1].guns[0].gunName}}</div>
                                                    <div>{{i.machineEntities[1].guns[1].gunName}}</div>
                                                </div>
                                                <div class="txtRow number" v-if="i.machineEntities[1].guns[2].gasolineNum">
                                                    <div>{{i.machineEntities[0].guns[0].gasolineNum}}#</div>
                                                    <div>{{i.machineEntities[0].guns[1].gasolineNum}}#</div>
                                                </div>
                                            </div>
                                            <img src="~@/assets/img/home/weiguaqiang.png" alt="" class="left" v-if="i.machineEntities[0].guns[2].gunStatus == 3">
                                            <img src="~@/assets/img/home/zhengzaijiayou.png" alt="" class="left jiayou" v-if="i.machineEntities[0].guns[2].gunStatus == 2">
                                            <img src="~@/assets/img/home/weiguaqiang.png" alt="" class="right" v-if="i.machineEntities[1].guns[3].gunStatus == 3">
                                            <img src="~@/assets/img/home/zhengzaijiayou.png" alt="" class="right jiayou" v-if="i.machineEntities[1].guns[3].gunStatus == 2">
                                        </div>
                                        <div class="carIn"><span class="carInTx1">{{i.machineEntities[0].guns[2].carNo}}</span><span class="carInTx2">{{i.machineEntities[0].guns[3].carNo}}</span></div>
                                        <!-- <div class="carIn"><span class="carInTx1" v-if="i.guns[2].gunStatus == 2">川A·590PH</span><span class="carInTx2" v-if="i.guns[3].gunStatus == 2">川A·580PK</span></div> -->
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <!-- <el-col :span="8" class="machineItem" v-for="(i,key) in machineAllInfoTest" :key="key">
                            <div class="machineM">
                                <div class="titTop">
                                    <span>{{key+1}}号加油机</span>
                                    <span class="rgTip">ID:200{{key+1}}</span>
                                </div>
                                <div class="machineIn">
                                    <div class="machineItem machineItemL">
                                        <div class="itemBg">
                                            <div class="oil">
                                                <div class="txtRow"><div>01</div><div>02</div></div>
                                                <div class="txtRow"><div>92#</div><div>95#</div></div>
                                            </div>
                                        </div>
                                        <div class="carIn"><span class="carInTx1">川A·567EG</span><span class="carInTx2">川A·5R7EG</span></div>
                                    </div>
                                    <div class="machineItem machineItemR">
                                        <div class="itemBg">
                                            <div class="oil">
                                                <div class="txtRow"><div>01</div><div>02</div></div>
                                                <div class="txtRow"><div>92#</div><div>95#</div></div>
                                            </div>
                                        </div>
                                        <div class="carIn"><span class="carInTx1">川A·567EG</span><span class="carInTx2">川A·5R7EG</span></div>
                                    </div>
                                </div>
                            </div>
                        </el-col> -->
                    </el-row>
                </div>
                <div class="totalTips">
                    <div class="itemBox itemBoxRT">
                        <div class="col colL">
                            <div class="tit">加油机工作状态</div>
                            <div class="items" style="margin-bottom:20px;">
                                <div class="itemIcon">
                                    <div class="iImg">
                                      <img src="~@/assets/img/home/zhengchang.png" alt="">
                                    </div>
                                    <div class="iTxt">
                                        <div>
                                            <span class="n number">{{machineQuantity}}</span>
                                            <span class="u">台</span>
                                        </div>
                                        <div class="s">正常</div>
                                    </div>
                                </div>
                                <div class="itemIcon">
                                    <div class="iImg">
                                      <img src="~@/assets/img/home/guzhang.png" alt="">
                                    </div>
                                    <div class="iTxt">
                                        <div>
                                            <span class="n number">{{machineError}}</span>
                                            <span class="u">台</span>
                                        </div>
                                        <div class="s">故障</div>
                                    </div>
                                </div>
                            </div>
                            <div class="tit">加油枪工作状态</div>
                            <div class="items">
                                <div class="itemIcon">
                                    <div class="iImg">
                                      <img src="~@/assets/img/home/zhanyong.png" alt="">
                                    </div>
                                    <div class="iTxt">
                                        <div>
                                            <span class="n number">{{gunUse}}</span>
                                            <span class="u">把</span>
                                        </div>
                                        <div class="s">占用</div>
                                    </div>
                                </div>
                                <div class="itemIcon">
                                    <div class="iImg">
                                      <img src="~@/assets/img/home/kongxian.png" alt="">
                                    </div>
                                    <div class="iTxt">
                                        <div>
                                            <span class="n number">{{gunXz}}</span>
                                            <span class="u">把</span>
                                        </div>
                                        <div class="s">空闲</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col colR number">
                          <div id="chartGauge" :style="{width:'100%',height:'145px'}"></div>
                          <div style="width:100%;height:20%;color:#FDD75A;font-size:16px;text-align:center;">自助加油占比</div>
                        </div>
                    </div>
                    <div class="itemBox itemBoxRT">
                        <div class="tit">今日统计</span></div>
                        <div class="items">
                            <div class="itemRow" style="padding-top:30px;">
                                <div class="iBox">
                                    <div class="iTit">自助加油</div>
                                    <div class="iNum">
                                        <span class="in number">{{salesItems.selfServeCarQuantity}}</span>
                                        <span class="unit">次</span>
                                    </div>
                                </div>
                                <div class="iBox">
                                    <div class="iTit">平均加油金额</div>
                                    <div class="iNum">
                                        <span class="in number">{{salesItems.averageOilsAmount}}</span>
                                        <span class="unit">元</span>
                                    </div>
                                </div>
                                <div class="iBox">
                                    <div class="iTit">销售总金额</div>
                                    <div class="iNum">
                                        <span class="in number">{{salesItems.salesTotalAmount}}</span>
                                        <span class="unit">元</span>
                                    </div>
                                </div>
                            </div>
                            <div class="itemRow">
                                <div class="iBox">
                                    <div class="iTit">进站车辆总数</div>
                                    <div class="iNum">
                                        <span class="in number">{{salesItems.totalCarQuantity}}</span>
                                        <span class="unit">辆</span>
                                    </div>
                                </div>
                                <div class="iBox">
                                    <div class="iTit">平均等待时间</div>
                                    <div class="iNum">
                                      <span class="in number">{{salesItems.averageWaitingTime}}</span>
                                      <!-- <span class="in">19</span><span class="unit">秒</span> -->
                                    </div>
                                </div>
                                <div class="iBox">
                                    <div class="iTit">告警信息</div>
                                    <div class="iNum">
                                        <span class="in number">{{salesItems.warningQuantity}}</span>
                                        <span class="unit">次</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="itemBox itemBoxRTB">
                        <div class="tit"><span class="warning">告警信息</span><div class="more" @click="more('visibleAlarm')">更多</div></div>
                        <div class="items itemList">
                            <div class="itemListTable">
                                <table>
                                    <thead>
                                        <th>时间</th>
                                        <th>加油机名称</th>
                                        <th>告警类型</th>
                                        <th>状态</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(i,key) in warnings" @click="handdleWaring(i)">
                                            <td>{{i.createTime}}</td>
                                            <td>{{i.fillingMachineName}}</td>
                                            <td>{{i.warningDetailTypeDescription}}</td>
                                            <td>{{i.statusDescription}}</td>
                                        </tr>
                                    </tbody>
                                    <div v-if="warnings.length<1" style="width:330px;text-align:center;color:#fff;position:absolute;line-height:49px;">暂无数据</div>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            title="车辆进出情况"
            :visible.sync="visibleCars"
            width="800px"
            v-if="visibleCars"
            :close-on-click-modal="false">
            <car-list :tableData="stationInCars"></car-list>
        </el-dialog>
        <el-dialog
            title="异常统计"
            :visible.sync="visibleAlarm"
            width="850px"
            v-if="visibleAlarm"
            :close-on-click-modal="false">
            <alarm-list></alarm-list>
        </el-dialog>
        <el-dialog
            title="故障处理"
            :visible.sync="visibleWaringHanddle"
            width="580px"
            v-if="visibleWaringHanddle"
            :close-on-click-modal="false">
            <handdle-waring :warning-id="warningRecordId" @closeWaring="closeWaring" @refreshList="refreshList"></handdle-waring>
        </el-dialog>
    </div>
</template>

<script>
let echarts = require("echarts/lib/echarts")
require("echarts/lib/chart/pie")
require("echarts/lib/chart/line")
require("echarts/lib/chart/gauge")
require("echarts/lib/component/tooltip")
require("echarts/lib/component/title")
require("echarts/lib/component/dataZoom")

import carList from './tool/carList'
import alarmList from './tool/alarmList'
import handdleWaring from './tool/handdleWaring'
export default {
  name:'home',
  components:{
    carList,
    alarmList,
    handdleWaring
  },
  data() {
    return {
        timerGetdata:null,
        timerDate:null,
        fullScreen:false,
        myChartGauge:null,
        visibleCars:false,
        visibleAlarm:false,
        visibleWaringHanddle:false,
        ratio:0,
        warningRecordId:'',
        tableData:[{time:'18:25:36',carCard:'川A·3DEF9',sta:'等候中'}],
        tableData2:[{time:'18:25:36',machineName:'1号加油机',type:'未挂枪',sta:'待处理'}],
        machineList:[1,2,3,4,5,6,7,8,9],
        tabPosition: 1,
        machineAllInfo: [],
        gunUse: 0,
        gunXz: 0,
        machineError: 0,
        stationInCars: [],
        websocket: null,
        salesItems:{},
        prices:{price92:'',price95:''},
        warnings:[],
        gunUse:'',
        gunXz:'',
        // machineError:'',
        machineQuantity:'',
        machineAllInfoTest:[1,2,3,4,5,6,7,8,9],
        date:'',
        time:'',
        week:''
    }
  },
  computed:{
    com_name:function(){
        return localStorage.getItem('com_name');
    }
  },
  methods: {
    getTimeNow(){
        let vm = this;
        let time = new Date();
        let year,month,day,hour,minute,second,week;
        year = time.getFullYear();
        month = time.getMonth() + 10;
        day = time.getDate();

        hour = time.getHours();
        minute = time.getMinutes();
        second = time.getSeconds();

        week = time.getDay();

        vm.date = year + '.' + month + '.' + day;
        vm.time = vm.checkNo(hour) + ":" + vm.checkNo(minute) + ':' + vm.checkNo(second);
        vm.week = '星期' + vm.checkWeek(week);
    },
    checkNo(i){
        if(i<10){
            i = '0' + i;
        }else{
            i = i;
        }
        return i;
    },
    checkWeek(i){
        let weekday;
        switch(i){
            case 1:
                weekday = '一';
                break;
            case 2:
                weekday = '二';
                break;
            case 3:
                weekday = '三';
                break;
            case 4:
                weekday = '四';
                break;
            case 5:
                weekday = '五';
                break;
            case 6:
                weekday = '六';
                break;
            case 7:
                weekday = '日';
                break;
            default:

                break;
        }
        return weekday;
    },
    handdleWaring(data){
        if(data.status == 0){
            this.warningRecordId = data.id;
            this.visibleWaringHanddle = true;
        }
    },
    closeWaring(){
        this.visibleWaringHanddle = false;
    },
    refreshList(){
        this.visibleWaringHanddle = false;
        this.getAlarms();
    },
    more(type){
      this[type] = true;
    },
    checkMode(){
      this.fullScreen = !this.fullScreen;
    },
    search(){
      this.$http
      .get(this.$http.adornUrl(`/business/work/manageInfo?ie=${new Date().getTime()}`))
      .then(res => {
        if (res.data && res.data.code != 0) {
          this.$message.error(res.data.msg)
          // this.fail()
          return
        }
        // const {
        //   stationInCars,
        //   machineAllInfo
        // } = res.data
        console.log(res.data.machineAllInfo)
       console.log(res.data.machineAllInfo[0].machineEntities[0].guns[0].gasolineNum)
        this.machineAllInfo = res.data.machineAllInfo;
        // this.machineAllInfo.forEach(function(item,index){
        //     if(item.guns.length<4){
        //         let len = 4 - item.guns.length;
        //         // for(let i=0;i<len;i++){
        //             item.guns.push({boardNo: null,
        //                     carNo: null,
        //                     createId: null,
        //                     createTime: "2019-08-06 11:22:06",
        //                     fillingMachineId: "",
        //                     gasolineNum: "92",
        //                     gunName: "3号",
        //                     gunStatus: "",
        //                     machineName: null,
        //                     position: 0,
        //                     price: "8.01",
        //                     refuelingGunId: "",
        //                     remark: null,
        //                     serialPortNum: "1",
        //                     serialPortSort: null,
        //                     updateId: null,
        //                     updateTime: "2019-08-07 17:00:53"})
        //             item.guns.push({boardNo: null,
        //                     carNo: null,
        //                     createId: null,
        //                     createTime: "2019-08-06 11:22:06",
        //                     fillingMachineId: "",
        //                     gasolineNum: "95",
        //                     gunName: "4号",
        //                     gunStatus: "",
        //                     machineName: null,
        //                     position: 0,
        //                     price: "8.01",
        //                     refuelingGunId: "",
        //                     remark: null,
        //                     serialPortNum: "1",
        //                     serialPortSort: null,
        //                     updateId: null,
        //                     updateTime: "2019-08-07 17:00:53"})
        //         // }
        //     }
        // })
        // if(this.machineAllInfo.length<9){
        //     let len = 9 - this.machineAllInfo.length;
        //     // console.log(len);
        //     for(let i=0;i<len;i++){
        //         this.machineAllInfo.push({boardNo: 1,
        //             createId: null,
        //             createTime: "2019-08-06 11:22:06",
        //             expireTime: "2019-08-07 17:21:28",
        //             fillingMachineId: "",
        //             guns: [{boardNo: null,
        //                     carNo: null,
        //                     createId: null,
        //                     createTime: "2019-08-06 11:22:06",
        //                     fillingMachineId: "",
        //                     gasolineNum: "92",
        //                     gunName: "1号",
        //                     gunStatus: "",
        //                     machineName: null,
        //                     position: 0,
        //                     price: "8.01",
        //                     refuelingGunId: "",
        //                     remark: null,
        //                     serialPortNum: "1",
        //                     serialPortSort: null,
        //                     updateId: null,
        //                     updateTime: "2019-08-07 17:00:53"},
        //                     {boardNo: null,
        //                     carNo: null,
        //                     createId: null,
        //                     createTime: "2019-08-06 11:22:06",
        //                     fillingMachineId: "",
        //                     gasolineNum: "95",
        //                     gunName: "2号",
        //                     gunStatus: "",
        //                     machineName: null,
        //                     position: 0,
        //                     price: "8.01",
        //                     refuelingGunId: "",
        //                     remark: null,
        //                     serialPortNum: "1",
        //                     serialPortSort: null,
        //                     updateId: null,
        //                     updateTime: "2019-08-07 17:00:53"},
        //                     {boardNo: null,
        //                     carNo: null,
        //                     createId: null,
        //                     createTime: "2019-08-06 11:22:06",
        //                     fillingMachineId: "",
        //                     gasolineNum: "92",
        //                     gunName: "3号",
        //                     gunStatus: "",
        //                     machineName: null,
        //                     position: 0,
        //                     price: "8.01",
        //                     refuelingGunId: "",
        //                     remark: null,
        //                     serialPortNum: "1",
        //                     serialPortSort: null,
        //                     updateId: null,
        //                     updateTime: "2019-08-07 17:00:53"},
        //                     {boardNo: null,
        //                     carNo: null,
        //                     createId: null,
        //                     createTime: "2019-08-06 11:22:06",
        //                     fillingMachineId: "",
        //                     gasolineNum: "95",
        //                     gunName: "4号",
        //                     gunStatus: "",
        //                     machineName: null,
        //                     position: 0,
        //                     price: "8.01",
        //                     refuelingGunId: "",
        //                     remark: null,
        //                     serialPortNum: "1",
        //                     serialPortSort: null,
        //                     updateId: null,
        //                     updateTime: "2019-08-07 17:00:53"}],
        //             machineGroup: null,
        //             machineName: "",
        //             machineNo: "",
        //             machineStatus: "",
        //             refuellerModel: "",
        //             remark: null,
        //             updateId: null,
        //             updateTime: ""});
        //     }
        // }
        console.log(this.machineAllInfo)
        this.stationInCars = res.data.stationInCars;
        this.gunUse = res.data.gunUse;
        this.gunXz = res.data.gunXz;
        this.machineError = res.data.machineError;
        this.machineQuantity = res.data.machineQuantity;

      })
      .catch(err => {
        // this.$message.error('数据加载失败')
        // this.fail()
      })
    },
    searchStatic(){
      this.$http
      .get(this.$http.adornUrl(`/business/work/sales_statistics?ie=${new Date().getTime()}`))
      .then(res => {
        if (res.data && res.data.code != 0) {
          this.$message.error(res.data.msg)
          // this.fail()
          return
        }
        this.salesItems = res.data.salesStatistics;
        this.drawGauge(this.salesItems.selfServeRatio);
      })
      .catch(err => {
        // this.$message.error('数据加载失败')
        // this.fail()
      })
    },
    getPrice(){
      this.$http
        .get(this.$http.adornUrl(`/business/price/manageInfo?ie=${new Date().getTime()}`))
        .then(res => {
          this.prices = res.data.oilBasePrice;
          // resolve(res)
        })
        .catch(err => {
          // reject(err)
        })
    },
    getAlarms(){
      this.$http
        .get(this.$http.adornUrl(`/business/warning/latest?ie=${new Date().getTime()}`))
        .then(res => {
          this.warnings = res.data.warnings;
          // resolve(res)
        })
        .catch(err => {
          // reject(err)
        })
    },
    changeData() {
      this.activeGroup = []
      this.machineAllInfo.forEach(item => {
        if (item.machineGroup == this.tabPosition) {
          this.activeGroup.push(item)
        }
      })
      console.log(JSON.stringify(this.activeGroup[0]));
    },
    fail() {
      this.gunUse = 0
      this.gunXz = 0
      this.machineError = 0
      this.stationInCars = []
    //   this.machineAllInfo = []
    },
    initWebSocket() {
      console.log(this.websocket)
      //连接错误
      this.websocket.onerror = this.setErrorMessage
      // //连接成功
      this.websocket.onopen = this.setOnopenMessage
      //收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage
      //连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage
      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage() {
      console.log("WebSocket连接发生错误" + '   状态码：' + this.websocket.readyState)
    },
    setOnopenMessage() {
      console.log("WebSocket连接成功" + '   状态码：' + this.websocket.readyState)
    },
    setOnmessageMessage(event) {
      this.search()
    },
    setOncloseMessage() {
      console.log("WebSocket连接关闭" + '   状态码：' + this.websocket.readyState)
    },
    onbeforeunload() {
      this.websocket.close()
    },
    drawGauge(value){
      // console.log(this.$echarts);
      this.myChartGauge = echarts.init(document.getElementById('chartGauge'));
      this.myChartGauge.setOption({
            tooltip : {
                formatter: "{a} <br/>{b} : {c}"
            },
            toolbox: {
                feature: {
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: [
                {
                    name: '自助加油占比率',
                    type: 'gauge',
                    radius:'100%',
                    axisLine:{
                      lineStyle:{
                        color:[[0.4, '#FF6D00'], [1, '#09FA11']],
                        width:8,
                      }
                    },
                    splitLine :{
                      length:12,
                      lineStyle:{
                        width:2,
                      }
                    },
                    pointer:{
                      width:5,
                      length:'70%'
                    },
                    title:{
                      color:'#fff',
                      offsetCenter:[0,'-30%'],
                    },
                    detail: {
                      formatter:'{value}%',
                      color:'#fff',
                      fontSize:20,
                      // offsetCenter:[0,'70%']
                    },
                    data: [{value: parseInt(value), name: ''}]
                }
            ]
        });
    },
  },
  filters: {
    index: function (value) {
      const num = +value + 1
      return num > 9 ? num : "0" + num
    },
    status: function (value) {
      return value == '0' ? '正常' : '异常'
    }
  },
  mounted() {
    let vm = this;
    vm.searchStatic();
    vm.search();
    vm.getPrice();
    vm.getAlarms();

    vm.timerGetdata = setInterval(()=>{
        vm.searchStatic();
        vm.search();
        vm.getPrice();
        vm.getAlarms();
    },2000);
    vm.timerDate = setInterval(()=>{
        vm.getTimeNow();
        // console.log('time');
    },1000);
    /*if ('WebSocket' in window) {
      this.websocket = new WebSocket(this.$http.ws_api)
      this.initWebSocket()
    } else {
      alert('当前浏览器不支持websocket')
    }*/
  },
  beforeDestroy() {
    let vm = this;
    // vm.onbeforeunload();
    clearInterval(vm.timerGetdata);
    vm.timerGetdata = null;
    clearInterval(vm.timerDate);
    vm.timerDate = null;
  }
}
</script>
<style  lang="scss">
$number-fontfamily:'Receiver-Regular';
$time-fontfamily:'UnidreamLED';
$font-color: #00FFFC;
$font-colorTxt:#00CCFF;
$fontColor-err:#FC355D;
$background-tit:rgba(10,34,85,.5);
$font-size-tit:16px;
.number{
    font-family:$number-fontfamily;
}
.tmfamily{
    font-family:$time-fontfamily;
    font-size:28px;
    text-align:left;
}
.home{
    /*background: #fff;*/
    height: 1080px;
    box-sizing:border-box;
    padding:20px 10px 10px;
    background: url(~@/assets/img/home/bg1.png) no-repeat;
    background-size: 100% 100%;
}
.homeFixed{
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:9999;
    box-sizing:border-box;
}
#home .el-table th,#home .el-table tr{
    background-color: transparent;
}
#home .title{
    height: 54px;
    background: url(~@/assets/img/home/dingbu.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
    text-align:center;
}
.title .checkMode{
  // width:50px;
  // height:100%;
  position:absolute;
  left:20px;
  top:20px;
  cursor:pointer;
}
.title .logo{
  // width:50px;
  // height:100%;
  position:absolute;
  left:60px;
  top:15px;
  cursor:pointer;
}
.title .guang{
    margin: 0 auto;
    margin-top:20px;
}
.title .jiange{
    position:absolute;
    left:165px;
    top:20px;
    cursor:pointer;
    font-size:22px;
    color:#fff;
    // border-left:1px solid #fff;
    padding-left:15px;
}
.title .contName{
    position:absolute;
    left:180px;
    top:20px;
    cursor:pointer;
    font-size:22px;
    color:#fff;
    // border-left:1px solid #fff;
    padding-left:15px;
}
.title .datetime{
    position:absolute;
    right:50px;
    top:20px;
    cursor:pointer;
    font-size:22px;
    color:#fff;
    height:32px;
    // border-left:1px solid #fff;
    // padding-left:15px;
}
.title .datetime>span{
    // margin-right:10px;
    display:inline-block;
}
#home .contentBox{
    height: calc(100% - 54px);
    box-sizing:border-box;
    padding-top:20px;
}
.contentBox{
    overflow: hidden;
}
.leftTips{
    width: 340px;
    height: 100%;
    box-sizing:border-box;
    padding-right: 10px;
    float: left;
}
.content{
    width: calc(100% - 340px);
    height: 100%;
    float: right;
    overflow:hidden;
}
.machineBox{
    width: calc(100% - 350px);
    height: 100%;
    float: left;
}
.itemBox{
    height: 150px;
    padding-top:15px;
}
.itemBoxRT{
    // height:216px;
    height:33.33%;
    padding-top:15px;
    // margin-bottom:25px;
}
.itemBoxRTB{
    // height:calc(100% - 432px);
    height:33.33%;
    padding-top:15px;
}
.itemBoxRT .col .items{
    height:70px;
}
.itemBoxRT .col .itemIcon{
    width:50%;
    height:100%;
    float:left;
}
.itemBoxRT .col .itemIcon .iImg{
    width:40%;
    height:100%;
    float:left;
    text-align:right;
    padding-top:6px;
    box-sizing:border-box;
}
.warning{
  color:$fontColor-err;
}
.iTxt{
  color:#fff;
}
.iTxt .n{
  font-size:24px;
}
.iTxt .u{
  font-size:12px;
}
.iTxt .s{
  font-size:14px;
  color:$font-colorTxt;
}
.itemBoxRT .col .itemIcon .iImg>img{
  width:32px;
  height:32px;
}
.itemBoxRT .col .itemIcon .iTxt{
    width:60%;
    height:100%;
    float:left;
    padding-left:8px;
    box-sizing:border-box;
}
.itemBoxRT .colL{
    width:55%;
    float:left;
}
.itemBoxRT .colR{
    width:45%;
    float:right;
    height:100%;
    position:relative;
    padding-top:40px;
    // background: url(~@/assets/img/home/jiayoujizhanbi.png) no-repeat;
    // background-size: 100% 100%;
}
.itemBoxLeftTop{
    height:16.66%;
}
.itemBoxTable{
    height: calc(100% - 360px);
}
.itemBox .tit{
    height: 36px;
    line-height: 36px;
    font-size: $font-size-tit;
    background: url(~@/assets/img/home/biaoqian.png) no-repeat;
    background-size: 100% 100%;
    color:#00fffc;
    text-indent: 20px;
    position: relative;
}

.itemBox .items{
    height: calc(100% - 36px);
    padding:10px 0 15px 0;
    box-sizing:border-box;
    // text-align: center;
}
.itemBox .itemsLTop{
  padding-left:20px;
  box-sizing:border-box;
}
.itemBox .items .itemRow{
    height:50%;
    padding-left:12px;
    box-sizing:border-box;
}
.itemRow .iBox{
    height:100%;
    width:33.33%;
    float:left;
}
.itemRow .iBox .iTit{
  font-size:14px;
  color:#fff;
  margin-bottom:10px;
}
.itemRow .iBox .in{
  font-size:24px;
  color:$font-colorTxt;
}
.itemRow .iBox .unit{
  font-size:12px;
  color:#fff;
}
.itemBox .item{
    // height: 100px;
    width:50%;
    // background: url(~@/assets/img/home/jinriryoujia.png) no-repeat;
    // background-size: 100% 100%;
    padding-top:23px;
    padding-left:20px;
    box-sizing:border-box;
}
.itemBox .itemList{
    padding-bottom: 0;
}
.itemBox .itemL{
    float: left;
}
.itemBox .itemR{
    float: right;
}
.itemBox .item .tir{
    font-size: 14px;
    color:#a9ddee;
    margin-bottom:5px;
}
.itemBox .item .txt1{
    font-size: 28px;
}
.itemBox .item .txt2{
    font-size: 14px;
}
.itemBox .item .txt{
    color:#37e961;
}
.itemBox .item .tx1{
  color:#FDD75A
}
.itemListTable{
    height: 100%;
    // background:url(~@/assets/img/home/zhanneicheliangshuliang.png) no-repeat;
    // background-size: 100% 100%;
}
.itemListTable table{
    width: 100%;
    border-collapse:collapse;
}
.itemListTable th,.itemListTable td{
    padding:12px 0;
    cursor:pointer;
}
.itemListTable th{
    color:#fff;
    // background:$background-tit;
    padding:2px 0;
}
.itemListTable td{
    color: $font-colorTxt;
    border-bottom:1px dashed #02aada;
    text-align:center;
}
.machineBox .machineRow{
    height: 100%;
}
.machineBox .machineItem{
    height: 33.33%;
    padding-top:15px;
}
.machineM{
    // border:1px solid #ddd;
    height: 100%;
    box-shadow:inset 0 0 10px #15bdfb;
}
.machineM .titTop{
    height: 40px;
    line-height: 40px;
    text-align: center;
    color:$font-color;
    background:$background-tit;
    font-size:$font-size-tit;
    position:relative;
}
.machineM .machineIn{
    height:calc(100% - 40px);
    box-sizing:border-box;
    padding:15px 5px;
}
.machineM .machineIn .machineItem{
    width:49%;
    height:100%;
    float:left;
    box-sizing:border-box;
    padding:0 10px;
}
.machineM .machineIn .machineItem .itemBg{
    width:100%;
    height:calc(100% - 30px);
    background:url(~@/assets/img/home/jiayouji.png) no-repeat;
    background-size: 100% 100%;
    position:relative;
}
.machineM .machineIn .machineItem .itemBg img.left{
  position:absolute;
  left:-6px;
  top:25%;
}
.machineM .machineIn .machineItem .itemBg img.right{
  position:absolute;
  right:-6px;
  top:25%;
}
.machineM .machineIn .machineItem .itemBg img.jiayou{
    -webkit-animation: scaleout 1s infinite ease-in-out;
    animation: scaleout 1s infinite ease-in-out;
}
@-webkit-keyframes scaleout {
    0% {
        -webkit-transform: scale(1.0);
        opacity: 1;
    }
    100% {
        -webkit-transform: scale(1.1);
        opacity: 0;
    }
}
@keyframes scaleout {
    0% {
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
        opacity: 1;
    } 100% {
        transform: scale(1.1);
        -webkit-transform: scale(1.1);
        opacity: 0;
    }
}
.machineM .machineIn .machineItem .carIn{
    width:100%;
    height:30px;
    line-height:30px;
    font-size:12px;
    color:#E7D33B;
}
.machineM .machineIn .machineItem .carInTx1{
    float:left;
}
.machineM .machineIn .machineItem .carInTx2{
    float:right;
}
.machineM .titTop .rgTip{
    position:absolute;
    right:10px;
    font-size:12px;
}
.machineM .titTop .lfTip{
    position:absolute;
    left:10px;
    color:$fontColor-err;
}
.machineM .titTop .lfTip>img{
    position:absolute;
    top:9px;
}
.machineM .titTop .lfTip>span{
    padding-left:23px;
}
.totalTips{
    width: 350px;
    height:100%;
    box-sizing:border-box;
    padding-left: 10px;
    float: right;
    // padding-top:16px;
}
.oil{
    text-align:center;
    color:#fff;
    box-sizing:border-box;
    padding:0 20% 0 18%;
    padding-top:30%;
}
.oil .txtRow{
    background:$background-tit;
    overflow:hidden;
}
.oil .txtRow div{
    float:left;
    width:50%;
    line-height:24px;
    font-size:13px;
    // padding:0 20px;
}
.more{
    // display:inline-block;
    // padding:10px 20px;
    height:32px;
    width:70px;
    // text-align:center;
    background:url(~@/assets/img/home/gengduo.png) no-repeat;
    background-size: 100% 100%;
    color:#fff;
    font-size:14px;
    position:absolute;
    top:2px;
    right:20px;
    cursor:pointer;
}
</style>
