<template>
    <div>
        <h3>网价订单列表</h3>
        <el-form :inline="true" :model="formInline" class="demo-form-inline" v-show="searchBtn">
            <el-form-item label="订单号">
                <el-input v-model="formInline.order_no" placeholder="订单号" class="width150"></el-input>
            </el-form-item>
            <el-form-item label="项目名称">
                <el-input v-model="formInline.project_name" placeholder="项目名称" class="width150"></el-input>
            </el-form-item>
            <el-form-item label="供应商名称">
                <el-input v-model="formInline.supplier_name" placeholder="供应商名称" class="width150"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="全部" class="width120">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="履约中" value="PENDING"></el-option>
                    <el-option label="关闭中" value="CLOSING"></el-option>
                    <el-option label="已结束" value="FINISHED"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="nomalBtn1" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" border style="width: 100%">
            <el-table-column v-for="(value,key) in tableJson"  :prop="key" :label="value" :key="value"></el-table-column>
            <el-table-column label="申请关闭原因" width="180">
                <template slot-scope="scope">
                    <div class="closeBtn" @click="showCloseReason(scope.row.close_reason)" >{{ scope.row.close_reason }}</div>
                </template>
            </el-table-column>
            <el-table-column  label="操作" width="230">
                <template slot-scope="scope">
                    <div v-if="lookDetial" class="nomalBtn1 tabelBtn" @click="order(scope.row.id)">订单详情</div>
                </template>
            </el-table-column >
        </el-table>
        <div class="pageCont" v-if='total>10'>
            <el-pagination background layout="prev, pager, next" :total="total" :currentPage="currentPage"  @current-change="current_change"></el-pagination>
        </div>

    </div>
</template>

<script>
    export default {
        name: "order-list",
        data() {
            return {
                per_page:10,
                total:0,
                currentPage:0,
                // token
                token:"",
                role_id: '',
                formInline: {
                    order_no: '',
                    status: 'all',
                    supplier_name:'',
                    project_name:""
                },
                copyParams:{},
                tableData: [],
                tableJson:{
                    order_no:"订单编号",
                    project_name:"项目名称",
                    project_code:"项目编码",
                    brand_name:"产品名",
                    specifications:"规格",
                    purchase_num:"数量",
                    supplier_name:"供应商",
                    status:"状态"
                },
                accountingBtnVisible: '',
                jointBtnVisible: '',
                finaceBtnVisible: '',
                //权限按钮
                searchBtn:false,
                closure:false,
                lookDetial:false
            }
        },
        methods: {
            //权限按钮
            getAuthority(){
                let that=this;
                //console.log(that.$store.getters.authForGroup)
                if(that.$store.getters.authForGroup.OrderList && that.$store.getters.authForGroup.OrderList.transfers.length!=0){
                    that.$store.getters.authForGroup.OrderList.transfers.map(item=>{
                        if(item.power_transfer_name.indexOf('查询')!=-1){
                            that.searchBtn=true;
                        }else if(item.power_transfer_name.indexOf('查看详情')!=-1){
                            that.lookDetial=true;
                        }else if(item.power_transfer_name.indexOf('申请关闭')!=-1){
                            that.closure=true;
                        }
                    });
                }
            },
            //获取用户信息
            getUserInfo(){
                let that = this;
                let url = '/api/frontend/member/detail';
                let params = {
                    token: that.token
                }
                that.ZN_GET(url,params,function(data){
                    that.role_id = data.response.member_extend.service_role_id;
                    that.accountingBtnVisible = data.response.parent_id > 0 && data.response.member_extend.service_role_id == 4;
                    that.jointBtnVisible = data.response.parent_id > 0 && data.response.member_extend.service_role_id == 2;
                    that.finaceBtnVisible = data.response.parent_id > 0 && data.response.member_extend.service_role_id == 3;
                })
            },
            order(id){
                let that = this;
                that.$router.push({path: '/group_super/NetworkPriceManagementDetails_super/'+id})
            },
            onSubmit() {
                let that = this;
                let params = {
                    current_page:1,
                    per_page:10,
                    token:that.token
                };
                if(that.formInline.order_no){
                    params.order_no = that.formInline.order_no
                }
                if(that.formInline.status != 'all'){
                    params.status = that.formInline.status
                }
                if(that.formInline.supplier_name){
                    params.supplier_name = that.formInline.supplier_name
                }
                if(that.formInline.project_name){
                    params.project_name = that.formInline.project_name
                }
                that.copyParams = params;
                that.getTabList(1);
            },
            current_change(currentPage){
                this.currentPage = currentPage;
                this.getTabList(currentPage);
            },
            getTabList(page){
                let that = this;
                let params = that.copyParams;
                that.currentPage = page;
                params.current_page = page;
                params.per_page = 10;
                params.token = that.token;
                that.$http.get('/api/frontend/joint_purchase/super/group/order/lists', {
                    params
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.total = response.data.response.total;
                        that.tableData = response.data.response.data.map((item)=>{
                            let element = {
                                id:item.id,
                                order_no:item.order_no,
                                project_name:item.project_name,
                                project_code:item.demand_purchase.demand.project_code,
                                status:item.status == "PENDING"? "履约中" : item.status == "CLOSING" ? "关闭中" : "已结束",
                                supplier_name: item.supplier_name,
                                purchase_num :item.purchase_num,
                                brand_name: item.category.name,
                                quoted_price_location:item.quoted_price_location,
                                quoted_price_website:item.quoted_price_website == "XB" ? "西本":"我的钢铁",
                                close_reason: item.close_reason || '-',
                                verify_goods_amount:item.demand_purchase.demand.verify_goods_amount||'-'
                            };
                            let specifications = JSON.parse(item.category_spec);
                            element.specifications = specifications.category_spec_min +'-'+specifications.category_spec_max;
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
            //展示申请关闭原因
            showCloseReason(reason){
                this.$alert(reason,'申请关闭原因', {
                    confirmButtonText: '确定',
                    callback: action => {}
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
            }
            // 获得 列表数据
            that.getTabList(1);
            that.getAuthority();
        }
    }
</script>
<style lang="less" scoped>
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
    .closeBtn{
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>

