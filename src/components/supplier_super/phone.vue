<template>
    <div class="status-wrapper">
        <div class="phoneTitle">注册手机号修改</div>
        <div class="phoneBox">
        	<el-steps :active="active" finish-status="success">
			  	<el-step title="验证身份"></el-step>
			  	<el-step title="添加新手机号"></el-step>
			  	<el-step title="完成"></el-step>
			</el-steps>
			<div class="phoneForm" v-if="first">
				<div><span class="tryedPhone">已验证手机：</span>{{mobile}}</div>
				<div class="phoneCode">
					<span>手机校验码：</span>
					<el-input v-model="code" placeholder="请输入校验码" size="small"></el-input>
					<el-button type="primary" @click="getCode()" :disabled="disGet" v-show="codeBtn">{{ disGet ? timeNum + 's' : '获取校验码' }}</el-button>
					<!-- <el-button type="primary" v-if="showTimeless">{{timeNum}}s</el-button> -->
				</div>
				<el-button type="primary" class="next" @click="next" v-show="nextBtn">下一步</el-button>
			</div>
			<div class="phoneForm" v-if="second">
				<div class="phoneCode">
					<span>新手机号：</span>
					<el-input v-model="newPhone" placeholder="请输入手机号" size="small"></el-input>
					<el-button type="primary" @click="getCode(1)" :disabled="disGet">{{ disGet ? timeNum + 's' : '获取校验码' }}</el-button>
					<!-- <el-button type="primary" v-if="showTimeless">{{timeNum}}s</el-button> -->
				</div>
				<div class="phoneCode">
					<span>验证码：</span>
					<el-input v-model="newCode" placeholder="请输入验证码" size="small"></el-input>
				</div>
				<el-button type="primary" class="next" @click="finish">下一步</el-button>
			</div>
			<div class="phoneForm phoneSuccessImg" v-if="third">
				<div>
					<img src="../../assets/public/phoneSuccess.png" />
					修改成功！
				</div>
				<div class="phoneSuccessTips">
					您可以使用用户名({{userName}})或注册手机号({{telNum}})作为登录名，进行登录。
				</div>
			</div>
        </div>
    </div>
    
</template>

