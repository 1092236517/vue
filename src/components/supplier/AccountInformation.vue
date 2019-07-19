<template>
	<div class="pay-account-wrapper">
		<h2 class="title">收款方账户列表</h2>
		<div class="content">
			<div>
				<button type="button" class="btn add-btn" @click="addPayAccount">添加账户</button>
			</div>
			<div class="pay-account-table">
				<el-table
                    ref="multipleTable"
				  	:data="payAccountList"
				  	stripe
				  	style="width: 100%">
				  		<el-table-column
				    		prop="account_name"
				    		label="账号名称">
				  		</el-table-column>
				  		<el-table-column
				    		prop="bank_name"
				    		label="开户行">
				  		</el-table-column>
                        <el-table-column
							prop="account"
				  			label="账号">
						</el-table-column>
                        <el-table-column
							prop="location"
				  			label="城市名称">
						</el-table-column>
                        <el-table-column
				  			label="操作"
				  			width="270">
				  			<template slot-scope="scope">
				  				<button type="button" class="btn table-edit-btn" @click="editPayAccount(scope.row.id)">编辑</button>
				  				<span class="dividing-line">|</span>
				  				<button type="button" class="btn table-del-btn" @click="deletePayAccount(scope.row.id)">删除</button>
				  			</template>
						</el-table-column>
				</el-table>
			</div>
		</div>
        <div class="pageCont" v-if="total > 10">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :currentPage="currentPage"
                @current-change="current_change">
            </el-pagination>
        </div>
	</div>
</template>

<script>
	export default {
        name: 'PayAccountReceiveList_supplier',
		data(){
			return{
				token:'',
                total: 0,
                currentPage: 1,
				payAccountList: []
			}
		},
        created(){
			this.token = this.$cookies.get('ZL_token');
            this.getPayAccountList(1);
        },
        methods: {
            //获取列表
            getPayAccountList(pageNum){
                let that=this;
                let params={
					token:that.token,
					type:that.type,
                    current_page: pageNum,
					per_page: 10,
					type: 'supplier',
					account_type: 'ACCOUNT_RECEIVE'
                }
                that.$api.bank_accountList_supplier(params).then(response => {
					if(response.data.msg_code===100000){
						that.total = response.data.response.total;
						that.payAccountList = response.data.response.data.map(item => {
							let element = {
								id: item.id,
								account_name: item.account_name,
								bank_name: item.bank_name,
								account: item.account,
								location: (item.address_province + item.address_city) || '-',
								status: item.status,
								compony_code: item.compony_code
							};
							return element
						});
					}else{
						that.$alert(response.data.message,'提示',{
							confirmButtonText: '知道了',
							callback: action => {
								result.message
							}
						})
					}
                }).catch(error => {
                    that.$alert(error,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {
                            //todo
                        }
                    })
                })
            },
            //新增
            addPayAccount(){
                this.$router.push({name: 'supplierAccountInformationAdd'});
			},
			//编辑
			editPayAccount(id){
				this.$router.push({name: 'accountinformationEdit_supplier', params: {id}})
			},
            //删除
            deletePayAccount(id){
				let that = this;
				let params = {
					token: that.token,
					id: id,
					type: 'group'
                };
                that.$confirm('是否确认删除？', '提示', {
                    confirmButtonText: '确定',
					cancelButtonText: '取消',
					type:'warning'
                }).then(() => {
					that.$api.bank_accountDelete_supplier(params).then(response => {
						if(response.data.msg_code === 100000){
							that.getPayAccountList(that.currentPage)
							this.$message({
								type: 'success',
								message: '删除成功'
							});
						}
					}).catch(error => {
						console.log(error);
					})
				}).catch(() => {
                    this.$message({
						type: 'info',
						message: '已取消删除'
					});
                })
            },
            //列表分页
            current_change:function(currentPage){
                this.currentPage = currentPage;
                this.getPayAccountList(currentPage);
            }
        }
	}
</script>

<style lang="less" scoped>
	@color: #2793F4;
	.pay-account-wrapper{
		.title{
			margin-top: 0;
			margin-bottom: 30px;
		}
		.content{
			margin-top: 10px;
			background: #fff;
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
				margin-right: 10px;
			}
			.pay-account-table{
				margin-top: 20px;
				.default-icon{
					display: inline-block;
					font-size: 12px;
					width: 20px;
					height: 20px;
					line-height: 20px;
					color: #fff;
					background: @color;
					border-radius: 4px;
				}
				.table-edit-btn{
					height: 20px;
					font-size: 14px;
					font-weight: 600;
					color: #2793F4;
					border-radius: 4px;
				}
				.table-del-btn{
					font-size: 14px;
					font-weight: 600;
					color: #EC3636;
					border-radius: 4px;
				}
				.default-pay{
					display: inline-block;
					font-size: 14px;
					font-weight: 400;
					color: #999;
					width: 85px;
					margin-right: 10px;
				}
			}
			.dividing-line{
				color: #999;
				margin-left: 15px;
				margin-right: 15px;
			}
		}
	}
</style>