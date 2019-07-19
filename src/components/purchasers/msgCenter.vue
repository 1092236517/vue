<template>
    <div class="message-wrapper">
        <el-tabs v-model="tabActiveName" @tab-click="handleClick">
            <el-tab-pane label="全部" name="all">
                <div v-for="(item,index) in allMsgData.list" :key="index" class="itemWrapper">
                    <p class="clearfix title">
                        <el-checkbox v-model="item.checked" @change="checkAll(allMsgData)"></el-checkbox>
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
                <div class="selectAllDiv" v-if='allMsgData.total>0'>
                    <el-checkbox v-model="allMsgData.checked" @change="selectAll(allMsgData)">全选</el-checkbox>
                    <span class="signRead" @click="signRead(allMsgData)">标记已读</span>
                </div>
                <div class="pageCont" v-if='allMsgData.total>10'>
                    <el-pagination background layout="prev, pager, next" :total="allMsgData.total" :currentPage="allMsgData.curPage"  @current-change="goTo"></el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="未读" name="unReadMsg">
                <div v-for="(item,index) in unReadMsgData.list" :key="index" class="itemWrapper">
                    <p class="clearfix title">
                        <el-checkbox v-model="item.checked" @change="checkAll(unReadMsgData)"></el-checkbox>
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
                <div class="selectAllDiv" v-if='unReadMsgData.total>0'>
                    <el-checkbox v-model="unReadMsgData.checked" @change="selectAll(unReadMsgData)">全选</el-checkbox>
                    <span class="signRead" @click="signRead(unReadMsgData)">标记已读</span>
                </div>
                <div class="pageCont" v-if='unReadMsgData.total>10'>
                    <el-pagination background layout="prev, pager, next" :total="unReadMsgData.total" :currentPage="unReadMsgData.curPage"  @current-change="goTo"></el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已读" name="readedMsg">
                <div v-for="(item,index) in readedMsgData.list" :key="index" class="itemWrapper">
                    <p class="clearfix title">
                        <el-checkbox v-model="item.checked" @change="checkAll(readedMsgData)"></el-checkbox>
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
                <div class="pageCont" v-if='readedMsgData.total>10'>
                    <el-pagination background layout="prev, pager, next" :total="readedMsgData.total" :currentPage="readedMsgData.curPage"  @current-change="goTo"></el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "branchMsgCenter",
        data(){
        	return {
				userId:0,
        		tabActiveName: 'all',
        		token: '',
        		allMsgData:{
        			perPage: 10,
        			curPage: 1,
        			total: 0,
        			checked: false,
        			list: []
        		},
        		unReadMsgData: {
        			perPage: 10,
        			curPage: 1,
        			total: 0,
        			checked: false,
        			list: []
        		},
        		readedMsgData: {
        			perPage: 10,
        			curPage: 1,
        			total: 0,
        			checked: false,
        			list: []
        		}
        	}
        },
        methods: {
        	//获取消息列表
        	getMsgList(status,curPage){
        		let that = this;
        		let params = {};
        		let curData;
        		switch (status) {
        			case 'readedMsg':
        				params.is_read = 1;
        				curData = that.readedMsgData;
        				break;
        			case 'unReadMsg':
        				params.is_read = 0;
        				curData = that.unReadMsgData;
        				break;
        			default:
        			    params.is_read = '';
        			    curData = that.allMsgData;
        				break;
        		};
        		params.token = that.token;
        		params.per_page = curData.perPage;
				params.current_page = curPage || curData.curPage;
				let url = "";
				if(that.userId == 1){
					url = '/api/frontend/joint_purchase/normal/group/message/lists'
				}else if(that.userId == 2){
					url = '/api/frontend/joint_purchase/normal/branch/message/lists'
				}else{
					url = '/api/frontend/joint_purchase/normal/supplier/message/lists'
				}
        		that.$http.get(url,{params})
        			.then(function(response){
        				let result = response.data;
        				if(result.msg_code == 100000){
        					curData.total = result.response.total;
                            curData.checked = false;
        					curData.list = result.response.data.map((item) => {
        						let element = {
        							id: item.id,
        							message: item.message,
        							type: item.type,
        							is_read: item.is_read,
        							created_at: item.created_at,
        							updated_at: item.updated_at,
        							checked: false,
        							show: false,
        							btnName: '展开',
                                    title: item.title
        						};
        						return element;
        					});
        					switch (status) {
        						case 'readedMsg':
        							that.readedMsgData = curData;
        							break;
        						case 'unReadMsg':
        							that.unReadMsgData = curData;
        							break;
        						default:
        						    that.allMsgData = curData;
        							break;
        					};
        				}else{
        					that.$alert(result.message , '警告', {
        					    confirmButtonText: '确定',
        					    callback: action => {
        					    }
        					});
        				}
        			}).catch(function(error){
        				that.$alert(error, '警告', {
        				    confirmButtonText: '确定',
        				    callback: action => {
        				    }
        				});
        			})
        	},
        	//切换
        	handleClick(tag,event){
        		this.getMsgList(tag.name);
        	},
        	// 全选
        	selectAll(msgData){
        		let that = this;
        		msgData.list.forEach(function(element,index){
        			element.checked = msgData.checked;
        		});
        	},
            /**
             * 全选检查
             * @param  {Object} msgData 消息列表对象
             */
            checkAll(msgData){
                if(msgData.list.every(item => item.checked)){
                    msgData.checked = true;
                }else{
                    msgData.checked = false;
                }
            },
        	//标记已读
        	signRead(msgData){
        		let that = this;
        		let params = {};
        		let selectedList = [];
				params.token = that.token;
				let url = "";
				if(that.userId == 1){
					url = '/api/frontend/joint_purchase/normal/group/message/read';
				}else if(that.userId == 2){
					url = '/api/frontend/joint_purchase/normal/branch/message/read';
				}else{
					url = '/api/frontend/joint_purchase/normal/supplier/message/read';
				}
				if(msgData.list){
					msgData.list.forEach(function(curValue,index){
						if(curValue.checked){
							selectedList.push(curValue.id);
						}
					});
					if(selectedList.length > 0){
						params.id = selectedList.join(',');
						that.$http.post(url,params)
							.then(function(response){
								let result = response.data;
								if(result.msg_code == 100000){
									that.getMsgList(that.tabActiveName);
								}else{
									that.$alert(result.message , '警告', {
										confirmButtonText: '确定',
										callback: action => {
										}
									});
								}       					
							}).catch(function(error){
								that.$alert(error, '警告', {
									confirmButtonText: '确定',
									callback: action => {
									}
								});
							})
					}
				}else if(msgData.is_read == 0){
					params.id = msgData.id;
					that.$http.post(url,params)
						.then(function(response){
							let result = response.data;
							if(result.msg_code == 100000){
								msgData.is_read = 1;
							}else{
								that.$alert(result.message , '警告', {
									confirmButtonText: '确定',
									callback: action => {
									}
								});
							}       					
						}).catch(function(error){
							that.$alert(error, '警告', {
								confirmButtonText: '确定',
								callback: action => {
								}
							});
						})
				}

        	},
        	goTo(curPage){
        		switch (this.tabActiveName) {
        			case 'readedMsg':
        				this.readedMsgData.curPage = curPage;
        				break;
        			case 'unReadMsg':
        				this.unReadMsgData.curPage = curPage;
        				break;        				
        			default:
						this.allMsgData.curPage = curPage;       				
        				break;
        		};
        		this.getMsgList(this.tabActiveName);
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
        	}
        },
        mounted(){
        	// 设置下token
        	if(!this.$cookies.get("ZL_token")){
        	    this.$router.push({path: '/login'})
        	}else{
        	    this.token = this.$cookies.get("ZL_token");
			};
			this.userId = this.$route.meta.userId;
			this.getMsgList(this.tabActiveName);
        }
    }
</script>

<style lang="less" scoped>
    .message-wrapper .pageCont{
        margin-top: -30px;
    }
	.itemWrapper{
		position: relative;
		padding-top: 10px;
		padding-bottom: 10px;
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
			padding-left: 20px;
		}
	}
	.unReadMsgClass{
		font-weight: 600;
	}
	.signRead{
		padding-left: 30px;
		cursor: pointer;
		color: #409EFF;
	}
	.selectAllDiv{
		margin-top: 30px;
        padding-bottom: 60px;
	}
	.message-enter-active, .message-leave-active {
	  transition: opacity .5s;
	}
	.message-enter, .message-leave-to{
	  opacity: 0;
	}
</style>