<template>
    <div>
    <!-- <keep-alive> -->
        <tanker-list v-if="showHaddle" @changeFlag="changeFlag"></tanker-list>
        <add-or-update v-if="!showHaddle" @changeFlag="changeFlag" :edit-id="currentId"></add-or-update>
    <!-- </keep-alive> -->
    </div>
</template>
<script>
    import TankerList from './tankermanagement-list'
    import AddOrUpdate from './tankermanagement-add-or-update'
    export default {
        data() {
            return {
                showHaddle:true,
                currentId:null
            }
        },
        components: {
            TankerList,
            AddOrUpdate
        },
        methods: {
            changeFlag(data,flag){
                this.currentId = data;
                this.showHaddle = flag;
                // console.log(data);
            },
        },


    }
</script>
<style>
    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
    }
</style>
