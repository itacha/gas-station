<template>
    <section id="table" style="width: 100%">
        <!-- 搜索功能 -->
        <!--工具条-->
        <div  style="text-align:left;padding-left:18px;">
            <el-col :span="24" class="toolbar"  style="padding-top: 10px;">
                <el-form :inline="true" :model="filters" ref="filters" >
                    <!-- <el-form-item label=""  prop="oilTankName">
                        <el-select v-model="filters.oilTankName" placeholder="请选择摄像机类别">
                            <el-option label="加油站入口" value="1"></el-option>
                            <el-option label="加油站出口" value="2"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="油罐名称" prop="oilTankName">
                        <el-input v-model="filters.oilTankName" placeholder="请输入油罐名称" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  v-on:click="searchOilTank()">查询</el-button>
                        <el-button @click="resetForm('filters')">重置</el-button>
                        <!-- <el-button  type="primary" @click="addOrUpdateHandle(null, false)">新增</el-button>
                        <el-button  type="danger" @click="deleteHandle()" :disabled="sels.length <= 0">批量删除</el-button> -->
                    </el-form-item>
                </el-form>
            </el-col>
        </div>
        <!--表格数据及操作-->
        <el-table :data="tableData"  v-loading="listLoading" @selection-change="selsChange" border style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark">
            <!--勾选框-->
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <!--索引-->
            <el-table-column label="序号" type="index" :index="indexMethod" width="50" align="center">
            </el-table-column>
            <el-table-column prop="oilTankName" label="油罐名称" min-width="15%" sortable align="center">
            </el-table-column>
            <el-table-column prop="gasolineNum" label="油品名称" min-width="15%" align="center">
            </el-table-column>
            <el-table-column prop="gasolineType" label="油品种类" min-width="15%" align="center">
            </el-table-column>
            <el-table-column prop="oilTankUnit" label="油罐单位" min-width="15%" align="center">
            </el-table-column>
            <el-table-column prop="totalTon" label="油罐总容量(吨)" min-width="15%" align="center">
            </el-table-column>
            <!-- <el-table-column prop="user" label="用户名" min-width="20%" align="center">
            </el-table-column> -->
            <el-table-column label="操作" min-width="20" align="center" >
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-search" size="small" @click="addOrUpdateHandle(scope.row.oilTankId, true)">开始分析</el-button>
                    <!-- <el-button type="text" icon="el-icon-edit" size="small" @click="addOrUpdateHandle(scope.row.oilTankId, false)">编辑</el-button>
                    <el-button type="text" style="color:#f78989;" icon="el-icon-delete" size="small" @click="deleteHandle(scope.row.oilTankId)">删除</el-button> -->
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
    import AddOrUpdate from './oil-tank-add-or-update.vue'
    export default {
        data() {
            return {
                //表格数据
                tableData: [],
                pageSize: 10,
                currentPage:1,
                totalCount:0,
                filters:{
                    oilTankCount:''
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
            searchOilTank(){
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
                return item.oilTankId
                })
                this.$confirm(`确定对所选数据进行[${id ? '删除' : '批量删除'}]操作吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/business/oiltankmanage/delete'),
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
                    url: this.$http.adornUrl('/business/oiltankmanage/list'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'page': this.currentPage,
                        'limit': this.pageSize,
                        'oilTankName': this.filters.oilTankName
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