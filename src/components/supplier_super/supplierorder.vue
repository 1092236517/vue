<template>
    <div>
        <h3>我的订单</h3>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="订单号">
                <el-input v-model="formInline.order_no" placeholder="订单号" class="width180"></el-input>
            </el-form-item>
            <el-form-item label="产品名">
                <el-cascader
                    :options="options2"
                    @active-item-change="handleItemChange"
                    :props="props"
                    @change='selectChange'
                    class="width210"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="全部">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="履约中" value="PENDING"></el-option>
                    <el-option label="关闭中" value="CLOSING"></el-option>
                    <el-option label="已结束" value="FINISHED"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="nomalBtn1" @click="submitForm">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
        :data="tableData"
        border
        style="width: 100%">
            <el-table-column v-for="(value,key) in tableJson"  :prop="key" :label="value" :key="value">
            </el-table-column>
            <el-table-column  label="操作" width="240">
                <template slot-scope="scope">
                    <div class="nomalBtn1 tabelBtn" @click="openOrderWindow(scope.row.id,scope.row.mode)">查看详情</div>
                </template>
            </el-table-column >
        </el-table>
        <div class="pageCont" v-if='total>10'>
            <el-pagination background layout="prev, pager, next" :total="total" :currentPage="currentPage"  @current-change="current_change"></el-pagination>
        </div>

        <el-dialog
            :title="orderDialogName"
            :visible.sync="orderDialogVisible"
            width="80%"
            :before-close="orderHandleClose">
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
                 <!-- width="200" -->                 
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
                 <!-- width="200" -->                 
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
                 <!-- width="200" -->                 
              </el-table-column>
              <el-table-column  label="操作" width="220">
                  <template slot-scope="scope">
                      <div class="nomalBtn1 tabelBtn" @click="openOrderBatchWindow(scope.row)">查看详情</div>
                      <div class="nomalBtn1 tabelBtn" v-if="scope.row.statusCode == 'WAIT_SUPPLIER_CONFIRM_RECEIVE_MONEY'" @click="confirmOrder(scope.row)">确认</div>
                        <div class="nomalBtn1 tabelBtn" v-if="scope.row.statusCode == 'CHECK_PASS'" @click="confirmOrder1(scope.row)">确认</div>
                        <div class="nomalBtn1 tabelBtn" v-if="scope.row.statusCode == 'WAIT_SEND_GOODS'" @click="confirmOrder2(scope.row)">确认发货</div>


                        <!-- WAIT_SEND_GOODS -->
                      <!-- status -->

                  </template>
              </el-table-column >
            </el-table>            
            <span slot="footer" class="dialog-footer">
                <el-button @click="orderDialogVisible = false">返回</el-button>
            </span>
        </el-dialog>

        <el-dialog
            :title="orderBatchDialogName"
            :visible.sync="orderBatchDialogVisible"
            width="80%"
            :before-close="orderBatchHandleClose">
            <h2>批次订单详情</h2>
            <div class="">
                <p class="label">支付方式：{{ orderBatchDetailData.paid_type}}</p>
            </div>
            <el-table
              :data="orderBatchDetailData.list"
              border
              style="width: 100%">
              <el-table-column v-for="(value,key) in orderBatchDetailNameList" :prop="key" :label="value" :key="value">
                 <!-- width="200" -->                 
              </el-table-column>
            </el-table> 
            <span slot="footer" class="dialog-footer">
                <el-button @click="orderBatchDialogVisible = false">返回</el-button>
            </span>
        </el-dialog>        
    </div>
</template>

