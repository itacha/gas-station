<template>
  <div>
    <oilprice-list v-if="!showLogs" @changeFlag="changeFlag"></oilprice-list>
    <handdle-logs v-if="showLogs" @changeFlag="changeFlag"></handdle-logs>
  </div>
</template>

<script>
import oilpriceList from './oilprice-list';
import handdleLogs from './handdle-logs';
export default {
  data() {
    return {
      showLogs:false
    }
  },
  components:{
    oilpriceList,
    handdleLogs
  },
  methods:{
    changeFlag:function(flag){
      this.showLogs = flag;
    }
  },
  mounted(){

  }
}
</script>

<style>

</style>
