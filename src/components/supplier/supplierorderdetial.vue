<template>
    <div>
        <h2>订单详情</h2>
        <div class="tableHeader">
            <span class="label">订单号：{{ orderDetailData.order_no }}</span>
            <span class="labelRight">{{ orderDetailData.closing_status }}</span>
        </div>
        <el-table
            :data="orderDetailData.list"
            border
            style="width: 100%">
            <el-table-column v-for="(value,key) in orderDetailNameList" :prop="key" :label="value" :key="value">
            </el-table-column>
        </el-table>
        <div class="tableHeader">
            <span class="label">采购信息</span>
            <span class="labelRight">订单生成时间：{{ purchaseInfoData.created_at }}</span>
        </div>
        <el-table
            :data="purchaseInfoData.list"
            border
            style="width: 100%">
            <el-table-column v-for="(value,key) in purchaseInfoNameList" :prop="key" :label="value" :key="value">
            </el-table-column>
        </el-table>
        <div class="tableHeader">
            <span class="label">订单批次</span>
        </div>
        <el-table
            :data="orderBatchData.list"
            border
            style="width: 100%">
            <el-table-column v-for="(value,key) in orderBatchNameList" :prop="key" :label="value" :key="value">
            </el-table-column>
            <el-table-column  label="操作" width="220">
                <template slot-scope="scope">
                    <div class="nomalBtn1 tabelBtn" @click="openOrderBatchWindow(scope.row)">查看详情</div>
                    <div class="nomalBtn1 tabelBtn" v-if="scope.row.statusCode == 'WAIT_SUPPLIER_CONFIRM_RECEIVE_MONEY'" @click="confirmGathering(scope.row)">确认收款</div>
                    <div class="nomalBtn1 tabelBtn" v-if="scope.row.statusCode == 'WAIT_SUPPLIER_CONFIRM_GOODS_PRICE_AND_QUANTITY'" @click="openConfirmOrderWindow(scope.row)">确认</div>
                    <div class="nomalBtn1 tabelBtn" v-if="scope.row.statusCode == 'BRANCH_CONFIRM_PRICE_AND_QUANTITY_REJECT'" @click="openConfirmOrderWindow(scope.row)">重新编辑</div>
                    <div class="nomalBtn1 tabelBtn" v-if="scope.row.statusCode == 'WAIT_SEND_GOODS'" @click="sendGoodsWindow(scope.row)">确认发货</div>
                </template>
            </el-table-column >
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="before">返回</el-button>
        </span>

        <el-dialog :title="orderBatchDialogName" :visible.sync="orderBatchDialogVisible" width="80%" :before-close="orderBatchHandleClose">
            <h2>批次订单详情</h2>
            <div class="step-bar-div">
                <stepBar :stepData="stepData" />
            </div>
            <div>报价参考网站: {{ dialogFs }}</div>
            <p>
                <span>报价参考地： </span>
                <span>{{ dialogPlace }}</span>
            </p>
            <div class="web-price-date">
                <span>订价日期：</span>
                <el-date-picker
                    v-model="orderBatchDetailData.webPriceDate"
                    type="datetime"
                    value-format= 'yyyy-MM-dd HH:mm:ss'
                    placeholder="选择日期时间"
                    :disabled="showQuotationTime">
                </el-date-picker>
            </div>
            <div>
                <span>计划收货日期：</span>
                <el-date-picker
                    v-model="orderBatchDetailData.receive_time"
                    type="datetime"
                    value-format= 'yyyy-MM-dd HH:mm:ss'
                    placeholder="选择日期时间"
                    :disabled="true">
                </el-date-picker>
            </div>
            <div class="">
                <p class="label">支付方式：{{ orderBatchDetailData.paid_type}}</p>
            </div>
            <p>{{ `（网上标价如未知，可不填。网上标价为实际参考${dialogFs}网，${dialogPlace}的网上标价，不含上下浮动价）` }}</p>
            <el-table
                :data="orderBatchDetailData.list"
                border
                style="width: 100%">
                <el-table-column prop="brand_name" label="产品名"></el-table-column>
                <el-table-column prop="diameter" label="直径（mm）"></el-table-column>
                <el-table-column prop="is_seismic" label="是否抗震"></el-table-column>
                <el-table-column prop="num" label="数量（吨）"></el-table-column>
                <el-table-column prop="length" label="长度（米）"></el-table-column>
                <el-table-column label="网上标价（元）">
                    <template slot-scope="scope">
                        <el-input
                            v-model="scope.row.webPrice"
                            placeholder="网上标价"
                            @blur="calculatePriceForPrice(scope.row)"
                            :disabled="!isEdit"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="总额（元）">
                    <template slot-scope="scope">
                        <span>{{ scope.row.supplier_total_money | roundedToTwoDecimals }}</span>
                        <!-- <el-input v-model="scope.row.supplier_total_money" placeholder="总量" :disabled="true"></el-input> -->
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="orderBatchHandleClose">返回</el-button>
                <el-button type="primary" @click="confirmOrder" v-if="isEdit">提交</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="sendGoodsTitle" :visible.sync="sendGoodsDialogVisible" width="80%">
            <div>
                <p>报价参考网站： {{dialogFs}}</p>
                <p>报价参考地： {{dialogPlace}}</p>
            </div>
            <div class="web-price-date">
                <span>定价日期：</span>
                <el-date-picker
                    v-model="dialogJson.webPriceDate"
                    type="datetime"
                    value-format= 'yyyy-MM-dd HH:mm:ss'
                    placeholder="选择日期时间"
                    :disabled="true">
                </el-date-picker>
            </div>
            <el-form>
               <el-form-item label="支付方式：">
                   <el-select v-model="dialogJson.paid_type" placeholder="请选择支付方式" class="width350" :disabled="true">
                        <el-option :label="item.description" :value="item.id" v-for="(item,index) in priceType" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预计收货时间：">
                    <span class="requiredSpan">*</span>
                    <el-date-picker
                        v-model="dialogJson.receive_time"
                        type="datetime"
                        value-format= 'yyyy-MM-dd HH:mm:ss'
                        placeholder="选择日期时间"
                        :disabled="true">
                    </el-date-picker>
                </el-form-item>
                 <div class="onelineDiv">
                    <p>参数详情：</P>
                    <div class="nomalBtn1 " v-if='hasSure' v-show="dialogJson.payType == 'PAID_BEFORE'" @click="addThisRow">添加一栏</div>
                </div>
                 <el-table :data="dialogJson.spec" border style="width: 100%">
                    <el-table-column prop="brand_name" label="产品名">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.brand_name" placeholder="产品名" :disabled="!hasSure"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="diameter" label="直径（mm）">
                         <template slot-scope="scope">
                            <el-input v-model="scope.row.diameter" placeholder="直径" :disabled="!hasSure"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="数量（吨）">
                        <template slot-scope="scope">
                            <el-input
                                v-model="scope.row.num"
                                placeholder="吨"
                                :disabled="!hasSure"
                                @blur="calculatePriceForNum(scope.row)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="is_seismic"
                        label="抗震需求">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.is_seismic" placeholder="请选择" :disabled="!hasSure">
                                <el-option label="抗震" value="1"></el-option>
                                <el-option label="不抗震" value="0"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="length" label="长度（米）">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.length" placeholder="请选择"  :disabled="!hasSure">
                                <el-option label="9" value="9"></el-option>
                                <el-option label="12" value="12"></el-option>
                                <el-option label="无需求" value="0"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="网上标价（元）"></el-table-column>
                    <el-table-column
                        label="总额（元）">
                            <template slot-scope="scope">
                                <span>{{ scope.row.supplier_total_money | roundedToTwoDecimals }}</span>
                            </template>
                        </el-table-column>
                    <el-table-column prop="remark" label="备注">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" placeholder="备注" :disabled="!hasSure"></el-input>
                        </template>
                    </el-table-column>
