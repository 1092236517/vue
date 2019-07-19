<template>
    <div>
        <h3>我的联采报价</h3>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="采购单号">
                <el-input v-model="formInline.order_no" placeholder="采购单号" class="width180"></el-input>
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
                <el-select v-model="formInline.status" placeholder="全部" class="width90">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="待报价" value="QUOTING"></el-option>
                    <el-option label="已报价" value="QUOTED"></el-option>
                    <el-option label="已截标" value="CUT_OFF"></el-option>
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
                    <div class="nomalBtn1 tabelBtn" v-if='scope.row.statusN == 1' @click="openPriceWindow(scope.row)">立即报价</div>
                    <div class="nomalBtn1 tabelBtn" @click="openOrderWindow(scope.row)">查看详情</div><!--openOrderWindow-->
                </template>
            </el-table-column >
        </el-table>
        <div class="pageCont" v-if='total>10'>
            <el-pagination background layout="prev, pager, next" :total="total" :currentPage="currentPage"  @current-change="current_change"></el-pagination>
        </div>

        <el-dialog :title="priceDialogName" :visible.sync="priceDialogVisible" width="50%" :before-close="handleClose">
            <!-- :model="formInline" -->
            <p>参考数据：</p>
            <el-table :data="priceData" border style="width: 100%">
                <el-table-column v-for="(value,key) in priceJson"  :prop="key" :label="value" :key="value">
                </el-table-column>
            </el-table>
            <el-form  class="demo-form-inline supplier-quote-form">
                <p>填写成交价：</p>
                <!-- <div v-for="(price,key) in priceArr" :key="key" class="priceDiv">
                    <div class="title">{{price.description}}</div>
                    <el-input v-model="price.price" placeholder="请输入期望成交价" class="width180"></el-input> 
                </div> -->
                <el-checkbox-group v-model="checkArr" v-for="(price,key) in priceArr" :key="key">
                    <el-checkbox :label="price" border>
                        <p class="title">{{price.description}}</p>
                        <el-select v-model="price.value">
                            <el-option label="上浮（元）" value="+"></el-option>
                            <el-option label="下浮（元）" value="-"></el-option>
                        </el-select>
                        <el-input v-model="price.price" placeholder="请输入期望成交价"></el-input>
                        <!-- <p class="title">报价时间：{{time}}</p> -->
                    </el-checkbox>
                    <!--   -->
                </el-checkbox-group>
                <el-form-item label="备注">
                    <el-input
                        v-model="remark"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 5}"
                        resize="none"
                        placeholder="请输入备注信息">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitPrice">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            :title="orderDialogName"
            :visible.sync="orderDialogVisible"
            width="80%"
            :before-close="orderHandleClose">
            <h2>联采单详情</h2>
            <div class="orderDetailsDiv">
                <p class="orderDetailsItem">
                    <span class="label">订单号：</span><span class="content">{{ orderDetails.order_no }}</span>
                    <span class="label">状态：</span><span class="content">{{ orderDetails.statusChinese }}</span>
                    <span class="label">发布时间：</span><span class="content">{{ orderDetails.created_at }}</span>
                </p>
                <p class="orderDetailsItem">
                    <span class="label">项目名称：</span><span class="content">********</span>
                    <span class="label">采购商：</span><span class="content">江苏筑牛</span>
                </p>
                <p class="orderDetailsItem">
                    <span class="label">收货地：</span><span class="content">{{ orderDetails.delivery_address }}</span>
                    <span class="label">详细地址：</span><span class="content">********</span>
                </p>
                <p class="orderDetailsItem">
                    <span class="label">收货人：</span><span class="content">********</span>
                    <span class="label">收货人联系电话：</span><span class="content">********</span>
                    <span class="label">收货人身份证：</span><span class="content">********</span>
                </p>
            </div>
            <el-table
              :data="productsData"
              border
              style="width: 100%">
              <el-table-column v-for="(value,key) in products" :prop="key" :label="value" :key="value">
                 <!-- width="200" -->
              </el-table-column>
            </el-table>
            <div class="orderInfoDiv">
                <p class="infoItem title">联采规则</p>
                <p class="infoItem">供应商报价截止时间：{{ orderDetails.deadline }}</p>
                <p class="infoItem">发票要求：增值税发票</p>
                <p class="infoItem">联采说明：{{ orderDetails.remark }}</p>
            </div>
            <div class="online"></div>
            <div class="titlediv">供应商报价  </div>
            <el-table :data="dealpriceData" border style="width: 100%" :span-method="SpanMethod">
                <el-table-column  prop="supplier_name" label="供应商名" ></el-table-column>
                <el-table-column  prop="time" label="报价时间" ></el-table-column>
                <el-table-column  prop="description" label="订单支付方式" ></el-table-column>
                <el-table-column  prop="price" label="单位（元/吨）" ></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="orderDialogVisible = false">返回</el-button>
                <el-button type="primary" v-if="current_item_statusN == 1" @click="priceDialogVisible = true">填写报价</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "supplieroffer",
        data() {
            return {
                time:'',
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
                current_item_id: '',
                formInline: {
                    order_no: '',
                    status: 'all',
                    category_id:''
                },
                // 分类列表
                options2: [],
                // 地址列表
                optionsAdd:[],
                props: {
                    label:'label',
                    value: 'id',
                    children: 'sons'
                },
                hasClick:[],
                hasClickAdd:[],
                hasPlaceholderMax:[],
                copyParams:{
                    token:''
                },
                total:0,
                currentPage:0,
                tableData: [],
                //填写报价
                priceJson:{
                    "name":"产品名",
                    "category_spec": '直径（mm）',
                    "purchase_num": '数量（吨）',
                    "quoted_price_website": '价格参考网站',
                    "quoted_price_location": '价格参考地区'
                },
                priceData:[],
                priceDialogVisible:false,
                checkArr:[],
                remark:'',

                tableJson:{
                    "order_no":"采购单",
                    "brand_name":"产品名",
                    'specifications':"规格",
                    'purchase_num':"已核货量",
                    'quoted_supplier_num':"供应商报价人数",
                    'deadline':"剩余报价时间"
                },
                priceDialogName:'填写报价',
                orderDialogName: '联采单详情',
                orderDialogVisible: false,
                placeholderMax:"最大可采购数量8888吨",
                fileList:[],
                dialogJson:{
                    category_id:0,
                    category_type:'',
                    category_spec_min:'',
                    category_spec_max:'',
                    purchase_num:'',
                    brand_name:'',
                    remark:'',
                    deadline:'',
                    attachments :[],
                    delivery_address_district_id:'',
                    delivery_address_detail :'',
                    consignee_name :'',
                    consignee_mobile :'',
                    consignee_identity_card :'',
                    quoted_price_website :'XB'
                },
                defaultPrice:'0',
                // priceArr:{
                //     paid_before: {
                //         title:"每批先付订货款，后发货，价格按款到帐日",
                //         content: ''
                //     },
                //     paid_after_in_tenth:{
                //         title:"每月10日，结清上月贷款",
                //         content: ''
                //     },
                //     paid_after_in_ninetieth:{
                //         title:"货到工地，90天内结算所欠货款",
                //         content: ''
                //     }
                // },
                priceArr:[],
                priceArr_normal: [
                    {
                        description: "每批先付订货款，后发货，价格按款到帐日",
                        price: ''
                    },
                    {
                        description: "每月10日，结清上月贷款",
                        price: ''
                    },
                    {
                        description: "货到工地，90天内结算所欠货款",
                        price: ''
                    }
                ],
                productsData: [],
                products: {
                    name: '产品名',
                    brand: '品牌名',
                    category_spec: '规格',
                    purchase_num: '数量（吨）',
                    quoted_price_website: '价格参考网站',
                    quoted_price_location: '价格参考地区'
                },
                orderDetails: {},
                recommendedMan:'',
                recommendedTel:'',
                dialogChecked:true,
                defaultPriceNum:{},
                lastRecordId:'',
                current_item_statusN: '',
                mode:'',
                //成交价格显示
                dealpriceData:[],
                dealpriceArr:[],
                dealpricePos:''
            }
        },
        methods: {
            current_change(currentPage){
                this.currentPage = currentPage;
                this.getTabList(currentPage);
            },
            //获取列表数据
            getTabList:function(page){
                let params = this.copyParams;
                let that = this;
                params.token = that.token;
                that.currentPage = page;
                params.current_page = page;
                params.per_page = that.per_page;
                that.$http.get('/api/frontend/joint_purchase/super/supplier/demand_purchase_quoted_price/lists', {
                    params
                }).then(function (response) {
                    let result = response.data
                    if(result.msg_code == 100000){
                        that.total = result.response.total;
                        that.tableData = result.response.data.map((item)=>{
                            let element = {
                                id: item.id,
                                order_no: item.demand_purchase.order_no,
                                brand_name: item.demand_purchase.demand.category.name,
                                specifications: item.demand_purchase.demand.category_spec,
                                quoted_supplier_num: item.demand_purchase.quoted_supplier_num,
                                purchase_num: item.demand_purchase.demand.purchase_num,
                                deadline: item.demand_purchase.deadline
                            };
                            if(item.status == 'QUOTING'){
                                let deadline_time = +new Date(item.demand_purchase.deadline);
                                let now_time = +new Date();
                                if(deadline_time < now_time){
                                    element.status = "已截标";
                                    element.statusN = 3;
                                    element.mode=item.demand_purchase.demand.joint_mode;
                                }else{
                                    element.status = "待报价";
                                    element.statusN = 1;
                                    element.mode=item.demand_purchase.demand.joint_mode;
                                }
                            }else if(item.status == 'QUOTED'){
                                element.status = "已报价";
                                element.statusN = 2;
                                element.mode=item.demand_purchase.demand.joint_mode;
                            };
                            let specifications = JSON.parse(element.specifications);
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
                    console.log(error)
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
                    params.running_status = that.formInline.status
                }
                if(that.formInline.category_id){
                    params.category_id = that.formInline.category_id
                }
                that.copyParams = params;
                that.getTabList(1);
            },
            // 关闭报价弹窗
            handleClose(){
                this.priceDialogVisible = false;
                this.checkArr = [];
            },
            //关闭联采单弹窗
            orderHandleClose(){
                this.orderDialogVisible = false;
            },
            //提交报价
            submitPrice(){
                let that = this;
                let params = {token: that.token};
                let url = '';
                let checkArrCopy;
                if(that.checkArr.length == 0){
                    that.$message({
                        message: '该订单没有填写报价信息！',
                        type: 'warning'
                    })
                    return false;
                }
                for(let i = 0; i < that.checkArr.length; i++){ //校验报价数据
                    if(!that.isNumber(that.checkArr[i].price)){
                        that.$message({
                            message: '请输入正确的报价！',
                            type: 'warning'
                        })
                        return false;
                    }
                    if(!that.checkArr[i].value){
                        that.$message({
                            message: '请选择价格浮动！',
                            type: 'warning'
                        })
                        return false;
                    }
                };
                checkArrCopy = JSON.parse(JSON.stringify(that.checkArr)); //拷贝报价数据
                checkArrCopy.forEach((item, index) => {
                    item.price = item.value + item.price;
                })
                if(that.mode=='NORMAL'){
                    url='/api/frontend/joint_purchase/normal/supplier/demand_purchase_quoted_price/quota_price/';
                }else{
                    url='/api/frontend/joint_purchase/super/supplier/demand_purchase_quoted_price/quota_price/';
                }
                params.super_quote_prices = JSON.stringify({supplier: checkArrCopy,zn: []});
                params.remark = that.remark;
                that.$http.post(url + that.current_item_id,params)
                    .then(function(response){
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.getTabList(that.currentPage);
                            that.priceDialogVisible = false;
                            that.orderDialogVisible = false;
                        }else{
                            that.$alert(result.message , '警告', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        }
                    }).catch(function(error){
                        that.$alert(error, '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    })
            },
            openPriceWindow(item){
                this.current_item_id = item.id;
                this.mode=item.mode;
                this.priceArr=[];
                this.checkArr = []; //重置已选价格数组
                this.remark = ''; //评论重置
                let url='';
                if(item.mode=="NORMAL"){
                    url='/api/frontend/joint_purchase/normal/supplier/demand_purchase_quoted_price/detail/';
                }else{
                    url='/api/frontend/joint_purchase/super/supplier/demand_purchase_quoted_price/detail/';
                }
                this.getOrderData(url);
                this.priceDialogVisible = true;
            },
            openOrderWindow(item){
                this.current_item_statusN = item.statusN;
                this.current_item_id = item.id;
                this.mode=item.mode;
                let url='';
                if(item.mode=="NORMAL"){
                    url='/api/frontend/joint_purchase/normal/supplier/demand_purchase_quoted_price/detail/';
                }else{
                    url='/api/frontend/joint_purchase/super/supplier/demand_purchase_quoted_price/detail/';
                }
                this.getOrderData(url);
                this.orderDialogVisible = true;
            },
            //获取订单详情数据
            getOrderData(url){
                let params = {token: this.token};
                let that = this;
                that.$http.get(url + that.current_item_id, {
                    params
                }).then(function (response) {
                    let result = response.data;
                    let productItem = {};
                    if(result.msg_code == 100000){
                        that.orderDetails = {
                            order_no: result.response.demand_purchase.order_no,
                            status: result.response.running_status,
                            created_at: result.response.created_at,
                            product_name: '',
                            brand: '',
                            category_spec: result.response.demand_purchase.demand.category_spec,
                            purchase_num: result.response.demand_purchase.demand.purchase_num,
                            quoted_price_website: result.response.demand_purchase.demand.quoted_price_website,
                            deadline: result.response.demand_purchase.deadline,
                            remark: result.response.demand_purchase.remark,
                            category: result.response.demand_purchase.demand.category,
                            delivery_address_province: result.response.demand_purchase.demand.delivery_address_province,
                            delivery_address_city: result.response.demand_purchase.demand.delivery_address_city,
                            delivery_address_district: result.response.demand_purchase.demand.delivery_address_district,
                            delivery_address: result.response.demand_purchase.demand.delivery_address_province + result.response.demand_purchase.demand.delivery_address_city,                            
                        };
                        if(result.response.demand_purchase.demand.reference_province
                            && result.response.demand_purchase.demand.reference_city){
                            that.orderDetails.quoted_price_location = result.response.demand_purchase.demand.reference_province.region_name+"/"+result.response.demand_purchase.demand.reference_city.region_name;
                        }else{
                            that.orderDetails.quoted_price_location = '--';
                        }
                        if(result.response.running_status == 'PENDING'){
                            that.orderDetails.statusChinese = '待处理';
                        }else if(result.response.running_status == 'QUOTING'){
                            that.orderDetails.statusChinese = '报价中';
                        }else if(result.response.running_status == 'DEADLINE'){
                            that.orderDetails.statusChinese = '已截止报价';
                        }else if(result.response.running_status == 'ABORT'){
                            that.orderDetails.statusChinese = '流标';
                        }else if(result.response.running_status == 'PRE_FINISH'){
                            that.orderDetails.statusChinese = '待分公司确认';
                        }else if(result.response.running_status == 'PRE_FINISH_REJECT'){
                            that.orderDetails.statusChinese = '分公司驳回';
                        }else if(result.response.running_status == 'FINISH'){
                            that.orderDetails.statusChinese = '已完成';
                        };
                        productItem = {
                            name: result.response.demand_purchase.demand.category.name,
                            brand: result.response.demand_purchase.demand.brand_name,
                            category_spec: JSON.parse(result.response.demand_purchase.demand.category_spec).category_spec_min
                                + ' - ' + JSON.parse(result.response.demand_purchase.demand.category_spec).category_spec_max,
                            purchase_num: result.response.demand_purchase.demand.purchase_num,
                        };
                        if(result.response.demand_purchase.demand.reference_province
                            && result.response.demand_purchase.demand.reference_city){
                            productItem.quoted_price_location = result.response.demand_purchase.demand.reference_province.region_name+"/"+result.response.demand_purchase.demand.reference_city.region_name;
                        }else{
                            productItem.quoted_price_location = '--';
                        }
                        switch (result.response.demand_purchase.demand.quoted_price_website) {
                            case 'XB':
                                productItem.quoted_price_website = '西本';
                                break;
                            case 'MY_STEEL':
                                productItem.quoted_price_website = '我的钢铁';
                                break;
                            default:
                                productItem.quoted_price_website = '-';
                                break;
                        }
                        that.productsData = [productItem];
                        that.priceData=[productItem];

                        if(Array.isArray(result.response.pay_info)){
                            that.priceArr=result.response.pay_info.map((item)=>{
                                let priceItem={
                                    description:item.description,
                                    quote_id:item.id,
                                    price:'',
                                };
                                return priceItem
                            });
                        }else{
                            that.priceArr = that.priceArr_normal;
                        }


                        that.dealpriceData=[];
                        that.dealpriceArr=[];
                        that.dealpricePos='';
                        let dealData = response.data.response.demand_purchase;
                        // if(dealData.total_quote_price){
                        //     for(let i=0;i<JSON.parse(dealData.total_quote_price).supplier.length;i++){
                        //         let itemdata = {
                        //             name:dealData.demand.supplier_company_name,
                        //             supplier_name:dealData.demand.supplier_company_name,
                        //             time:dealData.updated_at,
                        //             description:JSON.parse(dealData.total_quote_price).supplier[i].description,
                        //             price: that.signToWords(JSON.parse(dealData.total_quote_price).supplier[i].price)
                        //         }
                        //         that.dealpriceData.push(itemdata);
                        //     };
                        // }else 
                        if(response.data.response.super_quote_prices && JSON.parse(response.data.response.super_quote_prices).supplier){
                            for(let i=0;i<JSON.parse(response.data.response.super_quote_prices).supplier.length;i++){
                                let itemdata = {
                                    name: result.response.supplier.member_auth.auth_name,
                                    supplier_name: result.response.supplier.member_auth.auth_name,
                                    time: dealData.updated_at,
                                    description: JSON.parse(response.data.response.super_quote_prices).supplier[i].description,
                                    price: that.signToWords(JSON.parse(response.data.response.super_quote_prices).supplier[i].price)
                                }
                                that.dealpriceData.push(itemdata);
                            };
                        }
                        that.getSpanArr(that.dealpriceData, that.dealpriceArr, that.dealpricePos);
                    }else{
                        that.$alert(result.message , '警告', {
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
                            // that.canClick = !that.canClick;
                        }
                    });
                });
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
            },
            SpanMethod({ row, column, rowIndex, columnIndex }){
                if(columnIndex != 2 && columnIndex != 3){
                    const _row = this.dealpriceArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return{
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            /**
             * 非负浮点数检测
             * @param  {String}  number 待检测字符串
             * @return {Boolean}        是否为非负浮点数
             */
            isNumber(number){
                let numberReg = /^\d+(\.\d+)?$/;
                return numberReg.test(number);
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
            // 获得 列表数据
            that.getTabList(1);
            that.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
        }
    }
</script>

<style>
    .supplier-quote-form .el-checkbox__input{
        float: right;
        margin-top: 34px;
    }
</style>

<style lang="less" scoped>
//成交价格
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
    .priceDiv{
        width: 85%;
        margin: 10px auto;
        border: 1px solid #e5e5e5;
        padding: 20px;
        .title{
            padding-bottom: 10px;
        }
    }
    .tabelBtn{
        width: 80px;
    }
    .title{
        white-space: normal;
    }
    .orderInfoDiv{
        border: 1px solid #999;
        margin-top: 30px;
        .infoItem{
            margin: 0;
            padding: 10px 15px;
            border-bottom: 1px solid #ccc;
        }
        .title{
            background: #2793f4;
            color:#fff;
        }
    }
    .orderDetailsItem{
        .content{
            padding-right: 30px;
        }
    }
    .el-checkbox-group{
        margin: 20px 0;
    }
    .el-checkbox.is-bordered{
        height: auto;
        width: 100%;
    }
    .el-input{
        width: auto;
    }
    .el-checkbox span:first-child{
        float: right;
        margin-top: 2.5%;
    }
    body .el-checkbox__input{
        float: right;
        margin-top: 2.5%;
      }
    body .el-checkbox__label{
        width: 50%;
    }
</style>