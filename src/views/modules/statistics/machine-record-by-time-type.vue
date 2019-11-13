<template>
    <div>
        <!-- 当日数据统计 -->
        <div  style="text-align:left;padding-left:18px;">
            <div v-for="item in stationCount" :key="item.value" style="float:left; margin:10px 20px;text-align:center;width:200px;height:100px;border: 1px solid #dddddd;border-radius: 10px;">
                <div style="margin-top:20px;">
                    <span v-if="item.value == 'today'&& timeFlag == '0'" ><i class="el-icon-star-off"></i>今日销售（元）</span>
                    <span v-else-if="item.value == 'today'&& timeFlag == '1'" ><i class="el-icon-star-off"></i>本月销售（元）</span>
                    <span v-else-if="item.value == 'today'&& timeFlag == '2'" ><i class="el-icon-star-off"></i>今年销售（元）</span>
                    <span v-else>{{item.value}}油销售体积（升）</span>
                    <span style="display: block;font-weigth:normal;font-size:1cm;margin:10px 0">{{item.label}}</span>
                </div>
            </div>
        </div>
        <div  style="text-align:left;padding-left:18px;">
            <el-col :span="24" class="toolbar"  style="padding-top: 10px;">
                <el-form :inline="true" :model="tabFilters" ref="tabFilters" >
                    <el-form-item label="加油机名称" prop="fillingName">
                        <el-input v-model="tabFilters.fillingName" placeholder="请输入加油机名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="油枪名称" prop="gunName">
                        <el-input v-model="tabFilters.gunName" placeholder="请输入油枪名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="结算日期" prop="settlementTime">
                        <el-date-picker :type="timeType" placeholder="请选择结算日期" v-model="tabFilters.settlementTime" style="width: 100%;" :value-format="formatTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button  v-on:click="searchByDay(timeFlag)">查询</el-button>
                        <el-button @click="resetFormByDay('tabFilters')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </div>
            <!--表格数据及操作-->
        <el-table :data="tableDataByDay"  v-loading="listLoadingByDay"  border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
            <!--勾选框-->
            <el-table-column type="selection" width="50" align="center">
            </el-table-column>
            <!--索引-->
            <el-table-column label="序号" type="index" :index="indexMethod" width="50" align="center">
            </el-table-column>
            <el-table-column prop="settlementTimeStr" label="结算时间" min-width="10%" sortable align="center">
            </el-table-column>
            <el-table-column prop="fillingName" label="加油机名称" min-width="10%" sortable align="center">
            </el-table-column>
            <el-table-column prop="gunName" label="油枪名称" min-width="10%" sortable align="center">
            </el-table-column>
            <el-table-column prop="gasolineNum" label="油品" min-width="10%" sortable align="center">
            </el-table-column>
            <el-table-column prop="amount" label="合计金额（元）" min-width="10%" align="center">
            </el-table-column>
            <el-table-column prop="quantity" label="数量（升）" min-width="10%" align="center">
            </el-table-column>
            <el-table-column prop="unitPrice" label="单价（元）" min-width="10%" align="center">
            </el-table-column>
            <!-- <el-table-column label="操作" min-width="20%" align="center" >
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="addOrUpdateHandle(scope.row.salesRecordsId, true)">详情</el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="addOrUpdateHandle(scope.row.salesRecordsId, false)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteHandle(scope.row.salesRecordsId)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>
            <!--分页条-->
        <el-pagination
            @size-change="handleSizeChangeByDay"
            @current-change="handleCurrentChangeByDay"
            :current-page="currentPageByDay"
            :page-sizes="[10,20,50,100, 200,]"
            :page-size="pageSizeByDay"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCountByDay" >
        </el-pagination>
    </div>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
        return {
            stationCount: [],
            timeFlag: '0',
            listLoadingByDay: false,
            tableDataByDay: [],
            currentPageByDay: 1,
            pageSizeByDay: 10,
            totalCountByDay: 0,
            tabFilters:{
                fillingName: '',
                gunName: '',
                settlementTime: ''
            },
            timeType: 'date',
            formatTime: 'yyyy-MM-dd',

        }
    },
    methods: {
          resetFormByDay(formName) {
                this.currentPageByDay = 1;
                this.$refs[formName].resetFields();
                this.getStationCount(this.timeFlag);
            },
        indexMethod(index) {
            return index + 1;
        },
        handleSizeChangeByDay(val) {
            console.log(`每页 ${val} 条`);
            this.pageSizeByDay = val;
            //重新获取列表
            this.searchByDay(this.timeFlag);

        },
        handleCurrentChangeByDay(val) {
            console.log(`当前页: ${val}`);
            this.currentPageByDay = val;
            //重新获取列表
            this.searchByDay(this.timeFlag);
        },
        searchByDay(flag){
            this.listLoadingByDay = true
            this.$http({
                url: this.$http.adornUrl('/business/salesrecords/listByTimeTyp'),
                method: 'get',
                params: this.$http.adornParams({
                    'page': this.currentPageByDay,
                    'limit': this.pageSizeByDay,
                    'fillingName': this.tabFilters.fillingName,
                    'gunName': this.tabFilters.gunName,
                    'settlementTime': this.tabFilters.settlementTime,
                    'timeFlag': flag
                })
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.tableDataByDay = data.page.list
                    this.totalCountByDay = data.page.totalCount
                } else {
                    this.tableDataByDay = []
                    this.totalCountByDay = 0
                }
                this.listLoadingByDay = false
            })
        },
        getStationCount(flag){
            this.$http({
                url: this.$http.adornUrl('/business/salesrecords/stationList'),
                method: 'get',
                params: this.$http.adornParams({
                    'timeFlag': flag
                })
            }).then(({data}) => {
                if (data && data.code === 0) {
                    if(data.list.length>0){
                        var quantitys = data.list[0].quantitys.split(",");
                        var gasolineNums = data.list[0].gasolineNums.split(",");
                        this.stationCount = [];
                        this.stationCount.push({"value":"today","label":data.list[0].amounts});
                        for(var a=0;a<gasolineNums.length; a++){
                            this.stationCount.push({"value":gasolineNums[a],"label":quantitys[a]});
                        }
                    }
                } else {
                    this.stationCount = []
                }
            }).then(()=>{
                this.searchByDay(flag);
            })
        },
    }
  }
</script>
