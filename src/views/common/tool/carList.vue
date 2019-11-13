<template>
    <div class="pageView">
        <el-table
          :data="tableDataCar"
          style="width: 100%"
          :header-cell-style="cm.theadStyle">
          <el-table-column
                label="序号"
              type="index"
              width="50">
            </el-table-column>
          <el-table-column
            prop="carNo"
            label="车牌号"
            width="110">
          </el-table-column>
          <el-table-column
            prop="inTime"
            label="进站时间"
            width="160">
          </el-table-column>
          <el-table-column
            prop="outTime"
            label="出站时间"
            width="160">
          </el-table-column>
          <el-table-column
            prop="statusDescription"
            label="车辆状态"
            width="100">
          </el-table-column>
          <el-table-column
            prop="waitingTimeDescription"
            label="进站时长">
          </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default{
    name:'carList',
    props:{
      tableData:{
        type:Array
      }
    },
    data(){
        return{
            tableDataTest:[{car:'川A·3DEF9',timeIn:'14:34:08',timeOut:'14:40:09',sta:'等候中',lang:'59秒'}]
        }
    },
    computed:{
      tableDataCar:function(){
        if(this.tableData){
          return this.tableData
        }else{
          return [];
        }

      }
    },
    methods:{
      getDataList(){

      }
    }
}
</script>
