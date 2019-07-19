<template>
	<div class="transfer-wrapper clearfix">
		<div class="source-div">
			<p class="title clearfix">
				{{ titles[0] }}
			</p>
			<ul class="list">
				<li class="transfer-item" 
					v-for="(item, index) in sourceList" 
					:key="item.key"
					:class="{'selected': index === sourceCurrentIndex}"
					@click="selected('source', index)">
					{{ item.label }}
				</li>
			</ul>
		</div>
		<div class="btns-div">
			<div class="mb30">
				<span class="btn-right" @click="targetAdd">
					<i style="font-size: 24px;position: relative;left: -3px" class="iconfont icon-gengduo"></i>
				</span>
			</div>
			<div>
				<span class="btn-left" @click="targetDelete">
					<i style="font-size: 24px;position: relative;left: -3px" class="iconfont icon-gengduo"></i>
				</span>
			</div>
		</div>
		<div class="target-div">
			<p class="title clearfix">
				{{ titles[1] }}
			</p>			
			<ul class="list">
				<li class="transfer-item" 
					v-for="(item, index) in targetList" 
					:key="item.key + '-' + index"
					:class="{'selected': index === targetCurrentIndex}"
					@click="selected('target', index)">
					{{ item.label }}
				</li>
			</ul>
		</div>
		<div class="btns-div">
			<div class="mb30">
				<span class="btn-up" @click="forward">
					<i style="font-size: 24px;position: relative;left: -3px" class="iconfont icon-gengduo"></i>
				</span>
			</div>
			<div>
				<span class="btn-down" @click="backward">
					<i style="font-size: 24px;position: relative;left: -3px" class="iconfont icon-gengduo"></i>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'transfer',
		model: {
			prop: 'targetList',
			event: 'targetListChange'
		},
		props: {
			sourceList: Array,
			targetList: Array,
			titles: Array
		},
		data(){
			return {
				sourceCurrentIndex: '',
				targetCurrentIndex: ''
			}
		},
		methods: {
			//选中
			selected(type, index){
				if(type == 'source'){
					if(this.sourceCurrentIndex === index){
						this.sourceCurrentIndex = '';
					}else{
						this.sourceCurrentIndex = index;
					}
				}else if(type == 'target'){
					if(this.targetCurrentIndex === index){
						this.targetCurrentIndex = '';
					}else{
						this.targetCurrentIndex = index;
					}
				}
			},
			//添加流程
			targetAdd(){
				if(this.sourceCurrentIndex !== ''){
					this.targetList.push(this.sourceList[this.sourceCurrentIndex]);
					this.sourceCurrentIndex = '';
					this.$emit('targetListChange', this.targetList);
				}else{
					this.$message({
						message: '请选择要添加的流程！',
						type: 'warning'
					})
				}
			},
			//删除流程
			targetDelete(){
				if(this.targetCurrentIndex !== ''){
					this.targetList.splice(this.targetCurrentIndex, 1);
					this.targetCurrentIndex = '';
					this.$emit('targetListChange', this.targetList);
				}else{
					this.$message({
						message: '请选择要删除的流程！',
						type: 'warning'
					})
				}
			},
			//向上移动
			forward(){
				if(this.targetCurrentIndex !== ''){
					if(this.targetCurrentIndex === 0){
						this.$message({
							message: '已经是第一个了啦！',
							type: 'info'
						})
					}else{
						this.targetList.splice(this.targetCurrentIndex - 1, 0, ...this.targetList.splice(this.targetCurrentIndex, 1));
						this.targetCurrentIndex--;
					}
				}else{
					this.$message({
						message: '请选择要操作的流程！',
						type: 'warning'
					})
				}
			},
			//向下移动
			backward(){
				if(this.targetCurrentIndex !== ''){
					if(this.targetCurrentIndex === (this.targetList.length - 1)){
						this.$message({
							message: '已经是最后一个了啦！',
							type: 'info'
						})
					}else{
						this.targetList.splice(this.targetCurrentIndex + 1, 0, ...this.targetList.splice(this.targetCurrentIndex, 1));
						this.targetCurrentIndex++;
					}
				}else{
					this.$message({
						message: '请选择要操作的流程！',
						type: 'warning'
					})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.transfer-wrapper{
		.source-div,.target-div{
			width: 248px;
			height: 350px;
			border: 1px solid #E8E8E8;
			border-radius: 4px;
			overflow: hidden;
			float: left;
		}
		.title{
			margin: 0;
			padding-left: 20px;
			padding-right: 20px;
			height: 40px;
			line-height: 40px;
			color: #fff;
			font-size: 14px;
			background: #2793F4;
			.selected-span{
				float: right;
			}
		}
		.list{
			height: 310px;
			font-size: 12px;
			overflow: auto;
		}
		.btns-div{
			float: left;
			margin-left: 30px;
			margin-right: 30px;
			margin-top: 118px;
			.btn-left,.btn-right{
				display: inline-block;
				width: 40px;
				height: 40px;
				line-height: 40px;
				text-align: center;
				border-radius: 50%;
				border: 1px solid #AFAFAF;
				background: #F6F6F6;
				color: #B6B6B6;
				cursor: pointer;
			}
			.btn-left{
				transform: rotate(180deg);
			}
			.btn-up,.btn-down{
				display: inline-block;
				width: 40px;
				height: 35px;
				line-height: 35px;
				text-align: center;
				border: 1px solid #AFAFAF;
				border-radius: 4px;
				background: #F6F6F6;
				color: #B6B6B6;
				cursor: pointer;
			}
			.btn-up{
				transform: rotate(-90deg);
			}
			.btn-down{
				transform: rotate(90deg);
			}
			.btn-left:hover,
			.btn-right:hover,
			.btn-up:hover,
			.btn-down:hover{
				background: #2793F4;
				color: #fff;
			}
		}
		.mb30{
			margin-bottom: 30px;
		}
	}
	.transfer-item{
		padding: 10px 20px 10px 20px;
	}
	.selected{
		background: #eee;
	}	
</style>