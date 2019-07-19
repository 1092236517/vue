<template>
    <div>
        <h3>订单报告</h3>
        <el-form :inline="true" label-position="right" :model="formInline" class="demo-form-inline" label-width="100px">
            <el-form-item label="项目编号">
                <el-input v-model="formInline.order_no" placeholder="项目编号" class="width150"></el-input>
            </el-form-item>
            <el-form-item label="项目名称">
                <el-input v-model="formInline.project_name" placeholder="项目名称" class="width150"></el-input>
            </el-form-item>
            <el-form-item label="分公司名称">
                <el-input v-model="formInline.branch_name" placeholder="分公司名称" class="width150"></el-input>
            </el-form-item>
            <el-form-item label="品牌" >
                <el-input v-model="formInline.brand_name" placeholder="品牌" class="width150"></el-input>
            </el-form-item>
            <el-form-item label="规格">
                <el-input v-model="formInline.diameter" placeholder="规格" class="width150"></el-input>
            </el-form-item>
            <el-form-item label="供应商名称">
                <el-input v-model="formInline.supplier_name" placeholder="供应商" class="width150"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-col :span="8">
                    <el-date-picker type="date" placeholder="选择起始日期" v-model="formInline.start_date" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="8">
                    <el-date-picker type="date" placeholder="选择截止日期" v-model="formInline.end_date" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="是否收货">
                <el-radio-group v-model="formInline.status">
                    <el-radio label="">全部</el-radio>
                    <el-radio label="accept">已收货</el-radio>
                    <el-radio label="unaccept">未收货</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="nomalBtn1" @click="onSubmit(1)" >查询</el-button>
            </el-form-item>
        </el-form>
        <div class="borderBox"></div>
        <div>
            <div class="totalnum floatL">总价：<span class="num">{{ sumPrice | roundedToTwoDecimals }}</span>元</div>
            <div class="totalnum floatL">总供货数量：<span class="num">{{ sumNum }}</span>吨</div>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column v-for="(value,key) in tableJson"  :prop="key" :label="value" :key="value"></el-table-column>
        </el-table>
        <div class="pageCont" v-if='total>10'>
            <el-pagination background layout="prev, pager, next" :total="total" :currentPage="currentPage"  @current-change="current_change"></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    filters: {
        //保留两位小数
        roundedToTwoDecimals(value){
            let number = parseFloat(value);
            if(isNaN(number)){
                return '--'
            }
            return number.toFixed(2)
        }
    },
    data(){
        return{
            token:"",
            formInline: {
                order_no: '',
                project_name: '',
                branch_name:'',
                brand_name:'',
                supplier_name:'',
                start_date:'',
                end_date:'',
                diameter:'',
                status:'',
            },
            sumPrice:'--',
            sumNum:'--',
            tableData:[],
            tableJson:{
                "created_at":"时间",
                "order_no":"项目编码",
                "project_name":'项目名称',
                "branch_name":"分公司名称",
                'supplier_name':"供应商",
                'category_name':"产品名称",
                "brand_name":"品牌",
                "diameter":"规格",
                "quoted_price_website":"价格参考网站",
                "webPrice":'当日网价',
                "num":"数量（吨）",
                'totalPrice':"总价（元）",
                'quoted_price_location':"价格参考地",
                "status":"订单状态",
            },
            per_page:10,
            total:0,
            currentPage:0,
            searchBtn:false
        }
    },
    mounted(){
        let that = this;
        if(!that.$cookies.get("ZL_token")){
            that.$router.push({path: '/login'})
        }else{
            that.token = that.$cookies.get("ZL_token");
        };
        // that.getAuthority();
        that.onSubmit(1);
    },
    methods:{
        /**
         * 格式化时间
         * @param  {Object} date 时间对象
         * @param  {String} type 'start'|'end'补足时分秒'00:00:00'|'23:59:59'
         * @return {String}      格式化时间字符串'yyyy-MM-dd'
         */
        formatDate(date, type){
            let year = date.getFullYear();
            let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
            let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
            let time = {
                start: '00:00:00',
                end: '23:59:59'
            }
            return year + '-' + month + '-' + day + ' ' + (time[type] || '00:00:00');
        },
        //权限按钮
        getAuthority(){
            let that=this;
            //console.log(that.$store.getters.authForGroup)
            if(that.$store.getters.authForGroup.SlaveOrderReport && that.$store.getters.authForGroup.SlaveOrderReport.transfers.length!=0){
                that.$store.getters.authForGroup.SlaveOrderReport.transfers.map(item=>{
                    if(item.power_transfer_name.indexOf('查询')!=-1){
                        that.searchBtn=true;
                    }
                });
            }
        },
        //搜索按钮
        onSubmit(pageNum){
            let that = this;
            that.tableData = [];
            that.currentPage = pageNum;
            that.sumNum ="";
            that.sumPrice ="";
            let params = {
                token:that.token,
                per_page:that.per_page,
                current_page:pageNum,
            }
            if(that.formInline.order_no){
                params.order_no = that.formInline.order_no;
            }
            if(that.formInline.project_name){
                params.project_name = that.formInline.project_name;
            }
            if(that.formInline.branch_name){
                params.branch_name = that.formInline.branch_name
            }
            if(that.formInline.brand_name){
                params.brand_name = that.formInline.brand_name;
            }
            if(that.formInline.diameter){
                params.diameter = that.formInline.diameter;
            }
            if(that.formInline.supplier_name){
                params.supplier_name = that.formInline.supplier_name;
            }
            if(that.formInline.start_date){
                params.start_time = that.formatDate(that.formInline.start_date, 'start');
            }
            if(that.formInline.end_date){
                params.end_time = that.formatDate(that.formInline.end_date, 'end');
            }
            if(that.formInline.status){
                params.status = that.formInline.status;
            }
            that.$api.orderReportSum(params).then(response=>{
                that.sumNum = response.data.response.sum;
            })
            that.$api.orderReportCount(params).then(response=>{
                 that.sumPrice = response.data.response.count;
            })
            that.$api.orderReportList(params).then(response=>{
                // that.sumPrice = response.data.response.sumPrice || '--';
                // that.sumNum = response.data.response.sumNum || '--';
                response.data.response.data.forEach(function(item){
                    switch (item.slave_order.status) {
                        case 'WAIT_SUPPLIER_CONFIRM_GOODS_PRICE_AND_QUANTITY':
                            item.statusN = "待供应商确认"
                            break;
                        case 'WAIT_BRANCH_CONFIRM_PRICE_AND_QUANTITY':
                            item.statusN = "待分公司确认"
                            break;
                        case 'BRANCH_CONFIRM_PRICE_AND_QUANTITY_REJECT':
                            item.statusN = "分公司拒绝"
                            break;
                        case 'WAIT_GROUP_PAY':
                            item.statusN = "待集团支付"
                            break;
                        case 'WAIT_ZN_PAY':
                            item.statusN = "待筑牛支付"
                            break;
                        case 'WAIT_SUPPLIER_CONFIRM_RECEIVE_MONEY':
                            item.statusN = "待收款"
                            break;
                        case 'WAIT_SEND_GOODS':
                            item.statusN = "待发货"
                            break;
                        case 'WAIT_SIGN':
                            item.statusN = "待收货"
                            break;
                        case 'FINISHED':
                            item.statusN = "订单完成"
                            break;
                        default:
                            item.statusN = "-"
                            break;
                    }
                    let dataItem = {
                        created_at : item.slave_order.created_at || '--',
                        order_no:item.slave_order.order_no,
                        project_name:item.slave_order.master_order.project_name,
                        branch_name:item.slave_order.master_order.branch_name,
                        supplier_name:item.slave_order.master_order.supplier_name,
                        category_name:item.slave_order.master_order.demand.category.name,
                        brand_name:item.slave_order.master_order.brand_name,
                        quoted_price_website:item.slave_order.master_order.quoted_price_website=="MY_STEEL"?'我的钢铁':'西本',
                        quoted_price_location:item.slave_order.master_order.demand.reference_city.mergername || '--',
                        status:item.statusN,
                        diameter: item.diameter||'--',
                        webPrice: item.price|| '--',
                        num: item.num|| '--',
                        totalPrice: item.group_total_money?that.toDecimal(item.group_total_money) : '--',
                    }
                    that.tableData.push(dataItem);
                    // if(item.get_slave_order_configures.length!=0){
                    //     for(let i=0;i<item.get_slave_order_configures.length;i++){
                    //         let dataItem = {
                    //             created_at : item.created_at || '--',
                    //             order_no:item.order_no,
                    //             project_name:item.master_order.project_name,
                    //             branch_name:item.master_order.branch_name,
                    //             supplier_name:item.master_order.supplier_name,
                    //             category_name:item.master_order.demand.category.name,
                    //             brand_name:item.master_order.brand_name,
                    //             quoted_price_website:item.master_order.quoted_price_website=="MY_STEEL"?'我的钢铁':'西本',
                    //             quoted_price_location:item.master_order.demand.reference_city.mergername || '--',
                    //             status:item.statusN
                    //         }
                    //         dataItem.diameter=item.get_slave_order_configures[i].diameter || '--';
                    //         dataItem.webPrice=item.get_slave_order_configures[i].webPrice || '--';
                    //         dataItem.num=item.get_slave_order_configures[i].num || '--';
                    //         dataItem.totalPrice=item.get_slave_order_configures[i].totalPrice || '--';
                    //         that.tableData.push(dataItem);
                    //     }
                    // }else{
                    //      let dataItem = {
                    //         created_at : item.created_at || '--',
                    //         order_no:item.order_no,
                    //         project_name:item.master_order.project_name,
                    //         branch_name:item.master_order.branch_name,
                    //         supplier_name:item.master_order.supplier_name,
                    //         category_name:item.master_order.demand.category.name,
                    //         brand_name:item.master_order.brand_name,
                    //         quoted_price_website:item.master_order.quoted_price_website=="MY_STEEL"?'我的钢铁':'西本',
                    //         quoted_price_location:item.master_order.demand.reference_city.mergername || '--',
                    //         status:item.statusN
                    //     }
                    //     dataItem.diameter= '--';
                    //     dataItem.webPrice= '--';
                    //     dataItem.num= '--';
                    //     dataItem.totalPrice= '--';
                    //     that.tableData.push(dataItem);
                    // }
                    // item.get_slave_order_configures.forEach(childrenItem=>{
                    //     dataItem.diameter=childrenItem.diameter || '--';
                    //     dataItem.webPrice=childrenItem.webPrice || '--';
                    //     dataItem.num=childrenItem.num || '--';
                    //     dataItem.totalPrice=childrenItem.totalPrice || '--';
                    //     console.log(dataItem)
                    //     that.tableData.push(dataItem);
                    // })
                });
                that.total = response.data.response.total;
            }).catch(error => {
                console.log(error);
                that.$alert(error,'提示',{
                    confirmButtonText: '知道了',
                    callback: action => {}
                })
            })
        },
        current_change(currentPage){
            this.currentPage = currentPage;
            this.onSubmit(currentPage);
        },
    }
}
</script>

<style scoped lang="less">
    h3{
        color: #0576DB;
    }
    .line{
        text-align: center;
    }
    .el-form--inline .el-form-item{
        margin-right: 65px;
    }
    .width150{
        width: 150px;
        height: 100%;
    }
    .width70{
        width: 70px;
    }
    .floatL{
        float: left;
    }
    .borderBox{
        border-bottom: 1px dashed #ccc;
        height: 1px;
        width: 99%;
        margin: 0 auto;
        margin-bottom: 20px;
    }
    .totalnum{
        margin-right: 50px;
        margin-bottom: 20px;
        margin-left: 20px;
        font-size:8px;
        color:rgba(51,51,51,1);
        .num{
            display: inline-block;
            background:rgba(241,241,241,1);
            border:1px solid rgba(215,215,215,1);
            border-radius: 2px;
            height: 16px;
            padding: 5px;
            margin: 0 5px;
        }
    }
    .pageCont{
        padding-bottom: 84px;
    }
</style>


