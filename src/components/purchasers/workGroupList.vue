<template>
	<div class="roles-manage-wrapper">
		<h2 class="title">组列表</h2>
		<div class="content">
			<div>
				<!-- <el-checkbox @change="selectAll(rolesManageList)">全选</el-checkbox> -->
				<button type="button" class="btn add-btn" @click="addRolesItem(-1)">新增</button>
				<!-- <button type="button" class="btn delete-btn">删除</button> -->
			</div>
			<div class="roles-table">
				<el-table
                    ref="multipleTable"
				  	:data="groupList"
				  	stripe
                    @selection-change="handleSelectionChange"
				  	style="width: 100%">
				  		<!-- <el-table-column
				  	  		type="selection"
				  	  		width="55">
				  		</el-table-column> -->
				  		<el-table-column
				    		prop="groupName"
				    		label="组名称"
				    		width="180">
				  		</el-table-column>
				  		<!-- <el-table-column
				   			prop="memberNum"
				    		label="人员数"
				    		width="180">
				  		</el-table-column> -->
				  		<el-table-column
				    		prop="creater"
				    		label="添加人">
				  		</el-table-column>
						<el-table-column
							prop="creat_time"
				  			label="添加时间"
				  			width="270">
						</el-table-column>
                        <el-table-column
				  			label="操作"
				  			width="270">
				  			<template slot-scope="scope">
				  				<button type="button" class="btn table-edit-btn" @click="addRolesItem(scope.row.id)">编辑</button>
				  				<button type="button" class="btn table-del-btn" @click="deleteRolesItem(scope.row.id)">删除</button>
				  			</template>
						</el-table-column>
				</el-table>
			</div>
		</div>
        <div class="pageCont" v-if="total > 0">
            <el-pagination 
                background 
                layout="prev, pager, next" 
                :total="total" 
                :currentPage="currentPage"  
                @current-change="current_change">
            </el-pagination>
        </div>
	</div>
</template>

<script>
	export default {
        name: 'rolesList',
		data(){
			return{
				token:'',
				// type:'',
				// pathUrl:'',
                allChecked: true,
                total: 0,
                currentPage: 1,
				groupList: [],
                selectedgroupItem: []
			}
		},
        methods: {
            //获取组列表
            getGroupList(pageNum){
                let that=this;
                let params={
					token:that.token,
                    current_page: pageNum,
        			per_page: 10,
                }
                that.$api.branchgroupList_normal(params).then(response=>{
					if(response.data.msg_code===100000){
						that.total=response.data.response.total;
						that.groupList=response.data.response.data.map(item=>{
							return{
								id:item.id,
								groupName: item.name,
								memberNum: item.number,
								creater: item.get_group_creator.user_name,
								creat_time:item.created_at,
							}
						})
					}else{
						that.$alert(response.data.message,'提示',{
							confirmButtonText: '知道了',
							callback: action => {
								result.message
							}
						})
					}
                }).catch(error => {
                    that.$alert(error,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {
                            //todo
                        }
                    })
                })
            },
            //已选择列表
            handleSelectionChange(val){
                this.selectedgroupItem = val;
            },
            //全选
            selectAll(rows){
                if(rows){
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                }else{
                    this.$refs.multipleTable.clearSelection();
                }
            },
            //新增或编辑
            addRolesItem(id){
                this.$router.push({path: '/workgroupAdd/'+id})
            },
            //删除
            deleteRolesItem(id){
				let that = this;
				let params={
					token:that.token,
					id:id,
				};
				that.$api.branchgroupDelete_normal(params).then(response=>{
					if(response.data.msg_code==100000){
						that.$alert('删除成功');
						that.getGroupList(that.currentPage)
					}else{
						that.$alert(response.data.message,'提示',{
							confirmButtonText: '知道了',
							callback: action => {
								result.message
							}
						})
					}
				}).catch(error => {
                    that.$alert(error,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {
                            //todo
                        }
                    })
                })
            },
            //列表分页
            current_change:function(currentPage){
                this.currentPage = currentPage;
                this.getGroupList(currentPage);
            },
        },
        mounted(){
            let that=this;
			that.token = this.$cookies.get('ZL_token'); 
			// if(that.$cookies.get('user_role')=='3'){
			// 	that.type = 'GROUP';
			// 	that.pathUrl = '/group_super'
			// }else if(that.$cookies.get('user_role')=='1'){
			// 	that.type = 'BRANCH';
			// 	that.pathUrl = '/purchasers_super'
			// }
            that.getGroupList(1)
        }
	}
</script>

<style lang="less" scoped>
	.roles-manage-wrapper{
		background: #eee;
		padding: 10px;
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
			padding: 30px 20px;
			.btn{
				outline: none;
				border: 0;
				margin: 0;
				padding: 0;
				background: none;
				cursor: pointer;
			}
			.add-btn{
				width: 68px;
				height: 30px;
				background: #2793F4;
				font-size: 12px;
				color: #fff;
				border-radius: 4px;
				// margin-left: 30px;
				margin-right: 10px;
			}
			.delete-btn{
				width: 68px;
				height: 30px;
				background: #FF4B4B;
				font-size: 12px;
				color: #fff;
				border-radius: 4px;
			}
			.roles-table{
				margin-top: 20px;
				.table-edit-btn{
					width: 68px;
					height: 20px;
					font-size: 12px;
					color: #2793F4;
					border: 1px solid #2793F4;
					border-radius: 4px;
                    margin-right: 10px;
				}
				.table-del-btn{
					width: 68px;
					height: 20px;
					font-size: 12px;
					color: #FF4B4B;
					border: 1px solid #FF4B4B;
					border-radius: 4px;
				}
			}
		}
	}
</style>