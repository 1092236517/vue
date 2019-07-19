<template>
    <div class="contain">
        <!-- <div class="container"> -->
            <div class="cont_1">
                <div class="contH">联采信息</div>
                <div class="state">状态：<span :class="{yellow:state1==0,blue:state1==1,red:state1==2}">{{state}}</span></div>
                <div class="stateCon">
                    <div class="sCon" v-for="(item, index) in collectInfo" :key="index">
                        <div class="conH">{{item.name}}：</div>
                        <div class="conC">{{item.value}}</div>
                    </div>
                </div>
            </div>
            <div class="cont_2">
                <div class="contH">采购信息</div>
                <div class="stateCon">
                    <el-table :data="tableData" border style="width: 100%;">
                        <el-table-column prop="brandname" label="产品名称"></el-table-column>
                        <el-table-column prop="plane" label="品牌"></el-table-column>
                        <el-table-column prop="amount" label="数量（吨）"></el-table-column>
                        <el-table-column prop="type" label="规格"></el-table-column>
                        <el-table-column prop="priceweb" label="价格参考网站"></el-table-column>
                        <el-table-column prop="pricelocal" label="价格参考地区"></el-table-column>
                        <el-table-column prop="dealtype" label="付款方式"></el-table-column>
                        <el-table-column prop="business" label="推荐供应商"></el-table-column>
                        <el-table-column prop="businessphone" label="推荐供应商电话"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="cont_3">
                <div class="cont_31">
                    <div class="contH">联采规则</div>
                    <div class="stateCon">
                        <div class="sCon">
                            <div class="first">
                                <div class="conH" style="width:150px;">供应商报价截止时间：</div>
                                <div class="conC">{{deadline}}</div>
                            </div>
                            <div class="second" v-if="count==0">
                                <div class="conH" style="width: 136px;">距离报价结束还剩：</div>
                                <div class="conC" ><span class="timeStyle">{{day}}</span>天<span class="timeStyle">{{hour}}</span>时<span class="timeStyle">{{minute}}</span>分<span class="timeStyle">{{second}}</span>秒</div>
                            </div>
                            <div class="second yellow" v-else>报价已结束</div>
                        </div>
                        <div class="sCon">
                            <div class="conH" style="width:80px;">发票要求：</div>
                            <div class="conC">增值税发票</div>
                        </div>
                        <div class="sCon">
                            <div class="conH" style="width:80px;">联采说明：</div>
                            <div class="conC" style="width:90%;">{{remark}}</div>
                        </div>
                        <div class="sCon">
                            <div class="conH" style="width:45px;"><div class="upLogo"></div>附件：<!--<input type="file" @change="getfile">--></div> 
                            <div class="conC" style="width:90%;">
                                <div class="files" v-for="(item,index) in filement" :key="index">
                                    <a :href="item.value" :download="item.name">{{item.name}}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cont_32" v-if="state=='报价中'&&'已截标'"><!---->
                    <div class="contH">报价详情</div>
                    <div class="stateCon">
                        <el-table :data="tableList" :span-method="SpanMethod" border style="width: 100%;">
                            <el-table-column prop="name" label="供应商名"></el-table-column>
                            <el-table-column prop="time" label="报价时间"></el-table-column>
                            <el-table-column prop="priceType" label="订单支付方式" width="300"></el-table-column>
                            <el-table-column prop="unit" label="单位（元/吨）"></el-table-column>
                            <el-table-column prop="remark" label="备注"></el-table-column>
                            <el-table-column prop="exit" label="操作">
                                <template slot-scope="scope">
                                    <div  v-if='scope.row.exit.test == 0' @click='clickInto(scope.row.exit.id,scope.row.exit.data)' class="clicks" v-show="dealButton">成交</div>
                                    <div  v-else-if='scope.row.exit.test == 1' class="clickss">待报价</div>
                                    <div  v-else-if='scope.row.exit.test == 2' class="clickss">已流标</div>
                                    <div  v-else-if='scope.row.exit.test == 3' class="clickss">待确认</div>
                                     <div  v-else-if='scope.row.exit.test == 4' class="clickss">成交</div>
                                    <div v-else class="clickss">已成交</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <div class="cont_32" v-else-if="state=='流标'">
                    <div class="contH">报价详情</div>
                    <div class="textcon">暂无报价</div>
                </div>

                <div class="cont_32" v-else-if="state=='订单完成'">
                    <div class="contH">供应商报价详情</div>
                    <div class="stateCon">
                        <el-table :data="tableList" :span-method="SpanMethod" border style="width: 100%;">
                            <el-table-column prop="name" label="供应商名"></el-table-column>
                            <el-table-column prop="time" label="报价时间"></el-table-column>
                            <el-table-column prop="priceType" label="订单支付方式" width="300"></el-table-column>
                            <el-table-column prop="unit" label="单位（元/吨）"></el-table-column>
                            <el-table-column prop="remark" label="备注"></el-table-column>
                            <el-table-column prop="exit" label="操作">
                                <template slot-scope="scope">
                                    <div v-if='scope.row.exit.id == bid_demand_purchase_quoted_price_record_id' class="clicknes">已成交</div>                                            
                                    <div v-else  class="clickne">未成交</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="contH">筑牛报价详情</div>
                    <div class="stateCon">
                        <el-table :data="tabZNList" :span-method="ZNSpanMethod" border style="width: 100%;">
                            <el-table-column prop="priceType" label="价格类别"></el-table-column>
                            <!-- <el-table-column prop="priceweb" label="我的价格参考网"></el-table-column> -->
                            <el-table-column prop="payType" label="订单支付方式" width="300"></el-table-column>
                            <el-table-column prop="unit" label="单位（元/吨）"></el-table-column>
                        </el-table>
                    </div>
                </div>

