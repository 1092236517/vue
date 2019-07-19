<template>
    <div class="contain">
        <div class="header">联采单列表</div>
            <div class="inputcontain">
                <div class="inputs">
                    采购单号：
                    <el-input placeholder="请输入内容" v-model="orderNo" clearable></el-input>
                </div>
                <div class="inputs">
                    公司名称：
                    <el-input placeholder="请输入内容" v-model="companyName" clearable></el-input>
                </div>
                <div class="inputs">
                    产品名：
                    <el-input placeholder="请输入内容" v-model="productName" clearable></el-input>
                </div>
                <div class="inputs">
                    状态：
                    <el-select v-model="status" placeholder="全部">
                        <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status"></el-option>
                    </el-select>
                </div>
                <div class="inputs" style="width:5%;">
                    <el-button type="primary" @click="getTabList(1)">查询</el-button>
                </div>
            </div>
            <div class="tabCont">
                <el-table :data="tableData" border style="width:100%">
                    <el-table-column prop="authName" label="公司名称"></el-table-column>
                    <el-table-column prop="project_code" label="项目编码"></el-table-column>
                    <el-table-column prop="brandName" label="联采品类"></el-table-column>
                    <el-table-column prop="categoryType" label="规格"></el-table-column>
                    <el-table-column prop="purchaseNum" label="核准数量（吨）"></el-table-column>
                    <el-table-column prop="deadline" label="报价截止时间"></el-table-column>
                    <el-table-column prop="companyNum" label="已报价供应商数量"></el-table-column>
                    <el-table-column prop="authStatus" label="状态">
                        <template slot-scope="scope">
                            <span :class="scope.row.exit.colors">{{scope.row.authStatus}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="exit" label="操作" >
                        <template slot-scope="scope">
                            <div  v-if='scope.row.exit.test == 0&&lookDetial'><div @click='clickThis(scope.row.exit.id)' class="clickne">查看详情</div></div>
                            <div v-else-if="lookDetial"  @click='clickThis(scope.row.exit.id)' class="clicknes">查看详情</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_no" label="采购单号"></el-table-column>
                    <!-- <el-table-column prop="order_no" label="采购单号"></el-table-column>
                    <el-table-column prop="authName" label="公司名称"></el-table-column>
                    <el-table-column prop="brandName" label="产品名称"></el-table-column>
                    <el-table-column prop="categoryType" label="规格"></el-table-column>
                    <el-table-column prop="deadline" label="截止时间"></el-table-column>
                    <el-table-column prop="purchaseNum" label="数量（吨）"></el-table-column>
                    <el-table-column prop="companyNum" label="报名数量（供应商）"></el-table-column>
                    <el-table-column prop="authStatus" label="状态">
                        <template slot-scope="scope">
                            <span :class="scope.row.exit.colors">{{scope.row.authStatus}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="exit" label="操作" >
                        <template slot-scope="scope">
                            <div  v-if='scope.row.exit.test == 0&&lookDetial'><div @click='clickThis(scope.row.exit.id)' class="clickne">查看详情</div></div>
                            <div v-else-if="lookDetial"  @click='clickThis(scope.row.exit.id)' class="clicknes">查看详情</div>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
        <div class="pageCont" v-if="total > 0">
            <el-pagination background layout="prev, pager, next" :total="total" :currentPage="currentPage"  @current-change="current_change"></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name:"colect-List",
    data(){
        return{
            //bid_demand_purchase_quoted_price_record_id:0,
            token: '',
            options: [{
                status: '',
                label: '全部'
                }, {
                status: 'PENDING',
                label: '待处理'
                },{
                status: 'QUOTING',
                label: '报价中'
                },{
                status: 'FINISH',
                label: '发单成功'
                }, {
                status: 'ABORT',
                label: '已流标'
                },{
                status: 'DEADLINE',
                label: '已截标'
                }  ],
            status:"",
            companyName:"",
            orderNo: '',
            productName: '',
            perPage:10,
            total:0,
            currentPage:1,
            tableData:[],
            url_prefix: '/api/frontend/joint_purchase/super',
            //权限按钮
            lookDetial:false
        }
    },
    methods:{
        //权限按钮
        getAuthority(){
            let that=this;
            //console.log(that.$store.getters.authForGroup.JointPurchaseOrderList)
            that.$store.getters.authForGroup.JointPurchaseOrderList.transfers.map(item=>{
                if(item.power_transfer_name.indexOf('查看详情')!=-1){
                    that.lookDetial=true;
                }
            });
        },
        // 联采单列表
        getTabList(pageNum){
            let that = this;
            let params = {
                per_page: that.perPage ,
                current_page: pageNum,
                token: that.token,
            };
            if(that.status){
                params.running_status = that.status
            }
            if(that.companyName){
                params.auth_name = that.companyName
            }
            if(that.orderNo){
                params.order_no = that.orderNo
            }
            if(that.productName){
                params.prodcut_name = that.productName
            }
            let url = that.url_prefix + '/group/demand/purchases/lists';
            that.$http.get(url,{params} ).then(function (response) {
                if(response.data.msg_code==100000){
                    that.currentPage = pageNum;
                    let arr = response.data.response.data;
                    that.tableData = arr.map( (item)=> {
                        
                        let specifications = JSON.parse(item.demand.category_spec);
                        let paramItem={
                            order_no: item.order_no || '--',
                            project_code:item.demand.project_code || '--',
                            authName:!item.demand.member.member_auth.auth_name?'--':item.demand.member.member_auth.auth_name,
                            brandName:!item.demand.category.name?'--':item.demand.category.name,
                            categoryType:specifications.category_spec_min +'--'+ specifications.category_spec_max,
                            deadline:!item.demand.deadline?'--':item.demand.deadline,
                            authStatus:!item.status?'--':item.status,
                            purchaseNum:!item.demand.purchase_num?'--':item.demand.purchase_num,
                            companyNum:!item.quoted_supplier_num?'--':item.quoted_supplier_num,
                            exit:{
                                id:item.demand.demand_purchase_id,
                                mid:item.demand.member.member_auth.id
                            }
                        };
                        
                        if(item.running_status=="QUOTING"){
                            paramItem.authStatus="报价中";
                            paramItem.exit.test=1;
                            paramItem.exit.colors="yellow";
                        }else if(item.running_status=="PENDING"){
                            paramItem.authStatus="待处理";
                            paramItem.exit.test=0;
                            paramItem.exit.colors="yellow";
                        }else if(item.running_status=="FINISH"){
                            paramItem.authStatus="发单成功";
                            paramItem.exit.test=1;
                            paramItem.exit.colors="blue";
                        }else if(item.running_status=="ABORT"){
                            paramItem.authStatus="已流标";
                            paramItem.exit.test=1;
                            paramItem.exit.colors="red";
                        }else if(item.running_status=="DEADLINE"){
                            paramItem.authStatus="已截标";
                            paramItem.exit.test=1;
                            paramItem.exit.colors="red";
                        }else{
                            paramItem.authStatus="--";
                            paramItem.exit.test='';
                            paramItem.exit.colors="";
                        }
                        return paramItem;
                    })
                    that.total=response.data.response.total;
                }else {
                    that.$alert(response.data.message , '警告', {confirmButtonText: '确定', callback: action => {}});
                }
            }).catch(function (error) {
                that.$alert(error , '警告', {confirmButtonText: '确定', callback: action => {}});
            });
        },
        //列表分页
        current_change:function(currentPage){
            this.currentPage = currentPage;
            this.getTabList(currentPage);
        },
        //查看详情
        clickThis(id){
            let that=this;
            that.$router.push({path:"/group_super/collectionDetail_super/" + id})           
        },
    },
    mounted(){
        let that=this;
        that.getAuthority();
    },
    created(){
        this.token = this.$cookies.get("ZL_token");
        this.getTabList(1);
    }    
}
</script>

<style lang="less" scoped>
    .contain {
        .header {
            height: 60px;
            width: 99%;
            background-color: #fff;
            text-align: left;
            margin:.5% .5%;
            line-height: 60px;
            padding-left: 2%;
            box-sizing: border-box;
            color: #0576db;
            font-size: 24px;
            font-weight: 600;
            border-radius: 4px;
        }
            .yellow{
                color: #ffc601;
                font-weight: 600;
            }
            .blue{
                color: #0576db;
                font-weight: 600;
            }
            .red{
                color: red;
                font-weight: 600;
            }
            .inputcontain{
                height: 60px;
                line-height: 60px;
                display: inline-block;
                width: 100%;
                font-size: 14px;
                color: #333333;
                .inputs{
                        float: left;
                        height: 60px;
                        width: 22%;
                        margin-left: 1%;
                        text-align: center;
                    .el-input {
                        position: relative;
                        font-size: 14px;
                        display: inline-block;
                        float: right;
                        width: 60%;
                    }
                    .el-select{
                        width: 65%;
                    }
                }
            }
            .tabCont{
                box-sizing: border-box;
                .clicknes{
                        height: 30px;
                        width: 70px;
                        background-color: #0677dc;
                        color: #fff;
                        text-align: center;
                        line-height: 30px;
                        cursor: pointer;
                        border-radius: 7px;
                        margin: 0 auto;
                }
                .clickne{
                     height: 30px;
                        width: 70px;
                        background-color: red;
                        color: #fff;
                        text-align: center;
                        line-height: 30px;
                        cursor: pointer;
                        border-radius: 7px;
                        margin: 0 auto;
                }
            }
    }
</style>

