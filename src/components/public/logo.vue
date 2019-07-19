<template>
    <div>
    	<div class="logoTitle">LOGO设置</div>
	    <div class="logoBox">
	    	<img src="../../assets/public/setLogo.png" />
	    	<el-button type="primary">上传图片</el-button>
	    	<p>仅支持JPEG、JPG、GIF、PNG格式的图片文件<br>文件不能大于2M</p>
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
	.logoTitle{
		font-size: 20px;
		font-weight: bold;
	}
	.logoBox{
		width: 400px;
		text-align: center;
		position: absolute;
		left: 50%;
		top: 20%;
		margin-left: -200px;
		line-height: 26px;
		color: #6C6C6C;
	}
	.logoBox img{
		width: 240px;
		display: block;
		margin-left: 80px;
	}
	button.el-button--primary{
		width: 150px;
		margin-top: 20px;
		padding: 8px 0;
	}
</style>