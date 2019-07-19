<template>
	<div class="error-wrapper">
		<h1 class="title"><img src="@/assets/login/login.png" alt="logo"> - 404</h1>
		<div class="content">
			<p>页面找不到了...</p>
			<p>可能原因：路径是否正确</p>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'error'
	}
</script>

<style lang="less" scoped>
	.error-wrapper{
		width: 350px;
		margin: 200px auto 0;
		.title{
			margin: 0;
		}
		.content{
			padding: 20px 15px;
		}
	}
</style>