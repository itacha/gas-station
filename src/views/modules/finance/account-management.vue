<template>
  <div>
    <AccountList v-show="key == 0" :fun="look" :data="signTime"/>
    <StatementDetail v-if="key == 1" :data="row" :fun="back"  @getDetailId="getDetailId"/>
    <!-- <StatementAppeal v-if="key == 2" :data="row" :fun="back"/> -->
    <salesflowsearch-detail v-if="key == 3" :detail-id="detailId" @changeFlag="changeFlag"></salesflowsearch-detail>
  </div>
</template>

<script>
import AccountList from './account-list'
import StatementDetail from './statement-detail'
// import StatementAppeal from './statement-appeal'
import salesflowsearchDetail from './salesflowsearch-detail'
export default {
  data() {
    return {
      key:0,
      row:{},
      signTime:'',
      detailId:null
    }
  },
  components:{
    AccountList,
    StatementDetail,
    // StatementAppeal,
    salesflowsearchDetail
  },
  methods: {
    look(val,key){
      this.key = key
      this.row = val
    },
    back(val){
      this.key = 0
      if(val){
        this.signTime = new Date().getTime()
      }
    },
    getDetailId(id){
      this.detailId = id;
      this.key = 3;
    },
    changeFlag(flag){
      this.key = 1;
    }
  }
}
</script>

<style>
</style>
