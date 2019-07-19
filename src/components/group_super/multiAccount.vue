<template>
	<div class="users-list-wrapper">
		<h2 class="title">多账号设置</h2>
		<div class="content">
			<!-- <div>
				<el-checkbox @change="selectAll(rolesList)">全选</el-checkbox>
				<button type="button" class="btn add-btn" @click="addUsers">新增</button>
				<button type="button" class="btn delete-btn">删除</button>
			</div> -->
			<el-form :inline="true" :model="searchCondition" class="search-wrapper">
			  	<el-form-item label="用户名：">
			    	<el-input v-model="searchCondition.account" placeholder="请输入用户名"></el-input>
			  	</el-form-item>
			  	<el-form-item label="姓名：">
			    	<el-input v-model="searchCondition.username" placeholder="请输入姓名"></el-input>
			  	</el-form-item>
			  	<el-form-item label="是否有效">
			    	<el-select v-model="searchCondition.isActive" placeholder="请选择状态">
			    		<el-option label="全部" value=""></el-option>
			      		<el-option label="有效" value="active"></el-option>
			      		<el-option label="无效" value="forbiden"></el-option>
			    	</el-select>
			  	</el-form-item>
			  	<el-form-item>
			    	<el-button type="primary" @click="search">查询</el-button>
			  	</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addUsers" v-show="addBtn">新增</el-button>
				</el-form-item>
			</el-form>
			<div class="users-table">
				<el-table
                    ref="multipleTable"
				  	:data="rolesList"
				  	stripe
                    @selection-change="handleSelectionChange"
				  	style="width: 100%">
				  		<!-- <el-table-column
				  	  		type="selection"
				  	  		width="55">
				  		</el-table-column> -->
				  		<el-table-column
				    		prop="account"
				    		label="用户名"
				    		width="180">
				  		</el-table-column>
				  		<el-table-column
				   			prop="username"
				    		label="姓名"
				    		width="180">
				  		</el-table-column>
				  		<el-table-column
				    		prop="role"
				    		label="角色">
				  		</el-table-column>
						<el-table-column
				    		prop="mobile"
				    		label="电话">
				  		</el-table-column>
						<el-table-column
				  			label="添加时间">
				  			<template slot-scope="scope">
				  				<span>{{ scope.row.created_time | formatDate }}</span>
				  			</template>
						</el-table-column>
						<el-table-column
				  			label="状态">
                            <template slot-scope="scope">
                                <span :class="showStatus(scope.row.status)">{{ scope.row.status }}</span>
                            </template>
						</el-table-column>
						<el-table-column
				  			label="操作"
				  			width="180">
				  			<template slot-scope="scope">
				  				<button type="button" v-show="editBtn" class="btn table-edit-btn" @click="editUser(scope.row.id)">修改</button>
				  				<button type="button" v-show="deleteBtn" class="btn table-del-btn">删除</button>
								<div v-show="noneBtn">--</div>
				  			</template>
						</el-table-column>
				</el-table>
			</div>
			<div class="pagination-wrapper" v-if="total > 0">
			    <el-pagination 
			        background 
			        layout="prev, pager, next" 
			        :total="total" 
			        :currentPage="currentPage"  
			        @current-change="current_change">
			    </el-pagination>
			</div>
		</div>
	</div>

</template>

