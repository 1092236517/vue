<template>
	<div class="side-menu-wrapper">
		<div @click="logoToMain" class="loginImage" :style="'background-image:url('+userDataSrc+')'">
		    {{userDataName}}
		</div>
		<el-menu :default-active="currentIndex">
			<template v-for="(parentItem,parentIndex) in sideBarMenuList">
				<template v-if="parentItem.child_channels.length == 0">
					<el-menu-item :index="parentItem.tag" @click="href(parentItem.tag)">
					    <i :class="parentItem.icon"></i>
					    <span slot="title">{{ parentItem.name }}</span>
					</el-menu-item>
				</template>
				<template v-else>
					<el-submenu  :index="parentItem.tag">
					    <template slot="title" >
					        <i :class="parentItem.icon"></i>
					        <span>{{ parentItem.name }}</span>
					    </template>
					    <el-menu-item-group >
					        <el-menu-item v-for="(childItem,childIndex) in parentItem.child_channels"
					        	:key="childIndex" 
					        	:index="childItem.tag" 
								@click="href(childItem.tag)">
					            <span>{{ childItem.name }}</span>
					        </el-menu-item>
					    </el-menu-item-group>
					</el-submenu>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
	export default{
		name: 'sideBarMenu',
		props: {
			sideBarMenuList: Array
		},
		data(){
			return{
				currentIndex: '',
				userDataName:"",
			}
		},
		created(){
			this.currentIndex = this.$route.meta.indexN;
			this.userDataName = this.$cookies.get('userDataName');
			this.userDataSrc = this.$cookies.get('userDataSrc');
		},
		methods: {
			//点击logo跳到首页
			logoToMain(){
			    window.location.href = 'http://www.zhuniu.com';
			},
			//跳转
			href(tag){
				let that=this;
				that.$store.state.routeList.forEach(function(item, index){
					if(tag == item.tag && item.route){
						that.$router.push({path: item.route})
						return false
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.loginImage{
	    height: 100px;
	    padding-left: 100px;
	    padding-top: 30px;
	    padding-right: 30px;
	    box-sizing: border-box;
	    letter-spacing: 1px;
	    color: #fff;
	    // background-image: url(../../assets/public/aside_logo.png);
	    background-repeat:no-repeat;
	    background-size: 65px 65px;
	    background-position: 25px 20px;
	    cursor: pointer;
	}
</style>