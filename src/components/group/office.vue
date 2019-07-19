<template>
    <div>
        <h3>分公司列表</h3>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <!-- <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="全部" class="width120">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="待确认" value="0"></el-option>
                    <el-option label="已确认" value="1"></el-option>
                    <el-option label="未通过" value="2"></el-option>
                </el-select>
            </el-form-item> -->
            <!-- auth_name -->
            <el-form-item label="公司名">
                <el-input placeholder="请输入公司名" class="width180" v-model="formInline.auth_name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="nomalBtn1" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item v-show="addBranchBtn">
                <el-button type="primary" class="nomalBtn2" @click="release">添加分公司</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column  prop="auth_name" label="名称" >
            </el-table-column>
            <el-table-column  prop="show_name" label="用户名" >
            </el-table-column>
            <el-table-column  prop="user_name" label="联系人" >
            </el-table-column>
            <el-table-column  prop="mobile" label="联系人电话" >
            </el-table-column>
            <el-table-column  prop="detail_address" label="地址" >
            </el-table-column>
            <el-table-column  prop="quota" label="采购额度" >
            </el-table-column>
            <!-- <el-table-column  prop="status" label="状态" >
            </el-table-column> -->
            <el-table-column  label="操作" width="180">
                <template slot-scope="scope">
                    <!-- v-if='scope.row.status == "已通过"' -->
                    <div class="nomalBtn1 tabelBtn" v-show="quotaBtn"  @click="quotaThisRow(scope.row)">配额</div>
                    <div class="nomalBtn1 tabelBtn" v-show="deleteBtn" @click="deleteThisRow(scope.row)">删除</div>
                    <div v-show="noneBtn">--</div>
                </template>
            </el-table-column >
             <!-- @click="editItem(scope.row)" -->
        </el-table>
        <div class="pageCont" v-if='total>10'>
            <el-pagination background layout="prev, pager, next" :total="total" :currentPage="currentPage"  @current-change="getTabList"></el-pagination>
        </div>

        <el-dialog
            title="添加分公司"
            :visible.sync="dialogVisible"
            width="80%"
            >
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="公司名称">
                    <el-input placeholder="公司名称" v-model="findComName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="nomalBtn1" @click="onSubmit1">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="tableData1"
                border
                style="width: 100%">
                <el-table-column  prop="auth_name" label="名称" >
                </el-table-column>
                <el-table-column  prop="show_name" label="用户名" >
                </el-table-column>
                <el-table-column  prop="user_name" label="联系人" >
                </el-table-column>
                <el-table-column  prop="mobile" label="联系人电话" >
                </el-table-column>
                <el-table-column  prop="detail_address" label="地址" >
                </el-table-column>
                <el-table-column  label="操作" width="120">
                    <template slot-scope="scope">
                        <div class="nomalBtn1 tabelBtn1" @click="editItem1(scope.row)">设为分公司</div>
                    </template>
                </el-table-column >
            </el-table>
            <div class="pageCont pageCont1"  v-if='total1>10'>
                <el-pagination background layout="prev, pager, next" :total="total1" :currentPage="currentPage1"  @current-change="getTabList1"></el-pagination>
            </div>
        </el-dialog>


        <el-dialog
            title="配额"
            :visible.sync="dialogVisible1"
            width="60%"
            >
            <div><span class="tryedPhone">公司名称：</span>{{quotaCom}}</div>
            <div><span class="tryedPhone">剩余配额：</span>{{quotaMoney}}</div>
            <div class="phoneCode">
                <span>配置额度：（正数加上，负数减去）</span>
                <el-input v-model="quota" placeholder="请输入金额" size="small"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="addDemand">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "order-list",
        data() {
            return {
                quotaCom:"",
                quotaMoney:"",
                quota:"",
                quotaId:'',
                groupId:"",





                dialogVisible1:false,
                findComName:'',
                dialogVisible:false,
                // dialogName:"创建批次订单",
                per_page:10,
                total:0,
                currentPage:0,
                token:"",
                formInline: {
                    status: 'all',
                    auth_name:""
                },
                copyParams:{
                },
                tableData:[],
                tableData1:[],
                total1:0,
                currentPage1:0,
                copyParams1:{
                    auth_name:""
                },
                //权限按钮
                addBranchBtn:false,
                quotaBtn:false,
                deleteBtn:false,
                noneBtn:false,
            }
        },
        methods: {
            //权限按钮
            getAuthority(){
                let that=this;
                if(that.$store.getters.authForGroup.NormalMyBranch.transfers.length!=0){
                    that.$store.getters.authForGroup.NormalMyBranch.transfers.map(item=>{
                        if(item.power_transfer_name.indexOf('添加分公司')!=-1){
                            that.addBranchBtn=true;
                        }else if(item.power_transfer_name.indexOf('配额')!=-1){
                            that.quotaBtn=true;
                        }else if(item.power_transfer_name.indexOf('删除')!=-1){
                            that.deleteBtn=true;
                        }
                    });
                }else{
                    that.noneBtn=true;
                }
            },
            addDemand(){
                let that = this;
                that.$http.post('/api/frontend/member/quota/update', {
                    token:that.token,
                    id:that.quotaId,
                    quota:that.quota,
                    group_id:that.groupId
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.dialogVisible1 = false;
                        that.getTabList(1);
                        that.getdetail()
                    }else{
                        that.$alert(response.data.message , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(function (error) {
                    that.$alert(error , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                });
            },
            editItem1(val){
                let that = this;
                this.$alert('请确认将'+val.auth_name+'设置成分公司吗？', '添加确认', {
                    confirmButtonText: '确定',
                    cancelButtonText:'取消',
                    showCancelButton:true,
                    callback: action => {
                        if(action == 'confirm'){
                            that.$http.post('/api/frontend/member/branch/set', {
                                token:that.token,
                                id:val.id
                            }).then(function (response) {
                                if(response.data.msg_code == 100000){
                                    that.dialogVisible = false;
                                    that.getTabList(1);
                                }else{
                                    that.$alert(response.data.message , '警告', {
                                        confirmButtonText: '确定',
                                        callback: action => {
                                        }
                                    });
                                }
                            }).catch(function (error) {
                                that.$alert(error , '警告', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                    }
                                });
                            });
                        }
                    }
                });
            },
            onSubmit1(){
                let that = this;
                let params = {
                    current_page:1,
                    per_page:10,
                    token:that.token,
                    auth_name:that.findComName
                };
                that.copyParams1 = params;
                that.getTabList1(1);
            },
            release(){
                this.dialogVisible = true;
                this.findComName = '';
                this.copyParams1.auth_name = '';
                this.getTabList1(1);

            },
            getTabList1(page){
                let that = this;
                let params = that.copyParams1;
                that.currentPage1 = page;
                params.current_page = page;
                params.per_page = 10;
                params.token = that.token;
                that.$http.get('/api/frontend/member/branch/other', {
                    params
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.total1 = response.data.response.total;
                        that.tableData1 = response.data.response.data.map((item)=>{
                            let element = {
                                id:item.member_auth.user_base_id,
                                auth_name:item.member_auth.auth_name,
                                detail_address:item.detail_address,
                                user_name:item.member_auth ? item.member_auth.legal_person : "-",
                                mobile:item.member ? item.member.mobile : "-",
                                show_name:item.member ? item.member.show_name : "-",
                                detail_address:item.member_auth.detail_address,
                                quota:item.member ? item.member.quota : "-"
                            };
                            return element;
                        });
                    }else{
                        that.$alert(response.data.message , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(function (error) {
                    that.$alert(error , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                });
            },
            quotaThisRow(val){
                let that = this;
                that.dialogVisible1 = true;
                that.quotaCom = val.auth_name;
                that.quotaId = val.id
            },
            deleteThisRow(val){
                let that = this;
                this.$alert('请确认删除'+val.auth_name+'这家分公司吗？', '确认删除', {
                    confirmButtonText: '确定',
                    cancelButtonText:'取消',
                    showCancelButton:true,
                    callback: action => {
                        if(action == 'confirm'){
                            that.$http.post('/api/frontend/member/branch/del', {
                                token:that.token,
                                id:val.id
                            }).then(function (response) {
                                if(response.data.msg_code == 100000){
                                    that.getTabList(1);
                                }else{
                                    that.$alert(response.data.message , '警告', {
                                        confirmButtonText: '确定',
                                        callback: action => {
                                        }
                                    });
                                }
                            }).catch(function (error) {
                                that.$alert(error , '警告', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                    }
                                });
                            });
                        }
                    }
                });
            },
            onSubmit() {
                let that = this;
                let params = {
                    current_page:1,
                    per_page:10,

                    auth_name:that.formInline.auth_name,

                    token:that.token
                };
                if(that.formInline.status != 'all'){
                    params.status = that.formInline.status
                };
                that.copyParams = params;
                that.getTabList(1);
            },
            getTabList(page){
                let that = this;
                let params = that.copyParams;
                that.currentPage = page;
                params.current_page = page;
                params.per_page = 10;
                params.token = that.token;
                that.$http.get('/api/frontend/member/lists', {
                    params
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.total = response.data.response.total;
                        that.tableData = response.data.response.data.map((item)=>{
                            let element = {
                                id:item.member_auth.user_base_id,
                                auth_name:item.member_auth.auth_name,
                                detail_address:item.detail_address,
                                user_name:item.member_auth ? item.member_auth.legal_person : "-",
                                mobile:item.member ? item.member.mobile : "-",
                                show_name:item.member ? item.member.show_name : "-",
                                detail_address:item.member_auth.detail_address,
                                quota:item.member ? item.member.quota : "-",
                                status:item.status == "0" ? "待确认" :item.status == "1" ? "已通过" :"未通过" 
                            };
                            return element;
                        });
                    }else{
                        that.$alert(response.data.message , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(function (error) {
                    that.$alert(error , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                });
            },
            getdetail(){
                let that = this;
                let params = {};
                params.token = that.token;
                that.$http.get('/api/frontend/member/detail', {
                    params
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.quotaMoney = response.data.response.quota;
                        that.groupId= response.data.response.id
                    }else{
                        that.$alert(response.data.message , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(function (error) {
                    that.$alert(error , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                });
            }
        },
        mounted(){
            let that = this;
            // 设置下token
            if(!that.$cookies.get("ZL_token")){
                that.$router.push({path: '/login'})
            }else{
                that.token = that.$cookies.get("ZL_token");
            };
            // 获得 列表数据
            that.getTabList(1);
            that.getdetail();
            that.getAuthority();
        }
    }
</script>
<style lang="less" scoped>
    .tryedPhone{
		display: inline-block;
		width: 98px;
        text-align: right;
        margin-bottom: 30px;
    }
    .phoneCode{
        margin-top: 20px;
        .el-input{
            display: inline-block;
            width: 200px;
            height: 15px;
        }
	}
	.phoneCode span{
		display: inline-block;
		width: 250px;
		text-align: right;
	}
    .pageCont1{
        clear: both;
        position: relative;
        top: 17px;
    }
    .thisDiv{
        width: 20px;
        height: 20px;
        margin: 0 auto;
        cursor: pointer;
        background-size: 100% 100%;
        background-image: url(../../assets/purch/dele.png);
    }
    .onelineDiv{
        height: 30px;
        line-height: 30px;
        margin-bottom: 20px;
        .nomalBtn1{
            float: right;
            padding: 0 10px;
            border-radius: 5px;
        }
    }
    .tabelBtn{
        width: 70px;
        margin: 1px;
    }
    .tabelBtn1{
        width: 80px;
        margin: 0 auto;
        padding: 0 5px;
        text-align: center
    }
    .priceDiv{
        width: 20%;
        margin-left: 5%;
        padding: 5px 2.5%;
        border: 1px solid #888;
        float: left;
        border-radius: 5px;
        height: 100px;
        margin-bottom: 30px;
        .title{
            line-height: 30px;
            font-size: 18px;
            color: #666;
        }
        .price{
            line-height: 20px;
            font-size: 14px;
            color: #888;
            input{
                outline: none;
                border: none;
                border-bottom: 1px solid #888;
                width: 60px;
                text-align: center;
            }
        }
    }
    .uploadButton{
        width: 200px;
        border-radius: 5px;
        position: relative;
        input{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999;
            opacity: 0;
        }
    }
    .addDiv{
        .addSpan{
            color: #999;
        }
    }
    h3{
        margin: 0;
        text-align: left;
    }
    form{
        margin-top: 20px;
    }
    .width350{
        width: 350px;
    }
    .width210{
        width: 210px;
    }
    .width180{
        width: 180px;
    }
    .width150{
        width: 150px;
    }
    .width120{
        width: 120px;
    }
    .width90{
        width: 90px;
    }
    .width60{
        width: 60px;
    }
</style>