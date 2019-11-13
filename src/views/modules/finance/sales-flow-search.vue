<template>
  <div>
    <salesflowsearch-list v-if="showHaddle" @changeFlag="changeFlag"></salesflowsearch-list>
    <salesflowsearch-detail  v-if="!showHaddle" @changeFlag="changeFlag" :detail-id="detailId"></salesflowsearch-detail>
  </div>
</template>

<script>
import salesflowsearchList from './salesflowsearch-list'
import salesflowsearchDetail from './salesflowsearch-detail'
import { getCookie } from "@/utils/tools"
import { flowStatus } from '@/utils/util'
export default {
  data() {
    return {
      showHaddle:true,
      detailId:null
    }
  },
  components:{
    salesflowsearchList,
    salesflowsearchDetail
  },
  computed: {

  },
  methods: {
    changeFlag(data,flag){
      this.detailId = data;
      this.showHaddle = flag;
    },

  },
  mounted() {

  }
}
</script>

<style>
</style>
