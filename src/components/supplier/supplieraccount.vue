<template>
    <div>
    	<div class="myAccount">
    		<h2 class="title">我的账户</h2>
    		<!-- <ul class="myAccount-ul clearfix">
    			<li v-for="(item,index) in accountList">
    				<div class="myAccount-content">
    					<p class="myAccount-name">{{ item.name }}</p>
    					<p class="myAccount-money">{{ item.money | currency }}</p>
    				</div>
    			</li>
    		</ul> -->
    	</div>
    	<div class="listDiv">
    		<el-tabs v-model="activeName" @tab-click="tabSelected">
    		  	<el-tab-pane label="收入" name="income">
    		  		<div class="incomeDiv">
    		  			<p>交易记录</p>
    		  			<ul class="list">
    		  				<li v-for="(item,index) in incomeData.list" :key="item.id">
    		  					<span class="time">{{ item.time }}</span><span class="type">{{ item.type }}</span><span class="money">{{ item.money | currency }}</span>
    		  				</li>
    		  			</ul>
    		  			<p v-show="incomeData.total > 0">显示最近10条交易记录</p>
    		  		</div>
    		  	</el-tab-pane>
    		  	<el-tab-pane label="支出" name="expense">
    		  		<div class="expenseDiv">
    		  			<p>交易记录</p>
    		  			<ul class="list">
    		  				<li v-for="(item,index) in expenseData.list" :key="item.id">
    		  					<span class="time">{{ item.time }}</span><span class="type">{{ item.type }}</span><span class="money">{{ item.money | currency }}</span>
    		  				</li>
    		  			</ul>
    		  			<p v-show="expenseData.total > 0">显示最近10条交易记录</p>
    		  		</div>
    		  	</el-tab-pane>
    		</el-tabs>
    	</div>

    </div>
</template>

<script>
    export default {
        name: "supplieraccount",
        data(){
        	return {
        		token: '',
        		activeName: 'income',
        		accountList: [],
        		incomeData: {
        			total: 0,
        			curPage: 1, //当前页数
        			perPage: 10, //每页条数
        			list: []
        		},
        		expenseData: {
        			total: 0,
        			curPage: 1,
        			perPage: 10,
        			list: []
        		}
        	}
        },
        methods: {
        	//获取用户信息
        	getAccountInfo(){
        		let that = this;
        		let params = {token: that.token};
        		that.$http.get('/api/frontend/member/detail',{params})
        			.then(function(response){
        				let result = response.data;
        				if(result.msg_code == 100000){
        					that.accountList = [
        						{
        							name: '账户总保证金额度',
        							money: result.response.total_quota
        						},
        						{
        							name: '可用保证金额度',
        							money: (result.response.total_quota - result.response.quota).toFixed(2)
        						},
        						{
        							name: '冻结保证金额度',
        							money: result.response.quota
        						}
        					]
        				}else{
        					that.$alert(result.message , '警告', {
        					    confirmButtonText: '确定',
        					    callback: action => {
        					    }
        					});
        				}
        			}).catch(function(error){
        				that.$alert(error , '警告', {
        				    confirmButtonText: '确定',
        				    callback: action => {
        				    }
        				});
        			})
        	},
        	//获取列表
        	getList(){
        		let that = this;
        		let curData;
        		let params = {};
        		if(that.activeName == 'income'){
        			curData = that.incomeData;
        			params.log_type = 1;
        		}else{
        			curData = that.expenseData;
        			params.log_type = 2;
        		};
        		params.token = that.token;
        		params.current_page = curData.curPage;
        		params.per_page = curData.perPage;
        		that.$http.get('/api/frontend/member/quota/lists',{params})
        			.then(function(response){
        				let result = response.data;
        				if(result.msg_code = 100000){
        					let curList = result.response.data.map((item,index) => {
        						let element = {
        							id: item.id,
        							time: item.created_at,
        							money: item.quota
        						};
        						if(that.activeName == 'income'){
        							element.type = '收入';
        						}else{
        							element.type = '支出';
        						};
        						return element;
        					})
        					if(that.activeName == 'income'){
        						that.incomeData.list = curList;
        						that.incomeData.total = result.response.total;
        					}else{
        						that.expenseData.list = curList;
        						that.expenseData.total = result.response.total;
        					};
        				}else{
        					that.$alert(result.message , '警告', {
        					    confirmButtonText: '确定',
        					    callback: action => {
        					        // that.canClick = !that.canClick;
        					    }
        				    })
        				}
        			}).catch(function(error){
        				that.$alert(error , '警告', {
        				    confirmButtonText: '确定',
        				    callback: action => {
        				        // that.canClick = !that.canClick;
        				    }
        			    })
        			})
        	},
        	//切换tab
        	tabSelected(){
        		this.getList();
        	}
        },
        mounted(){
        	// 设置下token
        	if(!this.$cookies.get("ZL_token")){
        	    this.$router.push({path: '/login'})
        	}else{
        	    this.token = this.$cookies.get("ZL_token");
        	}
        	//获取账户信息
        	this.getAccountInfo();
        	//获取列表
        	this.getList();
        }
    }
</script>

<style lang="less" scoped>
	.clearfix:after{
	    display: block;
	    clear: both;
	    content: "";
	    visibility: hidden;
	    height: 0;
	}
	.clearfix{
	    zoom:1;
	}
	.myAccount{
		.title{
			margin-top: 0;
			font-size: 24px;
		}
		.myAccount-ul{
			padding: 0;
			margin-left: -30px;
			li{
				list-style: none;
				float: left;
				width: 33.333333%;
				box-sizing: border-box;
			}
			.myAccount-content{
				margin-left: 30px;
				padding-left: 30px;
				border: 1px solid #999;
			}
			.myAccount-name{
				font-size: 20px;
			}
			.myAccount-money{
				font-size: 36px;
				color: #0576db;
			}
		}
	}
	.listDiv ul,.listDiv li{
		list-style: none;
		padding: 0;
	}
	.listDiv{
		margin-top: 30px;
		.incomeDiv,.expenseDiv{
			border: 1px solid #ccc;
			padding-left: 30px;
			padding-right: 30px;
			li{
				padding-bottom: 10px;
				border-bottom: 1px solid #ccc;
			}
			.time{
				display: inline-block;
				width: 40%;
			}
			.type{
				display: inline-block;
				width: 30%;
			}
			.money{
				display: inline-block;
				width: 30%;
			}
		}
	}
</style>