<template>
   <div>
    	<div class="accountTitle">多账号设置</div>
    	<!--查询条件-->
	    <div class="selectCondition">
	    	<div class="inputArea">
	    		<div>账号：</div>
	    		<el-input placeholder="请输入账号" size="mini" v-model="userAccountValue"></el-input>
	    	</div>
	    	<div class="inputArea">
	    		<div>姓名：</div>
	    		<el-input placeholder="请输入姓名" size="mini" v-model="userNameValue"></el-input>
	    	</div>
	    	<div class="inputArea">
	    		<div>是否有效：</div>
	    		<el-select v-model="isWorkValue" placeholder="请选择" size="mini">
				    <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value" ></el-option>
			  	</el-select>
	    	</div>
	    	 <el-button type="primary" @click="selectList" :disabled="selectDisabled">查询</el-button>
	    	 <el-button @click="addUsers" v-show="addBtn">新建账号</el-button>
	    </div>
	    <!--查询结果列表-->
	    <div class="accountList">
	    	<el-table :data="tableData" border>
    			<el-table-column prop="idNum" label="序号"></el-table-column>
    			<el-table-column prop="userAccount" label="登录账号"></el-table-column>
    			<el-table-column prop="userName" label="姓名"></el-table-column>
    			<!-- <el-table-column prop="userGroup" label="部门"></el-table-column> -->
    			<el-table-column prop="isWork" label="是否有效"></el-table-column>
    			<el-table-column label="操作">
    				<template slot-scope="scope">
				        <el-button size="small" class="view" @click="accountAbleStatus(scope.row.accountId,scope.$index,scope.row.accountAbleData)">{{scope.row.accountAbleData ? '启用' : '禁用'}}</el-button>
				        <el-button size="small" class="edit" @click="editAccount(scope.row.accountId)" v-show="editBtn">编辑</el-button>
				    </template>
    			</el-table-column>
			</el-table>
			<div class="pageCont" v-if="accountTotal > 10">
				<el-pagination
				  	background
				  	layout="prev, pager, next"
				  	:total="accountTotal"
				  	:currentPage="accountCurPage"
				  	@current-change="goTo">
				</el-pagination>
			</div>
	    </div>
	    <!--新建窗口-->
	    <!-- <el-dialog title="新建账号" :visible.sync="newAccount" width="80%">
		  	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			  	<el-form-item label="登录账户" prop="ruleAccount" class="newFormInput">
			    	<el-input v-model="ruleForm.ruleAccount" placeholder="字母和数字的组合"></el-input>
			  	</el-form-item>
			  	<el-form-item label="姓名" prop="ruleName" class="newFormInput">
			    	<el-input v-model="ruleForm.ruleName" placeholder="请输入您的姓名"></el-input>
			  	</el-form-item>
			  	<el-form-item label="角色" prop="ruleType">
				    <el-select v-model="ruleForm.ruleType" placeholder="请选择角色名称">
				      	<el-option :label="item.name" :value="item.id"  v-for="item in userType" :key="item.name"></el-option>
				    </el-select>
				</el-form-item>
			  	<el-form-item label="职务" prop="ruleGroup" class="newFormInput">
			    	<el-input v-model="ruleForm.ruleGroup" placeholder="请输入您的职务"></el-input>
			  	</el-form-item>
			  	<el-form-item label="手机" prop="ruleTel" class="newFormInput">
			    	<el-input v-model="ruleForm.ruleTel" placeholder="手机号用于找回密码"></el-input>
			  	</el-form-item>
			  	<el-form-item label="密码" prop="rulePass" class="newFormInput">
			    	<el-input v-model="ruleForm.rulePass" placeholder="请输入登录密码"></el-input>
			  	</el-form-item>
  				<el-form-item label="是否有效" prop="resource">
				    <el-radio-group v-model="ruleForm.ruleWork">
				      	<el-radio label="是"></el-radio>
				      	<el-radio label="否"></el-radio>
				    </el-radio-group>
				</el-form-item>
    			<el-button type="primary" @click="submitForm('ruleForm')" class="newAccountDo">立即创建</el-button>
			</el-form>
		</el-dialog> -->
	    <!--编辑窗口-->
	    <!-- <el-dialog title="编辑账号" :visible.sync="editAccountData" width="80%">
		  	<el-form :model="editData"  label-width="100px" class="demo-ruleForm">
			  	<el-form-item label="登录账户" class="newFormInput">
			    	<el-input v-model="editData.editAccountTitle"></el-input>
			  	</el-form-item>
			  	<el-form-item label="姓名" class="newFormInput">
			    	<el-input v-model="editData.editAccountName"></el-input>
			  	</el-form-item>
			  	<el-form-item label="角色" prop="ruleType">
				    <el-select v-model="ruleForm.ruleType" placeholder="请选择角色名称">
				      	<el-option :label="item.name" :value="item.id"  v-for="item in userType" :key="item.name"></el-option>
				    </el-select>
				</el-form-item>
			  	<el-form-item label="职务" class="newFormInput">
			    	<el-input v-model="editData.editAccountGroup"></el-input>
			  	</el-form-item>
			  	<el-form-item label="手机" class="newFormInput">
			    	<el-input v-model="editData.editAccountTel"></el-input>
			  	</el-form-item>
			  	<el-form-item label="密码" class="newFormInput">
			    	<el-input v-model="editData.editAccountPass" placeholder="如不修改密码请留空"></el-input>
			  	</el-form-item>
    			<el-button type="primary" @click="submitEdit(editData)" class="newAccountDo">提交编辑</el-button>
			</el-form>
		</el-dialog> -->
	</div>
