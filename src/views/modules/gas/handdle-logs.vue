<template>
  <div>
    <div style="background:#fff;padding:15px 0 0 25px;">

    </div>
    <el-form :inline="true" :model="queryForm" ref="queryForm" @keyup.enter.native="getDataList()" size="small" class="queryForm">
        <el-form-item><el-button @click="changeFlag(false)">返回</el-button></el-form-item>
      <el-form-item label="操作人" prop="operatorName">
        <el-input v-model="queryForm.operatorName" placeholder="操作人" clearable></el-input>
      </el-form-item>
      <el-form-item label="操作时间" prop="operateTime">
        <el-date-picker
          v-model="queryForm.operateTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" v-loading="loading" style="width: 100%;" id="oilPriceTable" :header-cell-style="cm.theadStyle">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="operatorName" label="操作人"></el-table-column>
      <el-table-column prop="createTime" label="操作时间"></el-table-column>
      <el-table-column prop="remark" label="操作内容"></el-table-column>
    </el-table>
    <div class="pagesBox">
      <el-pagination
        background
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      priceList: {},
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      offerForm: {},
      dialog: {},
      dataForm:{},
      edit92:false,
      edit95:false,
      base92:0,
      queryForm:{operatorName:'',operateTime:''}
    }
  },
  computed:{
    operateStartTime:function(){
        if(this.queryForm.operateTime.length>0){
            return this.queryForm.operateTime[0]
        }else{
            return ''
        }
    },
    operateEndTime:function(){
        if(this.queryForm.operateTime.length>0){
            return this.queryForm.operateTime[1]
        }else{
            return ''
        }
    }
  },
  methods: {
    changeFlag(flag){
        this.$emit('changeFlag',flag);
    },
    getDataList() {
        console.log(this.queryForm);
      this.loading = true
      this.$http
        .get(this.$http.adornUrl(`/business/price/record/list?` +
          `page=${this.pageIndex}&limit=${this.pageSize}&operatorName=${this.queryForm.operatorName}&operateStartTime=${this.operateStartTime}&operateEndTime=${this.operateEndTime}&ie=${new Date().getTime()}`))
        .then(res => {
          this.loading = false
          this.handleList(res.data)
        })
        .catch(err => {
          this.loading = false
          this.dataList = []
        })
    },
    handleList(val) {
      if (val.code != 0) {
        this.dataList = []
      }
      this.total = val.page.totalCount
      this.dataList = val.page.list
    },
    changeFlag(flag){
        this.$emit('changeFlag',flag);
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    reset(){
        this.queryForm={operatorName:'',operateTime:[]};
        this.pageIndex = 1
        this.getDataList();
    }
  },
  mounted() {
    this.loading = true
    this.getDataList();

  }
}
</script>

<style>

</style>
