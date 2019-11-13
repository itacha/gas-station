<template>
    <section id="table" style="width: 100%">
        <!-- 搜索功能 -->
        <div  style="text-align:center;padding-left:18px;border-bottom: 1px">
            <div  style="float:right; margin:10px 20px;text-align:center;width:200px;height:100px;border: 1px solid #dddddd;border-radius: 10px;">
                <div style="margin-top:20px;">
                    <span >{{$route.params.machineName}}</span>
                    <span style="display: block;font-weigth:normal;font-size:1cm;margin:10px 0">{{$route.params.machineStatus== '0'?'正常':'断电报警'}}</span>
                </div>
            </div>
        </div>
        <!--工具条-->
        <div  style="text-align:left;padding-left:18px;">
            <el-col :span="24" class="toolbar"  style="padding-top: 10px;">
                <el-form :inline="true" :model="filters" ref="filters" >
                    <el-form-item label="油枪名称" prop="gunName">
                        <el-input v-model="filters.gunName" placeholder="请输入油枪名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="油品名称" prop="gasolineNum">
                        <el-input v-model="filters.gasolineNum" placeholder="请输入油品名称" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  v-on:click="searchCamera()">查询</el-button>
                        <el-button @click="resetForm('filters')">重置</el-button>
                        <el-button  type="primary" @click="goBackToMachine()">返回</el-button>
                        <!-- <el-button  type="primary" @click="addOrUpdateHandle(null, false)">新增</el-button>
                        <el-button  type="danger" @click="deleteHandle()" :disabled="sels.length <= 0">批量删除</el-button> -->
                    </el-form-item>
                </el-form>
            </el-col>
        </div>
        <!--表格数据及操作-->
        <el-table :data="tableData"  v-loading="listLoading" @selection-change="selsChange" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
            <!--勾选框-->
            <!-- <el-table-column type="selection" width="55" align="center">
            </el-table-column> -->
            <!--索引-->
            <el-table-column label="序号" type="index" :index="indexMethod" width="50" align="center">
            </el-table-column>
            <el-table-column prop="machineName" label="加油机名称" min-width="15%" sortable align="center">
            </el-table-column>
            <el-table-column prop="gunName" label="油枪名称" min-width="15%" sortable align="center">
            </el-table-column>
            <el-table-column prop="gasolineNum" label="油品名称" min-width="15%" sortable align="center">
            </el-table-column>
            <el-table-column prop="price" label="单价" min-width="15%" sortable align="center">
            </el-table-column>
            <el-table-column prop="serialPortNum" label="串口号" min-width="15%" sortable align="center">
            </el-table-column>
            <el-table-column prop="serialPortSort" label="串口序号" min-width="15%" sortable align="center">
            </el-table-column>
            <el-table-column prop="machineStatus" label="油枪状态" min-width="15%" align="center">
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.gunStatus === '0' ? 'success' : 'primary'"
                    disable-transitions>{{scope.row.gunStatus== '0'? '闲置':'加油中'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="20" align="center" >
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-search" size="small" @click="addOrUpdateHandle(scope.row.refuelingGunId, true)">详情</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="addOrUpdateHandle(scope.row.refuelingGunId, false)">编辑</el-button>
                    <!-- <el-button type="text" style="color:#f78989;" icon="el-icon-delete" size="small" @click="deleteHandle(scope.row.refuelingGunId)">删除</el-button> -->
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
    </section>
</template>
<script>
    import AddOrUpdate from './refueling-gun-add-or-update'
    export default {
        data() {
            return {
                //表格数据
                tableData: [],
                pageSize: 10,
                currentPage:1,
                totalCount:0,
                filters:{
                    gasolineNum:'',
                    gunName:''
                },
                sels: [],
                listLoading: false,
                addOrUpdateVisible: false,
            }
        },
        components: {
        AddOrUpdate
        },
        methods: {
            goBackToMachine(){
                this.$router.go(-1);
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
                var cameraIds = id ? [id] : this.sels.map(item => {
                return item.refuelingGunId
                })
                this.$confirm(`确定对所选数据进行[${id ? '删除' : '批量删除'}]操作吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/business/refuelinggun/delete'),
                    method: 'post',
                    data: this.$http.adornData(cameraIds, false)
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
                    url: this.$http.adornUrl('/business/refuelinggun/list'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'page': this.currentPage,
                        'limit': this.pageSize,
                        'gunName': this.filters.gunName,
                        'gasolineNum': this.filters.gasolineNum,
                        'fillingMachineId': this.$route.params.fillingMachineId
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
            //批量删除
			batchRemove: function(){
	            var ids = this.sels.map(item => item.logId).toString();
			    this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { ids: ids };
                    //批量删除
				}).catch(() => {

				});
			}
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
