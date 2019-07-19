<template>
    <div class="add-account-wrapper">
		<h2 class="title">添加账户</h2>
        <div class="content">
            <p class="tips">提示：请输入公司账户信息</p>
			<el-form ref="form" label-width="80px" v-model="accountForm">
				<el-form-item label="开户行">
					<!-- <span class="requiredSpan">*</span> -->
					<el-select v-model="accountForm.bank_name" placeholder="开户行" class="width260">
						<el-option v-for="(item,index) in bankName" :label="item.bank_name" :value="item.bank_name" :key='index'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="账号">
					<!-- <span class="requiredSpan">*</span> -->
					<el-input v-model.trim="accountForm.account" placeholder="账号" class="width260"></el-input>
				</el-form-item>
				<el-form-item label="账户名称">
					<!-- <span class="requiredSpan">*</span> -->
					<el-input v-model.trim="accountForm.account_name" placeholder="账户名称" class="width260"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="nomalBtn1" @click="addPayAccount" >添加</el-button>
				</el-form-item>
			</el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
			token: '',
			bankName: [],
			accountForm: {
				bank_name: '',
				account: '',
				account_name: ''
			}
        }
	},
	created(){
		this.token = this.$cookies.get("ZL_token");
		this.getbankNameList();
	},
	methods:{
		//新增支付账户
		addPayAccount(){
			let that = this;
			let params = {
				token: that.token,
				bank_name: that.accountForm.bank_name,
				account: that.accountForm.account,
				account_name: that.accountForm.account_name,
				type:'group'
			};
			if(that.validator()){
				that.$message({
					message: '您有未填项',
					type: 'warning'
				})
				return false
			}
			that.$api.bank_accountAdd(params).then(response => {
				if(response.data.msg_code===100000){
					that.$message({
					    message: '创建成功',
					    type: 'success'
					});
					that.$router.push({name: 'groupAccountInformation'});
				}else{
					that.$alert(response.data.message , '提示', {
						confirmButtonText: '确定',
						callback: action => {
						}
					});
				}
			}).catch(error=>{
				console.log(error);
			})
		},
		//获取银行列表
		getbankNameList(){
			let that = this;
			let params = {
				token :that.token,
				type: 'group',
			};
			that.$api.bank_nameList(params).then(response => {
				if(response.data.msg_code === 100000){
					that.bankName = response.data.response;
				}else{
					that.$alert(result.message , '提示', {
						confirmButtonText: '确定',
						callback: action => {
						}
					});
				}
			}).catch(error=>{
				console.log(error)
			})
		},
		//校验表单
		validator(){
			return Object.keys(this.accountForm).some(key => {
				return !this.accountForm[key]
			})
		}
	}
}
</script>

<style lang='less' scoped>
    .add-account-wrapper{
    	.title{
    		margin-top: 0;
    		margin-bottom: 10px;
    	}
		.content{
			background: #fff;
			padding: 0 20px 30px 0;
			.width260{
				width: 260px;
			}
            .tips{
                font-size: 12px;
                font-weight: 400;
                color: #999;
            }
		}
	}
</style>
