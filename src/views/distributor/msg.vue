<template>
  <el-form ref="form" :model="form" label-width="80px" style="margin:20px;width:60%;min-width:600px;" :rules="msgFormRules">
		<el-form-item label="标题" prop="title">
			<el-input v-model="form.title"></el-input>
		</el-form-item>
		<el-form-item label="留言内容" prop="message">
			<el-input type="textarea" v-model="form.message" :rows='rows'></el-input>
		</el-form-item>
    <el-form-item label="联系号码" prop="phone">
			<el-input v-model="form.phone"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onSubmit">提交</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import { distributorGetaddmsg } from '@/api/api';
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      setTimeout(() => {
        if(!(/^1[34578]\d{9}$/.test(value))){ 
          callback('请输入正确手机号')
        }else{
          callback();
        }
      }, 500);
    };
    return {
      form: {
        title: '',
        message: '',
        phone: ''
      },
      rows: 5,
      msgFormRules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
          ],
          message: [
						{ required: true, message: '请输入留言内容', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机', trigger: 'blur' },
						{ validator: checkPhone, trigger: 'blur' }
          ]
				}
    }
  },
  methods: {
    
    onSubmit(){
      this.$refs.form.validate((valid) => {
				if (valid) {
          this.$confirm('确认提交该留言吗?', '提示', {
					  type: 'warning'
				  }).then(() => {
            let para = {
              title: this.form.title,
              message: this.form.message,
              account: JSON.parse(sessionStorage.getItem('user')).account,
              phone: this.form.phone,
            }
            distributorGetaddmsg(para).then((res) => {
              this.$message({
                message: '提交成功',
                type: 'success'
              });
            }).catch((err) => {
              this.$message({
                message: '提交失败',
                type: 'error'
              });
              throw err
            })
          })
        }
      })
    }
  }
}
</script>

