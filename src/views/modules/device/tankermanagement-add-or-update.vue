<template>
  <div
    v-loading="loading"
    style="background:#fff;padding:20px;box-sizing:border-box;"
    id="tankerUpdate"
  >
    <!-- <div class="back"><el-button size="small" @click="changeFlag(null,true)">返回</el-button></div> -->
    <div class="backBtn backBtn1" @click="changeFlag(null,true)"></div>
    <div>
      <el-form :model="dataForm" ref="dataForm" status-icon label-width="150px" :rules="rules">
        <el-row>
          <el-col :span="8" style="padding-top:50px;">
            <el-form-item label="加油机名称" prop="machineName">
              <el-input v-model="dataForm.machineName" placeholder="请输入加油机名称"></el-input>
            </el-form-item>
            <el-form-item label="加油机型号" prop="refuellerModel">
              <el-input v-model="dataForm.refuellerModel" placeholder="请输入加油机名称"></el-input>
            </el-form-item>
            <el-form-item label="加油机ID" prop="machineNo">
              <el-input v-model="dataForm.machineNo" placeholder="请输入加油机ID"></el-input>
            </el-form-item>
            <el-form-item label="油枪数">
              <el-select v-model="dataForm.gunsNum" placeholder="请选择油枪数" :disabled="editId != null">
                <el-option :label="2" :value="2"></el-option>
                <el-option :label="4" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <div class="machineContent">
              <div style="overflow:hidden;width:480px;margin:0 auto;">
                <div style="float:left;">
                  <div class="machine">
                    <div class="machieName">主板1</div>
                    <div class="machineList">
                      <ul>
                        <li>{{dataForm.guns[0].gunName}}</li>
                        <li>{{dataForm.guns[1].gunName}}</li>
                        <li>
                          <span
                            v-if="dataForm.guns[0].gasolineNum"
                          >{{dataForm.guns[0].gasolineNum}}#</span>
                        </li>
                        <li>
                          <span
                            v-if="dataForm.guns[1].gasolineNum"
                          >{{dataForm.guns[1].gasolineNum}}#</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="machineId">
                    <span v-if="fillingMachineId1">ID：{{fillingMachineId1}}</span>
                  </div>
                </div>
                <div style="float:right;" v-if="dataForm.gunsNum == 4">
                  <div class="machine">
                    <div class="machieName">主板2</div>
                    <div class="machineList">
                      <ul>
                        <li>{{dataForm.guns[2].gunName}}</li>
                        <li>{{dataForm.guns[3].gunName}}</li>
                        <li>
                          <span
                            v-if="dataForm.guns[2].gasolineNum"
                          >{{dataForm.guns[2].gasolineNum}}#</span>
                        </li>
                        <li>
                          <span
                            v-if="dataForm.guns[3].gasolineNum"
                          >{{dataForm.guns[3].gasolineNum}}#</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="machineId">
                    <span v-if="fillingMachineId2">ID：{{fillingMachineId2}}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row
          style="margin-bottom:50px;margin-top:30px;border-bottom:2px solid #eee;padding-left:30px;overflow:hidden;"
        >
          <el-radio-group v-model="labelTab" style="width:300px;">
            <el-radio-button :label="1">主板1</el-radio-button>
            <el-radio-button :label="2" v-show="dataForm.gunsNum == 4">主板2</el-radio-button>
          </el-radio-group>
        </el-row>
        <el-row class="boardContent" v-show="labelTab == 1">
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="主板1 ID"
                :rules="[{ required: true, message: '请选择主板ID', trigger: 'change' }]"
              >
                <el-select
                  v-model="fillingMachineId1"
                  placeholder="请选择主板ID"
                  :disabled="editId != null"
                  @change="changeMachineId(fillingMachineId1)"
                  @focus="filterId(fillingMachineId2)"
                >
                  <el-option
                    :label="i.fillingMachineId"
                    :value="i.fillingMachineId"
                    v-for="(i,key) in boardIds"
                    :key="key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="8">
            <el-form-item
              label="左枪通信接口"
              prop="guns[0].serialPortNum"
              :rules="[{ required: true, message: '请选择通信接口', trigger: 'change' }]"
            >
              <el-select
                v-model="dataForm.guns[0].serialPortNum"
                placeholder="请选择通信接口"
                @change="changeGuns(dataForm.guns[0],0)"
                @focus="checkId(fillingMachineId1),filterLeft1()"
              >
                <el-option :label="i.label" :value="i.value" v-for="(i,key) in ports" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="左边油枪名称"
              prop="guns[0].gunName"
              :rules="[{ required: true, message: '请输入油枪名称', trigger: 'blur' },{ min: 1, max: 5, message: '油枪名称最长 5 个字符', trigger: 'blur' }]"
            >
              <el-input v-model="dataForm.guns[0].gunName" placeholder="请输入油枪名称"></el-input>
            </el-form-item>
            <el-form-item
              label="左边油枪油品"
              prop="guns[0].gasolineNum"
              :rules="[{ required: true, message: '请选择油品', trigger: 'change' }]"
            >
              <el-select v-model="dataForm.guns[0].gasolineNum" placeholder="请选择油品">
                <el-option :label="i.label" :value="i.value" v-for="(i,key) in oilType" :key="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="右枪通信接口"
              prop="guns[1].serialPortNum"
              :rules="[{ required: true, message: '请选择通信接口', trigger: 'change' }]"
            >
              <el-select
                v-model="dataForm.guns[1].serialPortNum"
                placeholder="请选择通信接口"
                @change="changeGuns(dataForm.guns[1],1)"
                @focus="checkId(fillingMachineId1),filterParam()"
              >
                <el-option :label="i.label" :value="i.value" v-for="(i,key) in ports2" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="右边油枪名称"
              prop="guns[1].gunName"
              :rules="[{ required: true, message: '请输入油枪名称', trigger: 'blur' },{ min: 1, max: 5, message: '油枪名称最长 5 个字符', trigger: 'blur' }]"
            >
              <el-input v-model="dataForm.guns[1].gunName" placeholder="请输入油枪名称"></el-input>
            </el-form-item>
            <el-form-item
              label="右边油枪油品"
              prop="guns[1].gasolineNum"
              :rules="[{ required: true, message: '请选择油品', trigger: 'change' }]"
            >
              <el-select v-model="dataForm.guns[1].gasolineNum" placeholder="请选择油品">
                <el-option :label="i.label" :value="i.value" v-for="(i,key) in oilType" :key="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="boardContent" v-show="labelTab == 2" v-if="dataForm.gunsNum == 4">
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="主板2 ID"
                :rules="[{ required: true, message: '请选择主板ID', trigger: 'change' }]"
              >
                <el-select
                  v-model="fillingMachineId2"
                  placeholder="请选择主板ID"
                  @change="changeMachineId(fillingMachineId2)"
                  @focus="filterId(fillingMachineId1)"
                  :disabled="editId != null"
                >
                  <el-option
                    :label="i.fillingMachineId"
                    :value="i.fillingMachineId"
                    v-for="(i,key) in boardIds"
                    :key="key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="8">
            <el-form-item
              label="左枪通信接口"
              prop="guns[2].serialPortNum"
              :rules="[{ required: true, message: '请选择通信接口', trigger: 'change' }]"
              @focus="checkId(fillingMachineId2),filterLeft2"
            >
              <el-select
                v-model="dataForm.guns[2].serialPortNum"
                placeholder="请选择通信接口"
                @change="changeGuns(dataForm.guns[2],2)"
              >
                <el-option :label="i.label" :value="i.value" v-for="(i,key) in ports" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="左边油枪名称"
              prop="guns[2].gunName"
              :rules="[{ required: true, message: '请输入油枪名称', trigger: 'blur' },{ min: 1, max: 5, message: '油枪名称最长 5 个字符', trigger: 'blur' }]"
            >
              <el-input v-model="dataForm.guns[2].gunName" placeholder="请输入油枪名称"></el-input>
            </el-form-item>
            <el-form-item
              label="左边油枪油品"
              prop="guns[2].gasolineNum"
              :rules="[{ required: true, message: '请选择油品', trigger: 'blur' }]"
            >
              <el-select v-model="dataForm.guns[2].gasolineNum" placeholder="请选择油品">
                <el-option :label="i.label" :value="i.value" v-for="(i,key) in oilType" :key="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="右枪通信接口"
              prop="guns[3].serialPortNum"
              :rules="[{ required: true, message: '请选择通信接口', trigger: 'change' }]"
              @focus="checkId(fillingMachineId2),filterParam2"
            >
              <el-select
                v-model="dataForm.guns[3].serialPortNum"
                placeholder="请选择通信接口"
                @change="changeGuns(dataForm.guns[3],3)"
              >
                <el-option :label="i.label" :value="i.value" v-for="(i,key) in ports2" :key="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="右边油枪名称"
              prop="guns[3].gunName"
              :rules="[{ required: true, message: '请输入油枪名称', trigger: 'blur' },{ min: 1, max: 5, message: '油枪名称最长 5 个字符', trigger: 'blur' }]"
            >
              <el-input v-model="dataForm.guns[3].gunName" placeholder="请输入油枪名称"></el-input>
            </el-form-item>
            <el-form-item
              label="右边油枪油品"
              prop="guns[3].gasolineNum"
              :rules="[{ required: true, message: '请选择油品', trigger: 'blur' }]"
            >
              <el-select v-model="dataForm.guns[3].gasolineNum" placeholder="请选择油品">
                <el-option :label="i.label" :value="i.value" v-for="(i,key) in oilType" :key="key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-top:50px;">
          <el-col :span="18" style="text-align:center;">
            <el-form-item>
              <el-button type="primary" style="width:150px;" @click="submit('dataForm')">保存</el-button>
              <el-button @click="changeFlag(null,true)" style="width:150px;">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    editId: {}
  },
  data() {
    return {
      labelTab: 1,
      loading: false,
      visible: false,

      // dialogVisible:false,
      oilType: [
        {
          value: "95",
          label: "95#"
        },
        {
          value: "92",
          label: "92#"
        }
      ],
      boardIds: [
        "jdfdfd878754",
        "dfdfdfd878700",
        "ytdfuyd878776",
        "uiuudfd878289"
      ],
      ports: [{ label: "COM1", value: "1" }, { label: "COM2", value: "2" }],
      ports2: [{ label: "COM1", value: "1" }, { label: "COM2", value: "2" }],
      portsEdit: [],
      fillingMachineId1: "",
      fillingMachineId2: "",
      dataForm: {
        label: 1,
        gunsNum: 4,
        guns: [
          {
            boardNo: 1,
            fillingMachineId: "",
            serialPortNum: null,
            gunName: "",
            gasolineNum: "",
            position: 0
          },
          {
            boardNo: 1,
            fillingMachineId: "",
            serialPortNum: null,
            gunName: "",
            gasolineNum: "",
            position: 1
          },
          {
            boardNo: 2,
            fillingMachineId: "",
            serialPortNum: null,
            gunName: "",
            gasolineNum: "",
            position: 0
          },
          {
            boardNo: 2,
            fillingMachineId: "",
            serialPortNum: null,
            gunName: "",
            gasolineNum: "",
            position: 1
          }
        ]
      },
      rules: {
        machineName: [
          { required: true, message: "请输入加油机名称", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "加油机名称最长 30 个字符",
            trigger: "blur"
          }
        ],
        refuellerModel: [
          { required: true, message: "请输入加油机型号", trigger: "blur" }
        ],
        machineNo: [
          { required: true, message: "请输入加油机ID", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    fillingMachineId1: function(newVal, oldVal) {
      if (newVal) {
        this.$set(this.dataForm.guns[0], "fillingMachineId", newVal);
        this.$set(this.dataForm.guns[1], "fillingMachineId", newVal);
      }
    },
    fillingMachineId2: function(newVal, oldVal) {
      if (newVal) {
        this.$set(this.dataForm.guns[2], "fillingMachineId", newVal);
        this.$set(this.dataForm.guns[3], "fillingMachineId", newVal);
      }
    },
    serialPortNum1: function(newVal, oldVal) {
      if (newVal) {
        this.$set(this.dataForm.guns[0], "serialPortNum", newVal);
      }
    }
  },
  methods: {
    checkId(id) {
      let vm = this;
      if (!id) {
        vm.$message.error("请先选择主板ID");
      }
    },
    filterLeft1() {
      if (this.dataForm.guns[1].serialPortNum === "1") {
        this.ports = [{ label: "COM2", value: "2" }];
      } else if (this.dataForm.guns[0].serialPortNum === "2") {
        this.ports = [{ label: "COM1", value: "1" }];
      } else {
        this.ports = [
          { label: "COM1", value: "1" },
          { label: "COM2", value: "2" }
        ];
      }
    },
    filterLeft2() {
      alert("left");
      if (this.dataForm.guns[3].serialPortNum === "1") {
        this.port = [{ label: "COM2", value: "2" }];
      } else if (this.dataForm.guns[0].serialPortNum === "2") {
        this.port = [{ label: "COM1", value: "1" }];
      } else {
        this.port = [
          { label: "COM1", value: "1" },
          { label: "COM2", value: "2" }
        ];
      }
    },
    filterParam() {
      if (this.dataForm.guns[0].serialPortNum === "1") {
        this.ports2 = [{ label: "COM2", value: "2" }];
      } else if (this.dataForm.guns[0].serialPortNum === "2") {
        this.ports2 = [{ label: "COM1", value: "1" }];
      } else {
        this.ports2 = [
          { label: "COM1", value: "1" },
          { label: "COM2", value: "2" }
        ];
      }
    },
    filterParam2() {
      alert("111");
      if (this.dataForm.guns[2].serialPortNum === "1") {
        this.ports2 = [{ label: "COM2", value: "2" }];
      } else if (this.dataForm.guns[2].serialPortNum === "2") {
        this.ports2 = [{ label: "COM1", value: "1" }];
      } else {
        this.ports2 = [
          { label: "COM1", value: "1" },
          { label: "COM2", value: "2" }
        ];
      }
    },
    filterId(id) {
      // console.log(this.boardIds)
      if (id) {
        this.boardIds = this.boardIds.filter(function(val) {
          return val.fillingMachineId !== id;
        });
      }
    },
    changeMachineId(id) {
      let arr = [];
      this.boardIds.forEach((item, index) => {
        if (item.fillingMachineId == id) {
          item.guns.forEach(function(item, index) {
            let itemN = {};
            itemN.label = "COM" + item.serialPortNum;
            itemN.value = item.serialPortNum;
            for (let key in item) {
              itemN[key] = item[key];
            }
            arr.push(itemN);
          });
          this.ports = arr;
        }
      });
      if (this.ports.length == 0) {
        this.ports = [
          {
            label: "COM1",
            value: "1",
            refuelingGunId: "",
            gunName: "",
            gasolineNum: ""
          },
          {
            label: "COM2",
            value: "2",
            refuelingGunId: "",
            gunName: "",
            gasolineNum: ""
          }
        ];
      }
      // console.log('this.labelTab',this.labelTab);
      if (this.labelTab == 1) {
        this.dataForm.guns[0].serialPortNum = "";
        this.dataForm.guns[1].serialPortNum = "";
      } else if (this.labelTab == 2) {
        this.dataForm.guns[2].serialPortNum = "";
        this.dataForm.guns[3].serialPortNum = "";
      }
    },
    changeGuns: function(gunItem, indexGun) {
      if (this.editId) {
        return;
      }
      if (!this.ports[0].refuelingGunId && !this.ports[1].refuelingGunId) {
        return;
      }
      // console.log(gunItem.serialPortNum);
      this.ports.forEach(function(item, index) {
        if (item.value == gunItem.serialPortNum) {
          gunItem.refuelingGunId = item.refuelingGunId;
          gunItem.gunName = item.gunName;
          gunItem.gasolineNum = item.gasolineNum;
        }
      });
    },
    init(cameraId) {
      this.visible = true;
    },
    changeFlag(data, flag) {
      this.$emit("changeFlag", data, flag);
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.fillingMachineId1 == this.fillingMachineId2) {
            this.$message.error("主板ID不能相同，请检查");
            return;
          }
          if (
            this.dataForm.guns[0].serialPortNum ==
              this.dataForm.guns[1].serialPortNum ||
            this.dataForm.guns[0].serialPortNum ==
              this.dataForm.guns[1].serialPortNum
          ) {
            this.$message.error("左右通信接口不能相同，请检查");
            return;
          }
          if (this.dataForm.gunsNum == 2 && this.dataForm.guns.length > 2) {
            this.dataForm.guns.splice(2, 2);
            // console.log(this.dataForm.guns);
            // return;
          }
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.loading=true
              this.$http({
                url: this.$http.adornUrl(
                  `/business/fillingmachine/update?ie=${new Date().getTime()}`
                ),
                method: "post",
                data: JSON.stringify(this.dataForm)
              })
                .then(res => {
                  if (res.data.code !== 0) {
                    this.$message.error(res.data.msg);
                    return;
                  }
                  this.loading=false
                  this.$message.success('保存成功！')
                  this.$emit("changeFlag", null, true);
                  // this.$confirm(`保存成功`, "提示", {
                  //   confirmButtonText: "确定",
                  //   // cancelButtonText: "取消",
                  //   type: "success"
                  // })
                  //   .then(() => {
                  //     this.$emit("changeFlag", null, true);
                  //   })
                  //   .catch(() => {});
                })
                .catch(err => {});
            }
          });
        } else {
          console.log("error submit");
        }
      });
    }
  },
  computed: {},
  mounted() {
    // console.log('this.editId',this.editId);
    this.$http
      .post(
        this.$http.adornUrl(
          `/business/fillingmachine/listAll?ie=${new Date().getTime()}`
        )
      )
      .then(res => {
        // console.log(typeof res.data.machineInfo)
        if (res.data.code !== 0) {
          this.$message.error(res.data.msg);
          return;
        }
        let arr = [];
        if (res.data.machineInfo) {
          res.data.machineInfo.forEach(function(item, index) {
            arr.push(item);
          });
          this.boardIds = arr;
        }
      })
      .catch(err => {});
    if (this.editId) {
      this.$http({
        url: this.$http.adornUrl(
          `/business/fillingmachine/getInfo/${
            this.editId
          }?ie=${new Date().getTime()}`
        ),
        method: "post",
        data: JSON.stringify({})
      })
        .then(res => {
          this.dataForm = res.data.machineInfo;
          this.dataForm.gunsNum = this.dataForm.guns.length;
          this.fillingMachineId1 = this.dataForm.guns[0].fillingMachineId;
          this.fillingMachineId2 = this.dataForm.guns[2].fillingMachineId;
          // this.$set(this.dataForm,'label',1);
          // console.log('this.dataForm.label',this.dataForm);
        })
        .catch(err => {});
    }
  }
};
</script>

<style>
#tankerUpdate .el-radio-button,
.el-radio-button__inner {
  width: 150px;
}
#tankerUpdate .el-select {
  width: 100%;
}
h3 {
  text-indent: 24px;
}
.machieName {
  width: 130px;
  height: 50px;
  line-height: 50px;
  position: absolute;
  left: 42px;
  top: 30px;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
}
.machineId {
  font-size: 16px;
  padding-top: 10px;
  min-height: 50px;
  /*height:34px;
  line-height:34px;*/
  font-weight: 700;
  text-align: center;
  width: 214px;
}
.machineId span {
  display: inline-block;
  width: 100%;
  word-wrap: break-word;
  word-break: normal;
}
#tankerUpdate .machineList li {
  height: 30px;
  line-height: 30px;
}
.backBtn1 {
  left: 40px;
  z-index: 9;
}
</style>
