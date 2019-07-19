<template>
    <div>
        <h3>订单详情</h3>
        <div class="titlediv">订单号：{{orderN}}
            <span class="rightSpan">{{orderState}}</span>
        </div>
        <el-table
            :data="data1"
            border
            style="width: 100%">
            <el-table-column  prop="branch_name" label="采购商" >
            </el-table-column>
            <el-table-column  prop="supplier_name" label="供应商" >
            </el-table-column>
            <el-table-column  prop="project_name" label="项目名称" >
            </el-table-column>
            <el-table-column  prop="demand_purchase.demand.delivery_address_district" label="收货地" >
            </el-table-column>
            <el-table-column  prop="demand_purchase.demand.delivery_address_detail" label="详细地址" >
            </el-table-column>
            <el-table-column  prop="demand_purchase.demand.consignee_name" label="收货人" >
            </el-table-column>
            <el-table-column  prop="demand_purchase.demand.consignee_mobile" label="收货人电话" >
            </el-table-column>
            <el-table-column  prop="demand_purchase.demand.consignee_identity_card" label="收货人身份证" >
            </el-table-column>
            <el-table-column  v-if="orderState == '关闭中'" prop="close_reason" label="关闭原因" key="orderClosed">
            </el-table-column >
        </el-table>
        <div class="online"></div>
        <div class="titlediv">采购信息   <span class="rightSpan">订单生成时间：{{created_at}}</span></div>
        <el-table :data="data1" border style="width: 100%">
            <el-table-column  prop="demand_purchase.demand.category.name" label="产品名" >
            </el-table-column>
            <el-table-column  prop="spec" label="规格" >
            </el-table-column>
            <el-table-column  prop="brand_name" label="品牌" >
            </el-table-column>
            <el-table-column  prop="purchase_num" label="采购数量" >
            </el-table-column>
            <el-table-column  prop="received_goods_num" label="已收数量" >
            </el-table-column>
        </el-table>

        <div class="online"></div>
        <div class="titlediv">订单批次信息  </div>
        <el-table :data="data2" border style="width: 100%">
            <el-table-column  prop="batch_number" label="批次号">
            </el-table-column>
            <el-table-column  prop="order_no" label="批次订单号"  width="180">
            </el-table-column>
            <el-table-column  prop="received_goods_num" label="发货适量（吨）" >
            </el-table-column>
            <el-table-column  prop="send_goods_time" label="发货日期" >
            </el-table-column>
            <el-table-column  prop="statusN" label="状态" >
            </el-table-column>
            <el-table-column  label="操作" width="240">
                <template slot-scope="scope">
                    <div class="nomalBtn1 tabelBtn" @click="seeItem1(scope.row)">{{scope.row.isNum == 2?"配置网价":"查看详情"}}</div>
                </template>
            </el-table-column >
        </el-table>

        <div class="online"></div>
        <div class="titlediv">成交价格  </div>
        <el-table :data="priceData" border style="width: 100%" :span-method="SpanMethod">
            <el-table-column  prop="supplier_name" label="供应商名" ></el-table-column>
            <el-table-column  prop="time" label="报价时间" ></el-table-column>
            <el-table-column  prop="description" label="订单支付方式" ></el-table-column>
            <el-table-column  prop="price" label="单位（元/吨）" ></el-table-column>
        </el-table>

        <el-dialog title="填写网价" :visible.sync="dialogVisible" width="50%">
            <div>报价参考: {{ dialogFs }}</div>
            <div>
                <span>参考地：</span>
                <span>{{ dialogPlace }}</span>
            </div>
            <el-form>
               <el-form-item label="支付方式">
                    <el-select v-model="dialogJson.pay_description" placeholder="请选择支付方式" class="width350"  :disabled="true">
                        <el-option label="dialogJson.pay_description" value="dialogJson.pay_description"></el-option>
                        <el-option label="每月10日，结清上月贷款" value="PAID_AFTER_IN_TENTH"></el-option>
                        <el-option label="货到工地，90天内结算所欠货款" value="PAID_AFTER_IN_NINETIETH"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="dialogtimeTitle">
                    <span class="requiredSpan">*</span>
                    <el-date-picker
                        v-model="dialogJson.receive_time"
                        type="datetime"
                        value-format= 'yyyy-MM-dd HH:mm:ss'
                        placeholder="选择日期时间"
                        :disabled="true">
                    </el-date-picker>
                </el-form-item> 
                <div v-if="attachments.length > 0 ">收货凭证</div>
                <div v-for="item in attachments" :key="item.path" v-if="attachments.length > 0 ">
                    <a target="_blank" :href="item.path" download="download" class="downloadA">{{item.original_name}}</a>
                </div>
                <div class="onelineDiv">参数详情</div>
                 <el-table
                    :data="dialogJson.spec"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="brand_name"
                        label="产品名"
                        >
                        <template slot-scope="scope">
                            <div>{{scope.row.brand_name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="diameter"
                        label="直径（mm）"
                        >
                        <template slot-scope="scope">
                            <div>{{scope.row.diameter}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="数量（吨）">
                        <template slot-scope="scope">
                            <div>{{scope.row.num}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="is_seismic"
                        label="抗震需求">
                        <template slot-scope="scope">
                            <div>{{scope.row.is_seismic == '0' ? '不抗震' : '抗震'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="length"
                        label="长度（米）">
                        <template slot-scope="scope">
                            <div>{{scope.row.length == '0' ? '--' : scope.row.length}}</div>
                        </template>
                    </el-table-column>
                    <!-- todo start v-if="allocationShow" -->
                    <el-table-column prop="price" label="网上标价（元）">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.price" placeholder="网上标价" @blur="comput(scope.row)" :disabled="isNum != 2"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="group_total_money" label="总额（元）">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.group_total_money" placeholder="总额" :disabled="true"></el-input>
                        </template>
                    </el-table-column>
                    <!-- todo end  v-if="allocationShow"-->
                    <el-table-column
                        prop="remark"
                        label="备注"
                        >
                        <template slot-scope="scope">
                            <div>{{scope.row.remark == '0' ? '--' : scope.row.remark}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkForBatchOrder(dialogJson.id)" v-if="isNum == 2">同 意</el-button>
                <el-button @click="dialogVisible = false" v-if="isNum == 1">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    export default {
        data(){
            return {
                role_id: '',
                isNum : 0,
                //文件 数组
                attachments:[],
                // 编辑时  id
                editId:0,
                // 供应商报价截止时间
                dialogtimeTitle:"供应商报价截止时间",
                fileList:[],
                dialogVisible:false,
                id:1,
                orderN:0,
                orderState:"",
                data1:[],
                created_at:'',
                dialogPlace:"",
                dialogFs:"",
                dialogJson:{
                    status:"PAID_BEFORE",
                    spec:[],
                    receive_time:''
                },
                data2:[],
                group_pay_amount:'',
                hasClose:true,
                url_prefix: '/api/frontend/joint_purchase/normal',
                stepData: {
                    curStep: 0,
                    steps: [],
                    operateData: []
                },
                //成交价格表格
                priceData:[],
                priceArr:[],
                pricePos:'',
            }
        },
        methods: {
            //计算价格
            comput(val){
                let that = this;
                let reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
                if(reg.test(val.price)){
                    let params = {
                        token:that.token,
                        configure_id:val.id,
                        type:'GROUP_ACTUAL_MONEY',
                        price:val.price,
                        num:val.num,
                    }
                    // val.group_total_money = val.num * val.price || 0;
                    that.$api.NetworkPriceCount_normal(params).then(response=>{
                        if(response.data.msg_code===100000){
                            val.group_total_money = response.data.response.groupActualMoney.toFixed(2);
                        }else{
                            that.$alert(response.data.message , '警告', {
                                confirmButtonText: '确定',
                                callback: action => {},
                            });
                        }
                    }).catch(error=>{
                            that.$alert(error , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    })
                }else{
                    this.$alert('请输入正确的当日网价（数字）');
                    val.price = "";
                }
            },
            // 同意提交
            checkForBatchOrder(id){
                let that = this;
                let params = {
                    token: that.token,
                    spec: JSON.stringify(that.dialogJson.spec.map(item=>{
                        item.group_price = item.price;
                        return item;
                    }))
                };
                that.$api.NetworkPriceUpdate_normal(params,id).then(response=>{
                    if(response.data.msg_code===100000){
                        that.dialogVisible = false;
                        that.getData(that.id);
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
            // 查看详情
            seeItem1(val){
                let that = this;
                that.editId = val.id;
                if((val.paid_type == 'PAID_BEFORE' && val.status=='WAIT_GROUP_PAY')||(val.paid_type != 'PAID_BEFORE' && (val.status=='WAIT_SEND_GOODS'||val.status=='WAIT_SIGN'||val.status=='WAIT_GROUP_PAY'))){
                    that.isNum = 2
                }else{
                    that.isNum = 1
                }
                let time = '';
                let spec = val.get_slave_order_configures.map(item=>{
                    item.group_total_money = parseFloat(item.group_total_money).toFixed(2);
                    return item;
                });
                if(val.actual_receive_time == null && val.send_goods_time == "--"){
                    that.dialogtimeTitle = "实际签收时间";
                    time = "";
                }else if(val.actual_receive_time){
                    that.dialogtimeTitle = "实际签收时间";
                    time = val.actual_receive_time;
                }else if(val.send_goods_time!="--"&&val.actual_receive_time==null&&val.group_audit_spec){
                    that.dialogtimeTitle = "实际签收时间";
                    time = val.actual_receive_time;
                }else{
                    that.dialogtimeTitle = "实际签收时间";
                    time = '';
                };

                if(val.branch_sign_attachments && val.branch_sign_attachments.length>0){
                    that.attachments = val.branch_sign_attachments;
                }else{
                    that.attachments = [];
                }
                that.dialogJson = {
                    id:val.id,
                    master_order_id:that.id,
                    token: that.token,
                    paid_type:val.paid_type,
                    spec,
                    receive_time:time,
                    pay_description: val.pay_description,
                    status: val.status,
                    pay_type: val.pay_type,
                    paid_type: val.paid_type
                };
                that.dialogVisible = true;
            },
            //获取订单详情数据
            getData(id){
                let that = this;
                let params = {
                    token : that.token
                }
                that.$http.get(that.url_prefix + '/group/order/detail/'+id, {
                    params
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        if( response.data.response.status == 'PENDING'){
                            that.orderState = "履约中";
                            that.hasClose = false;
                        }else if(response.data.response.status == "CLOSING"){
                            if(response.data.response.close_status == 'GROUP_AUTH_REJECT' || response.data.response.close_status == 'NOT_APPLY'){
                                that.orderState = "履约中";
                                that.hasClose = false;
                            }else if(response.data.response.close_status == 'WAIT_GROUP_AUTH' ){
                                that.hasClose = true;
                            }else{
                                that.orderState = "关闭中";
                                that.hasClose = false;
                            }
                        }else if(response.data.response.status == 'FINISHED'){
                            that.orderState = "已结束";
                            that.hasClose = false;
                        }else{
                            that.orderState = "履约中";
                            that.hasClose = false;
                        }


                        that.orderN = response.data.response.order_no;
                        that.data1 = [];
                        let specifications = JSON.parse(response.data.response.demand_purchase.demand.category.spec);
                        response.data.response.spec = specifications.min +'-'+specifications.max;
                        that.data1.push(response.data.response);
                        that.created_at = !response.data.response.created_at?"--":response.data.response.created_at;

                        that.dialogPlace = response.data.response.reference_address;
                        that.dialogFs = response.data.response.demand_purchase.demand.quoted_price_website == "MY_STEEL" ? "我的钢铁":"西本";

                        that.data2 = response.data.response.slave_orders.map(item => {
                            item.send_goods_time = item.send_goods_time || '--';
                            if((item.paid_type == 'PAID_BEFORE' && item.status=='WAIT_GROUP_PAY')||(item.paid_type != 'PAID_BEFORE' && (item.status=='WAIT_SEND_GOODS'||item.status=='WAIT_SIGN'||item.status=='WAIT_GROUP_PAY'))){
                                item.isNum = 2
                            }else{
                                item.isNum = 1
                            }
                            switch (item.status) {
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
                            return item
                        });

                        that.priceData=[];
                        that.priceArr=[];
                        that.pricePos='';
                        for(let i=0;i<JSON.parse(response.data.response.quote_result).supplier.length;i++){
                            let itemdata={
                                name:response.data.response.supplier_name,
                                supplier_name:response.data.response.supplier_name,
                                time:response.data.response.demand_purchase.demand_purchase_choosed_quoted_price_record.created_at,
                                description:JSON.parse(response.data.response.quote_result).supplier[i].description,
                                price: that.signToWords(JSON.parse(response.data.response.quote_result).supplier[i].price)
                            }
                            that.priceData.push(itemdata);
                        };
                        that.getSpanArr(that.priceData,that.priceArr,that.pricePos);
                    }else{
                        that.$alert(response.data.message , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                    that.$alert(error , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                });
            },
            SpanMethod({ row, column, rowIndex, columnIndex }){
                if(columnIndex != 2 && columnIndex != 3){
                    const _row = this.priceArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return{
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            //记录行号
            getSpanArr(data,arr,position){　
                for(var i = 0; i < data.length; i++) {
                    if(i === 0){
                        arr.push(1);
                        position = 0
                    }else{
                    // 判断当前元素与上一个元素是否相同
                        if(data[i].name === data[i - 1].name){
                            arr[position] += 1;
                            arr.push(0);
                        }else{
                            arr.push(1);
                            position = i;
                        }
                    }
                }
            }
        },
        mounted(){
            let that = this;
            that.id = that.$route.params.id;
            // 设置下token
            if(!that.$cookies.get("ZL_token")){
                that.$router.push({path: '/login'})
            }else{
                that.token = that.$cookies.get("ZL_token");
            };
            that.getData(that.id);
        }
    }
</script>
<style lang="less" scoped>
    .fl{
        float: left;
    }
    .rightSpan.nomalBtn{
        height: 30px;
        line-height: 30px;
        margin:5px 10px;
        display: block;
        padding:0 5px;
    }
    .downloadA{
        text-decoration: none;
        height: 30px;
        line-height: 30px;
    }
    .nomalBtn1.tabelBtn{
        width: 100px;
        margin: 1px;
    }
    form{
        margin-top: 20px;
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
    .thisDiv{
        width: 20px;
        height: 20px;
        margin: 0 auto;
        cursor: pointer;
        background-size: 100% 100%;
        background-image: url(../../assets/purch/dele.png);
    }
    .online{
        height: 40px;
    }
    .titlediv{
        height: 40px;
        background-color: #409eff;
        color: #fff;
        line-height: 40px;
        padding: 0 20px;
        .rightSpan{
            float: right;
            &.btn{
                background-color: red;
                border-radius: 5px;
                height: 30px;
                line-height: 30px;
                padding: 0 10px;
                margin: 5px;
                cursor: pointer;
            }
        }
    }
    .tabelBtn1{
        background-color: red;
        color: #fff;
        text-align: center;
        width: 100px;
        margin: 0 auto;
        cursor: pointer;
    }
    .step-bar-div{
        margin-bottom: 30px;
    }
</style>