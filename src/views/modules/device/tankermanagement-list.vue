<template>
    <section id="table" style="width: 100%">
        <div  style="text-align:left;">
            <el-col :span="24" class="toolbar"  style="padding-top: 10px;">
                <el-form :inline="true" :model="filters" ref="filters" size="small" class="queryForm">
                    <el-form-item label="加油机名称"  prop="gasName">
                        <el-input v-model="filters.gasName" placeholder="加油机名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="加油机型号"  prop="refuellerModel">
                        <el-input v-model="filters.refuellerModel" placeholder="加油机型号" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="加油机ID" prop="machineNo">
                        <el-input v-model="filters.machineNo" placeholder="加油机ID" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="主板ID" prop="boardId">
                        <el-input v-model="filters.boardId" placeholder="主板ID" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  v-on:click="searchCamera()">查询</el-button>
                        <el-button @click="resetForm('filters')">重置</el-button>
                    </el-form-item>
                    <el-form-item class="haddleRg">
                        <el-button  type="primary" @click="addOrUpdateHandle(null,false)">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </div>
        <!--表格数据及操作-->
        <el-table :data="tableData" border v-loading="listLoading" @selection-change="selsChange" style="width: 100%" ref="multipleTable" tooltip-effect="dark" :header-cell-style="cm.theadStyle" :span-method="arraySpanMethod">
            <!--勾选框:index="indexMethod" -->
            <!--索引-->
            <el-table-column prop="sequence" label="序号" width="50" align='center'>
            </el-table-column>
            <el-table-column prop="machineName" label="加油机名称" min-width="15%">
            </el-table-column>
            <el-table-column prop="refuellerModel" label="加油机型号" min-width="15%">
            </el-table-column>
            <el-table-column prop="machineNo" label="加油机ID" min-width="15%">
            </el-table-column>
            <el-table-column prop="fillingMachineId" label="主板ID" min-width="15%">
            </el-table-column>
            <el-table-column prop="serialPortNum" label="加油机通信接口" min-width="15%">
                <template slot-scope="scope">
                    <span>{{scope.row.serialPortNum == 1 ? 'COM1':'COM2'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="gunName" label="加油枪名称" min-width="15%">
            </el-table-column>
            <el-table-column prop="gasolineNum" label="油品" min-width="15%">
              <template slot-scope="scope">
                  <span>{{scope.row.gasolineNum}}#</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="20" >
                <template slot-scope="scope">
                    <el-button size="mini" @click="addOrUpdateHandle(scope.row.fillingMachineId, false)">编辑</el-button>
                    <el-button size="mini" @click="deleteHandle(scope.row.refuelingMachineId,false)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页条-->
        <div class="pagesBox">
            <el-button
                v-if="isAuth('sys:user:update')"
                size="small"
                @click="exportExcel"
                class="exportBtn"
              >导出</el-button>
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
    import { getCookie } from "@/utils/tools"
    import AddOrUpdate from './tankermanagement-add-or-update'
    export default {
        data() {
            return {
                //表格数据
                visible: false,
                tableData: [],
                pageSize: 10,
                currentPage:1,
                totalCount:0,
                filters:{
                    boardId:'',
                    gasName:''
                },
                sels: [],
                listLoading: false,
                addOrUpdateVisible: false,
                spanArr:[],
                spanArrboard:[],
                position:0
            }
        },
        components: {
        AddOrUpdate
        },
        methods: {
            rowspan() {
                this.spanArr = [];
                this.position = 0;
                this.tableData.forEach((item,index) => {
                  if(index == 0){
                    this.spanArr.push(1);
                    this.position = 0;
                    item.sequence=index+1;//设置序号
                  }else{
                    if(this.tableData[index].machineNo === this.tableData[index-1].machineNo ){
                      this.spanArr[this.position] += 1;//连续有几行项目名名称相同
                      this.spanArr.push(0); // 名称相同后往数组里面加一项0
                      console.log(this.spanArr)
                      //当项目名称相同时，设置当前序号和前一个相同
                      this.tableData[index].sequence = this.tableData[index-1].sequence;
                    }else{
                      this.spanArr.push(1);
                      this.position = index;
                      //当项目名称不同时，将当前序号设置为前一个序号+1
                      this.tableData[index].sequence = this.tableData[index-1].sequence+1;
                    }
                  }
                })
            },
            rowspanboard() {
                this.spanArrboard = [];
                this.position = 0;
                this.tableData.forEach((item,index) => {
                  if(index == 0){
                    this.spanArrboard.push(1);
                    this.position = 0;
                    // item.sequence=index+1;//设置序号
                  }else{
                    if(this.tableData[index].fillingMachineId === this.tableData[index-1].fillingMachineId ){
                      this.spanArrboard[this.position] += 1;//连续有几行项目名名称相同
                      this.spanArrboard.push(0); // 名称相同后往数组里面加一项0
                      console.log(this.spanArrboard)
                      //当项目名称相同时，设置当前序号和前一个相同
                      // this.tableData[index].sequence = this.tableData[index-1].sequence;
                    }else{
                      this.spanArrboard.push(1);
                      this.position = index;
                      //当项目名称不同时，将当前序号设置为前一个序号+1
                      // this.tableData[index].sequence = this.tableData[index-1].sequence+1;
                    }
                  }
                })
            },
            arraySpanMethod({ row, column, rowIndex, columnIndex }){
                if(columnIndex === 0){
                  const _row = this.spanArr[rowIndex];
                  console.log(_row)
                  const _col = _row>0 ? 1 : 0;
                  return {
                    rowspan: _row,
                    colspan: _col
                  }

                }
                if(columnIndex === 1 || columnIndex === 2 || columnIndex === 3){
                  const _row = this.spanArr[rowIndex];
                  const _col = _row>0 ? 1 : 0;
                  return {
                    rowspan: _row,
                    colspan: _col
                  }
                }
                if(columnIndex === 4 ){
                    const _row = this.spanArrboard[rowIndex];
                    const _col = _row>0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
                if(columnIndex === 8){
                    const _row=this.spanArr[rowIndex]                   
                    return{
                        rowspan:_row,
                        colspan: _row>0 ? 1 : 0
                    }
                }
            },
            exportExcel(){
                try {
                    let a = document.createElement('a')
                    a.download = '加油机列表.xlsx'
                    a.href = this.$http.adornUrl(`/business/fillingmachine/download?page=${this.currentPage}&limit=${this.pageSize}&token=${getCookie("token")}&ie=${new Date().getTime()}`)
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                } catch (e) {
                    this.$message.error('导出失败')
                }
            },
            searchCamera(){
                this.currentPage = 1;
                this.search();
            },
            // 新增 / 修改 /查看
            addOrUpdateHandle (data,flag) {
                this.$emit('changeFlag',data,flag);
            },
            // 删除
            deleteHandle (id) {
                // var cameraIds = id ? [id] : this.sels.map(item => {
                //     return item.cameraId
                // })
                this.$confirm(`确定对所选数据进行[${id ? '删除' : '批量删除'}]操作吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.$http({
                    url: this.$http.adornUrl(`/business/fillingmachine/delete/${id}`),
                    method: 'post',
                    data: this.$http.adornData({})
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
                // this.listLoading = true
                this.$http({
                    url: this.$http.adornUrl('/business/fillingmachine/list'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'page': this.currentPage,
                        'limit': this.pageSize,
                        'boardId': this.filters.boardId,
                        'gasName': this.filters.gasName,
                        'machineNo': this.filters.machineNo,
                        'refuellerModel':this.filters.refuellerModel
                    })
                }).then(({data}) => {
                    if (data && data.code === 0) {
                        this.tableData = data.page.records
                        this.totalCount = data.page.total

                        this.rowspan();
                        this.rowspanboard();
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
        // activated: function(){
        //     this.getDataList();
        // },
        mounted(){
            this.getDataList();
        }
    }
</script>
<style>
    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
    }
</style>
