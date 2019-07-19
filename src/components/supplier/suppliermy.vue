<template>
    <div>
    	<div class="userInfoDiv">
    		<div class="userPortrait"><img :src="userData.src" alt="portrait"></div>
    		<div class="userInfo">
    			<p class="userName">{{ userData.name }}</p>
<!--     			<p class="userDesc">
    				<span>总额（元）：<i>{{ userData.total_sum }}</i></span>
    				<span>剩余额度（元）：<i>{{ userData.bail }}</i></span>
    				<span>采购额度（元）：<i>{{ userData.purchase_amount }}</i></span>
    			</p> -->
    		</div>
    	</div>
    	<div class="unReadMsgDiv">
    		<p class="title">最新消息</p>
    		<div class="content">
    			<p class="unReadMsgTotal">消息通知（未读{{ unReadMsgData.unReadMsgTotal }}条）</p>
    			<div v-for="item in unReadMsgData.list" :key="item.id" class="itemWrapper">
    				<p class="clearfix msgTitle">
    					<span class="created_at">{{item.created_at}}</span>
    					<el-badge :class="{unReadMsgClass: !item.is_read}" :is-dot="item.is_read ? false : true" class="item">{{item.title}}</el-badge>
    				</p>
    				<transition name="message">
    					<div v-show="item.show" class="message">
    						<p>{{item.message}}</p>
    						<p>如有疑问请咨询筑牛客服： 4008-791-799</p>
    					</div>
    				</transition>
    				<span class="folderBtn" @click="folder(item)">{{ item.btnName }}</span>
    			</div>
    		</div>
    	</div>
    	<div class="demandDiv">
    		<p class="title">最新订单</p>

			<el-table
				:data="tableData"
				border
				style="width: 100%">
				<el-table-column v-for="(value,key) in tableJson"  :prop="key" :label="value" :key="value">
				</el-table-column>
				<!-- <el-table-column  label="操作" width="240">
					<template slot-scope="scope">
						<div class="nomalBtn1 tabelBtn" v-if='scope.row.statusN == 1' @click="openPriceWindow(scope.row.id)">立即报价</div>
						<div class="nomalBtn1 tabelBtn" @click="openOrderWindow(scope.row)">查看详情</div>
					</template>
				</el-table-column > -->
			</el-table>
    	</div>
    </div>
</template>

