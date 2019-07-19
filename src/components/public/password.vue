<template>
    <div>
    	<div class="passTitle">修改密码</div>
	    <div class="passBox">
	    	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="旧密码" prop="oldPass">
				    <el-input v-model="ruleForm.oldPass" placeholder="请输入旧密码"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPass">
				    <el-input v-model="ruleForm.newPass" placeholder="请输入新密码"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="newPassAgain">
				    <el-input v-model="ruleForm.newPassAgain" placeholder="请确认新密码"></el-input>
				</el-form-item>
				<el-form-item>
				    <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
				    <!--<el-button type="primary" @click="open()">修改</el-button>-->
				</el-form-item>
	    	</el-form>
	    </div>
    </div> 
</template>
<script>
    export default {
    	data(){
    		return {
    			ruleForm: {
    				oldPass: '',
    				newPass: '',
    				newPassAgain: ''
    			},
    			rules: {
    				oldPass: [
    					{ required: true, message: '请输入旧密码', trigger: 'blur' },
    				],
    				newPass: [
    					{ required: true, message: '请输入新密码', trigger: 'blur' },
    				],
    				newPassAgain: [
    					{ required: true, message: '请确认新密码', trigger: 'blur' },
    				],
    			}
    		}
    	},
        methods: {
        	submitForm: function(formName){
        		let that = this;
				let oldPass = that.ruleForm.oldPass;
				let newPass = that.ruleForm.newPass;
				let newPassAgain = that.ruleForm.newPassAgain;
				let validate_status = true;
				this.$refs[formName].validate((valid) => {
				  	if(!valid) {
				    	return validate_status = false;
				  	}
				});
				if(!validate_status){
					return false;
				}
				if(newPass == newPassAgain){
					that.$http.post('/api/frontend/member/reset/password/?token=' + that.token,{
						token: that.token,
						old_password: oldPass,
						password: newPass,
						password_confirmation: newPassAgain
	        		}).then(function(res){
	        			console.log(res);
	        			if(res.data.code == '100000'){
	        				that.$cookies.remove("ZL_token");
	        				that.$router.push({path: '/login'});
	        			}else{
	        				that.open(res.data.message);
	        			}
	        		})
				}else{
					that.open('确认新密码输入不一致！');
				}
        	},
        	open(msg) {
		        this.$alert(msg, '提示', {
			        confirmButtonText: '知道了',
		        });
		    }
        },
        mounted(){
        	let that = this;
        	//获取token
        	if(that.$cookies.get("ZL_token")){
        		that.token = that.$cookies.get("ZL_token");
            }else{
                that.$router.push({path: '/login'});
            }
            
            //初始化数据
        }
    }
</script>
<style lang="less" scoped>
	/*标题*/
	.passTitle{
		font-size: 20px;
		font-weight: bold;
	}
	.passBox{
		width: 400px;
		text-align: center;
		position: absolute;
		left: 50%;
		top: 20%;
		margin-left: -200px;
		line-height: 26px;
		color: #6C6C6C;
	}
	button.el-button--primary{
		width: 150px;
		margin-top: 20px;
		padding: 8px 0;
	}
</style>