<script>
    export default {
    	name: 'multiAccount',
    	data(){
    		return {
				token: '',
				role_id:'',
    			total: 0,
    			currentPage: 1,
    			searchCondition: {
    				account: '',
    				username: '',
    				isActive: ''
    			},
				rolesList: [
					{
						account: 'admin',
						username: '筑牛科技',
						role: 'super-admin',
						mobile: 13819192345,
						created_time: '2018/08/20',
						status: 'active'
					},
					{
						account: 'group-test',
						username: '集团账户',
						role: 'group-admin',
						mobile: 18812345678,
						created_time: '2018/08/20',
						status: 'forbiden'
					}
				],
				selectedRolesItem: [],
				//权限按钮
				addBtn:false,
				editBtn:false,
				deleteBtn:false,
				noneBtn:false,
    		}
    	},
    	watch: {
    		'$route'(to, from){ //检测路由变化
    			this.role_id = this.$route.params.id ? this.$route.params.id : '';
    			this.getUsersList();
    		}
    	},
    	created(){
    		this.token = this.$cookies.get('ZL_token');
			if(this.$route.params.id){
				this.role_id=this.$route.params.id;
			}
			this.getUsersList();
		},
		mounted(){
			this.getAuthority();
		},
        methods: {
			//权限按钮
            getAuthority(){
				let that=this;
                if(that.$store.getters.authForGroup.MultipleAccountSettings.transfers.length!=0){
                    that.$store.getters.authForGroup.MultipleAccountSettings.transfers.map(item=>{
                        if(item.power_transfer_name.indexOf('编辑')!=-1){
                            that.editBtn=true;
                        }else if(item.power_transfer_name.indexOf('删除')!=-1){
                            that.deleteBtn=true;
                        }else if(item.power_transfer_name.indexOf('新建')!=-1){
							that.addBtn = true;
						}
                    });
                }else{
                    that.noneBtn=true;
                }
            },
        	//获取用户列表
        	getUsersList(page){
        		let that = this;
        		let params;
        		that.rolesList = [];
        		that.currentPage = page || that.currentPage;
        		params = {
        			token: that.token,
        			current_page: that.currentPage,
        			per_page: 10,
        			user_name: that.searchCondition.account,
        			contacter: that.searchCondition.username,
					status: that.searchCondition.isActive,
					role_id:that.role_id,
        		}
        		that.$api.usersListNew(params)
        			.then(response => {
        				if(response.data.msg_code == 100000){
        					let result = response.data.response;
        					that.total = result.total;
        					result.data.forEach(function(element, index){
        						let item = {
        							id: element.id,
        							index: index,
        							account: element.user_name,
									//account:'nnnn',
        							username: element.member_extend.contacter,
        							role: element.get_user_roles.map(item=>{
										if(item.get_role){
											return item.get_role.name;
										}else{
											return '--'
										}
									}),
        							mobile: element.mobile,
        							created_time: element.create_time
        						};
        						that.rolesList.push(item);
        					});
        				}
        			}).catch(error => {
    						console.log(error);
    						that.$alert(error,'提示',{
    							confirmButtonText: '知道了',
    							callback: action => {
    								//todo
    							}
    						})
    				})
        	},
        	//查询用户
        	search(){
        		this.getUsersList(1);
        	},
        	//展示不同状态的颜色
        	showStatus(status){
        	    let statusStyle = {
        	        success: false,
        	        error: false,
        	        active: false,
        	        forbiden: false
        	    }
        	    switch (status) {
        	        case 'success':
        	            statusStyle.success = true;
        	            break;
        	        case 'error':
        	            statusStyle.error = true;
        	            break;
        	        case 'active':
        	            statusStyle.active = true;
        	            break;
        	        case 'forbiden':
        	            statusStyle.forbiden = true;
        	            break;
        	        default:
        	            //todo
        	            break;
        	    }
        	    return statusStyle
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
        	//新增
        	addUsers(){
        	    this.$router.push({path: '/group_super/userAdd'})
        	},
        	//删除
        	deleteRolesItem(){

        	},
        	//编辑
        	editUser(id){
        		this.$router.push({path: '/group_super/userEdit/' + id})
        	},
		    //账户禁用/启用
		    accountAbleStatus: function(ids,index){
		    	let that = this;
		    	that.$http.post('/api/frontend/member/account/status/del',{
		    		token: that.token,
		    		id: ids
		    	}).then(function(res){
		    		let stat = res.data.response.status;
		    		if(stat){
			    		that.tableData[index].accountAbleData = false;
			    		that.tableData[index].isWork = '有效';
		    		}else{
			    		that.tableData[index].accountAbleData = true;
			    		that.tableData[index].isWork = '无效';
		    		}
		    	})
		    },
		    //账户翻页
		    current_change(currentPage){
		    	this.currentPage = currentPage;
		    	this.getUsersList();
		    }
       	}
    }
</script>
<style lang="less" scoped>
	.users-list-wrapper{
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
			padding: 30px 20px 60px;
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
				margin-left: 30px;
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
			.search-wrapper{
				display: flex;
				margin-top: 20px;
			}
			.users-table{
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
                .success{
                    color: #1DCD67;
                }
                .error{
                    color: #FF4B4B;
                }
                .active{
                    color: #2793F4;
                }
                .forbiden{
                    color: #E8E8E8;
                }
			}
			.pagination-wrapper{
				margin-top: 30px;
				text-align: center;
			}
		}
	}
</style>