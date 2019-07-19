<template>
	<div class="process-flow-wrapper">
		<h2 class="title">批次订单管理流程</h2>
		<div class="content">
<!-- 			<p class="flow-tab">
				<span>串/并行流程：</span>
				<el-radio v-model="flowType" label="serial">串行审核流程</el-radio>
				<el-radio v-model="flowType" label="parallel">并行审核流程</el-radio>
			</p> -->
			<p class="apply-title">配置项</p>
			<div class="transfer-div" v-show="flowType == 'serial'">
				<myTransfer
					:titles="['审核角色', '串行审核流程']"
					:sourceList="serialTransferData"
					v-model="serialSelectedList" />
			</div>
<!-- 			<div class="transfer-div" v-show="flowType == 'parallel'">
				<myTransfer
					:titles="['审核角色', '并行审核流程']"
					:sourceList="parallelTransferData"
					v-model="parallelSelectedList" />
			</div> -->
			<button type="button" class="btn add-btn" @click="applyProcessFlow">保存</button>
		</div>
	</div>
</template>

<script>
	import myTransfer from '@/components/public/transfer'
	export default {
		name: 'applyProcessFlow',
		components: {
			myTransfer
		},
		data(){
			return {
				token: '',
				flowType: 'serial',
				flowTitle: '',
				//串行
				serialSelectedList: [],
				serialTransferData: [],
				//并行
				parallelSelectedList: [],
				parallelTransferData: [],
			}
		},
		created(){
			this.token = this.$cookies.get('ZL_token');
			this.getApplyList();
			this.getAppliedFlowDetail();
		},
		methods: {
			//获取角色及子流程列表
			getApplyList(){
				let that = this;
				let params = {
					token: that.token
				}
				that.$api.processFlowApplyListForBatchOrder(params)
					.then(response => {
						let result = response.data;
						if(result.msg_code == 100000){
							let rolesArray = result.response;
							rolesArray.forEach(function(element,index){
								let item = {
									key: element.id + '$' + element.type, //id+类型，例如'3$ELEMENT'
									id: element.id,
									label: element.name,
									mode: element.mode,
									type: element.type,
									disabled: false
								}
								that.serialTransferData.push(item);
								that.parallelTransferData.push(item);
							})
						}else{
							console.log(result);
						}
					}).catch(error => {
							console.log(error);
							that.$alert(error,'提示',{
								confirmButtonText: '知道了',
								callback: action => {}
							})
					})
			},
			//获取已应用的流程
			getAppliedFlowDetail(){
				let that = this;
				let params = {
					token: that.token
				};
				that.$api.processFlowApplyDetailForBatchOrder(params)
					.then(response => {
						let result = response.data;
						if(result.msg_code == 100000){
							that.serialSelectedList = JSON.parse(result.response.processes).map((element, index) => {
									let item = {
										key: element.id + '$' + element.type, //id+类型，例如'3$ELEMENT'
										label: element.name,
										id: element.id,
										type: element.type,
										mode: element.mode
									}
									return item
								});
						}else{
							console.log(result.message)
						}
					}).catch(error => {
							console.log(error);
							that.$alert(error,'提示',{
								confirmButtonText: '知道了',
								callback: action => {}
							})
					})
			},
			//应用快捷流程
			applyProcessFlow(){
				let that = this;
				let params = {
					token: that.token
				}
				if(that.flowType == 'serial'){
					params.type = 'SERIAL';
					if(that.serialSelectedList.length == 0){
						that.$message({
							message: '请选择流程中的角色或子流程！',
							type: 'warning'
						})
						return false
					}
					params.processes = JSON.stringify(that.handleSelectedList(that.serialSelectedList,that.serialTransferData));
				}else{
					params.type = 'PARALLEL';
					if(that.parallelSelectedList.length == 0){
						that.$message({
							message: '请选择流程中的角色或子流程！',
							type: 'warning'
						})
						return false
					}
					params.processes = JSON.stringify(that.handleSelectedList(that.parallelSelectedList,that.parallelTransferData));
				}
				that.$api.processFlowApplyForBatchOrder(params)
					.then(response => {
						let result = response.data;
						if(result.msg_code == 100000){
							that.$message({
								message: '流程应用成功！',
								type: 'success'
							})
						}else{
							that.$message({
								message: result.message,
								type: 'error'
							})	
							console.log(result);
						}
					}).catch(error => {
							console.log(error);
							that.$alert(error,'提示',{
								confirmButtonText: '知道了',
								callback: action => {}
							})
					})
			},
			//处理已选列表格式
			handleSelectedList(targetArr){
				let list = [];
				targetArr.forEach(function(element, index){
					list.push({
						id: element.id,
						name: element.label,
						mode: element.mode,
						type: element.type
					})
				});
				return list
			}
		}
	}
</script>

<style>
	.process-flow-wrapper .el-transfer-panel{
		width: 248px;
	}
	.process-flow-wrapper .el-transfer-panel .el-transfer-panel__header{
		background: #2793F4;
	}
	.process-flow-wrapper .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label{
		color: #fff;
	}
	.process-flow-wrapper .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label span{
		top: 10px;
		color: #fff;
	}
</style>
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
			.apply-title{
				margin: 0;
			}
			.flow-tab{
				margin: 0;
			}
			.transfer-div{
				margin-top: 20px;
			}
			.add-btn{
				width: 68px;
				height: 30px;
				background: #2793F4;
				font-size: 12px;
				color: #fff;
				border-radius: 4px;
				margin-top: 30px;
			}
		}
	}	
</style>