<template>
	<div class="manage-log-wrapper">
		<h2 class="title">管理日志</h2>
		<div class="content">
			<div>
				<el-form :inline="true" :model="searchForm">
				  	<el-form-item class="form-item">
				  		<el-date-picker
				  		  	v-model="searchForm.startTime"
				  		  	type="date"
				  		  	placeholder="选择起始日期">
				  		</el-date-picker>
				  		<span>-</span>
				  		<el-date-picker
				  		  	v-model="searchForm.endTime"
				  		  	type="date"
				  		  	placeholder="选择截止日期">
				  		</el-date-picker>
				  	</el-form-item>
				  	<el-form-item class="form-item">
				  	  	<el-input
				  	  	  	placeholder="请输入内容"
				  	  	  	prefix-icon="el-icon-search"
				  	  	  	v-model="searchForm.content">
				  	  	</el-input>
				  	</el-form-item>
				  	<el-form-item class="form-item">
				    	<button type="button" class="btn search-btn" @click="getManageLogList(1)">查询</button>
				  	</el-form-item>
				</el-form>
			</div>
			<div class="log-table">
				<el-table
                    ref="multipleTable"
				  	:data="manageLogList"
				  	stripe
				  	style="width: 100%">
				  		<el-table-column
				    		prop="account"
				    		label="用户名"
				    		>
				  		</el-table-column>
				  		<el-table-column
				   			prop="operationType"
				    		label="操作类型"
				    		>
				  		</el-table-column>
				  		<el-table-column
				    		prop="remark"
				    		label="备注">
				  		</el-table-column>
				  		<el-table-column
				  		  	prop="IP"
				  		  	label="用户IP">
				  		</el-table-column>
				  		<el-table-column
				  		  	prop="createdTime"
				  		  	label="添加时间">
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
        name: 'manageLog',
		data(){
			return{
				token:'',
				// type:'',
				// pathUrl:'',
                allChecked: true,
                total: 0,
                currentPage: 1,
                searchForm: {
                	startTime: '',
                	endTime: ''
                },
                manageLogList: [
                	{
                		account: '李会计',
                		operationType: 'login',
                		remark: '用户登录',
                		IP: '127.0.0.1',
                		createdTime: '2018-8-15 14:37'
                	},
                	{
                		account: '张经理',
                		operationType: 'login',
                		remark: '用户登录',
                		IP: '127.0.0.1',
                		createdTime: '2018-8-15 14:37'
                	}
                ]
			}
		},
		created(){
			let that=this;
			that.token = this.$cookies.get('ZL_token');
			this.getManageLogList(1)
		},
        methods: {
            //获取管理日志列表
            getManageLogList(pageNum){
				let that=this;
				that.manageLogList=[];
				let params={
					token:that.token,
                    current_page: pageNum,
        			//per_page: 10,
				};
				if(that.searchForm.startTime){
					params.start_time=that.searchForm.startTime;
				}
				if(that.searchForm.endTime){
					params.end_time = that.searchForm.endTime;
				}
				that.$api.manageLog(params).then(response=>{
					console.log(response);
				})
            },
            //列表分页
            current_change:function(currentPage){
				this.currentPage = currentPage;
				this.getRolesManageList(this.currentPage);
            },
		}
	}
</script>

<style lang="less" scoped>
	.manage-log-wrapper{
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
			.form-item{
				margin-right: 40px;
			}
			.search-btn{
				width: 68px;
				height: 40px;
				background: #2793F4;
				font-size: 12px;
				color: #fff;
				border-radius: 4px;
			}
		}
	}
</style>