<template>
	<div class="under-review-wrapper">
		<h2 class="title">
			<i class="iconfont icon-shizhong"></i>
			<span>已提交</span>
		</h2>
		<p class="desc">您已成功提交支付信息，请等待审核，<span class="time">{{ initCount }}秒</span>后返回批次供货订单列表页！</p>
		<router-link :to="{name: 'grouporderL_super'}" replace>
			<div class="back-btn">立即返回</div>
		</router-link>
	</div>
</template>

<script>
	export default{
		name: 'payResultUnderReview',
		data(){
			return {
				timer: null,
				initCount: 6
			}
		},
		created(){
			this.countDown();
		},
		beforeRouteLeave(to, from, next){
			clearTimeout(this.timer);
			this.timer = null;
			next();
		},
		methods: {
			//倒计时
			countDown(){
				if(this.initCount === 0){
					clearTimeout(this.timer);
					this.$router.replace({name: 'grouporderL_super'});
				}else{
					this.timer = setTimeout(this.countDown, 1000);
					this.initCount--;
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.under-review-wrapper{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		.title{
			font-size: 32px;
			font-weight: 400;
			color: #0576DB;
		}
		.icon-shizhong{
			font-size: 32px;
		}
		.desc{
			font-size: 14px;
			color: #999;
			.time{
				color: #0576DB;
			}
		}
		.back-btn{
			color: #0576DB;
			padding-top: 20px;
		}
	}
</style>