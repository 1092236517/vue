<template>
    <div>
        <h2 class="joint-data-header">数据报表</h2>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="project_name"
                label="项目名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="branch_name"
                label="分公司名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="start_time"
                label="项目开始时间">
            </el-table-column>
            <el-table-column
                prop="total_order"
                label="订单总批次数">
            </el-table-column>
            <el-table-column
                prop="order_total_money"
                label="订单总金额（元）">
            </el-table-column>
            <el-table-column
                prop="quantity"
                label="供货数量（吨）">
            </el-table-column>
            <el-table-column
                prop="max_overdue_days"
                label="最长逾期天数">
            </el-table-column>
            <el-table-column
                prop="min_overdue_days"
                label="最短逾期天数">
            </el-table-column>
            <el-table-column
                prop="past_due"
                label="逾期最大金额">
            </el-table-column>
            <el-table-column
                prop="breach_total_money"
                label="违约总金额">
            </el-table-column>
            <el-table-column
                prop="Maximum_arrears"
                label="最高累计欠款金额">
            </el-table-column>
            <el-table-column  label="操作" width="180">
                <template slot-scope="scope">
                    <router-link :to="'/group_super/jointdatadetail_super/' + scope.row.id"><el-button type="primary" v-show="lookButton">查看详情</el-button></router-link>
                </template>
            </el-table-column >
        </el-table>
        
    </div>

</template>

<script>
    export default {
        data(){
        	return {
        		tableData: [
                    {
                        id: 1,
                        project_name: '合肥新慧翠湖',
                        branch_name: '安徽分公司',
                        start_time: '2017-09-09',
                        total_order: 13,
                        order_total_money: 3858078.93,
                        quantity: 871.514,
                        max_overdue_days: 8,
                        min_overdue_days: 3,
                        past_due: 794536.68,
                        breach_total_money: 66259.98,
                        Maximum_arrears: 3791818.95,
                        src: require('../../assets/jointdata/hefei.png')
                    },
                    {
                        id: 2,
                        project_name: '蜀冈玫瑰园二期',
                        branch_name: '宁夏分公司',
                        start_time: '2017-03-04',
                        total_order: 35,
                        order_total_money: 9166350.25,
                        quantity: 2086.19,
                        max_overdue_days: 46,
                        min_overdue_days: 3,
                        past_due: 644747.59,
                        breach_total_money: 674868.47,
                        Maximum_arrears: 3520189.04
                    },
                    {
                        id: 3,
                        project_name: '蜀冈玫瑰园三期',
                        branch_name: '第一分公司',
                        start_time: '2017-04-07',
                        total_order: 29,
                        order_total_money: 7146447.62,
                        quantity: 1669.95,
                        max_overdue_days: 29,
                        min_overdue_days: 1,
                        past_due: 457262.45,
                        breach_total_money: 193273.95,
                        Maximum_arrears: 2006881.61
                    }
                ],
                lookButton:false
        	}
        },
        methods: {
             //权限按钮
            getAuthority(){
                let that=this;
                that.$store.getters.authForGroup.JointPurchaseDataSummary.transfers.map(item=>{
                    if(item.power_transfer_name.indexOf('查看详情')!=-1){
                        that.lookButton=true;
                    }
                });
            },
            goToDetail(id){
                this.$router.push({path: '/group_super/jointdatadetail_super/'+id})
            }
        },
        mounted(){
        	// 设置下token
        	if(!this.$cookies.get("ZL_token")){
        	    this.$router.push({path: '/login'})
        	}else{
        	    this.token = this.$cookies.get("ZL_token");
        	};
            this.getAuthority();
        }
    }
</script>


<style lang="less" scoped>
    .joint-data-header{
        font-size: 24px;
        color: #0576DB;
    }
</style>