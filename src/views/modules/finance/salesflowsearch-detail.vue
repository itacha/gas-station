<template>
  <div class="pageView" id="salesflowsearchDetail">
    <div class="title">
      <div class="backBtn" @click="changeFlag(null,true)"></div>
      <div class="rgTips">
        <span>订单编号：{{dataForm.serialNum}}</span>
        <span>
          用户手机号：
          <span v-if="dataForm.userTel">{{dataForm.userTel | phone}}</span>
          <span v-else>暂无</span>
        </span>
      </div>
    </div>
    <div class="contentItem">
      <div class="tit">
        <img src="~@/assets/img/dingdanxinxi.png" alt />
        <span>订单信息</span>
      </div>
      <div class="details">
        <el-row :gutter="10" class="detailsRow">
          <el-col :span="6">
            <span class="tip">结算时间</span>
            <span class="val">{{dataForm.settlementTime}}</span>
          </el-col>
          <el-col :span="6">
            <span class="tip">油品金额（元）</span>
            <span class="val">{{dataForm.amount.toFixed(2)}}</span>
          </el-col>
          <el-col :span="6">
            <span class="tip">优惠金额（元）</span>
            <span class="val">{{dataForm.offerAmount}}</span>
          </el-col>
          <el-col :span="6">
            <span class="tip">支付方式</span>
            <span class="val">{{dataForm.payType == 1 ? '人脸支付' : '加油卡支付'}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="detailsRow">
          <el-col :span="6">
            <span class="tip">人像留证</span>
            <span class="val ckeckFace" @click="dialogVisible = true">查看</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="contentItem">
      <div class="tit">
        <img src="~@/assets/img/jiayoujixinxi.png" alt />
        <span>加油机信息</span>
      </div>
      <div class="details">
        <el-row :gutter="10" class="detailsRow">
          <el-col :span="6">
            <span class="tip">油枪编号</span>
            <span class="val">{{dataForm.refuelingGunId}}</span>
          </el-col>
          <el-col :span="6">
            <span class="tip">油枪名称</span>
            <span class="val">{{dataForm.gunName}}</span>
          </el-col>
          <el-col :span="6">
            <span class="tip">结算价格（元）</span>
            <span class="val">{{dataForm.unitPrice}}</span>
          </el-col>
          <el-col :span="6">
            <span class="tip">标准价格（元）</span>
            <span class="val">{{dataForm.unitPrice}}</span>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="detailsRow">
          <el-col :span="6">
            <span class="tip">加油机编号</span>
            <span class="val">{{dataForm.fillingMachineId}}</span>
          </el-col>
          <el-col :span="6">
            <span class="tip">加油机名称</span>
            <span class="val">{{dataForm.fillingName}}</span>
          </el-col>
          <el-col :span="6">
            <span class="tip">油品</span>
            <span class="val">{{dataForm.gasolineNum}}#</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="contentItem">
      <div class="tit">
        <img src="~@/assets/img/qitaxinxi.png" alt />
        <span>其他信息</span>
      </div>
      <div class="details">
        <el-row :gutter="10" class="detailsRow">
          <el-col :span="6">
            <span class="tip">进场时间</span>
            <span class="val">{{dataForm.driverIn}}</span>
          </el-col>
          <el-col :span="6">
            <span class="tip">离场时间</span>
            <span class="val">{{dataForm.driverOut}}</span>
          </el-col>
          <el-col :span="6">
            <span class="tip">等候时长</span>
            <span class="val">{{dataForm.countWait}}</span>
          </el-col>
          <!-- <el-col :span="6"><span class="tip">支付方式</span> <span class="val">人脸支付</span></el-col> -->
        </el-row>
        <!-- <el-row :gutter="10" class="detailsRow">
                    <el-col :span="6"><span class="tip">人像留证</span><span class="val ckeckFace">查看</span></el-col>
        </el-row>-->
      </div>
    </div>
    <el-dialog title="人脸比对结果" :visible.sync="dialogVisible" width="576px" :v-if="dialogVisible">
      <div style="overflow:hidden;position:relative;">
        <img
          :src="'data:image/jpg;base64,'+ dataForm.userPic"
          alt
          style="width:200px;height:230px;border:1px solid #ccc;float:left;"
        />
        <img
          :src="dataForm.userBasePic"
          alt
          style="width:200px;height:230px;border:1px solid #ccc;float:right;"
        />
        <div style="width:136px;height:230px;position:absolute;left:200px;top:0;">
          <p style="text-align:center;font-size:20px;">相似度</p>
          <p
            style="text-align:center;font-size:22px;color:#f56c6c;"
            v-if="dataForm.userPicSimilarity"
          >{{(dataForm.userPicSimilarity*100).toFixed(2)}}%</p>
        </div>
      </div>
      <!-- <span>这是一段信息</span> -->
      <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "salesflowsearchDetail",
  props: {
    currentRow: {
      type: Object
    },
    detailId: {}
  },
  data() {
    return {
      dataForm: { amount: 0, userTel: "18888888888" },
      dialogVisible: false
    };
  },
  computed: {
    details: function() {
      return this.currentRow;
    }
  },
  methods: {
    changeFlag(data, flag) {
      this.$emit("changeFlag", data, flag);
    },
    formatDuring(mss) {
      var days = parseInt(mss / (1000 * 60 * 60 * 24));
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = parseInt((mss % (1000 * 60)) / 1000);
      if (days > 0) {
        return (
          days +
          " 天 " +
          hours +
          " 小时 " +
          minutes +
          " 分钟 " +
          seconds +
          " 秒 "
        );
      } else if (hours > 0) {
        return hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
      } else if (minutes > 0) {
        return minutes + " 分钟 " + seconds + " 秒 ";
      } else if (seconds > 0) {
        return seconds + " 秒 ";
      } else {
        return "";
      }
    }
    // phoneStatus:function(val){
    //     let tel = val.substr(0, 3) + '****' + val.substr(7);
    //     return tel;
    // }
  },
  filters: {
    phone: function(value) {
      return value.substr(0, 3) + "****" + value.substr(7);
    }
  },
  mounted() {
    if (this.detailId) {
      this.$http({
        url: this.$http.adornUrl(
          `/business/account/manage/info/${this.detailId}`
        ),
        method: "get",
        data: JSON.stringify({})
      })
        .then(res => {
          console.log(res.data);
          if (res.data.code !== 0) {
            this.$message.error(res.data.msg);
            return;
          }
          this.dataForm = res.data.salesRecords;
          this.dataForm.countWait = this.dataForm.countWait
            ? this.formatDuring(this.dataForm.countWait)
            : "";
        })
        .catch(err => {});
    }
  }
};
</script>
<style>
.contentItem .tit img {
  margin-right: 5px;
}
.contentItem .tit span {
  line-height: 20px;
}
.rgTips span {
  margin-right: 20px;
}
.contentItem {
  border: 1px solid #dedede;
  border-radius: 4px;
}
.detailsRow {
  height: 50px;
  line-height: 50px;
  padding-left: 30px;
}
.detailsRow .tip {
  color: #808080;
  margin-right: 10px;
}
.detailsRow .val {
  color: #010101;
}
</style>