<!--                 <div class="cont_32" v-if="(state=='待处理' || state=='报价中' || state=='已流标') && spareStatus != 'PRE_FINISH'" v-show="pushButton">
                    <div class="pushbtn" @click="push()" v-if="count==0">推荐给供应商</div>
                    <div class="pushbtns" v-else>推荐给供应商</div>
                </div> -->
            </div>
        <!-- </div> -->
        <el-dialog width="60%" title="编辑成交价" :visible.sync="innerVisible" center>
                <div class="d_cont">
                <div class="cont_con">
                    <el-form ref="efricefrom" label-width="80px">
                        <el-table :data="tabpriceList" :span-method="PriceSpanMethod" border style="width: 100%;">
                            <el-table-column prop="priceType" label="价格类别" width="100"></el-table-column>
                            <el-table-column prop="payType" label="订单支付方式"></el-table-column>
                            <el-table-column prop="unit" label="单位（元/吨）" >
                                <template slot-scope="scope">
                                    <div>
                                        <el-select v-model="scope.row.movement" placeholder="请选择" size="mini" style="width: 40%">
                                            <el-option label="上浮" value="+"></el-option>
                                            <el-option label="下浮" value="-"></el-option>
                                        </el-select>
                                        <el-input v-model="scope.row.unit" placeholder="请输入内容" size="mini" style="width: 50%"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submit()">提 交</el-button>
                <el-button @click="innerVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog width="40%" title="选择供应商" :visible.sync="pushDialogVisible" center>
            <div class="d_cont">
                <div class="cont_con">
                    <div class="con_top">
                        <div class="inputs">
                            <el-cascader :options="options2" @active-item-change="handleItemChange" :props="props" @change='selectChangedialog' placeholder="选择产品分类" v-model="sele"></el-cascader>
                        </div>
                        <div class="inputs"><el-input placeholder="请输入供应商名称" v-model="companyName" clearable></el-input></div>
                        <div class="inputs"><el-button type="primary" @click="getpushList(1)">查询</el-button></div>
                    </div>
                    <div v-for="item in pushdata.pushForm.type" :key="item.id" class="items">{{item.value}}<div class="delLogo" @click="del(item.value)"></div></div>
                    <div class="con_bottom">
                        <el-checkbox-group v-model="pushdata.pushForm.type" v-for="(item,index) in pushdata.pushList" :key="index">
                            <el-checkbox :label="item"  name="type">{{item.value}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div class="pageCont" style="margin-top: 0; padding-bottom: 0">
                        <el-pagination background layout="prev, pager, next" :total="total" :currentPage="currentPage"  @current-change="pushcurrent_change"></el-pagination>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="openPaymentModeWindow">下一步</el-button>
                <!-- <el-button @click="pushDialogVisible = false">取 消</el-button> -->
            </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="msgDialog" width="20%" center top="20%">
            <span v-if="pushdata.success==1">推送成功</span>
            <span v-else-if="pushdata.success==2">提交成功</span>
            <span v-else>失败</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="msgDialog = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog width="50%" title="选择付款方式" :visible.sync="paymentModeVisible" center>
            <div class="d_cont" style="height:550px">
                <div class="cont_con">
                    <el-table
                        :data="paymentModeList"
                        border
                        @selection-change="handlePaymentSelect"
                        :row-key="getRowKey"
                        style="width: 100%">
                        <el-table-column
                            prop="desc"
                            label="付款方式描述">
                        </el-table-column>
                        <el-table-column
                            prop="mode"
                            label="价格时间规则">
                        </el-table-column>
                        <el-table-column
                            type="selection"
                            :reserve-selection="true">
                        </el-table-column>
                    </el-table>
                    <div class="pageCont" style="margin-top: 10px; padding-bottom: 0">
                        <el-pagination background layout="prev, pager, next" :total="paymentModeTotal" :currentPage="curPage"  @current-change="goTo"></el-pagination>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="pushDialog()">推送</el-button>
                <el-button @click="closePaymentModeWindow">上一步</el-button>
                <router-link to="/group/paymentAdd">
                    <el-button type="primary" plain>添加付款方式</el-button>
                </router-link>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:"collection-m",
    data(){
        return{
            PRE_FINISH:false,
            token: '',
            service_role_id: '',
            //联采信息
            state:"",
            state1:0,
            collectInfo:[],
            //采购信息
            tableData:[],
            //联采规则
            count:0,
            deadline:"",
            remark:"",
            filement:"",
            day:"",
            hour:"",
            minute:"",
            second:"",
            //报价详情  供应商报价详情
            tableList:[],
            bid_demand_purchase_quoted_price_record_id:0,
            //筑牛报价详情
            tabZNList:[],
            //编辑成交价
            innerVisible:false,
            tabpriceList:[],
            // form:{
            //     znpriceA:"",
            //     znpriceB:"",
            //     znpriceC:"",
            //     spriceA:"",
            //     spriceB:"",
            //     spriceC:"",
            // },
            // efricefrom:{
            //     value:'',
            // },
            //推送给供应商
            pushDialogVisible:false,
            ispush:true,
            purchanseid:"",
            options2: [],
            props: {
                label:'label',
                value: 'id',
                children: 'sons'
            },
            hasClick:[],
            categoryid:0,
            sele:[],
            companyName:"",
            perPage:10,
            total:0,
            currentPage:1,
            //id
            ckid:"",
            quoteid:"",
            bigid:"",
            //推送供应商
            pushdata:{
                pushList:[],
                pushForm:{
                    type:[],
                },
                success:0,
            },
            //信息提示框
            msgDialog:false,
            url_prefix: '/api/frontend/joint_purchase/normal',
            paymentModeVisible: false,
            paymentModeList: [],
            paymentModeTotal: 0,
            curPage: 1,
            paymentModeSelected: [],
            spanArr: [],
            pos: '',
            editArr: [],
            editPos: '',
            ZNArr: [],
            ZNpos: '',
            spareStatus: '', //补充状态
            getRowKey(row){ //获取行号，保留之前选中项
                return row.id
            },
            //权限按钮
            pushButton:false,
            dealButton:false,
        }
    },
    created(){
        let that = this;
        let id=that.$route.params.id;
        that.token = that.$cookies.get("ZL_token");
        that.getTabData(id);
        that.getUserInfo();
        that.getAuthority();
    },
    methods:{
        //权限按钮
        getAuthority(){
            let that=this;
            that.$store.getters.authForGroup.NormalJointPurchaseOrderList.transfers.map(item=>{
                if(item.power_transfer_name.indexOf('推送供应商')!=-1){
                    that.pushButton=true;
                }else if(item.power_transfer_name.indexOf('成交')!=-1){
                    that.dealButton=true;
                }
            });
        },
        //获取用户信息
        getUserInfo(){
            let that = this;
            let url = '/api/frontend/member/detail';
            let params = {
                token: that.token
            }
            that.ZN_GET(url,params,function(data){
                that.service_role_id = data.response.member_extend.service_role_id;
            })
        },
        getTabData(id){
            let that=this;
            that.tableData=[];
            that.tableList=[];
            that.tabZNList=[];
            let params = {
                token: that.token
            };
            that.$http.get(that.url_prefix + '/group/demand/purchases/detail/' + id,{params} ).then(function (response) {
                if(response.data.msg_code===100000){
                    let arr=response.data.response;
                    that.quoteid=arr.demand.quoted_price_record_id;
                    that.bid_demand_purchase_quoted_price_record_id = arr.bid_demand_purchase_quoted_price_record_id;
                    that.bigid=arr.id;
                    that.spareStatus = arr.status;
                    //基本信息
                    that.collectInfo=[
                            {
                                name:"联采单号",
                                value:!arr.order_no?'--':arr.order_no,
                            },
                            {
                                name:"项目名称",
                                value:!arr.demand.project_name?'--':arr.demand.project_name,
                            },
                            {
                                name: "项目编码",
                                value: arr.demand.project_code || '--',
                            },
                            {
                                name:"采购商",
                                value:!arr.demand.member.member_auth.auth_name?'--':arr.demand.member.member_auth.auth_name,
                            },
                            {
                                name:"收货人",
                                value:!arr.demand.consignee_name?'--':arr.demand.consignee_name,
                            },
                            {
                                name:"联系电话",
                                value:!arr.demand.consignee_mobile?'--':arr.demand.consignee_mobile,
                            },
                            {
                                name:"收货人身份证",
                                value:!arr.demand.consignee_identity_card?'--':arr.demand.consignee_identity_card,
                            },
                            {
                                name:"收货地址",
                                value:(!arr.demand.delivery_address_province?'--':arr.demand.delivery_address_province)+(!arr.demand.delivery_address_city?'--':arr.demand.delivery_address_city), 

                            },
                            {
                                name:"详细地址",
                                value:(!arr.demand.delivery_address_district?'--':arr.demand.delivery_address_district)+(!arr.demand.delivery_address_detail?'--':arr.demand.delivery_address_detail),
                            },
                            {
                                name:"发布时间",
                                value:!arr.demand.updated_at?'--':arr.demand.updated_at,
                            }
                        ];
                    if(arr.running_status=="QUOTING"){
                        that.state="报价中";
                        that.state1=0;
                    }else if(arr.running_status=="PENDING"){
                        that.state="待处理";
                        that.state1=0;
                    }else if(arr.running_status=="FINISH"){
                        that.state="订单完成";
                        that.state1=1;
                    }else if(arr.running_status=="ABORT"){
                        that.state="已流标";
                        that.state1=2;
                    }else if(arr.running_status=="DEADLINE"){
                        that.state="已截标";
                        that.state1=2;
                    }else{
                        that.state="--";
                    };
                    //采购信息
                    let dealtype = ["货到工地，90天内结算所欠货款","每月10日，结清上月贷款","每批先付订货款，后发货，价格按款到帐日"];
                    let priceArr =[];
                    let reference_province='';
                    let reference_city='';
                    if(arr.demand.reference_province!=null&&arr.demand.reference_city!=null){
                        reference_province=!arr.demand.reference_province.region_name?"--":arr.demand.reference_province.region_name;
                        reference_city=!arr.demand.reference_city.region_name?"--":arr.demand.reference_city.region_name
                    }else{
                        reference_province="--";
                        reference_city="--"
                    }
                    let purchaseData =  {
                        brandname: !arr.demand.category.name?'--':arr.demand.category.name,
                        plane: !arr.demand.brand_name?'--':arr.demand.brand_name,
                        amount: !arr.demand.purchase_num?'--':arr.demand.purchase_num,
                        type: "",
                        priceweb: arr.demand.quoted_price_website == "XB" ?"西本":"我的钢铁",
                        business:arr.demand.supplier_name ? arr.demand.supplier_name :"--",
                        businessphone:arr.demand.supplier_mobile ? arr.demand.supplier_mobile : "--",
                        pricelocal:reference_province+"/"+reference_city
                    };
                    let specifications = JSON.parse(arr.demand.category_spec);
                    purchaseData.type = specifications.category_spec_min +'--'+ specifications.category_spec_max;
                    purchaseData.dealtype = arr.demand.pay_description;
                    that.tableData.push(purchaseData);


                    //联采规则
                    that.deadline=!arr.demand.deadline?'--':arr.demand.deadline;
                    that.remark=!arr.demand.remark?'--':arr.demand.remark;
                    that.purchanseid=arr.id;
                    that.memberids=!arr.demand.member.member_auth.id?'--':arr.demand.member.member_auth.id;
                    that.filement=arr.demand.attachments.map((item)=>{
                        let files={
                            name:!item.original_name?'--':item.original_name,
                            value:!item.path?'--':item.path,
                        }
                        return files;
                    });
                    //倒计时调用
                    that.timer();
                    //报价详情
                    //供应商报价详情
                    let price =[];
                    let lengthI=arr.demand_purchase_quoted_price_records.length;
                    for(let i = 0; i < lengthI; i++){
                        let supplierData=arr.demand_purchase_quoted_price_records;
                        let stat=supplierData[i].status;
                        let paymentModeArr = JSON.parse(supplierData[i].pay_type);
                        let paymentPriceArr;
                        let id = supplierData[i].id;
                        //报价
                        if(supplierData[i].super_quote_prices){
                            paymentPriceArr = JSON.parse(supplierData[i].super_quote_prices);
                            paymentPriceArr.forEach(function(element, index){
                                let itemData = {
                                    name: supplierData[i].supplier.member_auth.auth_name,
                                    time: new Date(supplierData[i].created_at).Format('yyyy-MM-dd hh:mm:ss'),
                                    remark: supplierData[i].remark || "--",
                                    id: id
                                };
                                if(stat=="QUOTED"){ //当前状态：供应商报价后待筑牛填写报价
                                    if(arr.status=="PRE_FINISH"){
                                        itemData.exit = {
                                            test:4,
                                            id:id,
                                            data:supplierData[i],
                                        }
                                    }else{
                                        itemData.exit = {
                                            test:0,
                                            id:id,
                                            data:supplierData[i],
                                        }
                                    }
                                }else if(stat=="QUOTING"){ //当前状态：推送给供应商待报价
                                    itemData.exit = {
                                        test:1,
                                        id:id,
                                        data:supplierData[i],
                                    }
                                    itemData.time='--';
                                }else if(stat=="REJECT"){
                                    itemData.exit={
                                        test:2,
                                        id:id,
                                        data:supplierData[i],
                                    }
                                }else if(stat=="WAIT_CHOOSE"){ //当前状态：待集团选择报价成交
                                    itemData.exit={
                                        test: 0,
                                        id: id,
                                        data: supplierData[i],
                                    }
                                }else{
                                    itemData.exit={
                                        test:5,
                                        id:id,
                                        data:supplierData[i],
                                    }
                                }
                                itemData.priceType = element.description;
                                itemData.unit = that.signToWords(element.price);
                                that.tableList.push(itemData);
                            });
                        }else{
                            for(let itemi = 0; itemi < paymentModeArr.length; itemi++){
                                let itemData = {
                                    name: supplierData[i].supplier.member_auth.auth_name,
                                    time: new Date(supplierData[i].created_at).Format('yyyy-MM-dd hh:mm:ss'),
                                    remark :supplierData[i].remark || '--',
                                    id: id
                                };
                                if(stat=="QUOTED"){
                                     if(arr.status=="PRE_FINISH"){
                                        itemData.exit={
                                            test:4,
                                            id:id,
                                            data:supplierData[i],
                                        }
                                    }else{
                                        itemData.exit={
                                            test: 0,
                                            id: id,
                                            data: supplierData[i],
                                        }
                                    }
                                }else if(stat=="QUOTING"){
                                    itemData.exit={
                                        test:1,
                                        id:id,
                                        data:supplierData[i],
                                    }
                                    itemData.time='--';
                                }else if(stat=="REJECT"){
                                    itemData.exit={
                                        test:2,
                                        id:id,
                                        data:supplierData[i],
                                    }
                                }else if(stat=="WAIT_CHOOSE"){
                                    itemData.exit={
                                        test: 0,
                                        id: id,
                                        data: supplierData[i],
                                    }
                                }else{
                                    itemData.exit={
                                        test: 5,
                                        id: id,
                                        data: supplierData[i],
                                    }
                                }
                                itemData.priceType = paymentModeArr[itemi].description;
                                itemData.unit = '--';
                                that.tableList.push(itemData);
                            };
                        }
                    }
                    //重置
                    that.spanArr = [];
                    that.pos = 0;
                    that.getSpanArrById(that.tableList,that.spanArr,that.pos);

                    //筑牛报价详情
                    if(arr.total_quote_price){
                        let ZNprice=[];
                        let ZNname= JSON.parse(arr.total_quote_price);
                        for(let i = 0;i < ZNname.supplier.length; i++){
                            let itemData =  {
                                priceType: '供应商',
                                name: '供应商'
                            };
                            itemData.payType = ZNname.supplier[i].description;
                            itemData.unit = that.signToWords(ZNname.supplier[i].price);
                            that.tabZNList.push(itemData);
                        }
                        for(let i = 0;i < ZNname.zn.length; i++){
                            let itemData =  {
                                priceType: '联采价',
                                name: '联采价'
                            };
                            itemData.payType = ZNname.zn[i].description;
                            itemData.unit = that.signToWords(ZNname.zn[i].price);
                            that.tabZNList.push(itemData);
                        }
                        that.ZNArr= [];
                        that.ZNpos= '';
                        that.getSpanArr(that.tabZNList,that.ZNArr,that.ZNpos);
                    }
                }else {
                    that.$alert(response.data.message , '警告', {confirmButtonText: '确定', callback: action => {}});
                };
            }).catch(function (error) {
                that.$alert(error , '警告', {confirmButtonText: '确定', callback: action => {}});
            });
        },
        //推送供应商的弹窗
        //推送  弹窗
        push(){
            let that=this;
            //清空
            that.pushdata.pushForm={
                type:[],
            };
            that.categoryid=0,
            that.companyName="";
            that.sele=[];
            that.hasClick=[];
            that.getSelect(1,0);
            that.getpushList(1);
            that.pushDialogVisible=true;
            that.currentPage=1;
            that.paymentModeSelected = [];
        },
        //产品分类
        getSelect(level,id){
            let that = this;
            let params = {
                token: that.token
            };
            if(level == 1){
                params.level = 1
            }else{
                params.level = 2;
            }
            params.parent_id　= id;
            that.$http.get(that.url_prefix+ '/category/lists', {
                params
            }).then(function (response) {
                if(response.data.msg_code == 100000){
                    if(level == 1){
                        // 这边将 要 将欲变化的 放进去
                        that.options2 = response.data.response.map((item)=> {
                            return {
                                type:item.type,
                                label : item.name,
                                id:item.id,
                                sons:[]
                                }
                        });
                        that.options2.unshift({label : '清空',id:'0'})

                        // 输入 最高采购 数据
                        //that.getMaxPurchaseNum(that.options2[1].type)
                    }else{
                        for (let i = 0; i<that.options2.length ; i++){
                            if(that.options2[i].id == id){
                                that.options2[i].sons = response.data.response.map((item)=> {
                                    return {
                                        label : item.name,
                                        id:item.id,
                                    }
                                });
                            }
                        }
                    }
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
                        // that.canClick = !that.canClick;
                    }
                });
            });
        },
        handleItemChange(val) {
                let that = this;
                if (that.hasClick.indexOf(val[0]) === -1) {
                    that.hasClick.push(val[0]);
                    let id = 1;
                    let type = "";
                    for (let i = 0; i<that.options2.length ; i++){
                        if(that.options2[i].label == val[0]){
                            id = that.options2[i].id;
                            type = that.options2[i].id;
                        }
                    }
                    that.getSelect(2,id);
                }
            },
        selectChangedialog(val){
            this.categoryid = val[1];
        },
        //供应商列表信息
        getpushList(pageNum){
            let that=this;
            let params = {
                token: that.token,
                per_page:that.perPage,
                current_page:pageNum,
                user_type:"COMPANY",
                auth_status:"APPROVE",
            };
            if(that.categoryid){
                params.category_id=that.categoryid;
            }
            if(that.companyName){
                params.auth_name=that.companyName;
            }
            that.$http.get(that.url_prefix + '/group/demand/suppliers',{params} ).then(function (response) {
                if(response.data.msg_code===100000){
                    let arr=response.data.response.data;
                    that.pushdata.pushList=arr.map((item)=>{
                        let list={
                            id:item.id,
                            value:!item.member_auth.auth_name?'--':item.member_auth.auth_name,
                        };
                        return list;
                    })
                    that.total=response.data.response.total;
                }else {
                    that.$alert(response.data.message , '警告', {confirmButtonText: '确定', callback: action => {}});
                };
            }).catch(function (error) {
                that.$alert(error , '警告', {confirmButtonText: '确定',callback: action => {}});
            });
        },
        pushcurrent_change:function(currentPage){
            this.currentPage = currentPage;
            this.getpushList(currentPage);
        },
        //推送  按钮
        pushDialog(){
            let that = this;
            let memberid = that.pushdata.pushForm.type.map((item)=>{
                let ids = item.id;
                return ids
            });
            let params = {
                token: that.token,
                member_ids: memberid,
                demand_purchase_id: that.purchanseid,
            };
            let pay_type_arr = [];
            that.paymentModeSelected.forEach(function(element, index){
                pay_type_arr.push(element.id)
            });
            if(pay_type_arr.length !=0 && memberid.length != 0){
                params.pay_type = JSON.stringify(pay_type_arr);
            }else{
                that.$message({
                    message: '请选择支付方式',
                    type: 'warning'
                })
                return false;
            }
            that.paymentModeVisible = false;
            that.$http.post(that.url_prefix + '/group/demand/push',params).then(function (response) {
                if(response.data.msg_code===100000){
                    //that.getTabList(that.currentPage);
                    that.pushdata.success=1;
                    that.ispush=false;
                    that.msgDialog=true;
                    window.location.reload();
                }else {
                    that.$alert(response.data.message , '警告', {confirmButtonText: '确定', callback: action => {}});
                };
            }).catch(function (error) {
                that.$alert(error , '警告', {confirmButtonText: '确定',callback: action => {}});
            });
        },
        del(companyname){
            let that=this;
            for(var i=0;i<that.pushdata.pushForm.type.length;i++){
                if(that.pushdata.pushForm.type[i].value==companyname){
                    that.pushdata.pushForm.type.splice(i,1);
                }
            }
        },

         //编辑成交价
        clickInto(id,data){
            let that=this;
            that.tabpriceList=[];
            that.ckid=id;
            let paymentModeList = JSON.parse(data.super_quote_prices);
            let priceType=["供应商价","联采价"];
            for(let i = 0;i<priceType.length;i++){
                if(priceType[i]=="供应商价"){
                    for(let itemi = 0 ; itemi < paymentModeList.length; itemi++){
                        // let spunit=[that.form.spriceA,that.form.spriceB,that.form.spriceC];
                        let itemData =  {
                            priceType: "供应商价",
                            name: "供应商价",
                            movement: ''
                        };
                        let price = paymentModeList[itemi].price.toString();
                        itemData.payType = paymentModeList[itemi].description;
                        itemData.unit = paymentModeList[itemi].price;
                        itemData.id = paymentModeList[itemi].id;

                        if(price.charAt(0) === '+'){
                            itemData.unit = price.slice(1);
                            itemData.movement = '+';
                        }else if(price.charAt(0) === '-'){
                            itemData.unit = price.slice(1);
                            itemData.movement = '-';
                        }else{
                            itemData.unit = price;
                            itemData.movement = '+';
                        }
                        that.tabpriceList.push(itemData);
                    };
                }else{
                    for(let itemi = 0 ; itemi < paymentModeList.length; itemi++){
                        // let znunit=[that.form.znpriceA,that.form.znpriceB,that.form.znpriceC];
                        let itemData =  {
                            priceType: "联采价",
                            name: "联采价"
                        };
                        itemData.payType = paymentModeList[itemi].description;
                        itemData.unit="";
                        itemData.id = paymentModeList[itemi].id;
                        that.tabpriceList.push(itemData);
                    };
                }
            }
            that.editArr= [];
            that.editPos= '';
            that.getSpanArr(that.tabpriceList,that.editArr,that.editPos);
            that.innerVisible=true;
        },
        //提交价格
        submit(){
            let that=this;
            for(let i = 0; i < that.tabpriceList.length; i++){
                if(!that.tabpriceList[i].unit){
                    that.$message({
                        message: '请填写正确的价格',
                        type: 'warning'
                    })
                    return false
                }
                if(!that.tabpriceList[i].movement){
                    that.$message({
                        message: '请选择价格浮动',
                        type: 'warning'
                    })
                    return false
                }
            }
            let total_quote_price = {
                supplier: [],
                zn: []
            };
            that.tabpriceList.forEach((item,index) => {
                if(item.name == '供应商价'){
                    let element = {
                        id: item.id,
                        description: item.payType,
                        price: item.movement + item.unit
                    }
                    total_quote_price.supplier.push(element);
                }else if(item.name == '联采价'){
                    let element = {
                        id: item.id,
                        description: item.payType,
                        price: item.movement + item.unit
                    }
                    total_quote_price.zn.push(element);
                }
            })

            that.$http.post(that.url_prefix + '/group/demand/finish/'+that.bigid,{
                token: that.token,
                quoted_price_record_id:that.quoteid,
                bid_demand_purchase_quoted_price_record_id: that.ckid,
                total_quote_price: JSON.stringify(total_quote_price)
            } ).then(function (response) {
                if(response.data.msg_code===100000){
                    //that.getTabList(that.currentPage);
                    that.innerVisible=false;
                    that.pushdata.success=2;
                    that.msgDialog=true;
                    // that.innerVisible=false;
                    that.getTabData(that.$route.params.id);
                }else {
                that.$alert(response.data.message , '警告', {confirmButtonText: '确定', callback: action => {}});
                    //that.$alert('请填写正确的价格', '警告',{confirmButtonText: '确定', callback: action => {}})
                };
            }).catch(function (error) {
                that.$alert(error , '警告', {confirmButtonText: '确定', callback: action => {}});
            });
        },
        //弹窗里面的方法
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex !=6 && columnIndex !=7) {
                if (rowIndex%3 === 0) {
                    return {
                        rowspan: 3,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        SpanMethod({ row, column, rowIndex, columnIndex }){
            if(columnIndex != 2 && columnIndex != 3){
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return{
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        ZNSpanMethod({ row, column, rowIndex, columnIndex }){
            if(columnIndex == 0){
                const _row = this.ZNArr[rowIndex];
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
        },
        //记录行号id
        getSpanArrById(data,arr,position){　
            for(var i = 0; i < data.length; i++) {
                if(i === 0){
                    arr.push(1);
                    position = 0
                }else{
                  // 判断当前元素与上一个元素是否相同
                    if(data[i].id === data[i - 1].id){
                        arr[position] += 1;
                        arr.push(0);
                    }else{
                        arr.push(1);
                        position = i;
                    }
                }
            }
        },
        PriceSpanMethod({ row, column, rowIndex, columnIndex }){
            if(columnIndex == 0){
                const _row = this.editArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return{
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        //倒计时
        timer(){
            let that=this;
            let time_end=new Date(that.deadline);
            time_end= time_end.getTime();
            let str_second,int_day,int_hour,int_minute,int_second;
            let time_now=new Date();
            time_now=time_now.getTime();
            let time_distance=time_end-time_now;
            if(time_distance>0){
                that.count=0;
                int_day=Math.floor(time_distance/86400000);
                time_distance-=int_day*86400000;
                int_hour=Math.floor(time_distance/3600000);
                time_distance-=int_hour*3600000;
                int_minute=Math.floor(time_distance/60000);
                time_distance-=int_minute*60000;
                int_second=Math.floor(time_distance/1000);
                time_distance-=int_second*1000;
                if(int_hour<10)int_hour="0"+int_hour;
                if(int_minute<10)int_minute="0"+int_minute;
                if(int_second<10)int_second="0"+int_second;
                that.day=int_day;
                that.hour=int_hour;
                that.minute=int_minute;
                that.second=int_second;
                setTimeout(that.timer,1000);
            }else{
                that.count=1
            }
        },
        //跳转
        goTo(curPage){
            this.curPage = curPage;
            this.getPaymentModeList();
        },
        //获取付款方式列表
        getPaymentModeList(){
            let that = this;
            let url = that.url_prefix + '/group/pay_type/lists';
            let params = {
                token: that.token,
                per_page: 10,
                current_page: that.curPage,
                status: 'VISIBLE'
            };
            that.ZN_GET(url,params,function(data){
                that.paymentModeTotal = data.response.total;
                that.paymentModeList = data.response.data.map(item => {
                    let element = {};
                    element.id = item.id;
                    element.desc = item.description;
                    element.pay_type = item.pay_type;
                    element.point_day = item.point_day;
                    element.status = item.status;
                    element.type = item.status == 'VISIBLE' ? 'danger' : 'primary';
                    if(item.pay_type == 'PAY_IN_DAYS'){
                        element.mode = item.point_day + '天';
                    }else if(item.pay_type == 'DAY_IN_MONTH'){
                        element.mode = '每月' + item.point_day + '日';
                    };
                    return element;
                });
            })
        },
        //打开付款方式弹框
        openPaymentModeWindow(){
            this.pushDialogVisible = false;
            this.paymentModeVisible = true;
            this.getPaymentModeList();
        },
        //关闭付款弹框
        closePaymentModeWindow(){
            this.paymentModeVisible = false;
            this.pushDialogVisible = true;
        },
        //付款方式选择
        handlePaymentSelect(val){
            this.paymentModeSelected = val;
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
    }
}
</script>

<style lang="less" scoped>
    .contain {
        .header {
            height: 60px;
            width: 98%;
            background-color: #fff;
            text-align: left;
            margin:.5% 1%;
            line-height: 60px;
            padding-left: 2%;
            box-sizing: border-box;
            color: #0576db;
            font-size: 24px;
            font-weight: 600;
            border-radius: 4px;
            span{
                float: right;
                font-size: 14px;
                padding-right: 30px;
                cursor: pointer;
            }
        }
        // .container{
        //     height: calc(100% - 3% - 55px);
        //     width: 98%;
        //     margin: 0% 1%;
        //     position: relative;
        //     box-sizing: border-box;
        //     display: inline-block;
        //     overflow: hidden;
        //     overflow-y: auto;
            .contH{
                height: 29px;
                line-height: 29px;
                width: 100%;
                text-align: left;
                padding-left: 1%;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                color: #0576db;
                font-size: 18px;
                font-weight: 600;
            }
            .yellow{
                color: #ffc601;
                font-weight: 600;
            }
            .stateCon{
                height: calc(100% - 30px);
                width: 100%;
            }
            .cont_1{
                background-color: #fff;
                height: 210px;
                width: 100%;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                padding: .5%;
                border-radius: 4px;
                .state{
                    height: 30px;
                    width: 100%;
                    line-height: 30px;
                    text-align: left;
                    padding-left: 1%;
                    box-sizing: border-box;
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
                }
                .stateCon{
                    height: calc(100% - 59px);
                    .sCon{
                        height: 30px;
                        line-height: 30px;
                        width: 32%;
                        float: left;
                        text-align: left;
                        padding-left: 1%;
                        .conH{
                            float: left;
                            font-size: 14px;
                            color: #666666;
                            width: 110px;
                        }
                        .conC{
                            float: left;
                            font-size: 14px;
                            color: #333333;
                            width: 60%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }

                }
                
            }
            .cont_2{
                background-color: #fff;
                margin-top: .5%;
                height: auto;
                width: 100%;
                padding: 5px;
                box-sizing: border-box;
                border-radius: 4px;
            }
            .cont_3{
                background-color: #fff;
                margin-top: 0.5%;
                height: auto;
                width: 100%;
                display: inline-block;
                box-sizing: border-box;
                padding: .5%;
                border-radius: 4px;
                .cont_31{
                    height: auto;
                    width: 100%;
                    .sCon{
                        height: 30px;
                        line-height: 30px;
                        width: 100%;
                        text-align: left;
                        padding-left: 2%;
                        box-sizing: border-box;
                        &:last-child{
                            height: auto;
                            border-top: 1px dashed #eee;
                            width: 96%;
                            margin: auto;
                            display: inline-block;
                            padding-left: 0;
                        }
                        .conH{
                            float: left;
                            font-size: 14px;
                            color: #666666;
                            width: 20%;
                        }
                        .conC{
                            float: left;
                            font-size: 14px;
                            color: #333333;
                            width: 60%;
                            .timeStyle{
                                display: inline-block;
                                //background-color: #0576db;
                                color: #0576db;
                                height: 20px;
                                line-height: 20px;
                                min-width: 30px;
                                text-align: center;
                                font-weight: 600;
                            }
                            .files{
                                height: 30px;
                                line-height: 30px;
                                float: left;
                                margin-left: 15px;
                            }
                        }
                        .first,.second{
                            width: 50%;
                            float: left;
                        }
                    }
                }
                .cont_32{
                    height: auto;
                    width: 100%;
                    .pushbtn{
                        height: 30px;
                        width: 125px;
                        background-color: #0677dc;
                        color: #fff;
                        text-align: center;
                        line-height: 30px;
                        cursor: pointer;
                        border-radius: 7px;
                        margin: 0 auto;
                        margin: 1.5% 2%;
                    }
                    .pushbtns{
                        height: 30px;
                        width: 125px;
                        background-color: #ccc;
                        color: #fff;
                        text-align: center;
                        line-height: 30px;
                        cursor: pointer;
                        border-radius: 7px;
                        margin: 0 auto;
                        margin: 1.5% 2%;
                    }
                    .stateCon{
                        height: calc(100% - 70px);
                        width: 100%;
                        // .clicknes{
                        //     height: 30px;
                        //     width: 70px;
                        //     background-color: #0677dc;
                        //     color: #fff;
                        //     text-align: center;
                        //     line-height: 30px;
                        //     //cursor: pointer;
                        //     border-radius: 7px;
                        //     margin: 0 auto;
                        // }
                        .clicknes{
                            height: 30px;
                            width: 70px;
                            color: green;
                            text-align: center;
                            line-height: 30px;
                            border-radius: 7px;
                            margin: 0 auto;
                        }
                        .clickne{
                            height: 30px;
                            width: 70px;
                            color: red;
                            text-align: center;
                            line-height: 30px;
                            border-radius: 7px;
                            margin: 0 auto;
                        }
                        .clicks{
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
                        .clickss{
                            height: 30px;
                            width: 70px;
                            background-color: #ccc;
                            color: #fff;
                            text-align: center;
                            line-height: 30px;
                            border-radius: 7px;
                            margin: 0 auto;
                        }
                    }
                    .pageCont{
                        height: 40px;
                        width: 100%;
                        line-height: 40px;
                        position: absolute;
                        bottom: 0%;
                    }
                }
            }
       // }
    }
    // 内层弹窗样式
    .el-dialog__header{
        display: none;
    }
    .d_cont{
        //height: 420px;
        .cont_head{
            height: 50px;
            line-height: 50px;
            color: #000;
            width: 100%;
            text-align: center;
            font-size: 20px;
            font-weight: 600;
        }
        .cont_con{
            //height: 270px;
            .con_top{
                height: 50px;
                width: 100%;
                .inputs{
                    height: 50px;
                    width: 30%;
                    float: left;
                    margin-left: 3%
                }
            }
            .con_bottom{
                height: 220px;
                width: 100%;
                overflow: hidden;
                overflow-y: auto;
                .el-checkbox {
                    height: 30px;
                    line-height: 30px;
                    width: 100%;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                    &:nth-child(2n){
                        margin-left: 0; 
                    }
                    &:nth-child(2n+1){
                        margin-left: 0; 
                    }
                    span {
                        float: right;
                    }
                }
            }
        }
        .pageCont{
            height: 30px;
            //width: 100%;
            float: left;
            bottom: initial;
        }
        .items{
            float: left;
            height: 30px;
            line-height: 30px;
            width: 100px;
            text-align: left;
            padding-left: 5px;
            color: #0677dc;
            border: 1px solid #0677dc;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 10px;
            display: inline-block;
            white-space: nowrap;
            padding-right: 20px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            margin-bottom: 10px;
            position: relative;
            .delLogo{
                background-image: url(../../assets/public/error.png);
                background-repeat: no-repeat;
                background-position: center;
                background-size: 100% 100%;
                height: 10px;
                width: 10px;
                vertical-align: middle;
                right: 7px;
                cursor: pointer;
                top: 9px;
                position: absolute;
            }
        }
    }
</style>
