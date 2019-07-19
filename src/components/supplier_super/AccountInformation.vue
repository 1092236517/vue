<template>
	<div class="roles-manage-wrapper">
		<h2>账户信息</h2>
		<div class="content">
			<div>
				<!-- <el-checkbox @change="selectAll(rolesManageList)">全选</el-checkbox> -->
				<button type="button" class="btn add-btn" @click="addRolesItem">添加账户</button>
				<!-- <button type="button" class="btn delete-btn">删除</button> -->
			</div>
			<div class="roles-table">
				<el-table
                    ref="multipleTable"
				  	:data="groupList"
				  	stripe
				  	style="width: 100%">
				  		<el-table-column
				    		prop="id"
				    		label="编号"
				    		width="100">
				  		</el-table-column>
				  		<el-table-column
				    		prop="bank_name"
				    		label="开户行">
				  		</el-table-column>
						<el-table-column
							prop="account_name"
				  			label="账号名称"
				  			>
						</el-table-column>
                        <el-table-column
							prop="account"
				  			label="账号"
				  			width="270">
						</el-table-column>
                        <el-table-column
				  			label="操作"
				  			width="270">
				  			<template slot-scope="scope">
								<div v-if="scope.row.status=='Using'" class="payType">默认支付</div>
				  				<button v-else type="button" class="btn table-edit-btn" @click="setDefault(scope.row.id)">设为默认支付</button>
				  				<button type="button" class="btn table-del-btn" @click="deleteRolesItem(scope.row.id)">删除</button>
				  			</template>
						</el-table-column>
				</el-table>
			</div>
		</div>
        <div class="pageCont" v-if="total > 0">
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
        name: 'rolesList',
		data(){
			return{
				token:'',
				// type:'',
				// pathUrl:'',
                //allChecked: true,
                total: 0,
                currentPage: 1,
				groupList: [],
                //selectedgroupItem: []
			}
		},
        methods: {
            //获取列表
            getGroupList(pageNum){
                let that=this;
                let params={
					token:that.token,
					type:that.type,
                    current_page: pageNum,
					per_page: 10,
					type:'supplier'
                }
                that.$api.bank_accountList_supplier(params).then(response=>{
					if(response.data.msg_code===100000){
						that.total=response.data.response.total;
						that.groupList=response.data.response.data;
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
            //新增或编辑
            addRolesItem(){
                this.$router.push({path: '/supplier_super/supplieraccountinformationadd'})
			},
			//设为默认
			setDefault(id){
				let that = this;
				let params = {
					token:that.token,
					type:'supplier',
					id:id,
				}
				that.$confirm('是否设为默认？','提示',{
                    confirmButtonText: '确定',
					cancelButtonText: '取消',
					type:'warning'
                }).then(()=>{
					that.$api.bank_accountSetDefault_supplier(params).then(response=>{
						if(response.data.msg_code===100000){
							that.getGroupList(that.currentPage)
							this.$message({
								type: 'success',
								message: '设为默认成功'
							}); 
						}else{
							that.$alert(response.data.message,'提示',{
								confirmButtonText: '知道了',
								callback: action => {
									result.message
								}
							})
						}
					}).catch(error=>{
						console.log(error);
					})
				}).catch(() => {
                    this.$message({
						type: 'info',
						message: '已取消设为默认'
					}); 
                })
				
			},
            //删除
            deleteRolesItem(id){
				let that = this;
				let params={
					token:that.token,
					id:id,
					type:'supplier'
                };
                that.$confirm('是否确认删除？','提示',{
                    confirmButtonText: '确定',
					cancelButtonText: '取消',
					type:'warning'
                }).then(()=>{
					that.$api.bank_accountDelete_supplier(params).then(response=>{
						if(response.data.msg_code===100000){
							that.getGroupList(that.currentPage)
							this.$message({
								type: 'success',
								message: '删除成功'
							}); 
						}else{
							that.$alert(response.data.message,'提示',{
								confirmButtonText: '知道了',
								callback: action => {
									result.message
								}
							})
						}
					}).catch(error=>{
						console.log(error);
					})
				}).catch(error => {
                    this.$message({
						type: 'info',
						message: '已取消删除'
					}); 
                })
            },
            //列表分页
            current_change:function(currentPage){
                this.currentPage = currentPage;
                this.getGroupList(currentPage);
            },
        },
        mounted(){
            let that=this;
			that.token = this.$cookies.get('ZL_token');
            that.getGroupList(1)
        }
	}
</script>

<style lang="less" scoped>
	.roles-manage-wrapper{
		// background: #eee;
		//padding: 10px;
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
			//padding: 30px 20px;
			.payType{
				display: inline-block;
				font-size:7px;
				font-weight:400;
				color:rgba(51,51,51,1);
				width: 68px;
				margin-right: 10px;
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
					width: 86px;
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