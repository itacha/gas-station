<template>
    <div class="pageview">
            <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small" class="queryForm">
          <el-form-item label="告警类型">
            <el-select v-model="dataForm.warningType" placeholder="请选择" style="width:100px;">
                <el-option
                  v-for="item in warningsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-select v-model="dataForm.typeSpan" placeholder="请选择" style="width:100px;">
                <el-option
                  v-for="item in times"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="dataForm.typeSpan === 0">
            <el-date-picker
              v-model="dataForm.time"
              type="datetimerange"
              range-separator="-"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:350px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="haddleRg">
            <el-button @click="search()">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <div style="border:1px solid #eee;padding:10px;">
            <div style="font-size:16px;color:#000;line-height:30px;">告警统计</div>
            <div class="types">
                <span v-for="(i,key) in statistics" :key="key">{{i.typeDescription}}：{{i.quantity}}</span>
            </div>
        </div>
        <el-table
          :data="dataList"
          style="width: 100%"
          :header-cell-style="cm.theadStyle">
          <el-table-column
                label="序号"
              type="index"
              width="50">
            </el-table-column>
          <el-table-column
            prop="createTime"
            label="时间"
            width="160">
          </el-table-column>
          <el-table-column
            prop="fillingMachineName"
            label="加油机名称"
            width="">
          </el-table-column>
          <el-table-column
            prop="machineModel"
            label="加油机型号"
            width="">
          </el-table-column>
          <el-table-column
            prop="fillingMachineId"
            label="加油机ID"
            width="">
          </el-table-column>
          <el-table-column
            prop="warningDetailTypeDescription"
            label="告警类型"
            width="">
          </el-table-column>
          <el-table-column
            prop="statusDescription"
            label="状态">
          </el-table-column>
        </el-table>
        <div class="pagesBox">
          <el-pagination
            background
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </div>
    </div>
</template>
<script>
export default{
    name:'alarmList',
    data(){
        return{
          time:'',
            tableData:[],
            dataForm:{
                warningType:0,
                typeSpan:0,
                time:'',
                startTime:'',
                endTime:''
            },
            pageIndex:1,
            pageSize:10,
            totalPage:0,
            dataList:[],
            warningsType:[{value:0,label:'全部'},{value:1,label:'未挂枪'},{value:2,label:'机器故障'},{value:11,label:'网络故障'},{value:12,label:'加油故障'},{value:13,label:'屏幕无显示'},{value:14,label:'其他'}],
            times:[{value:1,label:'今天'},{value:7,label:'本周'},{value:30,label:'本月'},{value:0,label:'自定义'}],
            statistics:[],

        }
    },
    methods:{
        getDataList(){
            if(this.dataForm.time){
              this.dataForm.startTime = this.dataForm.time[0];
              this.dataForm.endTime = this.dataForm.time[1];
            }else{
              this.dataForm.startTime = '';
              this.dataForm.endTime = '';
            }
            this.$http({
                url: this.$http.adornUrl('/business/warning/query?limit='+this.pageSize+'&page='+this.pageIndex+'&warningType='+this.dataForm.warningType+'&typeSpan='+this.dataForm.typeSpan+'&startTime='+this.dataForm.startTime+'&endTime='+this.dataForm.endTime),
                method: 'get',
                data: this.$http.adornData({
                  // 'page': this.pageIndex,
                  // 'limit': this.pageSize,
                  // 'username': this.dataForm.userName+
                }, false)
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.dataList = data.warnings.list;
                  this.totalPage = data.warnings.totalCount;
                  this.statistics = data.statistics;
                } else {
                  this.dataList = []
                  this.totalPage = 0
                }
                // this.dataListLoading = false
              })
        },
        search(){
            this.pageIndex = 1;
            this.getDataList();
        },
        sizeChangeHandle(val){
            this.pageSize = val;
            this.pageIndex = 1;
            this.getDataList();
        },
        currentChangeHandle(val){
            this.pageIndex = val;
            this.getDataList();
        },
        reset(){
            this.dataForm={
                  warningType:0,
                  typeSpan:0,
                  time:'',
                  startTime:'',
                  endTime:''
            }
        }
    },
    mounted(){
        this.getDataList();
    }
}
</script>
<style scoped>
    .types{
        margin-top: 10px;
    }
    .types span{
        margin-right:15px;
    }
    .more{
      position:static;
    }
</style>
