<template>
    <section id="table" style="width: 100%">
        <!-- 搜索功能 -->
        <!--工具条-->
        <div  style="text-align:left;">
            <el-col :span="24" class="toolbar"  style="padding-top: 10px;">
                <el-form :inline="true" :model="filters" ref="filters" size="small" class="queryForm">
                    <el-form-item label="摄像机类别"  prop="cameraType">
                        <el-select v-model="filters.cameraType" placeholder="请选择摄像机类别">
                            <el-option label="加油站入口" value="1"></el-option>
                            <el-option label="加油站出口" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="摄像机名称" prop="cameraName">
                        <el-input v-model="filters.cameraName" placeholder="请输入摄像机名称" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  v-on:click="searchCamera()">查询</el-button>
                        <el-button @click="resetForm('filters')">重置</el-button>
                    </el-form-item>
                    <el-form-item class="haddleRg">
                        <el-button  type="primary" @click="addOrUpdateHandle(null, false)">新增</el-button>
                        <el-button  type="danger" @click="deleteHandle()" :disabled="sels.length <= 0">批量删除</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </div>
        <!--表格数据及操作-->
        <el-table :data="tableData"  v-loading="listLoading" @selection-change="selsChange" style="width: 100%" stripe ref="multipleTable" tooltip-effect="dark" :header-cell-style="cm.theadStyle">
            <!--勾选框-->
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!--索引-->
            <el-table-column label="序号" type="index" :index="indexMethod" width="50">
            </el-table-column>
            <el-table-column prop="cameraName" label="摄像机名称" min-width="15%" sortable>
            </el-table-column>
            <el-table-column prop="cameraCode" label="设备标识" min-width="15%">
            </el-table-column>
            <el-table-column prop="cameraType" label="摄像机类别" min-width="15%">
                <template slot-scope="scope">
                    <span v-if ="scope.row.cameraType== '1'">加油站入口</span>
                    <span v-if ="scope.row.cameraType== '2'">加油站出口</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="user" label="用户名" min-width="20%" align="center">
            </el-table-column> -->
            <el-table-column prop="ip" label="IP地址" min-width="15%">
            </el-table-column>
            <el-table-column prop="port" label="端口号" min-width="15%">
            </el-table-column>
            <el-table-column label="操作" min-width="20" >
                <template slot-scope="scope">
                    <el-button size="mini" @click="addOrUpdateHandle(scope.row.cameraId, true)">详情</el-button>
                    <el-button size="mini" @click="addOrUpdateHandle(scope.row.cameraId, false)">编辑</el-button>
                    <el-button size="mini" @click="deleteHandle(scope.row.cameraId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页条-->
        <div class="pagesBox">
            <!-- <el-button
                v-if="isAuth('sys:user:update')"
                size="small"
                @click="exportExcel"
                class="exportBtn"
              >导出</el-button> -->
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10,20,50,100, 200,]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount" >
            </el-pagination>
        </div>
             <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </section>
</template>
<script>
    import AddOrUpdate from './camera-add-or-update'
    export default {
        data() {
            return {
                //表格数据
                tableData: [],
                pageSize: 10,
                currentPage:1,
                totalCount:0,
                filters:{
                    cameraTyle:'',
                    cameraName:''
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
                return item.cameraId
                })
                this.$confirm(`确定对所选数据进行[${id ? '删除' : '批量删除'}]操作吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/business/cameramanage/delete'),
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
                    url: this.$http.adornUrl('/business/cameramanage/list'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'page': this.currentPage,
                        'limit': this.pageSize,
                        'cameraType': this.filters.cameraType,
                        'cameraName': this.filters.cameraName
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
