<template>
    <div>
		<h2>添加账户</h2>
        <div class="content">
            <p class="tips">提示：请输入公司账户信息</p>
			<el-form ref="form" label-width="80px" v-model="accountForm">
				<el-form-item label="开户行">
					<!-- <span class="requiredSpan">*</span> -->
					<!-- <el-input v-model="accountForm.bank_name" placeholder="开户行" class="width200"></el-input> -->
					<el-select v-model="accountForm.bank_name" placeholder="开户行" class="width200">
						<el-option v-for="(item,index) in bankName" :label="item.bank_name" :value="item.bank_name" :key='index'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="账号">
					<!-- <span class="requiredSpan">*</span> -->
					<el-input v-model="accountForm.account" placeholder="账号" class="width200"></el-input>
				</el-form-item>
				<el-form-item label="账户名称">
					<!-- <span class="requiredSpan">*</span> -->
					<el-input v-model="accountForm.account_name" placeholder="账户名称" class="width200"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="nomalBtn1" @click="OnSubmit" >添加</el-button>
				</el-form-item>
			</el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
			token:'',
			bankName:[],
			accountForm:{
				bank_name:'',
				account:'',
				account_name:'',
			}
        }
	},
	methods:{
		OnSubmit(){
			let that = this;
			let params = {
				token:that.token,
				bank_name:that.accountForm.bank_name,
				account:that.accountForm.account,
				account_name:that.accountForm.account_name,
				type:'supplier'
			};
			that.$api.bank_accountAdd_supplier(params).then(response=>{
				if(response.data.msg_code===100000){
					this.$router.push({path: '/supplier_super/supplieraccountinformation'})
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
		getbankNameList(){
			let that = this;
			let params = {
				token :that.token,
				type:'supplier'
			};
			that.$api.bank_nameList_supplier(params).then(response=>{
				if(response.data.msg_code===100000){
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
		}
	},
	mounted(){
		let that = this;
		// 设置下token
		if(!that.$cookies.get("ZL_token")){
			that.$router.push({path: '/login'})
		}else{
			that.token = that.$cookies.get("ZL_token");
		};
		that.getbankNameList();
	}
}
</script>

<style lang='less' scoped>
	.width200{
		width: 200px;
	}
	.tips{
		font-size:9px;
		font-weight:400;
		color:rgba(153,153,153,1);
		padding-left: 20px;
	}
    .roles-manage-wrapper{
		background: #eee;
		padding: 10px;
		.title{
			margin: 0;
			height: 60px;
			line-height: 60px;
			background: #fff;
			padding-left: 30px;
			padding-right: 30px;
			font-size: 18px;
			color: #0576DB;
		}
		.content{
			margin-top: 10px;
			background: #fff;
			padding: 30px 20px;
			.width200{
				width: 200px;
			}
            .tips{
                font-size:9px;
                font-weight:400;
                color:rgba(153,153,153,1);
            }
			.btn{
				outline: none;
				border: 0;
				margin: 0;
				padding: 0;
				background: none;
				cursor: pointer;
			}
			.add-btn{
				width: 68px;
				height: 30px;
				background: #2793F4;
				font-size: 12px;
				color: #fff;
				border-radius: 4px;
				// margin-left: 30px;
				margin-right: 10px;
			}
			.delete-btn{
				width: 68px;
				height: 30px;
				background: #FF4B4B;
				font-size: 12px;
				color: #fff;
				border-radius: 4px;
			}
			.roles-table{
				margin-top: 20px;
				.table-edit-btn{
					width: 68px;
					height: 20px;
					font-size: 12px;
					color: #2793F4;
					border: 1px solid #2793F4;
					border-radius: 4px;
                    margin-right: 10px;
				}
				.table-del-btn{
					width: 68px;
					height: 20px;
					font-size: 12px;
					color: #FF4B4B;
					border: 1px solid #FF4B4B;
					border-radius: 4px;
				}
			}
		}
	}
</style>