<script>
    export default {
        name: "supplierorder",
        data() {
            return {
                per_page:10,
                // token
                token:"eyJpdiI6IlptUmhhMmx1Wld3N2FXNXFZV3BrYWc9PSIsInZhbHVlIjoiWU1kQ0ZwNmFvWTc1U3VocmY2S1EwQT09In0=",
                // 有无提交按钮
                hasEdit:true,
                // 是否为编辑
                isEdit:false,
                // 编译时的 id
                editId:0,
                // 默认分类
                dialogCascader:[],
                // 默认地址
                dialogAddr:[],
                hasClick:[],
                hasClickAdd:[],
                hasPlaceholderMax:[],
                current_item_id: '',
                formInline: {
                    order_no: '',
                    status: 'all',
                    category_id:''
                },
                // 分类列表
                options2: [],
                props: {
                    label:'label',
                    value: 'id',
                    children: 'sons'
                },
                copyParams:{
                    token:''
                },
                total:0,
                currentPage:0,
                tableData: [],
                priceDialogVisible:false,
                tableJson:{
                    "order_no":"订单号",
                    "brand_name":"产品名",
                    'specifications':"规格",
                    'purchase_num':"采购数量",
                    'supplier_name':"采购商",
                    'status': '状态'
                },
                priceDialogName:'填写报价',
                orderDialogName: '订单详情',
                orderDialogVisible: false,
                orderDetails: {},
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
                    order_no: '批次订单号',
                    received_goods_num: '发货适量（吨）',
                    zn_pay_amount: '价格（元）',
                    send_goods_time: '发货日期',
                    status: '状态'
                },
                orderBatchDialogName: '批次订单详情',
                orderBatchDialogVisible: false,
                orderBatchDetailData: {
                    paid_type: '',
                    list: []
                },
                orderBatchDetailNameList: {
                    diameter: '直径（mm）',
                    is_seismic: '是否抗震',
                    num: '数量（吨）',
                    length: '长度（米）'
                }
            }
        },
        methods: {
        	//获取列表数据
        	getTabList:function(page){
        	    let params = this.copyParams;
        	    let that = this;
                params.token= this.token;
        	    that.currentPage = page;
        	    params.current_page = page;
        	    params.per_page = that.per_page;
        	    that.$http.get('/api/frontend/joint_purchase/super/supplier/order/lists', {
        	        params
        	    }).then(function (response) {
        	        let result = response.data
        	        if(result.msg_code == 100000){
        	            that.total = result.response.total;
        	            that.tableData = result.response.data.map((item)=>{
        	                let element = {
        	                    id: item.id,
        	                    order_no: item.order_no,
        	                    brand_name: item.category.name,
        	                    specifications: item.category_spec,
        	                    purchase_num: item.purchase_num,
                                supplier_name: item.supplier_name,
                                mode:item.demand_purchase.demand.joint_mode,
        	                };
        	                if(item.status == 'PENDING'){
        	                    element.status = "履约中";
        	                    element.statusN = 1;
        	                }else if(item.status == 'CLOSING'){
        	                    element.status = "关闭中";
        	                    element.statusN = 2;
        	                }else{
        	                    element.status = "已结束";
        	                    element.statusN = 3;
        	                };
        	                let specifications = JSON.parse(element.specifications)
        	                element.specifications = specifications.category_spec_min +'-'+specifications.category_spec_max;
        	                return element;
        	            });
        	        }else{
        	            that.$alert(result.message , '警告', {
        	                confirmButtonText: '确定',
        	                callback: action => {
        	                }
        	            });
        	        }
        	    }).catch(function (error) {
        	        that.$alert(error , '警告', {
        	            confirmButtonText: '确定',
        	            callback: action => {
        	                // that.canClick = !that.canClick;
        	            }
        	        });
        	    });
        	},
        	//获取select的option
        	getSelect(level,id){
        	    let that = this;
        	    let params = {
        	        token:that.token
        	    };
        	    params.level = level;
        	    params.parent_id　= id;
        	    that.$http.get('/api/frontend/joint_purchase/super/category/lists', {
        	        params
        	    }).then(function(response){
        	        let result = response.data;
        	        if(result.msg_code == 100000){
        	            if(level == 1){
        	                // 这边将要将欲变化的 放进去
        	                that.options2 = result.response.map((item)=> {
        	                    return {
        	                        type:item.type,
        	                        label: item.name,
        	                        id: item.id,
        	                        sons: []
        	                        }
        	                });
        	                that.options2.unshift({label : '清空',id:'0'})
        	            }else{
        	                for(let i = 0; i < that.options2.length; i++){
        	                    if(that.options2[i].id == id){
        	                        that.options2[i].sons = result.response.map((item)=> {
        	                            return {
        	                                label: item.name,
        	                                id: item.id,
        	                                }
        	                        });
        	                    }
        	                }
        	            }
        	        }else{
        	            that.$alert(result.message , '警告', {
        	                confirmButtonText: '确定',
        	                callback: action => {
        	                }
        	            });
        	        }
        	    }).catch(function (error) {
        	        that.$alert(error, '警告', {
        	            confirmButtonText: '确定',
        	            callback: action => {
        	            }
        	        });
        	    });
        	},
        	handleItemChange(val){
        	    let that = this;
        	    if (that.hasClick.indexOf(val[0]) === -1) {
        	        that.hasClick.push(val[0]);
        	        let id = 0;
        	        let type = "";
        	        for (let i = 0; i<that.options2.length ; i++){
        	            if(that.options2[i].id == val[0]){
        	                id = that.options2[i].id;
        	                type = that.options2[i].type;
        	            }
        	        }
        	        that.getSelect(2,id);
        	    }else{
        	        for (let i = 0; i<that.hasPlaceholderMax.length ; i++){
        	            if(that.hasPlaceholderMax[i].id == val[0]){
        	                that.placeholderMax = that.hasPlaceholderMax[i].placeholderMax;
        	                return
        	            }
        	        }
        	    };
        	},
        	selectChange(val){
        	    this.formInline.category_id = val[1];
        	},
        	//查询提交表单
        	submitForm(){
        	    let that = this;
        	    let params = {
        	        current_page: 1,
        	        per_page: 10,
        	        token: that.token
        	    };
        	    if(that.formInline.order_no){
        	        params.order_no = that.formInline.order_no
        	    }
        	    if(that.formInline.status != 'all'){
        	        params.status = that.formInline.status
        	    }
        	    if(that.formInline.category_id){
        	        params.category_id = that.formInline.category_id
        	    }
        	    that.copyParams = params;
        	    that.getTabList(1);
        	},
        	//关闭订单弹窗
        	orderHandleClose(){
        	    this.orderDialogVisible = false;
        	},
        	//打开订单详情弹窗
        	openOrderWindow(id,mode){
        	    // this.current_item_id = id;
                // this.getOrderData();
                this.$router.push({path: 'supplier_super/supplierorderdetial/'+ id +'/'+ mode})
        	},
        	//获取订单详情数据
        	getOrderData(){
        	    let params = {token: this.token};
        	    let that = this;
        	    that.$http.get('/api/frontend/joint_purchase/super/supplier/order/detail/' + that.current_item_id, {
        	        params
        	    }).then(function (response) {
        	        let result = response.data;
        	        that.orderDialogVisible = true;
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
                            status: result.response.status
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
                        that.orderBatchData.list = result.response.slave_orders.map(function(item){
                            let element = {
                                id: item.id,
                                order_no: item.order_no,
                                received_goods_num: item.received_goods_num,
                                zn_pay_amount: item.zn_pay_amount,
                                send_goods_time: item.send_goods_time || '-',
                                statusCode: item.status,
                                paid_type: item.paid_type,
                                spec: JSON.parse(item.spec)
                            };
                            switch (item.status) {
                                case 'WAIT_CHECK':
                                    element.status = '待审核';
                                    element.statusTip = '待审核, 待集团审核'; 
                                    break;
                                case 'CHECK_PASS':
                                    element.status = '待确认';
                                    element.statusTip = '集团审核通过,待供应商确认';
                                    break;
                                case 'CHECK_REJECT':
                                    element.status = '审核失败';
                                    element.statusTip = '集团审核失败';
                                    break;
                                case 'WAIT_GROUP_PAY':
                                    element.status = '待支付';
                                    element.statusTip = '待支付,集团财务部支付给筑牛，上传支付凭证';
                                    break;
                                case 'WAIT_ZN_PAY':
                                    element.status = '待支付';
                                    element.statusTip = '待支付，等待筑牛支付给供应商';
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
                                    element.statusTip = '待供应商确认收款';
                                    break;
                                case 'WAIT_SEND_GOODS':
                                    element.status = '待发货';
                                    element.statusTip = '待发货，供应商确认收款并发货';
                                    break;
                                case 'WAIT_SIGN':
                                    element.status = '待签收';
                                    element.statusTip = '待签收，待分公司签收';
                                    break;
                                case 'FINISHED':
                                    element.status = '订单完成';
                                    element.statusTip = '订单完成';
                                    break;
                                default:
                                    element.status = '';
                                    element.statusTip = '';
                                    break;
                            }
                             // CHECK_REJECT
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
        	        that.$alert(error , '警告', {
        	            confirmButtonText: '确定',
        	            callback: action => {
        	                // that.canClick = !that.canClick;
        	            }
        	        });
        	    });
            },
            //确认发货
            confirmOrder2(item){
                let that = this;
                let params = {token: that.token};
                that.$confirm('是否确认发货？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.post('/api/frontend/joint_purchase/super/supplier/order/send_goods/' + item.id,params)
                        .then(function(response){
                            let result = response.data;
                            if(result.msg_code == 100000){
                                that.getOrderData();
                                that.orderDialogVisible = false;
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
            //确认审核
            confirmOrder1(item){
                let that = this;
                let params = {token: that.token};
                that.$confirm('是否确认批次信息？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.post('/api/frontend/joint_purchase/super/supplier/order/check_slave_order/' + item.id,params)
                        .then(function(response){
                            let result = response.data;
                            if(result.msg_code == 100000){
                                that.orderDialogVisible = false;
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
            confirmOrder(item){
                let that = this;
                let params = {token: that.token};
                that.$confirm('是否确认收款？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.post('/api/frontend/joint_purchase/super/supplier/order/confirm_received_money/' + item.id,params)
                        .then(function(response){
                            let result = response.data;
                            if(result.msg_code == 100000){
                                that.orderDialogVisible = false;
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
            orderBatchHandleClose(){
                this.orderBatchDialogVisible = false;
            },
            openOrderBatchWindow(item){
                this.orderBatchDialogVisible = true;
                if(item.paid_type == 'PAID_BEFORE'){
                    this.orderBatchDetailData.paid_type = '先付定金，后发货';
                }else if(item.paid_type == 'PAID_AFTER_IN_TENTH'){
                    this.orderBatchDetailData.paid_type = '每月10号付款';
                }else{
                    this.orderBatchDetailData.paid_type = '收货后90天付款';
                }
                if(!item.spec){
                    this.orderBatchDetailData.list=[];
                }else{
                    this.orderBatchDetailData.list = item.spec.map((item) => {
                        let element = {
                            diameter: item.diameter,
                            is_seismic: item.is_seismic == '0' ? '否' : '是',
                            num: item.num,
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
                }
               
            },
            //订单列表翻页
            current_change(curPage){
                this.currentPage = curPage;
                this.getTabList(curPage);
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
        	// 设置分类第一层
        	that.getSelect(1,0);
        	//获取订单列表
        	that.getTabList(1);
        }
    }
</script>

<style lang="less" scoped>
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
        margin-top: 50px;
        .labelRight{
            float: right;
        }
    }
</style>