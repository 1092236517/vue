<template>
	<div class="process-flow-wrapper">
		<h2 class="title">流程列表</h2>
		<div class="content">
			<div>
				<button type="button" class="btn add-btn" @click="addProcessFlow">添加</button>
			</div>
			<div>
				<p>流程名称：</p>
				<el-table
					:data="processFlows"
				  	stripe
				  	style="width: 100%"
				  	@selection-change="handleSelectionChange">
				  	<el-table-column
				  	  	type="selection"
				  	  	width="55">
				  	</el-table-column>
				  	<el-table-column
				  	  	prop="name"
				  	  	label="子流程名称">
				  	</el-table-column>
				  	<el-table-column label="操作">
				  	  	<template slot-scope="scope">
							<el-button type="primary" size="mini" @click="viewDetail(scope.row.id)">查看详情</el-button>
				  	  	</template>
				  	</el-table-column>
				</el-table>
                <button type="button" v-if="processFlows.length != 0" class="btn delete-btn" @click="deleteFlows">删除</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'processFlowList',
		data(){
			return {
				token: '',
				checkList: [],
				processFlows: []
			}
		},
		created(){
			this.token = this.$cookies.get('ZL_token');
			this.getProcessFlowList();
		},
		methods: {
			//获取快捷流程列表
			getProcessFlowList(){
				let that = this;
				let params = {
					token: that.token
				}
				that.$api.processFlowList(params)
					.then(response => {
						let result = response.data;
						if(result.msg_code == 100000){
							that.processFlows = result.response.map(element => {
								let item = {
									id: element.id,
									name: element.title,
									type: element.type,
									value: element.id
								}
								return item
							})
						}else {
                            console.log(result)          
                        }
					}).catch(error => {
							that.$alert(error,'提示',{
								confirmButtonText: '知道了',
								callback: action => {}
							})
					})
			},
			//添加流程
			addProcessFlow(){
				this.$router.push({path: '/group_super/createProcessFlow'})
			},
			//产看详情
			viewDetail(id){
				this.$router.push({path: '/group_super/editProcessFlow/' + id})
			},
            //删除流程
            deleteFlows(){
            	let that = this;
            	let params = {
            		token: that.token
            	}
            	if(that.checkList.length == 0){
            		that.$message({
            			message: '请选择要删除的流程！',
            			type: 'warning'
            		})
            		return false
            	}
            	params.id = that.checkList.map(item => {	
            		return item.id
            	})
            	that.$api.processFlowDelete(params)
            		.then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                        	that.$message({
                        		message: '删除成功',
                        		type: 'success'
                        	})
                            that.getProcessFlowList();
                        }else{
                            console.log(result);
                        }
                    }).catch(error => {
                            that.$alert(error,'提示',{
                                confirmButtonText: '知道了',
                                callback: action => {}
                            })
                    })
            },
            //已选项
            handleSelectionChange(value){ //value是array
            	this.checkList = value;
            }
		}
	}
</script>

<style lang="less" scoped>
	.process-flow-wrapper{
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
			padding: 30px 30px;
			.add-btn{
				width: 68px;
				height: 30px;
				background: #2793F4;
				font-size: 12px;
				color: #fff;
				border-radius: 4px;
			}
            .delete-btn{
                width: 68px;
                height: 30px;
                background: #FF4B4B;
                font-size: 12px;
                color: #fff;
                border-radius: 4px;
                margin-top: 30px;
            }
		}
	}	
</style>