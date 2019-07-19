<template>
    <div class="payment-list-wrapper">
        <h3 class="title">支付信息列表</h3>
        <div class="content">
            <el-form :inline="true" label-position="right" :model="searchForm" class="demo-form-inline" label-width="100px">
                <el-form-item label="支付状态" style="display: block;">
                    <el-radio-group v-model="searchForm.status">
                        <el-radio label="">全部</el-radio>
                        <el-radio label="WAIT_PAY">未支付</el-radio>
                        <el-radio label="PAY_ALREADY">已支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="项目编号">
                    <el-input v-model="searchForm.project_code" placeholder="项目编号" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="批次单编号">
                    <el-input v-model="searchForm.slave_order_code" placeholder="批次单编号" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="产品名称">
                    <el-input v-model="searchForm.product_name" placeholder="产品名称" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="金额" >
                    <el-input v-model="searchForm.money" placeholder="金额" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="收款方户名">
                    <el-input v-model="searchForm.payee_name" placeholder="收款方户名" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="收款方账号">
                    <el-input v-model="searchForm.payee_account" placeholder="收款方账号" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="付款方户名">
                    <el-input v-model="searchForm.payer_name" placeholder="付款方户名" class="width200"></el-input>
                </el-form-item>
                 <el-form-item label="付款方账号">
                    <el-input v-model="searchForm.payer_account" placeholder="付款方账号" class="width200"></el-input>
                </el-form-item>
            </el-form>
            <div class="search-btn-div">
                <el-button type="primary" @click="getPaymentList(1)">查询</el-button>
            </div>
            <!-- 支付信息列表 -->
            <el-table :data="paymentList" v-loading="paymentListLoading" style="width: 100%">
                <el-table-column v-for="(value,key) in tableJson"  :prop="key" :label="value" :key="value"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 'PAY_ALREADY'" class="pay-already">已支付</span>
				  		<el-button v-else type="primary" size="mini" @click="confirmedToPay(scope.row)">确认支付</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pageCont" v-if="total>10">
                <el-pagination background layout="prev, pager, next" :total="total" :currentPage="currentPage"  @current-change="current_change"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            token:"",
            searchForm: {
                project_code: '',
                slave_order_code: '',
                product_name: '',
                money: '',
                payee_name: '',
                payee_account: '',
                payer_name: '',
                payer_account: '',
                status: ''
            },
            paymentList:[],
            tableJson:{
                "project_code": "项目编码",
                "slave_order_code": "批次订单号",
                "product_name": "产品名称",
                "payee_bank_name": "收款方银行名称",
                "payee_name": "收款方户名",
                "payee_account": "收款方账号",
                "payer_bank_name": "付款方银行名称",
                "payer_name": "付款方户名",
                "payer_account": "付款方账号",
                "money": "金额"
            },
            paymentListLoading: false,
            per_page: 10,
            total: 0,
            currentPage: 1
        }
    },
    created(){
        this.token = this.$cookies.get("ZL_token");
        this.getPaymentList(1);
    },
    methods:{
        //搜索
        getPaymentList(pageNum){
            let that = this;
            that.paymentList = [];
            let params = {
                token: that.token,
                current_page: pageNum,
                per_page: 10,
                type: 'GroupToZhuNiu'
            }
            //搜索条件有值的情况下才传值
            Object.keys(that.searchForm).forEach(key => {
                if(that.searchForm[key]){
                    params[key] = that.searchForm[key];
                }
            })
            that.paymentListLoading = true;
            that.$api.payInformationList_normal(params).then(response => {
                let result = response.data;
                if(result.msg_code === 100000){
                    that.total = result.response.total;
                    that.paymentList = result.response.data;
                }else{
                    that.$alert(result.message,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {
                            result.message
                        }
                    })
                }
                that.paymentListLoading = false;
            }).catch(error => {
                that.paymentListLoading = false;
                that.$alert(error,'提示',{
                    confirmButtonText: '知道了',
                    callback: action => {
                        //todo
                    }
                })
            })
        },
        current_change(currentPage){
            this.currentPage = currentPage;
            this.getPaymentList(currentPage);
        },
        //确认支付
        confirmedToPay(paymentItem){
            let that = this;
            let params ={
                token: that.token,
                id: paymentItem.id,
                slave_order_id: paymentItem.slave_order_id
            }
            that.$confirm('是否确认付款？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                iconClass: 'el-icon-question'
            }).then(() => {
                that.$api.grouptConfirmToPay_normal(params).then(response => {
                    let result = response.data;
                    if(result.msg_code == 100000){
                        that.$router.push({name: 'groupPayResultApproved'})
                    }else{
                        that.$alert(result.message, '提示', {
                            confirmButtonText: '知道了',
                            callback: action => {
                            }
                        })
                    }
                }).catch(error => {
                    console.log(error);
                    that.$alert(error, '提示', {
                        confirmButtonText: '知道了',
                        callback: action => {
                            //todo
                        }
                    })
                })
            }).catch(()=>{
                that.$message({
                    type: 'info',
                    message: '已取消付款'
                });
            })
        }
    }
}
</script>

<style scoped lang='less'>
    .payment-list-wrapper{
        .title{
            margin-top: 0;
        }
        .width200{
            width: 200px;
            height: 100%;
        }
        .search-btn-div{
            margin-top: 10px;
            margin-bottom: 30px;
            margin-left: 20px;
        }
        .pay-already{
            color: #26B240;
        }
    }
    .el-form--inline .el-form-item{
        margin-right: 65px;
    }
</style>


