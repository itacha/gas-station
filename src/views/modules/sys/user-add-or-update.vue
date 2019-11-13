<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录名" prop="loginName">
            <el-input v-model="dataForm.loginName" placeholder="请输入登录名"></el-input>
          </el-form-item>
          <!-- <el-form-item label="登录名" prop="loginName">
            <el-input v-model="dataForm.loginName" placeholder="登录帐号"></el-input>
          </el-form-item>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工号" prop="workNum" size="medium">
            <el-input v-model="dataForm.workNum" placeholder="请输入工号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" size="medium">
            <el-radio v-model="dataForm.sex" label="0">男</el-radio>
  <el-radio v-model="dataForm.sex" label="1">女</el-radio>
          </el-form-item>
          <!-- <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
          </el-form-item>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位" prop="position">
            <el-input v-model="dataForm.position" placeholder="请输入岗位名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电话" size="medium" prop="tel">
            <!-- <el-radio-group v-model="dataForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">正常</el-radio>
            </el-radio-group>-->
            <el-input v-model="dataForm.tel" placeholder="请输入电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleIdList">
            <el-select v-model="dataForm.roleIdList" placeholder="请选择" multiple>
              <el-option
                v-for="role in roleList"
                :key="role.roleId"
                :label="role.roleName"
                :value="role.roleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- <el-form-item label="角色" size="mini" prop="roleIdList">
            <el-checkbox-group v-model="dataForm.roleIdList">
              <el-checkbox
                v-for="role in roleList"
                :key="role.roleId"
                :label="role.roleId"
              >{{ role.roleName }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <!-- <el-form-item label="原始密码" prop="password" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
          </el-form-item> -->
        </el-col>
      </el-row>
      <!-- 上传图片区域 -->
      <!-- <el-row>
        <el-col>
          <el-form-item label="上传图片">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl"  class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from "@/utils/validate";
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("确认密码不能为空"));
      } else if (this.dataForm.password !== value) {
        callback(new Error("确认密码与密码输入不一致"));
      } else {
        callback();
      }
    };
    // var validateEmail = (rule, value, callback) => {
    //   if (!isEmail(value)) {
    //     callback(new Error('邮箱格式错误'))
    //   } else {
    //     callback()
    //   }
    // }
    // var validateMobile = (rule, value, callback) => {
    //   if (!isMobile(value)) {
    //     callback(new Error('手机号格式错误'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      visible: false,
      roleList: [],
      dataForm: {
        // id: 0,
        // loginName: "",
        // 性别
        sex: "",
        // 登录名
        userName: "",
        // 密码
        password: "",
        // comfirmPassword: "",
        // salt: "",
        // email: "",
        // 电话
        tel: "",
        roleIdList: [],
        // status: 1,
        // 角色
        role: "",
        // 岗位
        position: "",
        workNum: "",
        // 上传图片地址
        imageUrl: ""
      },
      dataRule: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        loginName: [
          { required: true, message: "登录名不能为空", trigger: "blur" }
        ],
        password: [{ validator: validatePassword, trigger: "blur" }],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: "blur" }
        ],
        email: [
          // { required: true, message: '邮箱不能为空', trigger: 'blur' },
          // { validator: validateEmail, trigger: 'blur' }
          {
            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: "邮箱输入有误"
          }
        ],
        tel: [
          // { required: true, message: '手机号不能为空', trigger: 'blur' },
          // { validator: validateMobile, trigger: 'blur' }
          { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: "手机号输入有误" }
        ]
      }
    };
  },
  created() {},
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.$http({
        url: this.$http.adornUrl("/sys/role/select"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          this.roleList = data && data.code === 0 ? data.list : [];
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: "get",
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                // console.log(data)
                this.dataForm.userName = data.user.userName;
                this.dataForm.salt = data.user.salt;
                this.dataForm.email = data.user.email;
                this.dataForm.tel = data.user.tel;
                this.dataForm.roleIdList = data.user.roleIdList;
                this.dataForm.status = parseInt(data.user.status);
                this.dataForm.loginName = data.user.loginName;
                this.dataForm.workNum=data.user.workNum
                this.dataForm.position=data.user.position
                this.dataForm.sex=data.user.sex
                console.log(this.dataForm);
              }
            });
          }
        });
    },
    // 上传图片
    // handleAvatarSuccess(res, file) {
    //     this.imageUrl = URL.createObjectURL(file.raw);
    //   },
    //   beforeAvatarUpload(file) {
    //     const isJPG = file.type === 'image/jpeg';
    //     const isLt2M = file.size / 1024 / 1024 < 2;

    //     if (!isJPG) {
    //       this.$message.error('上传头像图片只能是 JPG 格式!');
    //     }
    //     if (!isLt2M) {
    //       this.$message.error('上传头像图片大小不能超过 2MB!');
    //     }
    //     return isJPG && isLt2M;
    //   },

    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/user/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData(
              {
                userId: this.dataForm.id || undefined,
                loginName: this.dataForm.loginName,
                userName: this.dataForm.userName,
                position:this.dataForm.position,
                password: this.dataForm.password,
                salt: this.dataForm.salt,
                email: this.dataForm.email,
                tel: this.dataForm.tel,
                sex: this.dataForm.sex,
                status: 1,
                roleIdList: this.dataForm.roleIdList,
                workNum: this.dataForm.workNum
              },
              false
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>