<script>
    export default {
    	data(){
    		return {
    			active: 0,
    			mobile: '',
    			showTimeless: false,
    			code: '',
    			timeNum: 60,
    			disGet: false,
    			first: true,
    			second: false,
    			third: false,
    			userName: '',
    			telNum: '',
    			newPhone: '',
				newCode: '',
				timer: null,
				//权限按钮
				codeBtn: false,
				nextBtn: false
    		}
    	},
        methods: {
			//权限
			getAuthority(){
				let that=this;
                if(that.$store.getters.authForGroup.ChangePhone&&that.$store.getters.authForGroup.ChangePhone.transfers.length!=0){
                    that.$store.getters.authForGroup.ChangePhone.transfers.map(item=>{
                        if(item.power_transfer_name.indexOf('获取校验码') !=-1){
                            that.codeBtn = true;
                        }else if(item.power_transfer_name.indexOf('下一步') !=-1){
							that.nextBtn = true;
						}
                    });
                }else if(that.$store.getters.authForGroup.BranchChangePhone&&that.$store.getters.authForGroup.BranchChangePhone.transfers.length!=0){
					 that.$store.getters.authForGroup.BranchChangePhone.transfers.map(item=>{
                        if(item.power_transfer_name.indexOf('获取校验码')!=-1){
                            that.codeBtn=true;
                        }else if(item.power_transfer_name.indexOf('下一步')!=-1){
							that.nextBtn=true;
						}
                    });
				}
				console.log(that.$store.getters.authForGroup)
			},
		    //获取用户信息 -> 手机号
		    getUser: function(){
		    	let that = this;
		    	that.$http.get('/api/frontend/member/detail/?token=' + that.token,{}).then(function(res){
		    		that.mobile = res.data.response.mobile;
		    	})
		    },
		    //获取验证码
		    getCode: function(phone){
		    	let that = this;
		    	let phoneNum = phone || '';
		    	if(!phone){
		    		phoneNum = that.mobile;
		    	}else{
		    		phoneNum = that.newPhone;
		    		if(phoneNum.length != '11'){
		    			that.$alert('请输入正确的手机号', '提示', {
				          	confirmButtonText: '确定'
				        });
				        return false;
		    		}
		    	}
		    	that.disGet = true;
		    	that.$http.get('/api/frontend/sms/?mobile=' + phoneNum,{}).then(function(res){
		    		//60s倒计时
		    		that.showTimeless = true;
		    		function timeLess(){
		    			if(that.timeNum == 0){
		    				that.showTimeless = false;
		    				that.disGet = false;
		    				that.timeNum = 60;
		    				clearInterval(that.timer);
		    				return false;
		    			}
			    		that.timeNum = that.timeNum - 1;
			    	}
			    	that.timer = setInterval(timeLess,1000);
		    	})
		    	
		    },
		    //下一步
		    next: function(){
		    	let that = this;
		    	that.showTimeless = false;
				//that.disGet = false;
				//that.timeNum = 60;
				if(!that.code){
					that.$message({
						type: 'warning',
						message: '请填写验证码'
					});
					return false;
				}
				clearInterval(that.timer);
				that.timeNum = 60;
				that.disGet = false;
		    	that.$http.post('/api/frontend/member/reset/mobile',{
		    		token: that.token,
		    		mobile: that.mobile,
		    		code: that.code
		    	}).then(function(res){
		    		if(res.data.msg_code == '100000'){
						that.first = false;
				    	that.second = true;
		    			if (that.active++ > 2) that.active = 0;
		    		}else{
		    			that.$alert(res.data.message, '提示', {
				          	confirmButtonText: '确定'
				        });
		    		}
		    	})
		    },
		    //添加手机号下一步，完成
		    finish: function(){
		   		let that = this;
		   		that.$http.post('/api/frontend/member/reset/mobile/next',{
		   			token: that.token,
		   			mobile: that.newPhone,
		   			code: that.newCode
		   		}).then(function(res){
		   			if(res.data.msg_code == '100000'){
		    			if (that.active++ > 2) that.active = 0;
						that.first = false;
				    	that.second = false;
				    	that.third = true;
		    			if (that.active++ > 2) that.active = 0;
		   			}else{
		   				that.$alert(res.data.message, '提示', {
				          	confirmButtonText: '确定'
				        });
		   			}
		   		})
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
            this.getUser();
			//初始化数据
			if(that.$cookies.get("user_role")=="2"){
				that.codeBtn = true;
				that.nextBtn = true;
			}else{
				that.getAuthority();
			}
        }
    }
</script>
<style lang="less" scoped>
// .status-wrapper{
// 	height: 1000px;
// }
	.phoneTitle{
		font-size: 20px;
		font-weight: bold;
	}
	.phoneBox{
		width: 80%;
		margin: 0 auto;
		margin-top: 10%;
	}
	.phoneForm{
		margin-left: 25%;
		margin-top: 80px;
	}
	button{
		width: 130px;
		padding: 8px 0;
	}
	.el-input{
		display: inline-block;
		width: 200px;
		height: 15px;
	}
	.phoneCode{
		margin-top: 20px;
	}
	.phoneCode span{
		display: inline-block;
		width: 7rem;
		text-align: right;
	}
	.next{
		margin-top: 30px;
		width: 200px;
		margin-left: 7.5rem;
	}
	.tryedPhone{
		display: inline-block;
		width: 7rem;
		text-align: right;
	}
	.phoneForm img{
		width: 50px;
		position: relative;
		top: 15px;
		left: -10px;
	}
	.phoneSuccessImg{
		text-align: center;
	}
	.phoneSuccessTips{
		margin-top: 30px;
	}
</style>