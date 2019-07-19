<template>
  <div class="user-add-wrapper">
    <h2 class="title">新建组信息</h2>
    <div class="content">
        <el-form label-width="80px" class="user-form">
            <el-form-item label="组名称">
                <el-input v-model="groupName" placeholder="请输入组名称"></el-input>
            </el-form-item>
        </el-form>
        <div class="clearfix">
            <div class="listTable">
                <div class="listTitle clearfix">组成员<button type="button" class="btn add-btn" @click="openGroupsWindow">添加组成员</button></div>
                <el-table :data="workgroupsList" style="width: 100%">
                    <el-table-column prop="name" label="组成员"></el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                            <div class="btn table-del-btn" @click="deleteGroupsItem(scope.row.id,scope.$index)">删除</div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <div class="pagination-wrapper" v-if="workGroupsTotal > 0">
                    <el-pagination background layout="prev, pager, next" :total="workGroupsTotal" :currentPage="workGroupsCurrentPage" @current-change="workgroup_current_change">
                    </el-pagination>
                </div> -->
            </div>
            <div class="listTable">
                <div class="listTitle clearfix">角色<button type="button" class="btn add-btn" @click="openRolesWindow">添加角色权限</button></div>
                <el-table :data="workrolesList" style="width: 100%">
                    <el-table-column prop="name" label="角色名"></el-table-column>
                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                            <div class="btn table-del-btn" @click="deleteRolesItem(scope.row.id,scope.$index)"><img src="../../assets/public/groupdelet.png" height="16px" width="16px"/>删除</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-wrapper" v-if="workRolesTotal > 0">
                    <el-pagination background layout="prev, pager, next" :total="workRolesTotal" :currentPage="workRolesCurrentPage" @current-change="workrole_current_change">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div style="height:100%;padding:0% 2% 2%;color:#666;box-shadow: 1px 1px 10px #eee;margin:1% 3%">
             <p style="line-height:15px;display:inline-block;">组权限</p>
            <div class="tabHeader">
                <div class="first">导航名称</div>
                <div class="second" style="padding-left: 5%;">权限操作</div>
            </div>
            <div class="tabContain">
                <el-tree :data="authorityData" show-checkbox node-key="id" ref="tree" highlight-current :props="defaultProps">
                    <!--<div class="custom-tree-node" slot-scope="{ node, data }">
                         <div class="first"><img src="../../assets/public/folder.png" height="16px" width="16px"/>{{ data.label }}</div>
                        <div class="second">
                            <el-checkbox-group v-model="checkedItem">
                                <el-checkbox v-for="item in data.authorityArr" :key="item.id" :value="item.id" :label="JSON.stringify(item)">{{item.power_transfer_name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div> -->
                </el-tree>
            </div>

        </div>
        <div class="btns-div">
            <button type="button" class="cancel-btn" @click="before">取消</button>
            <button type="button" class="confirm-btn" @click="creatGroup">确定</button>
        </div>
    </div>


    <!-- 组列表弹框 -->
        <el-dialog title="添加组成员" center :visible.sync="workGroupsWindowVisible">
            <div class="groupsList-wrapper">
                <!-- <el-form :inline="true" :model="searchGroupsForm" class="demo-form-inline">
                    <el-form-item label="成员姓名">
                        <el-input v-model="searchGroupsForm.content" prefix-icon="el-icon-search" placeholder="请输入成员姓名">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getGroupsManageList(1)">查询</el-button>
                    </el-form-item>
                </el-form> -->
                <el-table
                    ref="multipleGroupTable"
                    :data="groupsList"
                    stripe
                    @selection-change="handleGroupChange"
                    @row-click="groupSelectItem"
                    :row-key="getRowKey"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="成员">
                    </el-table-column>
                    <el-table-column type="selection" :reserve-selection="true"></el-table-column>
                </el-table>
                <div class="pagination-wrapper" v-if="groupsTotal > 0">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="groupsTotal"
                        :currentPage="groupsCurrentPage"
                        @current-change="group_current_change">
                    </el-pagination>
                </div>
                <div class="btns-div">
                    <button type="button" class="btn cancel-btn" @click="workGroupsWindowVisible=false">取消</button>
                    <button type="button" class="btn confirm-btn" @click='groupSure'>确定</button>
                </div>
            </div>
        </el-dialog>

        <!-- 角色列表弹框 -->
		<el-dialog title="添加管理角色" center :visible.sync="rolesListWindowVisible">
			<div class="rolesList-wrapper">
				<!-- <el-form :inline="true" :model="searchRolesForm" class="demo-form-inline">
				  	<el-form-item label="角色名">
				   		<el-input
				   			v-model="searchRolesForm.content"
				   			 prefix-icon="el-icon-search"
				   			placeholder="请输入角色名">
				   		</el-input>
				  	</el-form-item>
				  	 <el-form-item>
				    	<el-button type="primary" @click="getRolesManageList(1)">查询</el-button>
				  	</el-form-item> 
				</el-form> -->
				<el-table
                    ref="multipleRoleTable"
                    :data="rolesList" stripe
                    @selection-change="handleRoleChange"
                    @row-click="roleSelectItem"
                    :row-key="getRowKey"
                    style="width: 100%">
				  	<el-table-column
				    	prop="name"
				    	label="角色名">
				  	</el-table-column>
				  	<el-table-column type="selection" :reserve-selection="true"></el-table-column>
				</el-table>
				<div class="pagination-wrapper" v-if="rolesTotal > 0">
				    <el-pagination
				        background
				        layout="prev, pager, next"
				        :total="rolesTotal"
				        :currentPage="rolesCurrentPage"
				        @current-change="current_change">
				    </el-pagination>
				</div>
				<div class="btns-div">
					<button type="button" class="btn cancel-btn" @click="rolesListWindowVisible=false">取消</button>
					<button type="button" class="btn confirm-btn" @click="rolesSure">确定</button>
				</div>
			</div>
		</el-dialog>
  </div>
</template>

<script>
export default {
    data() {
      return{
            token:'',
            id:'',
            // type:'',
            // pathUrl:'',
            //组名称
            groupName:'',
            //组列表
            workGroupsWindowVisible: false,
            groupsList:[],
            searchGroupsForm: {
                content: ''
            },
            groupsTotal: 0,
            groupsCurrentPage: 1,

            workgroupsList:[],
            workGroupsTotal: 0,
            workGroupsCurrentPage: 1,
            //角色列表
            rolesListWindowVisible: false,
            rolesList: [],
            searchRolesForm: {
                content: ''
            },
            rolesTotal: 0,
            rolesCurrentPage: 1,

            workrolesList:[],
            workRolesTotal: 0,
            workRolesCurrentPage: 1,
            getRowKey(row){ //获取组行号，保留之前选中项
                return row.id
            },
            //权限
            authorityData:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            checkedItem:[],

      }
    },
    created(){
        let that = this;
        this.token = this.$cookies.get('ZL_token');
        // if(that.$cookies.get('user_role')=='3'){
        //     that.type = 'GROUP';
        //     that.pathUrl = '/group_super'
        // }else if(that.$cookies.get('user_role')=='1'){
        //     that.type = 'BRANCH';
        //     that.pathUrl = '/purchasers_super'
        // }
        this.permissions();
        let id=this.$route.params.id;
        that.id=id;
        if(id!=-1){
            this.editMessage(id)
        }
    },
    methods:{
        //返回
        before(){
            this.$router.push({path: '/group_super/MobileGroupList'});
        },
        //编辑时的方法
        editMessage(id){
            let that=this;
            let params={
                token:that.token,
                id:id,
            }
            that.$api.mobileGroupDetial(params).then(response=>{
                if(response.data.msg_code===100000){
                    that.groupName=response.data.response.name;
                    that.workgroupsList=response.data.response.memberLists.map(item=>{
                        return{
                            name:item.get_member.user_name,
                            id:item.get_member.id,
                        }
                    });
                    that.workrolesList=response.data.response.groupRoles.map(item=>{
                        return{
                            name:item.get_joint_purchase_power_role.name,
                            id:item.get_joint_purchase_power_role.id,
                        }
                    });
                    that.$refs.tree.setCheckedKeys(response.data.response.transfers[0].get_j_p_mobile_power_group_transfers.map((item)=>{
                            if(item.power_transfer_id!=null){
                                return item.power_transfer_id+1000;
                            }else{
                                return item.current_channel_id;
                            }
                    }));
                }else{
                    that.$alert(response.data.message,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {
                        }
                    })
                }
            }).catch(error => {
                console.log(error)
                that.$alert(error,'提示',{
                    confirmButtonText: '知道了',
                    callback: action => {}
                })
            })
        },
        //打开组列表弹框
        openGroupsWindow(){
            this.workGroupsWindowVisible = true;
            this.searchGroupsForm= {
                content: ''
            },
            this.groupsCurrentPage = 1; //重置组列表分页
            this.workGroupsCurrentPage = 1;
            this.getGroupsManageList(1)
        },
        //打开角色列表弹框
        openRolesWindow(){
            this.rolesListWindowVisible = true;
            this.searchRolesForm= {
                content: ''
            },
            this.rolesCurrentPage = 1;
            this.getRolesManageList(1)
        },
        //弹窗角色列表
        getRolesManageList(pageNum){
            let that=this;
            that.rolesList=[];
            let params={
                token:that.token,
                current_page: pageNum,
                per_page: 10,
            };
            if(that.searchRolesForm.content){
                params.name=that.searchRolesForm.content;
            }
            that.$api.rolesList(params).then(response=>{
                if(response.data.msg_code===100000){
                    that.rolesTotal=response.data.response.total;
                    that.rolesList=response.data.response.data.map((item)=>{
                        return{
                            id:item.id,
                            name:item.name,
                        }
                    })
                }else{
                    that.$alert(response.data.message,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {
                        }
                    })
                }
            }).catch(error => {
                that.$alert(error,'提示',{
                    confirmButtonText: '知道了',
                    callback: action => {}
                })
            })
        },
        //弹窗角色列表翻页
        current_change(currentPage){
            this.rolesCurrentPage = currentPage;
            this.getRolesManageList(currentPage);
        },
        //选中的角色
        handleRoleChange(val){
            this.workrolesSelect=val;
        },
        //角色确定
        rolesSure(){
            let that = this;
            this.rolesListWindowVisible = false;
            this.workrolesList.push(...this.workrolesSelect);
            that.DuplicateRemove(that.workrolesList)
        },
        //角色列表
        getRolesList(pageNum){
            //this.workrolesList=[];
            this.workRolesTotal=this.workrolesList.length;
        },
        //角色分页
        workrole_current_change(current_change){
            this.workRolesCurrentPage=current_change;
            getRolesList(current_change)
        },

        deleteRolesItem(id,index){
            this.workrolesList.splice(index,1);
        },
        //权限列表
        permissions(){
            let that=this;
            let params={
                token:that.token,
                type:'GROUP',
            }
            that.$api.mobilepermissionsList(params).then(response=>{
                 if(response.data.msg_code === 100000){
                    that.authorityData=response.data.response.map((item)=>{
                        let itemdata;
                        if(item.child_channels.length > 0){
                            itemdata={
                                id:item.id,
                                label:item.name,
                                has_child:item.has_child,
                                children:item.child_channels.map((childitem)=>{
                                        return{
                                            id:childitem.id,
                                            label:childitem.name,
                                            parent_channel_id:item.id,
                                            children:childitem.transfers.map((inititem)=>{
                                                return{
                                                    label:inititem.power_transfer_name,
                                                    parent_channel_id:item.id,
                                                    current_channel_id:childitem.id,
                                                    power_channel_id:inititem.id,
                                                    // power_transfer_name:inititem.power_transfer_name,
                                                    id:inititem.id+1000,
                                                    interface_url:inititem.interface_url,
                                                }
                                            }),
                                        }
                                }),
                            }
                        }else{
                            itemdata={
                                id:item.id,
                                label:item.name,
                                has_child:0,
                                children:item.transfers.map(inititem=>{
                                    return{
                                        label:inititem.power_transfer_name,
                                        parent_channel_id:0,
                                        current_channel_id:item.id,
                                        power_channel_id:inititem.id,
                                        // power_transfer_name:inititem.power_transfer_name,
                                        id:inititem.id+1000,
                                        interface_url:inititem.interface_url,
                                    }
                                })
                            }
                        }
                        return itemdata;
                    });
                }else{
                    that.$alert(response.data.message,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {
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
        //弹窗组成员列表
        getGroupsManageList(pageNum){
            let that=this;
            let params={
                token:that.token,
                current_page: pageNum,
                per_page: 10,
            }
            if(that.searchGroupsForm.content){
                params.user_name=that.searchGroupsForm.content;
            }
            that.$api.usersList(params).then(response=>{
                if(response.data.msg_code===100000){
                    that.groupsTotal=response.data.response.total;
                    that.groupsList=response.data.response.data.map(item=>{
                        return{
                            name:item.user_name,
                            id:item.id,
                        }
                    })
                }else{
                    that.$alert(response.data.message,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {
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
        //弹窗组成员列表翻页
        group_current_change(currentPage){
            this.groupsCurrentPage = currentPage;
            this.getGroupsManageList(currentPage)
        },
        //组成员勾选
        handleGroupChange(val){
            this.workgroupsSelect=val;
        },
        //组成员确定
        groupSure(){
            let that = this;
            this.workGroupsWindowVisible = false;
            this.workgroupsList.push(...this.workgroupsSelect);
            that.DuplicateRemove(that.workgroupsList)
        },
        //组成员列表
        getGroupsList(pageNum){
            this.workGroupsTotal=this.workgroupsList.length;
        },
        //组成员分页
        workGroup_current_change(current_change){
            this.workGroupsCurrentPage=current_change;
            getGroupsList(current_change)
        },
        deleteGroupsItem(id,index){
            this.workgroupsList.splice(index,1);
        },
        //添加组
        creatGroup(){
            let that=this;
            let transfers=[];
            that.$refs.tree.getCheckedNodes().forEach(item=>{
                if(item.children && item.children.length == 0 ){
                    if(item.has_child == 0){
                    transfers.push({
                        parent_channel_id:0,
                        current_channel_id:item.id,
                        power_transfer_id:null,
                    })
                    }else{
                    transfers.push({
                        parent_channel_id:item.parent_channel_id,
                        current_channel_id:item.id,
                        power_transfer_id:null,
                    })
                    }
                }
                else if(item.children==undefined){
                    transfers.push({
                        parent_channel_id:item.parent_channel_id,
                        current_channel_id:item.current_channel_id,
                        power_transfer_id:item.id-1000,
                    })
                }
            });
            let params={
                token:that.token,
                name:that.groupName,
                users:JSON.stringify(that.workgroupsList.map((item)=>{
                    return{
                        creator_name:item.name,
                        user_id:item.id,
                    }
                })),
                roles:JSON.stringify(that.workrolesList.map((item)=>{
                    return{
                        role_id:item.id,
                    }
                })),
                transfers:JSON.stringify(transfers),
            };
            //console.log(that.$refs.tree.getCheckedNodes())
            // if(that.checkedItem.length!=0){
            //     params.transfers=JSON.stringify(that.$refs.tree.getCheckedNodes().map((item) =>{
            //         return {
            //             parent_channel_id:'0',
            //             current_channel_id:item.id,
            //             power_transfer_id:item.id,
            //         }
            //     }));
            //     // .concat(that.checkedItem.map((item) =>{
            //     //     return {
            //     //         parent_channel_id:JSON.parse(item).parent_channel_id,
            //     //         current_channel_id:JSON.parse(item).current_channel_id,
            //     //         power_transfer_id:JSON.parse(item).id,
            //     //     }
            //     // }))
            //     // params.transfers = JSON.stringify(that.checkedItem.map((item) =>{
            //     //     return {
            //     //         parent_channel_id:JSON.parse(item).parent_channel_id,
            //     //         current_channel_id:JSON.parse(item).current_channel_id,
            //     //         power_transfer_id:JSON.parse(item).id,
            //     //     }
            //     // }))
            // }else{
            //     params.transfers=JSON.stringify(that.$refs.tree.getCheckedNodes().map((item) =>{
            //         return {
            //             parent_channel_id:'0',
            //             current_channel_id:item.id,
            //             power_transfer_id:item.id,
            //         }
            //     }));
            // }
            if(that.id==-1){
                that.$api.mobilegroupCreat(params).then(response=>{
                    if(response.data.msg_code===100000){
                        that.$alert('添加成功');
                        that.$router.push({path: '/group_super/MobileGroupList'});
                    }else{
                        that.$alert(response.data.message,'提示',{
                            confirmButtonText: '知道了',
                            callback: action => {
                            }
                        })
                    }
                }).catch(error => {
                    that.$alert(error,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {}
                    })
                })
            }else{
                params.id = that.id;
                that.$api.mobileGroupUpdate(params).then(response=>{
                    if(response.data.msg_code===100000){
                        that.$alert('编辑成功');
                        that.$router.push({path: '/group_super/MobileGroupList'});
                    }else{
                        that.$alert(response.data.message,'提示',{
                            confirmButtonText: '知道了',
                            callback: action => {
                            }
                        })
                    }
                }).catch(error => {
                    that.$alert(error,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {}
                    })
                })
            }
        },
        //组添加成员点击文字选中
        groupSelectItem(row, event, column,){
            this.$refs.multipleGroupTable.toggleRowSelection(row)
        },
        //组添加角色点击文字选中
        roleSelectItem(row, event, column,){
            this.$refs.multipleRoleTable.toggleRowSelection(row)
        }
    }
};
</script>

<style lang="less" scoped>
　  .clearfix::after{
        content: "";
        height: 0;
        line-height: 0;
        display: block;
        visibility: hidden;
        clear: both;
    }
	.user-add-wrapper{
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
			.user-form{
				width: 400px;
            }
        .btn{
            outline: none;
            border: 0;
            margin: 0;
            padding: 0;
            background: rgba(0,0,0,0);
            cursor: pointer;
        }
        .add-btn{
            width: 100px;
            height: 30px;
            background: #2793F4;
            font-size: 12px;
            color: #fff;
            border-radius: 4px;
            margin-left: 30px;
            margin-right: 10px;
        }
        .table-del-btn{
            color: #FF4B4B;
        }
        .listTable{
            float: left;
            width: 45.5%;
            margin-right: 1%;
            margin: 1% 0;
            margin-left: 3%;
            padding: 2%;
            box-sizing: border-box;
            box-shadow: 1px 1px 10px #eee;
            .listTitle{
                margin: 1% 0;
                font-size: 16px;
                color: #666;
                font-weight: 500;
                .add-btn{
                    float: right;
                }
            }
        }
        .custom-tree-node{
            width: 100%;
        }
        .first{
                width: 30%;
                line-height: 40px;
                float: left;
            }
            .second{
                width: 70%;
                line-height: 40px;
                float: left;
                text-align: left;
                box-sizing: border-box;
            }
            .tabHeader{
                background-color: #2793F4;
                color: #fff;
                height: 40px;
                line-height: 40px;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                font-size: 14px;
                text-align: center;
            }
            .tabContain{
                color: #333333;
                font-size: 12px;
                border-bottom-left-radius: 4px;
                border-bottom-left-radius: 4px;
                border-bottom: 1px solid #eee;
            }
    }
    //弹框样式
		.rolesList-wrapper,.groupsList-wrapper{
			width: 100%;
		}
		.pagination-wrapper{
			margin-top: 20px;
			text-align: center;
		}
		.btns-div{
			text-align: center;
			margin-top: 20px;
            margin-bottom: 20px;
		}
		.confirm-btn{
			width: 68px;
			height: 30px;
			background-color: #2793F4;
			font-size: 12px;
			color: #fff;
            border-radius: 4px;
            border: none;
            text-align: center;
            line-height: 30px;
            cursor: pointer;
		}
		.cancel-btn{
			width: 68px;
			height: 30px;
			font-size: 12px;
			color: #2793F4;
			border: 1px solid #2793F4;
			border-radius: 4px;
            margin-right: 20px;
            background: none;
            text-align: center;
            line-height: 30px;
            cursor: pointer;
		}
	}
</style>