</template>

<script>
    export default {
    	data(){
    		return {
				token:'',
				role_id:'',
    			options: [
    				{
			          	value: '1',
			          	label: '有效'
			        },
    				{
			          	value: '2',
			          	label: '无效'
			        }
		        ],
		        userAccountValue: '',
		        userNameValue: '',
		        isWorkValue: '',
		        tableData: [],
		        selectDisabled: false,
		        // newAccount: false,
		        // editAccountData: false,
		        // editData: {
	    		// 	editAccountTitle: '',
	    		// 	editAccountName: '',
	    		// 	editAccountType: '',
	    		// 	editAccountGroup: '',
	    		// 	editAccountTel: '',
	    		// 	editAccountPass: ''
	    		// },
		        // ruleForm: {
		        //   	ruleAccount: '',
		        //   	ruleName: '',
		        //   	ruleType: '',
		        //   	ruleGroup: '',
		        //   	ruleTel: '',
		        //   	rulePass: '',
		        //   	ruleWork: '是'
		        // },
		        // rules: {
		        //   	ruleAccount: [
		        //     	{ required: true, message: '登录账户不能为空', trigger: 'blur' }
		        //   	],
		        //   	ruleName: [
		        //     	{ required: true, message: '姓名不能为空', trigger: 'blur' }
		        //   	],
		        //   	ruleType: [
		        //     	{ required: true, message: '请选择角色', trigger: 'blur' }
		        //   	],
		        //   	ruleTel: [
		        //     	{ required: true, message: '手机号不能为空', trigger: 'blur' },
		        //     	{ min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
		        //   	],
		        //   	rulePass: [
		        //     	{ required: true, message: '密码不能为空', trigger: 'blur' }
		        //   	],
		        // },
		        //userType: [],
		        accountTotal: 0,
		        accountCurPage: 1,
				url_prefix: '/api/frontend/joint_purchase/normal',
				//权限按钮
				addBtn:false,
				editBtn:false
    		}
    	},
        methods: {
			//权限按钮
            getAuthority(){
				let that=this;
                if(that.$store.getters.authForGroup.NormalBranchMultiAccount && that.$store.getters.authForGroup.NormalBranchMultiAccount.transfers.length > 0){
                    that.$store.getters.authForGroup.NormalBranchMultiAccount.transfers.map(item=>{
                        if(item.power_transfer_name.indexOf('新建账号')!=-1){
                            that.addBtn=true;
                        }else if(item.power_transfer_name.indexOf('编辑')!=-1){
							that.editBtn = true;
						}
                    });
                }
            },
			//新增
        	addUsers(){
        	    this.$router.push({path: '/userAdd'})
        	},
        	//载入账户列表
        	getList(options){
        		options.pageNum = options.pageNum || 1;
        		options.userAccountValue = options.userAccountValue || '';
        		options.userNameValue = options.userNameValue || '';
        		options.userWorkValue = options.userWorkValue || '';
        		let that = this;
        		that.selectDisabled = true;
        		that.tableData = [];
        		let params = {
					token: that.token,
					type:'BRANCH',
        			current_page: options.pageNum,
        			per_page: 10
        		}
				//let url = that.url_prefix + '/branch/child/account/list';
				//let url = that.url_prefix + '/power/branch/member/lists'
        		if(options.userAccountValue){
        			params.mobile = options.userAccountValue;
        		}
        		if(options.userNameValue){
        			params.contacter = options.userNameValue;
        		}
        		if(options.isWorkValue){
        			params.status = options.isWorkValue;
				}
				if(that.role_id){
					params.role_id=that.role_id;
				}
				that.$api.branchaccountList_normal(params).then(data => {
					if(data.data.msg_code === 100000){
						let response  = data.data.response;
						that.accountTotal = response.total;
						for(let i = 0;i < response.data.length; i++){
							let tableList = {};
							tableList.accountId = response.data[i].id;
							tableList.idNum = i+1;
							tableList.userAccount = response.data[i].user_name;
							tableList.userName = response.data[i].member_extend.contacter;
							tableList.userGroup = response.data[i].member_extend.role_name;
							response.data[i].user_base_status == 'VALID' ? tableList.isWork = '有效' : tableList.isWork = '无效';
							response.data[i].user_base_status == 'VALID' ? tableList.accountAbleData = false : tableList.accountAbleData = true;
							that.tableData.push(tableList);
						}
						that.selectDisabled = false;
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
        		// that.ZN_GET(url, params, function(data){
        		// 	let response  = data.response;
        		// 	that.accountTotal = response.total;
        		// 	for(let i = 0;i < response.data.length; i++){
        		// 		let tableList = {};
        		// 		tableList.accountId = response.data[i].id;
        		// 		tableList.idNum = i+1;
        		// 		tableList.userAccount = response.data[i].user_name;
        		// 		tableList.userName = response.data[i].member_extend.contacter;
        		// 		tableList.userGroup = response.data[i].member_extend.role_name;
        		// 		response.data[i].user_base_status == 'VALID' ? tableList.isWork = '有效' : tableList.isWork = '无效';
        		// 		response.data[i].user_base_status == 'VALID' ? tableList.accountAbleData = false : tableList.accountAbleData = true;
        		// 		that.tableData.push(tableList);
        		// 	}
        		// 	that.selectDisabled = false;
        		// })
        	},
        	//载入角色列表
        	// getType(){
        	// 	let that = this;
        	// 	let params = {
        	// 		token: that.token
        	// 	}
        	// 	that.$http.get('/api/frontend/member/roles',{params}).then(function(res){
        	// 		let typeList = res.data.response;
        	// 		for(let i=0;i<typeList.length;i++){
        	// 			let typeOnce = {};
        	// 			typeOnce.name = typeList[i].role_name;
        	// 			typeOnce.id = typeList[i].id;
        	// 			that.userType.push(typeOnce);
        	// 		}
        	// 	})
        	// },
        	//查询用户
        	selectList: function(){
        		let that = this;
        		let params = {};
        		if(that.userAccountValue){
        			params.userAccountValue = that.userAccountValue;
        		}
        		if(that.userNameValue){
        			params.userNameValue = that.userNameValue;
        		}
        		if(that.isWorkValue){
        			if(that.isWorkValue == '1'){
        				params.isWorkValue = 'VALID';
        			}else{
        				params.isWorkValue = 'NOTVALID';
        			}

        		}
        		that.getList(params);
        	},
        	//确认创建
        	// submitForm(formName) {
        	// 	let that = this;
        	// 	let user_base_status;
        	// 	let url = that.url_prefix + '/branch/child/account/add';
		    //     that.$refs[formName].validate((valid) => {
			//         if (valid) {
			//             //通过验证
			//             if(that.ruleForm.ruleWork == '是'){
			//             	user_base_status = 'VALID';
			//             }else{
			//             	user_base_status = 'NOTVALID';
			//             }
			//             let params = {
			//             	token: that.token,
			//             	user_name: that.ruleForm.ruleAccount,
			//             	contacter: that.ruleForm.ruleName,
			//             	role_id: that.ruleForm.ruleType,
			//             	position: that.ruleForm.ruleGroup,
			//             	mobile: that.ruleForm.ruleTel,
			//             	password: that.ruleForm.rulePass,
			//             	user_base_status: user_base_status
			//             }
			//             that.ZN_POST(url, params, function(data){
			//             	that.newAccount = false;
			//             	that.getList({});
			//             })
			//         }else{
			//         	//不通过验证
			//             return false;
			//         }
		    //     });
		    // },
		    //编辑账户
		    editAccount: function(id){
		    	// let that = this;
		    	// let ids = id;
		    	// let params = {
		    	// 	token: that.token,
		    	// 	id: ids
		    	// }
		    	// let url = that.url_prefix + '/branch/child/account/detail';
		    	// that.editAccountData = true;
		    	// that.ZN_GET(url, params, function(data){
		    	// 	that.editData.editAccountTitle = data.response.user_name;
		    	// 	that.editData.editAccountName = data.response.member_extend.contacter;
		    	// 	that.editData.editAccountGroup = data.response.member_extend.position;
		    	// 	that.editData.editAccountTel = data.response.mobile;
		    	// 	that.editData.id = ids;
		    	// 	that.editData.editAccountType = data.response.member_extend.service_role_id;
				// })
				this.$router.push({path: '/userEdit/' + id})
		    },
		    //提交编辑函数
		    // submitEdit: function(){
		    // 	let that = this;
		    // 	let url = that.url_prefix + '/branch/child/account/update';
		    // 	let params = {
		    // 		token: that.token,
		    // 		id: that.editData.id,
		    // 		user_name: that.editData.editAccountTitle,
		    // 		contacter: that.editData.editAccountName,
		    // 		role_id: that.editData.editAccountType,
		    // 		position: that.editData.editAccountGroup,
		    // 		mobile: that.editData.editAccountTel,
		    // 		password: that.editData.editAccountPass
		    // 	}
		    // 	that.ZN_POST(url, params, function(data){
		    // 		that.editAccountData = false;
		    // 		that.getList({});
		    // 	})
		    // },
		    //账户禁用/启用
		    accountAbleStatus(ids, index, status){
		    	let that = this;
		    	let url = that.url_prefix + '/branch/child/account/change/status';
		    	let params = {
		    		token: that.token,
		    		id: ids
		    	};
		    	//status当前禁用状态
		    	if(status){
		    		params.status = 'VALID';
		    	}else{
		    		params.status = 'NOTVALID';
		    	}
		    	that.ZN_POST(url, params, function(data){
		    		if(data.response.status == 'VALID'){
		    			that.tableData[index].accountAbleData = false;
		    			that.tableData[index].isWork = '有效';
		    		}else{
		    			that.tableData[index].accountAbleData = true;
		    			that.tableData[index].isWork = '无效';
		    		}
		    	})
		    },
		    //账户翻页
		    goTo(currentPage){
		    	this.accountCurPage = currentPage;
		    	this.getList({pageNum: this.accountCurPage});
		    }
        },
        created(){
			this.token = this.$cookies.get("ZL_token");
			if(this.$route.params.id){
				this.role_id=this.$route.params.id;
			}
        	this.getList({});
			//this.getType();
			this.getAuthority();
        }
    }
</script>
<style lang="less" scoped>
	/*标题*/
	.accountTitle{
		font-size: 20px;
		font-weight: bold;
	}
	.selectCondition{
		display: flex;
		margin-top: 20px;
	}
	.inputArea{
		display: flex;
		margin-right: 30px;
	}
	.inputArea div:first-child{
		width: 6rem;
		line-height: 25px;
	}
	.el-input{
		display: inline;
		height: 30px;
		left: -15px;
	}
	.selectCondition button{
		padding: 5px 0;
		text-align: center;
		width: 100px;
	}
	.accountList{
		width: 100%;
		margin-top: 30px;
	}
	.accountList table{
		width: 100%;
	}
	.accountList button{
		color: #FFFFFF;
		border: none;
	}
	.accountList .view{
		background: #0576db;
	}
	.accountList .edit{
		background: #f7532d;
	}
	.newFormInput{
		width: 400px;
	}
	.newFormInput div{
		margin-left: 20px;
	}
	.newAccountDo{
		margin-left: 100px;
	}
</style>