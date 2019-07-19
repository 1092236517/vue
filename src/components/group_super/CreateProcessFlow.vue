<template>
	<div class="process-flow-wrapper">
		<h2 class="title">{{ isEdit ? '编辑流程' : '新建流程'}}</h2>
		<div class="content">
			<div class="flow-title">
				<el-input v-model="flowTitle" placeholder="请输入流程名称"></el-input>
			</div>
			<p class="flow-tab">
				<span>串/并行流程：</span>
				<el-radio v-model="flowType" label="serial">串行审核流程</el-radio>
				<el-radio v-model="flowType" label="parallel">并行审核流程</el-radio>
			</p>
			<div class="transfer-div" v-show="flowType == 'serial'">
				<myTransfer
					:titles="['审核角色', '串行审核流程']"
					:sourceList="serialTransferData"
					v-model="serialSelectedList" />
			</div>
			<div class="transfer-div" v-show="flowType == 'parallel'">
				<myTransfer
					:titles="['审核角色', '并行审核流程']"
					:sourceList="parallelTransferData"
					v-model="parallelSelectedList" />
			</div>
			<button type="button" class="btn add-btn" @click="createProcessFlow">保存</button>
		</div>
	</div>
</template>

<script>
	import myTransfer from '@/components/public/transfer'
	export default {
		name: 'createProcessFlow',
		components: {
			myTransfer
		},
		data(){
			return {
				flow_id: '',
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
		computed: {
			isEdit(){
				return this.flow_id ? true :  false
			}
		},
		created(){
			this.token = this.$cookies.get('ZL_token');
			this.flow_id = this.$route.params.id;
			this.getApplyList();
			//编辑时获取子流程详情
			if(this.isEdit){
				this.getProcessFlowDetail(this.flow_id);
			}
		},
		methods: {
			//获取角色列表
			getApplyList(){
				let that = this;
				let params = {
					token: that.token
				}
				that.$api.processFlowApplyList(params)
					.then(response => {
						let result = response.data;
						if(result.msg_code == 100000){
							let rolesArray = result.response;
							rolesArray.forEach(function(element,index){
								let item = {
									key: element.id + '$' + element.type, //id+类型，例如'3$ELEMENT'
									label: element.name,
									id: element.id,
									type: element.type,
									mode: element.mode,
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
			//子流程详情
			getProcessFlowDetail(id){
				let that = this;
				let params = {
					token: that.token,
					id: id
				};
				that.$api.processFlowDetail(params, id)
					.then(response => {
						let result = response.data;
						if(result.msg_code == 100000){
							let selectedList = JSON.parse(result.response.content).map((element, index) => {
									let item = {
										key: element.id + '$' + element.type, //id+类型，例如'3$ELEMENT'
										label: element.name,
										id: element.id,
										type: element.type,
										mode: element.mode
									}
									return item
								});
							that.flowTitle = result.response.title;
							that.flowType = result.response.type == 'SERIAL' ? 'serial' : 'parallel';
							if(result.response.type == 'SERIAL'){
								that.serialSelectedList = selectedList;
							}else if(result.response.type == 'PARALLEL'){
								that.parallelSelectedList = selectedList;
							}
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
			//创建或编辑快捷流程
			createProcessFlow(){
				let that = this;
				let params = {
					token: that.token,
					title: that.flowTitle
				}
				if(!that.flowTitle){
					that.$message({
						message: '请输入流程名！',
						type: 'warning'
					})
					return false
				}
				if(that.flowType == 'serial'){
					params.type = 'SERIAL';
					if(that.serialSelectedList.length == 0){
						that.$message({
							message: '请选择流程中的角色！',
							type: 'warning'
						})
						return false
					}
					params.content = JSON.stringify(that.handleSelectedList(that.serialSelectedList));
				}else{
					params.type = 'PARALLEL';
					if(that.parallelSelectedList.length == 0){
						that.$message({
							message: '请选择流程中的角色！',
							type: 'warning'
						})
						return false
					}
					if(that.parallelSelectedList.length == 1){
						that.$message({
							message: '并行流程内容项不得少于2个！',
							type: 'warning'
						})
						return false
					}
					params.content = JSON.stringify(that.handleSelectedList(that.parallelSelectedList));
				}
				if(that.isEdit){ //编辑状态
					params.id = that.flow_id;
				}
				that.$api.processFlowAdd(params)
					.then(response => {
						let result = response.data;
						if(result.msg_code == 100000){
							that.$message({
								message: that.isEdit ? '流程修改成功！' : '流程创建成功！',
								type: 'success'
							})
							that.$router.push('/group_super/processFlowList');
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
			.flow-title{
				width: 300px;
				margin-bottom: 20px;
			}
			.flow-tab{
				margin: 0;
			}
			.transfer-div{
				margin-top: 40px;
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