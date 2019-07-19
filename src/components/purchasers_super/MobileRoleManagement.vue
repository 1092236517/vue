<template>
	<div class="roles-manage-wrapper">
		<h2 class="title">APP角色管理</h2>
		<div class="content">
			<div>
				<!-- <el-checkbox @change="selectAll(rolesManageList)">全选</el-checkbox> -->
				<button type="button" class="btn add-btn" @click="addRolesItem(-1)">新增</button>
				<!-- <button type="button" class="btn delete-btn">删除</button> -->
			</div>
			<div class="roles-table">
				<el-table
                    ref="multipleTable"
				  	:data="rolesManageList"
				  	stripe
                    @selection-change="handleSelectionChange"
				  	style="width: 100%">
				  		<!-- <el-table-column
				  	  		type="selection"
				  	  		width="80">
				  		</el-table-column> -->
				  		<el-table-column
				    		prop="roleName"
				    		label="角色名称">
				  		</el-table-column>
				  		<el-table-column
				   			prop="workGroup"
				    		label="所属组"
				    		>
				  		</el-table-column>
				  		<el-table-column
				    		prop="category"
				    		label="类别">
				  		</el-table-column>
						<el-table-column
				  			label="操作"
				  			width="270">
				  			<template slot-scope="scope">
				  				<button type="button" class="btn table-edit-btn" @click="addRolesItem(scope.row.id)">管理角色</button>
				  				<button type="button" class="btn table-edit-btn" @click="manageRoleUsers(scope.row.id)">管理用户</button>
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
				// pathUrl:'',
				// type:'',
                allChecked: true,
                total: 0,
                currentPage: 1,
				rolesManageList: [],
                selectedRolesItem: []
			}
		},
        methods: {
            //获取角色列表
            getRolesManageList(pageNum){
				let that=this;
				that.rolesManageList=[];
				let params={
					token:that.token,
                    current_page: pageNum,
        			per_page: 10,
				};
				that.$api.mobilebranchrolesList(params).then(response=>{
					if(response.data.msg_code===100000){
						that.total=response.data.response.total;
						that.rolesManageList=response.data.response.data.map((item)=>{
							let workGroup = "";
							if(item.get_joint_purchase_poser_group_role){
								workGroup = item.get_joint_purchase_poser_group_role.get_joint_purchase_power_group.name
							}else{
								workGroup = "--";
							}
							return{
								id:item.id,
								role_tag_id:item.role_tag_id,
								roleName:item.name,
								workGroup:workGroup,
								category: item.get_joint_purchase_power_role_tag && item.get_joint_purchase_power_role_tag.name
							}
						})
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
						callback: action => {}
					})
				})
            },
            //已选择列表
            handleSelectionChange(val){
                this.selectedRolesItem = val;
            },
            //全选
            selectAll(rows){
                if(rows){
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                }else{
                    this.$refs.multipleTable.clearSelection();
                }
            },
            //新增或者管理角色
            addRolesItem(id){
				this.$router.push({path: '/purchasers_super/MobileRolesAdd/'+id})
            },
            //删除
            deleteRolesItem(id){
				let that=this;
				let params={
					token:that.token,
					id:id
				}
				that.$api.branchrolesDelete(params).then(response=>{
					if(response.data.msg_code===100000){
						that.$alert('删除成功');
						that.getRolesManageList(that.currentPage)
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
						callback: action => {}
					})
				})
            },
            // //管理角色
            // manageRoles(){

            // },
            //管理角色下的用户
            manageRoleUsers(id){
				this.$router.push({path: '/purchasers_super/multiAccountEdit_super/'+id})
            },
            //列表分页
            current_change:function(currentPage){
				this.currentPage = currentPage;
				this.getRolesManageList(currentPage)
            },
		},
		mounted(){
			let that=this;
			that.token = this.$cookies.get('ZL_token');
			// if(that.$cookies.get('user_role')=='3'){
			// 	that.type = 'GROUP';
			// 	that.pathUrl = '/group_super'
			// }else if(that.$cookies.get('user_role')=='1'){
			// 	that.type = 'BRANCH';
			// 	that.pathUrl = '/purchasers_super'
			// }
			that.getRolesManageList(1)
		}
	}
</script>

<style lang="less" scoped>
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