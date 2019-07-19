<template>
	<div class="user-add-wrapper">
		<h2 class="title">管理员管理</h2>
		<div class="content">
			<el-form ref="userForm"
				:model="userForm"
				:rules="rules"
				label-width="80px"
				class="user-form">
                <el-form-item label="管理组">
                    <el-tag
                        v-for="(group,index) in userWorkGroups"
                        :key="group.name"
                        closable
                        class="group-tag"
                        @close="deleteUserWorkGroup(index)">
                        {{ group.name }}
                    </el-tag>
                    <button type="button" class="btn add-group-btn" @click="openGroupsWindow">添加</button>
                </el-form-item>
				<el-form-item label="管理角色">
					<el-tag
					  	v-for="(role,index) in userRoles"
					  	:key="role.name"
					  	closable
					  	class="role-tag"
					  	@close="deleteUserRole(index)">
					  	{{ role.name }}
					</el-tag>
					<button type="button" class="btn add-role-btn" @click="openRolesWindow">添加</button>
				</el-form-item>
			  	<el-form-item label="是否启用">
			    	<el-switch v-model="userForm.isActive"></el-switch>
			  	</el-form-item>
			  	<el-form-item label="用户名" prop="account">
			    	<el-input v-model="userForm.account"></el-input>
			  	</el-form-item>
			  	<el-form-item label="登录密码" prop="password">
			    	<el-input v-model="userForm.password"></el-input>
			  	</el-form-item>
			  	<el-form-item label="头像"  >
			  	    <el-upload
			  	        :action="this.$api.upload_file_url"
			  	        :data="{column:'joint_purchase',category:'publish_demand'}"
			  	        :on-success="handleFileChange"
			  	        :on-progress="handleProgress"
			  	        :file-list="fileList"
			  	        :limit="1"
			  	        :on-exceed="handleExceed"
			  	        :show-file-list="false">
			  	        <el-button size="small" type="primary" >点击上传</el-button>
			  	    </el-upload>
			  	    <!-- 进度条 -->
			  	    <div v-if="uploadProgressVisible" style="width: 50%">
			  	        <el-progress :percentage="uploadPercentage"></el-progress>
			  	    </div>
			  	    <!-- 附件列表 -->
			  	    <attachmentList
			  	        :attachmentList="fileList"
			  	        @delete-attachment="deleteAttachment">
			  	    </attachmentList>
			  	</el-form-item>
			  	<el-form-item label="姓名" prop="username">
			    	<el-input v-model="userForm.username"></el-input>
			  	</el-form-item>
			  		<el-form-item label="职位" prop="position">
			  	  	<el-input v-model="userForm.position"></el-input>
			  		</el-form-item>
			  	<el-form-item label="电话" prop="mobile">
			    	<el-input v-model="userForm.mobile"></el-input>
			  	</el-form-item>
			  	<el-form-item label="邮箱">
			    	<el-input v-model="userForm.email"></el-input>
			  	</el-form-item>
			  	<el-form-item>
			    	<el-button type="primary" @click="submit()">确定</el-button>
			  	</el-form-item>
			</el-form>
		</div>

        <!-- 组列表弹框 -->
        <el-dialog title="添加管理组" center :visible.sync="workGroupsWindowVisible">
            <div class="groupsList-wrapper">
                <el-form :inline="true" :model="searchGroupsForm" class="demo-form-inline">
                    <el-form-item label="组名">
                        <el-input
                            v-model="searchGroupsForm.content"
                             prefix-icon="el-icon-search"
                            placeholder="请输入组名">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getGroups(1)">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table ref="multipleTable" :data="groupsList" @selection-change="handleGroupChange" stripe style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="组名">
                    </el-table-column>
                    <el-table-column type="selection"></el-table-column>
                </el-table>
                <div class="pagination-wrapper" v-if="workGroupsTotal > 0">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="workGroupsTotal"
                        :currentPage="workGroupsCurrentPage"
                        @current-change="group_current_change">
                    </el-pagination>
                </div>
                <div class="btns-div">
                    <button type="button" class="btn cancel-btn" @click="workGroupsWindowVisible=false">取消</button>
                    <button type="button" class="btn confirm-btn" @click="groupsSure">确定</button>
                </div>
            </div>
        </el-dialog>

		<!-- 角色列表弹框 -->
		<el-dialog title="添加管理角色" center :visible.sync="rolesListWindowVisible">
			<div class="rolesList-wrapper">
				<!-- <el-form :inline="true" :model="searchRolesForm" class="demo-form-inline">
				  	<el-form-item label="角色名">
				   		<el-input 
				   			v-model="searchRolesForm.content"
				   			 prefix-icon="el-icon-search" 
				   			placeholder="请输入角色名">
				   		</el-input>
				  	</el-form-item>
				  	<el-form-item>
				    	<el-button type="primary" @click="getRoles(1)">查询</el-button>
				  	</el-form-item>
				</el-form> -->
				<el-table ref="multipleTable" :data="rolesList" stripe @selection-change="handleRoleChange" style="width: 100%">
				  	<el-table-column
				    	prop="name"
				    	label="角色名">
				  	</el-table-column>
				  	<el-table-column type="selection"></el-table-column>
				</el-table>
				<div class="pagination-wrapper" v-if="rolesTotal > 0">
				    <el-pagination
				        background
				        layout="prev, pager, next"
				        :total="rolesTotal"
				        :currentPage="rolesCurrentPage"
				        @current-change="current_change">
				    </el-pagination>
				</div>
				<div class="btns-div">
					<button type="button" class="btn cancel-btn" @click="rolesListWindowVisible=false"> 取消</button>
					<button type="button" class="btn confirm-btn" @click="rolesSure">确定</button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import attachmentList from '../public/attachmentList'
	export default {
        name: 'userAdd',
        components: {
        	attachmentList
        },
		data(){
			return{
				token: '',
				user_id: '',
				isEdit: false,
				userForm: {
					account: '',
					username: '',
					mobile: '',
					email: '',
					position: '',
					password: '',
					isActive:true
				},
				rules: {
				  	account: [
				    	{ required: true, message: '登录账户不能为空', trigger: 'blur' }
				  	],
				  	username: [
				    	{ required: true, message: '姓名不能为空', trigger: 'blur' }
				  	],
				  	mobile: [
				    	{ required: true, message: '手机号不能为空', trigger: 'blur' },
				    	{ min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
				  	],
				  	position: [
				  		{required: true, message: '请填写职位信息', trigger: 'blur'}
				  	],
				  	password: [
				    	{ required: this.isRequired, message: '密码不能为空', trigger: 'blur' }
				  	]
				},
				rolesList: [],
                groupsList: [],
				uploadProgressVisible: false,
				fileList: [],
				attachments: [],
                //角色列表
				userRoles: [],
				rolesListWindowVisible: false,
				searchRolesForm: {
					content: ''
				},
				rolesTotal: 0,
				rolesCurrentPage: 1,
                //组列表
                userWorkGroups: [],
                workGroupsWindowVisible: false,
                searchGroupsForm: {
                    content: ''
                },
                workGroupsTotal: 0,
                workGroupsCurrentPage: 1
			}
		},
		computed: {
			isRequired(){ //是否需要验证
				return !this.isEdit
			}
		},
		created(){
			this.token = this.$cookies.get('ZL_token');
			this.user_id = this.$route.params.id;
			this.isEdit = this.user_id ? true : false;
			if(this.isEdit){
				this.getAccountInfo(this.user_id);
			}
		},
        methods: {
        	//获取角色列表
        	getRoles(page){
        		let that = this;
        		let params;
        		that.rolesList = [];
        		that.rolesCurrentPage = page || that.rolesCurrentPage;
        		params = {
        			token: that.token,
        			current_page: that.rolesCurrentPage,
        			per_page: 10,
				}
				if(that.searchRolesForm.content){
					params.name=that.searchRolesForm.content;
				}
        		that.$api.roles_normal(params)
        			.then(response => {
        				let result = response.data;
        				if(result.msg_code == 100000){
        					result.response.forEach(function(element, index){
        						let item = {
        							name: element.name,
        							id: element.id,
        							// created_time: element.created_at,
        							// label: element.name
        						}
        						that.rolesList.push(item);
        					});
        				}else{
							that.$alert(result.message,'提示',{
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
				// that.$api.rolesList(params).then(response=>{
				// 	if(response.data.msg_code===100000){
				// 		that.rolesTotal=response.data.response.total;
				// 		that.rolesList=response.data.response.data.map((item)=>{
				// 			return{
				// 				id:item.id,
				// 				name:item.name,
				// 			}
				// 		})
				// 	}	
				// }).catch(error => {
				// 	that.$alert(error,'提示',{
				// 		confirmButtonText: '知道了',
				// 		callback: action => {}
				// 	})
				// })
			},
			 //选中的角色
			handleRoleChange(val){
				this.workrolesSelect=val;
			},
			//角色弹窗确定
			rolesSure(){
				let that=this;
				// if(that.isEdit){
				// 	let params={
				// 		token:that.token,

				// 	}
				// }else{
					that.rolesListWindowVisible = false;
					that.userRoles.push(...that.workrolesSelect);
					that.DuplicateRemove(that.userRoles)
				//}
			},
            //获取组列表
            getGroups(page){
				let that=this;
				let params={
					token:that.token,
					current_page: page,
					per_page: 10,
				}
				if(that.searchGroupsForm.content){
					params.contacter=that.searchGroupsForm.content;
				}
				// that.$api.groupList(params).then(response=>{
				// 	if(response.data.msg_code===100000){
				// 		that.workGroupsTotal=response.data.response.total;
				// 		that.groupsList=response.data.response.data.map(item=>{
				// 			return{
				// 				name:item.name,
				// 				id:item.id,
				// 			}
				// 		})
				// 	}
				// }).catch(error => {
				// 	that.$alert(error,'提示',{
				// 		confirmButtonText: '知道了',
				// 		callback: action => {
				// 			//todo
				// 		}
				// 	})
				// })
				that.$api.groups_normal(params).then(response=>{
					if(response.data.msg_code===100000){
						//that.workGroupsTotal=response.data.response.total;
						that.groupsList=response.data.response.map(item=>{
							return{
								name:item.name,
								id:item.id,
							}
						})
					}else{
						that.$alert(response.data.message,'提示',{
							confirmButtonText: '知道了',
							callback: action => {
								//todo
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
			//组成员勾选
			handleGroupChange(val){
				this.workgroupsSelect=val;
			},
			//组弹窗确定
			groupsSure(){
				let that=this;
				this.workGroupsWindowVisible = false;
				this.userWorkGroups.push(...this.workgroupsSelect)
				that.DuplicateRemove(this.userWorkGroups);
			},
        	//提交用户信息
        	submit(){
                if(this.isEdit){
                    this.accountEdit('userForm');
                }else{
                    this.accountAdd('userForm');
                }
        	},
        	//新建用户
        	accountAdd(formName){
				let that = this;
				let photoUrl = "";
				if(that.attachments.length>0){
					photoUrl = that.attachments[0].path;
				}
        		let params = {
					token: that.token,
					groups:JSON.stringify(that.userWorkGroups.map(item=>{
						return{
							power_group_id:item.id,
						}
					})),
					roles:JSON.stringify(that.userRoles.map(item=>{
						return{
							role_id:item.id,
						}
					})),
					user_base_status: that.userForm.isActive ? "VALID" : "NOTVALID",
        			user_name: that.userForm.account,
        			contacter: that.userForm.username,
        			photo: photoUrl,
        			mobile: that.userForm.mobile,
        			password: that.userForm.password,
					position: that.userForm.position,
					email:that.userForm.email
				}
				if(that.attachments.length>0){
					params.photo = that.attachments[0].path;
				}else{
					params.photo = '';
				}
        		that.$refs[formName].validate(valid => {
        			if(valid){
        				that.$api.userAdd_normal(params).then(response => {
							let result = response.data;
							if(result.msg_code == 100000){
								that.$message({
									message: '创建成功',
									type: 'success'
								});
								that.$router.push({path: '/group/multiAccount'})
							}else{
								that.$alert(response.data.message,'提示',{
									confirmButtonText: '知道了',
									callback: action => {
									}
								})
							}
						}).catch(error => {
								that.$alert(error,'提示',{
									confirmButtonText: '知道了',
									callback: action => {
									}
								})
							})
        			}else{
        				that.$message({
        					message: '请填写必填项',
        					type: 'warning'
        				});
        				return false
        			}
        		})
        	},
        	//编辑用户
        	accountEdit(formName){
				let that = this;
				let photoUrl = "";
				if(that.attachments.length>0){
					photoUrl = that.attachments[0].path;
				}
                let params = {
                    token: that.token,
                    id: that.user_id,
                    user_name: that.userForm.account,
                    contacter: that.userForm.username,
                    // role_id: that.userForm.roles,
                    mobile: that.userForm.mobile,
                    password: that.userForm.password,
					position: that.userForm.position,
					email:that.userForm.email,
					photo:photoUrl,
					user_base_status:that.userForm.isActive?"VALID":"NOTVALID",
					groupIds:JSON.stringify(that.userWorkGroups.map(item=>{
						return item.id
					})),
					roleIds:JSON.stringify(that.userRoles.map(item=>{
						return item.id;
					})),
					hidden_roleIds:JSON.stringify(that.hiddenRoleIds),
					hidden_groupIds:JSON.stringify(that.hiddenGroupIds)
                }
                that.$refs[formName].validate(valid => {
                    if(valid){
                        that.$api.userUpdate_normal(params, that.token)
                            .then(response => {
                                let result = response.data;
                                if(result.msg_code == 100000){
                                    that.$message({
                                        message: '编辑成功',
                                        type: 'success'
									});
									that.$router.push({path: '/group/multiAccount'})
                                }else{
                                    that.$alert(response.data.message,'提示',{
										confirmButtonText: '知道了',
										callback: action => {
											//todo
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
                    }else{
                        that.$message({
                            message: '请填写必填项',
                            type: 'warning'
                        });
                        return false
                    }
                })        		
        	},
        	//获取账户详情
        	getAccountInfo(id){
        		let that = this;
        		let params = {
        			token: that.token,
        			user_id: id
        		};
        		that.$api.accountInfo_normal(params)
        			.then(response => {
						let result = response.data;
        				if(result.msg_code == 100000){
        					that.userForm.account = result.response.userInfo.user_name;
        					that.userForm.username = result.response.userInfo.member_extend.contacter;
        					that.userForm.mobile = result.response.userInfo.mobile;
        					that.userForm.roles = result.response.userInfo.member_extend.service_role_id;
							that.userForm.position = result.response.userInfo.member_extend.position;
							that.userForm.email = result.response.userInfo.member_extend.email;
							//that.userForm.password = result.response.userInfo.password;
							that.userForm.isActive = result.response.userInfo.user_base_status == "VALID" ? true:false;
							that.userForm.password = '';
							if(result.response.userInfo.member_extend.photo){
								that.fileList=[{
									url:result.response.userInfo.member_extend.photo,
									name:'头像',
									isImg:true,
								}];
								that.attachments=[{
									name:'头像',
									path:result.response.userInfo.member_extend.photo,
								}]
							}
							
							that.userWorkGroups=result.response.groups;
							that.hiddenGroupIds=JSON.parse(result.response.hiddenGroupIds);
							that.userRoles=result.response.roles;
							that.hiddenRoleIds=JSON.parse(result.response.hiddenRoleIds);
        				}else{
        					that.$alert(result.message,'提示',{
        						confirmButtonText: '知道了',
        						callback: action =>{
        							//todo
        						}
        					})
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
            //打开组列表弹框
            openGroupsWindow(){
				this.workGroupsWindowVisible = true;
				this.searchGroupsForm={
					content:''
				}
				this.getGroups(1);
            },
            //删除当前用户组
            deleteUserWorkGroup(index){
                this.userWorkGroups.splice(index, 1);
            },
        	//打开角色列表弹框
        	openRolesWindow(){
				this.rolesListWindowVisible = true;
				this.searchRolesForm= {
					content: ''
				},
				this.getRoles(1);
        	},
        	//删除当前用户角色
        	deleteUserRole(index){
        		this.userRoles.splice(index, 1);
        	},
        	//上传进度
        	handleProgress(event, file, fileList){
        	    this.uploadProgressVisible = true;
        	    this.uploadPercentage = event.percent;
        	    if(event.percent == 100){
        	        this.uploadProgressVisible = false;
        	        this.uploadPercentage = 0;
        	    }
        	},
        	//上传成功
        	handleFileChange(response, file, fileList){
        	    this.attachments.push({
        	        path:response.response.newFileName,
        	        original_name:response.response.originalFileName
        	    });
        	    this.fileList = fileList.map(item => { //附件列表展示
        	        item.id = item.uid;
        	        if(item.raw.type.indexOf('image') == -1){
        	            item.isImg = false;
        	        }else{
        	            item.isImg = true;
        	        }
        	        return item
        	    });
        	},
        	//自定义附件列表-删除附件
        	deleteAttachment(index){
        	    this.fileList.splice(index,1);
        	    this.attachments = this.fileList.map((item)=>{ //更新提交时的附件列表
        	    	let attachment = new Object();
        	    	attachment.path = item.response.response.newFileName;
        	    	attachment.original_name = item.response.response.originalFileName;
        	    	return attachment
        	    })
        	},
        	//上传超过限制个数
        	handleExceed(files,fileList){
        		this.$message({
        			message: '只能上传一张！',
        			type: 'warning'
        		})
        	},
        	//角色列表翻页
        	current_change(currentPage){
        		this.rolesCurrentPage = currentPage;
        		this.getRoles(currentPage);
        	},
            //组列表翻页
            group_current_change(currentPage){
				this.workGroupsCurrentPage = currentPage;
				this.getGroups(1);
            }
        }
	}
</script>

<style lang="less" scoped>
	.user-add-wrapper{
		background: #eee;
		padding: 10px;
		.btn{
			outline: none;
			border: 0;
			margin: 0;
			padding: 0;
			background: none;
			cursor: pointer;
		}
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
			.user-form{
				width: 400px;
			}
			.role-tag,.group-tag{
				margin-right: 10px;
			}
			.add-role-btn,.add-group-btn{
				width: 68px;
				height: 30px;
				color: #2793F4;
				font-size: 12px;
				border: 1px solid #2793F4;
				border-radius: 4px;
			}
		}
		//弹框样式
		.rolesList-wrapper,.groupsList-wrapper{
			width: 100%;
		}
		.pagination-wrapper{
			margin-top: 20px;
			text-align: center;
		}
		.btns-div{
			text-align: center;
			margin-top: 20px;
		}
		.confirm-btn{
			width: 68px;
			height: 30px;
			background-color: #2793F4;
			font-size: 12px;
			color: #fff;
			border-radius: 4px;
		}
		.cancel-btn{
			width: 68px;
			height: 30px;
			font-size: 12px;
			color: #2793F4;
			border: 1px solid #2793F4;
			border-radius: 4px;
			margin-right: 20px;
		}
	}
</style>