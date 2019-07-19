<template>
    <div class="payment-list-wrapper">
        <h3 class="title">支付信息列表</h3>
        <div class="content">
            <el-form :inline="true" label-position="right" :model="searchForm" class="demo-form-inline" label-width="100px">
                <el-form-item label="项目名称">
                    <el-input v-model="searchForm.project_name" placeholder="项目名称" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="批次订单号">
                    <el-input v-model="searchForm.slave_order_code" placeholder="批次订单号" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="产品名称">
                    <el-input v-model="searchForm.product_name" placeholder="产品名称" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="付款方户名">
                    <el-input v-model="searchForm.payer_name" placeholder="付款方户名" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="收款方户名">
                    <el-input v-model="searchForm.payee_name" placeholder="收款方户名" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="金额" >
                    <el-input v-model="searchForm.money" placeholder="金额" class="width200"></el-input>
                </el-form-item>
            </el-form>
            <div class="search-btn-div">
                <el-button type="primary" @click="getPaymentList(1)">查询</el-button>
            </div>
            <!-- 支付信息列表 -->
            <el-table :data="paymentList" v-loading="paymentListLoading" style="width: 100%">
                <el-table-column v-for="(value,key) in tableJson"  :prop="key" :label="value" :key="value"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="pay-already" @click="viewDetail(scope.row.id, scope.row.slave_order_id)">查看详情</span>
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
    name: 'paymentReceiveList_supplier',
    data(){
        return{
            token:"",
            searchForm: {
                project_name: '',
                slave_order_code: '',
                product_name: '',
                money: '',
                payee_name: '',
                payee_account: '',
                payer_name: '',
                payer_account: ''
            },
            paymentList:[],
            tableJson:{
                "project_name": "项目名称",
                "slave_order_code": "批次订单号",
                "product_name": "产品名称",
                "payer_name": "付款方户名",
                "payee_name": "收款方户名",
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
                type: 'ZhuNiuToSupplier'
            }
            //搜索条件有值的情况下才传值
            Object.keys(that.searchForm).forEach(key => {
                if(that.searchForm[key]){
                    params[key] = that.searchForm[key];
                }
            })
            that.paymentListLoading = true;
            that.$api.paymentReceiveList_supplier(params).then(response => {
                let result = response.data;
                if(result.msg_code === 100000){
                    that.total = result.response.total;
                    that.paymentList = result.response.data.map(item => {
                        let element = {
                            id: item.id,
                            slave_order_id: item.payInfo.slave_order_id,
                            project_name: item.payInfo.project_name || '-',
                            slave_order_code: item.slave_order_code,
                            product_name: item.product_name,
                            payee_name: item.payee_name,
                            payer_name: item.payer_name,
                            money: item.money
                        }
                        return  element
                    });
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
        //去支付详情页
        viewDetail(id, slave_order_id){ //id为当前支付订单id
            this.$router.push({name: 'paymentReceiveDetail_supplier', params: {id}, query: {slave_order_id}})
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
            color: #0576DB;
            cursor: pointer;
            &:hover{
                border-bottom: 1px solid #0576DB;
            }
        }
    }
    .el-form--inline .el-form-item{
        margin-right: 65px;
    }
</style>


