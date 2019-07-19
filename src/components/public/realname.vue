<template>
    <div>
    	<div class="realNameTitle">实名认证</div>
	    <div class="realNameBox">
	    	<p>您尚未实名认证！</p>
	    	<el-button type="primary">去认证</el-button>
	    </div>
    </div>
</template>

<script>
    export default {
        methods: {
        },
    }
</script>
<style lang="less" scoped>
	/*标题*/
	.realNameTitle{
		font-size: 20px;
		font-weight: bold;
	}
	.realNameBox{
		width: 200px;
		text-align: center;
		position: absolute;
		left: 50%;
		top: 30%;
		margin-left: -100px;
		color: #6C6C6C;
	}
	button.el-button--primary{
		width: 150px;
		margin-top: 10px;
		padding: 8px 0;
	}
</style>