<!--                     <el-table-column
                        label="操作" v-if='hasSure'>
                        <template slot-scope="scope">
                            <div class="thisDiv" @click='deleteThisRow(scope.$index, scope.row)'>
                            </div>
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sendGoods">发货</el-button>
                <el-button @click="sendGoodsDialogVisible = false">返回</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import stepBar from '@/components/public/stepBar'
export default {
    components: {
        stepBar
    },
    filters: {
        roundedToTwoDecimals(value){
            let number = parseFloat(value);
            return number.toFixed(2)
        }
    },
    data(){
        return{
            //订单的id和模式
            id:'',
            mode:'',
            url_prefix:'',
            // token
            token: '',
            //orderDetails: {},
            orderDetailData: {
                list:[],
                closing_status: ''
            },
            purchaseInfoData: {list:[]},
            orderBatchData: {list:[]},
            orderDetailNameList: {
                project_name: '项目名称',
                delivery_address: '收货地',
                delivery_address_detail: '详细地址',
                consignee_name: '收货人',
                consignee_mobile: '联系电话',
                consignee_identity_card: '身份证',
                status: '状态'
            },
            purchaseInfoNameList: {
                name: '产品名',
                spec: '规格',
                brand_name: '品牌',
                purchase_num: '采购数量',
                received_goods_num: '已发数量',
            },
            orderBatchNameList: {
                batch_number: '批次号',
                order_no: '批次订单号',
                received_goods_num: '发货数量（吨）',
                zn_pay_amount: '价格（元）',
                send_goods_time: '发货日期',
                actual_receive_time:'收货日期',
                status: '状态'
            },
            orderBatchDialogName: '批次订单详情',
            orderBatchDialogVisible: false,
            orderBatchDetailData: {
                id: '',
                paid_type: '',
                list: [],
                webPriceDate: new Date().Format('yyyy-MM-dd hh:mm:ss'),
                receive_time: ''
            },
            //发货弹窗
            sendGoodsDialogVisible:false,
            sendGoodsTitle:'',
            hasSure:true,
            dialogPlace:"",
            dialogFs:"",
            dialogJson:{
                spec:[],
                receive_time:'',
                paid_type:''
            },
            priceType:[],
            stepData: {
                curStep: 0,
                steps: [],
                operateData: [],
                demandStatus: ''
            },
            isEdit: false,
            showQuotationTime: true //是否显示订价日期
        }
    },
    methods:{
        //获取订单详情数据
        getOrderData(id){
            let params = {token: this.token};
            let that = this;
            that.$http.get(that.url_prefix+'/supplier/order/detail/' + id, {
                params
            }).then(function (response) {
                let result = response.data;
                //that.orderDialogVisible = true;
                if(result.msg_code == 100000){
                    //订单信息
                    that.orderDetailData.order_no = result.response.order_no;
                    that.orderDetailData.order_close_status = result.response.close_status;
                    let orderDetailItem = {
                        project_name: result.response.project_name,
                        delivery_address: result.response.demand_purchase.demand.delivery_address_province
                            + result.response.demand_purchase.demand.delivery_address_city
                            + result.response.demand_purchase.demand.delivery_address_district,
                        delivery_address_detail: result.response.demand_purchase.demand.delivery_address_detail,
                        consignee_name: result.response.demand_purchase.demand.consignee_name,
                        consignee_mobile: result.response.demand_purchase.demand.consignee_mobile,
                        consignee_identity_card: result.response.demand_purchase.demand.consignee_identity_card,
                        status: result.response.status,
                    };
                    if(orderDetailItem.status == 'PENDING'){
                        orderDetailItem.status = '履约中';
                    }else if(orderDetailItem.status == 'CLOSING'){
                        orderDetailItem.status = '关闭中';
                        switch (result.response.close_status) {
                            case 'NOT_APPLY':
                                that.orderDetailData.closing_status = '未申请';
                                break;
                            case 'WAIT_GROUP_AUTH':
                                that.orderDetailData.closing_status = '待集团审核';
                                break;
                            case 'GROUP_AUTH_REJECT':
                                that.orderDetailData.closing_status = '集团审核拒绝';
                                break;
                            case 'WAIT_ZN_CONFIRM':
                                that.orderDetailData.closing_status = '待筑牛确认';
                                break;
                            case 'SUCCESS':
                                that.orderDetailData.closing_status = '关闭成功';
                                break;
                            default:
                                that.orderDetailData.closing_status = '';
                                break;
                        }
                    }else{
                        orderDetailItem.status = '已结束';
                    };
                    that.orderDetailData.list = [orderDetailItem];

                    //采购信息
                    that.$set(that.purchaseInfoData, 'created_at', result.response.created_at);
                    that.purchaseInfoData.list = [{
                        name: result.response.demand_purchase.demand.category.name,
                        spec: JSON.parse(result.response.category_spec).category_spec_min
                            + ' - ' + JSON.parse(result.response.category_spec).category_spec_max,
                        brand_name: result.response.demand_purchase.demand.brand_name,
                        purchase_num: result.response.demand_purchase.demand.purchase_num,
                        received_goods_num: result.response.received_goods_num
                    }];

                    //订单批次
                    that.dialogPlace=result.response.reference_address;
                    that.dialogFs=result.response.quoted_price_website == "MY_STEEL" ? "我的钢铁":"西本"
                    that.orderBatchData.list = result.response.slave_orders.map(function(item){
                        let element = {
                            id: item.id,
                            batch_number: item.batch_number,
                            order_no: item.order_no,
                            received_goods_num: item.get_slave_order_configures[0] && item.get_slave_order_configures[0].num,
                            send_goods_time: item.send_goods_time,
                            actual_receive_time: item.actual_receive_time || '--',
                            statusCode: item.status,
                            paid_type: item.paid_type,
                            spec: item.get_slave_order_configures,
                            group_audit_spec:item.group_audit_spec ? JSON.parse(item.group_audit_spec):[],
                            send_good_spec: item.send_goods_spec ?  JSON.parse(item.send_goods_spec) : [],
                            actual_receive_spec: item.actual_receive_spec ? JSON.parse(item.actual_receive_spec) : [],
                            pay_description: item.pay_description,
                            get_slave_order_configures: item.get_slave_order_configures,
                            quotation_time: item.quotation_time,
                            receive_time: item.receive_time
                        };
                        if(item.payment_method == "ZN_PAY_ON_LINE"){
                            element.zn_pay_amount = that.toDecimal(item.get_slave_order_configures[0] && item.get_slave_order_configures[0].supplier_total_money) || '-';
                        }else{
                            element.zn_pay_amount = item.zn_pay_amount;
                        }
                        switch (item.status) {
                            case 'WAIT_SUPPLIER_CONFIRM_GOODS_PRICE_AND_QUANTITY':
                                element.status = '待供应商确认';
                                element.statusTip = '待供应商确认';
                                break;
                            case 'WAIT_BRANCH_CONFIRM_PRICE_AND_QUANTITY':
                                element.status = '待分公司确认';
                                element.statusTip = '待分公司确认';
                                break;
                            case 'BRANCH_CONFIRM_PRICE_AND_QUANTITY_REJECT':
                                element.status = '分公司拒绝';
                                element.statusTip = '分公司拒绝';
                                break;
                            case 'WAIT_GROUP_PAY':
                                element.status = '待集团支付';
                                element.statusTip = '待集团支付';
                                break;
                            case 'WAIT_ZN_PAY':
                                element.status = '待筑牛支付';
                                element.statusTip = '待筑牛支付';
                                break;
                            case 'WAIT_GROUP_CONFIRM_PAY':
                                element.status = '线上支付待集团审核';
                                element.statusTip = '线上支付待集团审核';
                                break;
                            case 'WAIT_ZHUNIU_CONFIRM_PAY':
                                element.status = '线上支付待筑牛审核';
                                element.statusTip = '线上支付待筑牛审核';
                                break;
                            case 'WAIT_SUPPLIER_CONFIRM_RECEIVE_MONEY':
                                element.status = '待收款';
                                element.statusTip = '待收款';
                                break;
                            case 'WAIT_SEND_GOODS':
                                element.status = '待发货';
                                element.statusTip = '待发货';
                                break;
                            case 'WAIT_SIGN':
                                element.status = '待收货';
                                element.statusTip = '待收货';
                                break;
                            case 'FINISHED':
                                element.status = '订单完成';
                                element.statusTip = '订单完成';
                                break;
                            default:
                                element.status = '-';
                                element.statusTip = '-';
                                break;
                        }
                        return element;
                    })
                    //批次订单详情
                }else{
                    that.$alert(result.message , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                }
            }).catch(function (error) {
                console.log(error)
                that.$alert(error , '警告', {
                    confirmButtonText: '确定',
                    callback: action => {
                        // that.canClick = !that.canClick;
                    }
                });
            });
        },
        addThisRow(){
            this.dialogJson.spec.push({
                brand_name: '',
                diameter: '0',
                num: '0',
                is_seismic: '0',
                length: '9',
                webPrice: 0,
                supplier_total_money: 0,
                remark: ''
            });
        },
        deleteThisRow(index){
            this.dialogJson.spec.splice(index, 1);
        },
        //确认发货弹窗
        sendGoodsWindow(item){
            let that = this;
            that.sendGoodsTitle = "第" + (item.batch_number || '--') + "批次订单发货";
            that.hasSure = true;
            that.sendGoodsDialogVisible = true;
            that.dialogJson={
                id: item.id,
                spec: item.get_slave_order_configures,
                receive_time: '',
                paid_type: item.pay_description, //支付描述
                webPriceDate: item.quotation_time,
                payType: item.paid_type,  //支付类型
                receive_time: item.receive_time
            };
        },
        //确认发货
        sendGoods(){
            let that = this;
            let params = {
                token: that.token,
                spec: JSON.stringify(that.dialogJson.spec)
            };
            that.$confirm('是否确认发货？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$http.post(that.url_prefix+'/supplier/order/send_goods/' + that.dialogJson.id,params)
                    .then(function(response){
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.getOrderData(that.id);
                            that.sendGoodsDialogVisible = false;
                        }else{
                            that.$alert(result.message , '警告', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        };
                    }).catch(function(error){
                        that.$alert(error, '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    })
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消'
                    });
                })
        },
        //打开审核确认/编辑弹窗
        openConfirmOrderWindow(item){
            this.showQuotationTime = false;
            this.isEdit = true;
            this.orderBatchDialogVisible = true;
            this.orderBatchDetailData.id = item.id;
            this.orderBatchDetailData.paid_type = item.pay_description;
            this.orderBatchDetailData.receive_time = item.receive_time;
            //获取进度条和操作日志
            this.getSlaveOrderProgress(item.id);
            this.orderBatchDetailData.list = item.get_slave_order_configures.map(item => {
                let element = {
                    id: item.id,
                    brand_name: item.brand_name || '--',
                    diameter: item.diameter || '--',
                    is_seismic: item.is_seismic == '0' ? '不抗震' : '抗震',
                    num: item.num || '--',
                    remark:item.remark || '--',
                    webPrice: item.price,
                    supplier_total_money: item.supplier_total_money,
                    group_price: item.group_price
                }
                if(item.length == '9'){
                    element.length = 9;
                }else if(item.length == '12'){
                    element.length = 12;
                }else{
                    element.length = '无需求'
                };
                return element;
            })
        },
        //确认审核
        confirmOrder(){
            let that = this;
            let params = {
                token: that.token,
                quotation_time: that.orderBatchDetailData.webPriceDate
            };
            let spec = that.orderBatchDetailData.list.map(item => {
                let element = Object.assign({}, item);
                element.is_seismic = element.is_seismic == '抗震' ? 1 : 0;
                return element
            })
            params.spec = JSON.stringify(spec);
            that.$confirm('是否确认批次信息？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$http.post(that.url_prefix + '/supplier/order/check_slave_order/' + that.orderBatchDetailData.id, params)
                    .then(function(response){
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.$message({
                                message: '提交成功',
                                type: 'success'
                            })
                            that.getOrderData(that.id);
                            //关闭审核弹窗
                            that.orderBatchHandleClose();
                        }else{
                            that.$alert(result.message , '警告', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        };
                    }).catch(function(error){
                        that.$alert(error, '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    })
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消'
                    });
                })
        },
        //确认收款
        confirmGathering(item){
            let that = this;
            let params = {token: that.token};
            that.$confirm('是否确认收款？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$http.post(that.url_prefix+'/supplier/order/confirm_received_money/' + item.id,params)
                    .then(function(response){
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.getOrderData(that.id);
                            //that.orderDialogVisible = false;
                        }else{
                            that.$alert(result.message , '警告', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        };
                    }).catch(function(error){
                        that.$alert(error, '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    })
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消'
                    });
                })
        },
        //关闭批次订单详情/审核弹窗
        orderBatchHandleClose(){
            this.orderBatchDialogVisible = false;
            this.isEdit = false; //重置是否编辑状态
            this.showQuotationTime = true;
        },
        //查看详情弹窗
        openOrderBatchWindow(item){
            this.isEdit = false;
            this.orderBatchDialogVisible = true;
            // if(item.paid_type == 'PAID_BEFORE'){
            //     this.orderBatchDetailData.paid_type = '先付定金，后发货';
            // }else if(item.paid_type == 'PAID_AFTER_IN_TENTH'){
            //     this.orderBatchDetailData.paid_type = '每月10号付款';
            // }else{
            //     this.orderBatchDetailData.paid_type = '收货后90天付款';
            // }
            this.orderBatchDetailData.webPriceDate = item.quotation_time;
            this.orderBatchDetailData.receive_time = item.receive_time;
            this.orderBatchDetailData.paid_type = item.pay_description;
            this.getSlaveOrderProgress(item.id);
            this.orderBatchDetailData.list = item.get_slave_order_configures.map(item => {
                let element = {
                    id:item.id,
                    brand_name: item.brand_name || '--',
                    diameter: item.diameter || '--',
                    is_seismic: item.is_seismic == '0' ? '不抗震' : '抗震',
                    num: item.num || '--',
                    remark:item.remark || '--',
                    webPrice: item.price,
                    supplier_total_money: item.supplier_total_money
                }
                if(item.length == '9'){
                    element.length = 9;
                }else if(item.length == '12'){
                    element.length = 12;
                }else{
                    element.length = '无需求'
                };
                return element;
            })
        } ,
        //返回按钮
        before(){
            this.$router.push({path: '/supplierorder'})
        },
        //获取批次订单进度和日志
        getSlaveOrderProgress(slave_order_id){
            let that = this;
            let params = {
                token: that.token,
                process_type: 'SLAVE_ORDER',
                slave_order_id: slave_order_id
            }
            that.$api.supplierProgress(params)
                .then(response => {
                    let result = response.data;
                    if(result.msg_code == 100000){
                        let stepsList = result.response.processes;
                        let logList = result.response.jointList;
                        that.stepData.curStep = result.response.step;
                        //进度条
                        that.stepData.steps = stepsList.map((item, index) => {
                            switch (item.title) { //添加icon
                                case '分公司':
                                    item.icon = 'step-icon iconfont icon-ziyuan';
                                    break;
                                case '成本部':
                                    item.icon = 'step-icon iconfont icon-yusuanyuchengbenguanli';
                                    break;
                                case '联采部':
                                    item.icon = 'step-icon iconfont icon-gouwuche';
                                    break;
                                case '供应商':
                                    item.icon = 'step-icon iconfont icon-renyuanguanli';
                                    break;
                                case '筑牛':
                                    item.icon = 'step-icon iconfont icon-niu';
                                    break;
                                case '财务部':
                                    item.icon = 'step-icon iconfont icon-jinbi';
                                    break;
                                case '订单完成':
                                    item.icon = 'step-icon iconfont icon-Shapecopy';
                                    break;
                                default:
                                    item.icon = 'step-icon iconfont icon-dingdan21';
                                    break;
                            }
                            //显示状态
                            if(item.status == 'CHECK_REJECT'){
                                item.current_status = 'error';
                            }
                            //自定义流程添加icon
                            if(item.child && item.child.length > 0){
                                item.child.forEach((childItem, childIndex) => {
                                    childItem.icon = 'iconfont icon-ziyuan';
                                    if(childItem.status == 'CHECK_REJECT'){
                                        childItem.current_status = 'error';
                                    }
                                    if(childItem.child && childItem.child.length > 0){
                                        childItem.child.forEach((grandchildItem, grandchildIndex) => {
                                            grandchildItem.icon = 'iconfont icon-ziyuan';
                                        })
                                    }
                                });
                            }
                            return item
                        })

                        //日志
                        that.stepData.operateData = logList.map((element) => {
                            //操作记录
                            let item = new Object();
                            item.demander = element.demand_submitting_name;
                            item.submitTime = element.demand_submitting_time;
                            item.approver = element.demand_submitter;
                            item.approveTime = element.created_at;
                            item.duration = element.format_diachronic || '--';
                            item.remark = element.remarks || '--';
                            item.log = element.demand_desc;
                            item.demand_status = element.demand_status;
                            //显示当前状态
                            if(element.demand_status == 'REJECT'){
                                item.approveStatus = '不通过';
                            }else if(element.demand_status == 'CHECK_REJECT'){
                                item.approveStatus = '不通过';
                            }else if(element.demand_status == 'BRANCH_ACCEPECT'){
                                item.approveStatus = '已完成';
                            }else{
                                item.approveStatus = '通过';
                            }
                            return item
                        })
                    }else{
                        that.$alert(result.message,'提示',{
                            confirmButtonText: '知道了',
                            callback: action => {
                            //todo
                            }
                        })
                    }
                }).catch(error => {
                            console.log(error);
                            that.$alert(error,'提示',{
                                confirmButtonText: '知道了',
                                callback: action => {}
                            })
                    })
        },
        /**
         * 网上标价改变计算货量价
         * @param  {Object} item 当前批次订单规格
         */
        calculatePriceForPrice(item){
            let that = this;
            let reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
            if(reg.test(item.webPrice)){
                let params = {
                    token:that.token,
                    configure_id:item.id,
                    type:'SUPPLIER_ACTUAL_MONEY',
                    price:item.webPrice,
                    num: item.num
                }
                that.$api.NetworkPriceCount_supplier(params).then(response=>{
                    if(response.data.msg_code===100000){
                        item.supplier_total_money = response.data.response.supplierActualMoney;
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
                item.webPrice = '';
                this.$message({
                    message: '请输入合法数字',
                    type: 'warning'
                })
            }
        },
        /**
         * 发货数量改变改变计算货量价
         * @param  {Object} item 当前批次订单规格
         */
        calculatePriceForNum(item){
            let that = this;
            let reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
            if(!item.id){ //新增一栏，不发请求计算价格
                return false
            }
            if(reg.test(item.num)){
                let params = {
                    token:that.token,
                    configure_id:item.id,
                    type:'SUPPLIER_ACTUAL_MONEY',
                    price:item.webPrice,
                    num: item.num
                }
                that.$api.NetworkPriceCount_supplier(params).then(response=>{
                    if(response.data.msg_code===100000){
                        item.supplier_total_money = response.data.response.supplierActualMoney;
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
                item.num = '';
                this.$message({
                    message: '请输入合法数字',
                    type: 'warning'
                })
            }
        }
    },
    mounted(){
        let that = this;
        if(!that.$cookies.get("ZL_token")){
            that.$router.push({path: '/login'})
        }else{
            that.token = that.$cookies.get("ZL_token");
        }
        that.id = that.$route.params.id;
        that.mode = that.$route.params.mode;
        if(that.mode=="SUPER"){
            that.url_prefix= '/api/frontend/joint_purchase/super';
        }else{
            that.url_prefix= '/api/frontend/joint_purchase/normal';
        }
        //获取订单详情列表
        that.getOrderData(that.id);
    }
}
</script>
<style lang="less" scoped>
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
    .web-price-date{
        margin-bottom: 20px;
    }
    .thisDiv{
        width: 20px;
        height: 20px;
        margin: 0 auto;
        cursor: pointer;
        background-size: 100% 100%;
        background-image: url(../../assets/purch/dele.png);
    }
    .tabelBtn{
        width: 80px;
    }
    .tableHeader{
        background: #0576db;
        color:#fff;
        font-size: 14px;
        line-height: 50px;
        height: 50px;
        padding-left: 15px;
        padding-right: 15px;
        margin-top: 20px;
        .labelRight{
            float: right;
        }
    }
    .el-button{
        margin-top: 20px;
    }
    .step-bar-div{
        margin-bottom: 30px;
    }
</style>