<script>
    export default {
        name: "suppliermy",
        data(){
        	return {
				tableData: [],
				tableJson:{
                    "order_no":"采购单",
                    "brand_name":"产品名",
                    'specifications':"规格",
                    'purchase_num':"数量",
                    'quoted_supplier_num':"供应商报价人数",
                    'deadline':"剩余报价时间"
                },
        		userData: {
        			src: require('../../assets/default_portrait.jpg'),
        			name: '',
        			total_sum: '', //总额
        			bail: '', //剩余额度
        			purchase_amount: '' //采购额度
        		},
        		unReadMsgData: {
        			total: '4',
        			perPage: 3,
        			curPage: 1,
        			list: [],
                    unReadMsgTotal: 0
        		}
        	}
        },
        methods: {
        	//获取用户信息
        	getUserInfo(){
        		let that = this;
        		let params = {token: that.token};
        		that.$http.get('/api/frontend/member/detail',{params})
        			.then(function(response){
        				let result = response.data;
        				if(result.msg_code == 100000){
                            if(result.response.member_auth.logo && !(/^http/.test(result.response.member_auth.logo))){
                                that.userData.src = 'http://file001.zhuniu.com/' + result.response.member_auth.logo;
                            }else {
                                that.userData.src = result.response.member_auth.logo || require('../../assets/default_portrait.jpg');
                            }
        					that.userData.name = result.response.member_auth.auth_name;
        					that.userData.total_sum = result.response.total_quota;
        					that.userData.bail = (result.response.total_quota - result.response.quota).toFixed(2);
        					that.userData.purchase_amount = result.response.quota;
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
        	//获取最新消息
        	getMsgList(status,curPage){ //status的值: ''(全部),0(未读),1(已读);curPage当前页
        		let that = this;
        		let params = {};
        		let curData;
        		curData = that.unReadMsgData;
        		params.is_read = status;
        		params.token = that.token;
        		params.per_page = curData.perPage;
        		params.current_page = curPage || curData.curPage;
        		that.$http.get('/api/frontend/joint_purchase/super/supplier/message/lists',{params})
        			.then(function(response){
        				let result = response.data;
        				if(result.msg_code == 100000){
        					curData.total = result.response.total;
                            curData.unReadMsgTotal = result.response.unReadTotal;
        					curData.list = result.response.data.map((item) => {
        						let element = {
        							id: item.id,
        							message: item.message,
        							type: item.type,
        							is_read: item.is_read,
        							created_at: item.created_at,
        							updated_at: item.updated_at,
        							show: false,
        							btnName: '展开',
                                    title: item.title
        						};
        						return element;
        					});
        					that.unReadMsgData = curData;
        				}else{
        					that.$alert(result.message , '警告', {
        					    confirmButtonText: '确定',
        					    callback: action => {
        					    }
        					});
        				}
        			}).catch(function(error){
        				that.$alert(error, '警告' , {
        					confirmButtonText: '确定',
        					callback: action => {
        					}
        				})
        			})
        	},
        	//折叠信息
        	folder(item){
        		if(item.show){
        			item.show = false;
        			item.btnName = '展开';
        		}else{
        			item.show = true;
        			item.btnName = '收起';
        			if(item.is_read == 0){
        				this.signRead(item);
        			}
        		}
        	},
        	//标记已读
        	signRead(item){
        		let that = this;
        		let params = {};
        		if(item.is_read == 0){
        			params.id = item.id;
        			params.token = that.token;
        			that.$http.post('/api/frontend/joint_purchase/super/supplier/message/read',params)
        				.then(function(response){
        					let result = response.data;
        					if(result.msg_code == 100000){
        						item.is_read = 1;
        					}else{
        						that.$alert(result.message , '警告', {
        						    confirmButtonText: '确定',
        						    callback: action => {
        						    }
        						});
        					}
        				}).catch(function(error){
        					console.log(error);
        					that.$alert(error, '警告', {
        					    confirmButtonText: '确定',
        					    callback: action => {
        					    }
        					});
        				})
        		}
			},
			//获取列表数据
            getTabList:function(page){
                let params = {};
                let that = this;
                params.token = that.token;
                params.current_page = page;
                params.per_page = 5;
                that.$http.get('/api/frontend/joint_purchase/super/supplier/demand_purchase_quoted_price/lists', {
                    params
                }).then(function (response) {
                    let result = response.data
                    if(result.msg_code == 100000){
                        that.total = result.response.total;
                        that.tableData = result.response.data.map((item)=>{
                            let element = {
                                id: item.id,
                                order_no: item.demand_purchase.order_no,
                                brand_name: item.demand_purchase.demand.category.name,
                                specifications: item.demand_purchase.demand.category_spec,
                                quoted_supplier_num: item.demand_purchase.quoted_supplier_num,
                                purchase_num: item.demand_purchase.demand.purchase_num,
                                deadline: item.demand_purchase.deadline
                            };
                            if(item.status == 'QUOTING'){
                                let deadline_time = +new Date(item.deadline);
                                let now_time = +new Date();
                                if(deadline_time < now_time){
                                    element.status = "已截标";
                                    element.statusN = 3;
                                }else{
                                    element.status = "待报价";
                                    element.statusN = 1;
                                }
                            }else if(item.status == 'QUOTED'){
                                element.status = "已报价";
                                element.statusN = 2;
                            };
                            let specifications = JSON.parse(element.specifications);
                            element.specifications = specifications.category_spec_min +'-'+specifications.category_spec_max;
                            return element;
                        });
                    }else{
                        that.$alert(result.message , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(function (error) {
                    that.$alert(error , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                            // that.canClick = !that.canClick;
                        }
                    });
                });
            }
        },
        mounted(){
        	// 设置下token
        	if(!this.$cookies.get("ZL_token")){
        	    this.$router.push({path: '/login'})
        	}else{
        	    this.token = this.$cookies.get("ZL_token");
        	};
        	//获取最新消息
        	this.getMsgList("");
        	//获取用户信息
			this.getUserInfo();
			// 获得 列表数据
            this.getTabList(1);
        }
    }
</script>

<style lang="less" scoped>
	.userInfoDiv{
		width: 100%;
		.userPortrait{
			float: left;
			width: 70px;
			height: 70px;
			border-radius: 5px;
			overflow: hidden;
			box-sizing: border-box;
			background: #fff;
			img{
				width: 100%;
			}
		}
		.userInfo{
			margin-left: 90px;
			height: 70px;
			color: #333;
			p{
				margin:0;
			}
			.userName{
				margin-bottom: 25px;
			}
			.userDesc{
				color: #999;
				span{
					margin-right: 30px;
				}
				i{
					font-style: normal;
					color: #333;
				}
			}
		}
	}
	.itemWrapper{
		position: relative;
		padding-top: 10px;
		padding-bottom: 30px;
		border-bottom: 1px solid #ccc;
		.created_at{
			float: right;
		}
		.folderBtn{
			position: absolute;
			right: 0;
			bottom: 10px;
			cursor: pointer;
			color: #5a97e2;
		}
		.message{
			padding-top: 20px;
			line-height: 24px;
		}
	}
	.unReadMsgClass{
		font-weight: 600;
	}
	.unReadMsgDiv{
		margin-top: 30px;
		p{margin: 0}
		.unReadMsgTotal{
			font-size: 18px;
			color: #337ab7;
		}
		.title{
			font-size: 24px;
			font-weight: 700;
			margin-bottom: 20px;
		}
		.content{
			border: 1px solid #999;
			padding: 10px 20px;
		}
	}
    .demandDiv .title{
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 20px;
    }
</style>