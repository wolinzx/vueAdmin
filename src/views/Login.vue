<template>
  <div class="login">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.allow" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-radio-group v-model="radio" size="small" class="radio" @change="hhh">
        <el-radio-button label="chairman">管理员</el-radio-button>
        <el-radio-button label="distributor">经销商</el-radio-button>
        <el-radio-button label="service">客服</el-radio-button>
      </el-radio-group>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { requestLogin } from '../api/api';
  import { mapActions } from 'vuex'
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '111',
          allow: '111'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            // { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true,
        radio: 'chairman'
      };
    },
    methods: {
      ...mapActions(['getAccount']),
      hhh(value) {
        console.log(this.radio);
      },
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { account: this.ruleForm2.account, allow: this.ruleForm2.allow, position: this.radio };
            // let jsonText = JSON.stringify(loginParams);
            requestLogin(loginParams).then(data => {
              this.logining = false;
              if (!data.length) {
                this.$message({
                  message: '账号或密码错误',
                  type: 'error'
                });
              } else {
                // this.$store.dispatch('getAccount', this.ruleForm2.account);
                let account = { 'account': _this.ruleForm2.account, 'src': data[0].src };
                sessionStorage.setItem('user', JSON.stringify(account));
                this.$router.push({ path: '/' + this.radio + '/table' });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: rgba($color: #FFFFFF, $alpha: 0.7);
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember{
      float: right;
    }
    .remember,
    .radio {
      margin: 0px 0px 22px 0px;
    }
  }
  .login {
    background: url('../assets/bg1.jpg') 50% 50% no-repeat;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>