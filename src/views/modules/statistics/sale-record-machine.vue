<template>
    <section id="table" style="width: 100%">
        <!-- 搜索功能 -->
        <!--工具条-->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="总计" name="first">
                <div  style="text-align:left;padding-left:18px;">
                    <el-col :span="24" class="toolbar"  style="padding-top: 10px;">
                        <el-form :inline="true" :model="filters" ref="filters" >
                            <el-form-item label="加油机名称" prop="fillingName">
                                <el-input v-model="filters.fillingName" placeholder="请输入加油机名称" ></el-input>
                            </el-form-item>
                            <el-form-item label="流水编号" prop="serialNum">
                                <el-input v-model="filters.serialNum" placeholder="请输入流水编号" ></el-input>
                            </el-form-item>
                            <el-form-item label="订单状态"  prop="recordsStatus">
                                <el-select v-model="filters.recordsStatus" placeholder="请选择摄像机类别">
                                    <el-option label="正常" value="0"></el-option>
                                    <el-option label="异常" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="结算时间" prop="settlementTime">
                                <el-date-picker type="date" placeholder="请选择结算时间" v-model="filters.settlementTime" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button  v-on:click="searchCamera()">查询</el-button>
                                <el-button @click="resetForm('filters')">重置</el-button>
                                <el-button  type="primary" @click="addOrUpdateHandle(null, false)">新增</el-button>
                                <el-button  type="danger" @click="deleteHandle()" :disabled="sels.length <= 0">批量删除</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </div>
                <!--表格数据及操作-->
                <el-table :data="tableData"  v-loading="listLoading" @selection-change="selsChange" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
                    <!--勾选框-->
                    <el-table-column type="selection" width="50" align="center">
                    </el-table-column>
                    <!--索引-->
                    <el-table-column label="序号" type="index" :index="indexMethod" width="50" align="center">
                    </el-table-column>
                    <el-table-column prop="serialNum" label="流水编号" min-width="10%" sortable align="center">
                    </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" min-width="10%" sortable align="center">
                  </el-table-column>
                    <el-table-column prop="settlementTime" label="结算时间" min-width="10%" sortable align="center">
                    </el-table-column>
                    <el-table-column prop="gasolineNum" label="油品名称" min-width="10%" sortable align="center">
                    </el-table-column>
                    <el-table-column prop="reamount" label="预计金额（元）" min-width="10%" sortable align="center">
                    </el-table-column>
                    <el-table-column prop="amount" label="实付金额（元）" min-width="10%" sortable align="center">
                    </el-table-column>
                    <el-table-column prop="gunName" label="油枪" min-width="10%" align="center">
                    </el-table-column>
                    <el-table-column prop="plateNumber" label="车牌号" min-width="10%" align="center">
                    </el-table-column>
                    <el-table-column prop="recordsStatus" label="业务状态" min-width="8%" align="center">
                        <template slot-scope="scope">
                            <el-tag v-if ="scope.row.recordsStatus== '0'" size="small">创建</el-tag>
                            <el-tag v-if ="scope.row.recordsStatus== '1'" size="small">已完全</el-tag>
                        </template>
                    </el-table-column>
                  <el-table-column prop="recordsStatus" label="订单状态" min-width="8%" align="center">
                    <template slot-scope="scope">
                      <el-tag v-if ="scope.row.status== '0'" size="small">正常</el-tag>
                      <el-tag v-if ="scope.row.status== '1'" size="small">异常</el-tag>
                    </template>
                  </el-table-column>
                    <el-table-column label="操作" min-width="20%" align="center" >
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-search" size="small" @click="addOrUpdateHandle(scope.row.salesRecordsId, true)">详情</el-button>
                            <el-button type="text" icon="el-icon-edit" size="small" @click="addOrUpdateHandle(scope.row.salesRecordsId, false)">修改</el-button>
                            <el-button type="text" style="color:#f78989;" icon="el-icon-delete" size="small" @click="deleteHandle(scope.row.salesRecordsId)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页条-->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10,20,50,100, 200,]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount" >
                </el-pagination>
                    <!-- 弹窗, 新增 / 修改 -->
                <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
            </el-tab-pane>
            <el-tab-pane label="按日" name="second">
                <time-type-record  ref="timeTypeRecord"></time-type-record>
            </el-tab-pane>
            <el-tab-pane label="按月" name="third">
                <time-type-record  ref="timeTypeRecord1"></time-type-record>
            </el-tab-pane>
            <el-tab-pane label="按年" name="fourth">
                <time-type-record  ref="timeTypeRecord2"></time-type-record>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>
    import AddOrUpdate from './machine-record-update-or-detail'
    import TimeTypeRecord from './machine-record-by-time-type'
    export default {
        data() {
            return {
                activeName: 'first',
                //表格数据
                tableData: [],
                pageSize: 10,
                currentPage:1,
                totalCount:0,
                filters:{
                    fillingName: '',
                    serialNum: '',
                    recordsStatus: '',
                    settlementTime: ''
                },
                sels: [],
                listLoading: false,
                addOrUpdateVisible: false,
            }
        },
        components: {
        AddOrUpdate,TimeTypeRecord
        },
        methods: {

            handleClick(tab, event) {
                if(tab.name == "first"){
                    this.resetForm('filters')
                }
                if(tab.name == "second"){
                    this.$refs.timeTypeRecord.timeType = 'date';
                    this.$refs.timeTypeRecord.formatTime = 'yyyy-MM-dd';
                    this.$refs.timeTypeRecord.timeFlag = '0';
                    this.$refs.timeTypeRecord.resetFormByDay("tabFilters");
                    //this.$refs.timeTypeRecord.getStationCount('0')
                }
                if(tab.name == "third"){
                    this.$refs.timeTypeRecord1.timeType = 'month';
                    this.$refs.timeTypeRecord1.formatTime = 'yyyy-MM';
                    this.$refs.timeTypeRecord1.timeFlag = '1';
                    this.$refs.timeTypeRecord1.resetFormByDay("tabFilters");
                    //this.$refs.timeTypeRecord.getStationCount('1')
                }
                if(tab.name == "fourth"){
                    this.$refs.timeTypeRecord2.timeType = 'year';
                    this.$refs.timeTypeRecord2.formatTime = 'yyyy';
                    this.$refs.timeTypeRecord2.timeFlag = '2';
                    this.$refs.timeTypeRecord2.resetFormByDay("tabFilters");

                    //this.$refs.timeTypeRecord.getStationCount('2')
                }
            },
            searchCamera(){
                this.currentPage = 1;
                this.search();
            },
            // 新增 / 修改 /查看
            addOrUpdateHandle (id, flag) {
                this.addOrUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.isEdit = flag;
                    this.$refs.addOrUpdate.init(id)
                })
            },
            // 删除
            deleteHandle (id) {
                var salesRecordsIds = id ? [id] : this.sels.map(item => {
                return item.salesRecordsId
                })
                this.$confirm(`确定对所选数据进行[${id ? '删除' : '批量删除'}]操作吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/business/salesrecords/delete'),
                    method: 'post',
                    data: this.$http.adornData(salesRecordsIds, false)
                }).then(({data}) => {
                    if (data && data.code === 0) {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                        this.getDataList()
                        }
                    })
                    } else {
                    this.$message.error(data.msg)
                    }
                })
                }).catch(() => {})
            },
            // 获取数据列表
            getDataList () {
                this.listLoading = true
                this.$http({
                    url: this.$http.adornUrl('/business/salesrecords/list'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'page': this.currentPage,
                        'limit': this.pageSize,
                        'fillingName': this.filters.fillingName,
                        'recordsStatus': this.filters.recordsStatus,
                        'serialNum': this.filters.serialNum,
                        'settlementTime': this.filters.settlementTime
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.tableData = data.page.list
                        this.totalCount = data.page.totalCount
                    } else {
                        this.tableData = []
                        this.totalCount = 0
                    }
                    this.listLoading = false
                })
            },
            indexMethod(index) {
                return index + 1;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                //重新获取列表
                this.search();

            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                //重新获取列表
                this.search();
            },

             //重置
             resetForm(formName) {
                this.currentPage = 1;
                this.$refs[formName].resetFields();
                this.search();
            },
            search() {
                //组装参数
               this.getDataList();
            },
            callbackForDelete(res){
                 if(res.status=='fail'){
                    //失败
                    this.$message({message: res.msg,type: 'error'});
                }else{
                    //成功
                    this.$message({message: res.msg,type: 'success'});
                }
                this.search();
            },
            selsChange: function (sels) {
				this.sels = sels;
            },
        },
        activated: function(){
            this.getDataList();
        },
    }
</script>
<style>
    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
    }

</style>
