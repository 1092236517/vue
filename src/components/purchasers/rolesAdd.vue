<template>
    <div class="user-add-wrapper">
		<h2 class="title">编辑角色信息</h2>
        <div class="content">
            <el-form label-width="80px" class="user-form">
                <el-form-item label="角色类别">
                    <el-select v-model="types" placeholder="请选择角色类别">
                        <el-option v-for="item in rolesType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色名称">
                    <el-input v-model="rolesName" placeholder="请输入角色名称"></el-input>
                </el-form-item> 
                <!-- <el-form-item label="管理权限">
                    <el-checkbox  :indeterminate="isIndeterminate" v-model="authoritycheckAll" @change="handleCheckAllChange">全选</el-checkbox>
                </el-form-item>  -->
            </el-form>
            <div style="height:100%;margin: 2% 1%;">
                    <div class="tabHeader">
                        <div class="first">导航名称</div>
                        <div class="second" style="padding-left:5%;">权限操作</div>
                    </div>
                    <div class="tabContain">
                        <el-tree :data="authorityData" show-checkbox node-key="id" ref="tree" default-expand-all highlight-current :props="defaultProps">
                            <!-- <div class="custom-tree-node" slot-scope="{ node, data }">
                                <div class="first">{{ data.label }}</div>
                                <div class="second">
                                    <el-checkbox-group v-model="checkedItem">
                                        <el-checkbox v-for="item in data.authorityArr" :key="item.id" :value="item.id" :label="JSON.stringify(item)">{{item.power_transfer_name}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </div> -->
                        </el-tree>
                    </div>
                    
                </div>
                <el-button type="primary" @click="submit">确定</el-button>
                <el-button @click="before">返回</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            token:'',
            // type:'',
            // pathUrl:'',
            rolesType:[],
            //权限
            authorityData:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            types:'',
            rolesName:'',
            //checkbox
            authoritycheckAll:false,
            isIndeterminate:true,
            checkedItem:[],
        }
    },
    methods:{
        //返回
        before(){
            this.$router.push({path: '/RolesManage'})
        },
        //修改——信息回填
        getRolesManageList(id){
            let that=this;
            let params={
                token:that.token,
                id:id,
            };
            that.$api.branchrolesList_normal(params).then(response=>{
                if(response.data.msg_code===100000){
                    that.types=response.data.response.data[0].role_tag_id;
                    that.rolesName=response.data.response.data[0].name;
                    // console.log(response.data.response.data[0].get_joint_purchase_power_role_transfers.map((item)=>{
                    //     return {
                    //         label:item.get_joint_purchase_power_channel_transfer.get_joint_purchase_power_channel_power.current_channel_name,
                    //         id:item.get_joint_purchase_power_channel_transfer.id,
                    //         authorityArr:item.get_joint_purchase_power_channel_transfer,
                    //     }
                    // }))
                    // that.$refs.tree.setCheckedKeys(response.data.response.data[0].get_joint_purchase_power_role_transfers.map((item)=>{
                    //     //return {
                    //         //label:item.get_joint_purchase_power_channel_transfer.get_joint_purchase_power_channel_power.current_channel_name,
                    //         return item.current_channel_id;
                    //     //}
                    // }));
                    that.$refs.tree.setCheckedKeys(response.data.response.data[0].get_role_transfers.map((item)=>{
                            if(item.power_transfer_id!=null){
                                return item.power_transfer_id+1000;
                            }else{
                                return item.current_channel_id;
                            }
                    }));
                    // that.checkedItem=response.data.response.data[0].get_joint_purchase_power_role_transfers.map((item)=>{
                    //     return JSON.stringify({
                    //         parent_channel_id:item.parent_channel_id,
                    //         current_channel_id:item.current_channel_id,
                    //         power_channel_id:item.get_joint_purchase_power_channel_transfer.power_channel_id,
                    //         power_transfer_name:item.get_joint_purchase_power_channel_transfer.power_transfer_name,
                    //         id:item.get_joint_purchase_power_channel_transfer.id,
                    //         interface_url:item.get_joint_purchase_power_channel_transfer.interface_url,           
                    //     })
                    // })
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
        //角色类别
        roleCategory(){
            let that=this;
            let params={
                token:that.token,
            };
            that.$api.branchroleCategory_normal(params).then(response=>{
                if(response.data.msg_code === 100000){
                    that.rolesType=response.data.response.data;
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
        //权限列表
        permissions(){
            let that=this;
            // let params={
            //     token:that.token,
            //     type:'BRANCH',
            // }
            // that.$api.branchpermissionsList(params).then(response=>{
            //     if(response.data.msg_code === 100000){
                    that.authorityData=JSON.parse(that.$store.state.sideBarMenuDataForGroup).map((item)=>{
                        let itemdata;
                        if(item.child_channels.length > 0){
                            itemdata={
                                id:item.id,
                                label:item.name,
                                has_child:item.has_child,
                                children:item.child_channels.map((childitem)=>{
                                    //if(childitem.has_child==0){
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
                                    // }else{
                                    //     return{
                                    //         id:childitem.id,
                                    //         label:childitem.name,
                                    //         parent_channel_id:item.id,
                                    //         current_channel_id:childitem.id,
                                    //         power_channel_id:null
                                    //     }
                                    // }
                                    
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
            //     }else{
            //         that.$alert(response.data.message,'提示',{
            //             confirmButtonText: '知道了',
            //             callback: action => {
            //             }
            //         })
            //     }
            // }).catch(error => {
            //     that.$alert(error,'提示',{
            //         confirmButtonText: '知道了',
            //         callback: action => {
            //             //todo
            //         }
            //     })
            // })
        },
        //全选
        handleCheckAllChange(val) {
            //this.authorityCheck=val;
            if(val==true){
                this.$refs.tree.setCheckedNodes(this.authorityData);
            }else{
                this.$refs.tree.setCheckedKeys([]);
            }
        },
        //确定提交
        submit(){
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
            if(that.id==-1){
                let params={
                    token:that.token,
                    role_tag_id:that.types,
                    name:that.rolesName,
                    role_transfers:JSON.stringify(transfers),
                }
                that.$api.branchroleCreat_normal(params).then(response=>{
                    if(response.data.msg_code===100000){
                        that.$alert('添加成功');
                        that.$router.push({path: '/RolesManage'})
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
                let params={
                    token:that.token,
                    id:that.id,
                    role_tag_id:that.types,
                    name:that.rolesName,
                    role_transfers:JSON.stringify(transfers),
                }
                // if(that.checkedItem.length!=0){
                //     params.role_transfers=JSON.stringify(that.$refs.tree.getCheckedNodes().map((item) =>{
                //         return {
                //             parent_channel_id:'0',
                //             current_channel_id:item.id,
                //             power_transfer_id:item.id,
                //         }
                //     }).concat(that.checkedItem.map((item) =>{
                //         return {
                //             parent_channel_id:JSON.parse(item).parent_channel_id,
                //             current_channel_id:JSON.parse(item).current_channel_id,
                //             power_transfer_id:JSON.parse(item).id,
                //         }
                //     })));
                // }else{
                //     params.role_transfers=JSON.stringify(that.$refs.tree.getCheckedNodes().map((item) =>{
                //         return {
                //             parent_channel_id:'0',
                //             current_channel_id:item.id,
                //             power_transfer_id:item.id,
                //         }
                //     }));
                // }
                that.$api.branchroleUpdate_normal(params).then(response=>{
                    if(response.data.msg_code===100000){
                        that.$alert('修改成功');
                        that.$router.push({path: '/RolesManage'})
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
        }
    },
    mounted(){
        let that=this;
        that.token = that.$cookies.get("ZL_token");
        // if(that.$cookies.get('user_role')=='3'){
        //     that.type = 'GROUP';
        //     that.pathUrl = '/group_super'
        // }else if(that.$cookies.get('user_role')=='1'){
        //     that.type = 'BRANCH';
        //     that.pathUrl = '/purchasers_super'
        // }
        that.id=that.$route.params.id;
        if(that.id!=-1){
            that.getRolesManageList(that.id)
        }
        that.roleCategory();
        that.permissions();
    }
}
</script>



<style lang="less" scoped>
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
			// .btn{
			// 	outline: none;
			// 	border: 0;
			// 	margin: 0;
			// 	padding: 0;
			// 	background: none;
			// 	cursor: pointer;
			// }
			.user-form{
				width: 400px;
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
            }
		}
	}
</style>
