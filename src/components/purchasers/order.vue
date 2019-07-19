<template>
    <div>
        <h3>订单详情</h3>
        <div class="titlediv">订单号：{{orderN}}   <span class="rightSpan">{{orderState}}</span></div>
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
            <el-table-column  prop="project_code" label="项目编码" >
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
            <el-table-column  v-else  label="操作" width="160" key="orderActive">
                <template slot-scope="scope">
                    <div class="tabelBtn1" @click="seeItem" v-if="closureBtn && scope.row.status == 'PENDING'">申请关闭</div>
                    <div v-else>--</div>
                </template>
            </el-table-column >
        </el-table>
        <div class="online"></div>
        <div class="titlediv">采购信息   <span class="rightSpan">订单生成时间：{{created_at}}</span></div>
        <el-table
            :data="data1"
            border
            style="width: 100%">
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
        <div class="titlediv">订单批次信息   <span class="rightSpan btn" @click="createBatch" v-if="orderState == '履约中'&&establishBtn">创建批次订单</span></div>
        <el-table
            :data="data2"
            border
            style="width: 100%">
            <el-table-column  prop="batch_number" label="批次号" width="180">
            </el-table-column>
            <el-table-column  prop="order_no" label="批次订单号">
            </el-table-column>
            <el-table-column  prop="received_goods_num" label="发货适量（吨）" >
            </el-table-column>
            <el-table-column  prop="send_goods_time" label="发货日期" >
            </el-table-column>
            <el-table-column  prop="actual_receive_time" label="收货日期" >
                <template slot-scope="scope">
                    <div>{{scope.row.actual_receive_time ||'--'}}</div>
                </template>
            </el-table-column>
            <el-table-column  prop="statusN" label="状态" >
            </el-table-column>
            <el-table-column  label="操作" width="240">
                <template slot-scope="scope">
                    <div class="nomalBtn1 tabelBtn" @click="seeItem1(scope.row)" v-if="lookBtn">查看详情</div>
                    <!-- <div class="nomalBtn1 tabelBtn" @click="confirmVolumePriceWindow(scope.row)" v-if="scope.row.statusN == '待分公司确认' && volumePriceBtn">确认量价</div> -->
                    <!-- <div class="nomalBtn1 tabelBtn" @click="seeItem2(scope.row)" v-if="(scope.row.statusN == '已驳回'|| scope.row.statusN == '成本部审核拒绝')&&editBtn">编辑提交</div> -->
                    <!-- <div class="nomalBtn1 tabelBtn" @click="rejectreson(scope.row)" v-if="scope.row.statusN == '已驳回'||'成本部审核拒绝'">驳回原因</div> -->
                    <div class="nomalBtn1 tabelBtn" @click="seeItem3(scope.row)" v-if="scope.row.statusN == '待收货'&&receiptBtn">确认收货</div>
                </template>
            </el-table-column >
        </el-table>

        <div class="online"></div>
        <div class="titlediv">成交价格</div>
        <el-table :data="priceData" border style="width: 100%" :span-method="SpanMethod">
            <el-table-column  prop="supplier_name" label="供应商名" ></el-table-column>
            <el-table-column  prop="time" label="报价时间" ></el-table-column>
            <el-table-column  prop="description" label="订单支付方式" ></el-table-column>
            <el-table-column  prop="price" label="单位（元/吨）" ></el-table-column>
        </el-table>

        <el-dialog :title="title" :visible.sync="dialogVisible" width="90%">
            <stepBar v-show="!isNewOrder" :stepData="stepData" />
            <p>报价参考网站: {{ dialogFs }}</p>
            <p>
                <span>报价参考地： </span>
                <span>{{ dialogPlace }}</span>
            </p>
            <div class="web-price-date">
                <span>订价日期：</span>
                <el-date-picker
                    v-model="webPriceDate"
                    type="datetime"
                    value-format= 'yyyy-MM-dd HH:mm:ss'
                    placeholder="选择日期时间"
                    :disabled="true">
                </el-date-picker>
            </div>
            <el-form>
               <el-form-item label="支付方式">
                   <el-select v-model="dialogJson.paid_type" placeholder="请选择支付方式" class="width350" :disabled="!isSureGood">
                        <el-option :label="item.description" :value="item.description" v-for="(item,index) in priceType" :key="index"></el-option>
                        <!-- <el-option label="每月10日，结清上月贷款" value="PAID_AFTER_IN_TENTH"></el-option>
                        <el-option label="货到工地，90天内结算所欠货款" value="PAID_AFTER_IN_NINETIETH"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item :label="dialogtimeTitle" v-show="showGoodsTime">
                    <span class="requiredSpan">*</span>
                    <el-date-picker
                        v-model="dialogJson.receive_time"
                        type="datetime"
                        value-format= 'yyyy-MM-dd HH:mm:ss'
                        placeholder="选择日期时间"
                        :disabled="!hasSure">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="上传附件"  v-if='hasLoad'>
                    <span class="requiredSpan fl">*</span>
                    <el-upload
                        :action="this.$api.upload_file_url"
                        :on-remove="handleFileRemove"
                        :before-remove="beforeFileRemove"
                        :on-progress="handleProgress"
                        :data="{column:'purchasers',category:'order'}"
                        multiple
                        :on-success="handleFileChange"
                        :file-list="fileList"
                        :show-file-list="false">
                            <el-button size="small" type="primary" :disabled="unUpload">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip" >请上传收货凭证</div>
                    </el-upload>
                    <!-- 进度条 -->
                    <div v-if="uploadProgressVisible" style="width: 50%">
                        <el-progress :percentage="uploadPercentage"></el-progress>
                    </div>
                    <!-- 附件列表 -->
                    <attachmentList
                        :attachmentList="fileList"
                        @delete-attachment="deleteAttachment">
                    </attachmentList>
                </el-form-item>
                <div v-if="!hasLoad && attachments.length > 0 ">收货凭证</div>
                <div v-for="item in attachments" :key="item.path" v-if="!hasLoad && attachments.length > 0 ">
                    <a :href="item.path" download="download" class="downloadA">{{item.original_name}}</a>
                </div>

                <div class="onelineDiv">
                    参数详情  <div class="nomalBtn1 " v-if='hasSure' v-show="isNew || dialogJson.payType == 'PAID_BEFORE'" @click="addThisRow">添加一栏</div>
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
                    <el-table-column prop="price" label="网上标价（元）" v-if="allocationShow && dialogJson.payType != 'PAID_BEFORE'">
                        <template slot-scope="scope">
                            <!-- <el-input v-model="scope.row.webPrice" placeholder="当日网价" :disabled="!hasSure"></el-input> -->
                            <div>{{ scope.row.price || '--' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="group_total_money" label="总额（元）" v-if="allocationShow && dialogJson.payType != 'PAID_BEFORE'">
                        <template slot-scope="scope">
                            <!-- <el-input v-model="scope.row.totalPrice" placeholder="总额" :disabled="!hasSure"></el-input> -->
                            <div>{{ roundedToTwoDecimals(scope.row.group_total_money) || '--' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" placeholder="备注" :disabled="!hasSure"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作" v-if='hasSure'>
                        <template slot-scope="scope">
                            <div class="thisDiv" @click='deleteThisRow(scope.$index, scope.row)'>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDemand" v-if='hasSure' :disabled="alreadyClicked">确 定</el-button>
                <el-button type="danger" @click="confirmVolumePrice('REJECT')" v-if='isCheckVolumePrice && volumePriceRejectBtn'>驳回</el-button>
                <el-button type="primary" @click="confirmVolumePrice('APPROVE')" v-if='isCheckVolumePrice && volumePriceApproveBtn'>同意</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import stepBar from '../../components/public/stepBar'
    import attachmentList from '../../components/public/attachmentList'
    export default {
        data(){
            return {
                title:'',
                // 是否为 新建  批次
                isNew:true,
                // 有无 上传接口
                hasLoad:true,
                // 有无确认 按钮
                hasSure:true,
                // 是否为  更新批次订单
                isEdit:true,
                //是否确认收货
                isSureGood:true,
                //文件 数组
                attachments:[],
                // 编辑时  id
                editId:0,
                //是否显示收货时间
                showGoodsTime: true,
                //是否确认货量价
                isCheckVolumePrice: false,
                // 供应商报价截止时间
                dialogtimeTitle:"供应商报价截止时间",
                alreadyClicked: false, //防止重复提交
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
                    receive_time:'',
                    paid_type:''
                },
                data2:[],
                priceType:[],
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

                uploadPercentage: 0,
                uploadProgressVisible: false,
                currentPaidType: '',
                webPriceDate: '',
                //权限按钮
                lookBtn:false,
                establishBtn:false,
                closureBtn:false,
                editBtn:false,
                receiptBtn:false,
                unUpload:false,
                isNewOrder: true,
                allocationShow:false,
                volumePriceBtn: false,
                volumePriceApproveBtn: false,
                volumePriceRejectBtn: false
            }
        },
        components:{
            stepBar,
            attachmentList
        },
        methods: {
             //权限按钮
            getAuthority(){
                let that=this;
                that.$store.getters.authForGroup.NormalBranchOrderList.transfers.map(item=>{
                    if(item.power_transfer_name.indexOf('订单详情')!=-1){
                        that.lookBtn = true;
                    }else if(item.power_transfer_name.indexOf('创建批次')!=-1){
                        that.establishBtn = true;
                    }else if(item.power_transfer_name.indexOf('申请关闭')!=-1){
                        that.closureBtn = true;
                    }else if(item.power_transfer_name.indexOf('编辑提交')!=-1){
                        that.editBtn = true;
                    }else if(item.power_transfer_name.indexOf('确认收货')!=-1){
                        that.receiptBtn = true;
                    }else if(item.power_transfer_name.indexOf('上传支付凭证')!=-1){
                        that.unUpload = true;
                    }else if(item.power_transfer_name.indexOf('批次订单配置显示')!=-1){
                        that.allocationShow = true;
                    }else if(item.power_transfer_name.indexOf('确认价量') != -1){
                        that.volumePriceBtn = true;
                    }else if(item.power_transfer_name.indexOf('同意') != -1){
                        that.volumePriceApproveBtn = true;
                    }else if(item.power_transfer_name.indexOf('驳回') != -1){
                        that.volumePriceRejectBtn = true;
                    }
                });
            },
            // 查看详情
            seeItem1(val){
                let that = this;
                that.title = "查看第"+(val.batch_number||'--')+"批次订单";
                that.isNew = false;
                that.hasLoad = false;
                that.hasSure = false;
                that.isSureGood = false;
                that.isEdit = false;
                that.isNewOrder = val ? false : true;
                that.isCheckVolumePrice = false;
                that.webPriceDate = val.quotation_time;
                let time = "";
                let spec = val.get_slave_order_configures;
                if(val.actual_receive_time == null && val.send_goods_time == null){
                    that.dialogtimeTitle = "实际签收时间";
                    time = "";
                }else if(val.actual_receive_time){
                    that.dialogtimeTitle = "实际签收时间";
                    time = val.actual_receive_time;
                }else if(val.send_goods_time&&val.actual_receive_time==null){
                    that.dialogtimeTitle = "实际签收时间";
                    time = val.actual_receive_time;
                }else{
                    that.dialogtimeTitle = "实际签收时间";
                    time = '';
                };
                spec.forEach(item => {
                    item.totalPrice = item.num * item.webPrice || '';
                })

                if(val.branch_sign_attachments && val.branch_sign_attachments.length>0){
                    that.attachments = val.branch_sign_attachments;
                }else{
                    that.attachments = [];
                }
                that.dialogJson = {
                    master_order_id:that.id,
                    token: that.token,
                    paid_type: val.pay_description,
                    // paid_type:{
                    //     description:val.pay_description,
                    //     id:val.paid_type,
                    // },
                    spec,
                    receive_time:time,
                    payType: ''
                };
                that.dialogVisible = true;
                //当前从订单付款方式
                that.currentPaidType = val.paid_type;
                //获取步骤条信息
                that.getStepsData(val.id);
                //获取操作日志
                that.getStepsLog(val.order_no);
            },
            //确认货量价弹框
            confirmVolumePriceWindow(item){
                let that = this;
                that.title = "确认货量价";
                that.dialogtimeTitle = "计划收货时间";
                that.isNew = false;
                that.hasLoad = false;
                that.hasSure = false;
                that.isEdit = false;
                that.isSureGood = false;
                that.showGoodsTime = true;
                that.attachments = [];
                that.isNewOrder = item ? true : false;
                that.isCheckVolumePrice = true;
                that.webPriceDate = item.quotation_time;
                that.dialogJson = {
                    master_order_id: that.id,
                    token: that.token,
                    paid_type: item.pay_description,
                    spec: item.get_slave_order_configures,
                    receive_time: item.receive_time,
                    slave_order_id: item.id,
                    payType: ''
                };
                that.editId = item.id;
                that.dialogVisible = true;
                //获取步骤条信息
                that.getStepsData(item.id);
                //获取操作日志
                that.getStepsLog(item.order_no);
            },
            // 编辑提交
            seeItem2(val){
                let that = this;
                that.dialogtimeTitle = "供应商报价截止时间";
                that.title = "重新编辑批次订单";
                that.isNew = false;
                that.hasLoad = false;
                that.hasSure = true;
                that.isEdit = true;
                that.isSureGood = true;
                that.showGoodsTime = true;
                that.attachments = [];
                that.isNewOrder = val ? true : false;
                that.isCheckVolumePrice = false;
                let spec = val.get_slave_order_configures;
                that.dialogJson = {
                    master_order_id:that.id,
                    token: that.token,
                    //paid_type:val.pay_type_id,
                    paid_type:val.pay_description,
                    spec,
                    receive_time:val.receive_time,
                    payType: ''
                };
                that.webPriceDate = val.quotation_time;
                that.editId = val.id;
                that.dialogVisible = true;
                //获取步骤条信息
                that.getStepsData(val.id);
                //获取操作日志
                that.getStepsLog(val.order_no);
            },
            // 确认收货
            seeItem3(val){
                let that = this;
                that.dialogtimeTitle = "分公司确认收货时间";
                that.title = "确认收货";
                that.isNew = false;
                that.hasLoad = true;
                that.hasSure = true;
                that.isEdit = false;
                that.isSureGood = false;
                that.showGoodsTime = true;
                that.attachments = [];
                that.isNewOrder = val ? true : false;
                that.isCheckVolumePrice = false;
                that.fileList = [];  //重置附件展示列表
                let spec = val.get_slave_order_configures;
                spec.forEach(item => {
                    item.totalPrice = item.num * item.webPrice || '';
                })

                that.dialogJson = {
                    master_order_id:that.id,
                    token: that.token,
                    paid_type:val.pay_description,
                    spec,
                    receive_time:val.actual_receive_time,
                    payType: val.pay_type.pay_type
                };
                that.webPriceDate = val.quotation_time;
                that.editId = val.id;
                that.dialogVisible = true;
                //当前从订单付款方式
                that.currentPaidType = val.paid_type;
                //获取步骤条信息
                that.getStepsData(val.id);
                //获取操作日志
                that.getStepsLog(val.order_no)
            },
            //创建新的订单批次
            createBatch(){
                let that = this;
                that.dialogtimeTitle = "计划收货时间(必须当前时间两日后)";
                that.isNew = true;
                that.hasLoad = false;
                that.hasSure = true;
                that.isEdit = false;
                that.isSureGood = true;
                that.showGoodsTime = true;
                that.attachments = [];
                that.title = "创建批次订单";
                that.isNewOrder = true;
                that.isCheckVolumePrice = false;
                that.webPriceDate = '';
                that.dialogJson = {
                    master_order_id:that.id,
                    token: that.token,
                    paid_type:"",
                    spec:[
                        {
                            diameter:'0',
                            num:'0',
                            is_seismic:'0',
                            length:'9',
                            remark: '',
                            price: 0,
                            webPrice: 0,
                            group_price: 0
                        }
                    ],
                    receive_time:''
                };
                that.dialogVisible = true;
                that.stepsList = {};
            },
            // 提交按钮  3种状态 1提交新的   2修改  3提交收货凭证
            addDemand(){
                let that = this;
                let json = {};
                let url = "";
                let dialogJsonCopy = JSON.parse(JSON.stringify(that.dialogJson));
                if(dialogJsonCopy.spec.some(item => !that.isNumber(item.diameter))){ //校验直径输入
                    that.$message({
                        message: '请在“直径”框输入合法数字',
                        type: 'warning'
                    })
                    return false
                }
                if(dialogJsonCopy.spec.some(item => !that.isNumber(item.num))){ //校验数量输入
                    that.$message({
                        message: '请在“数量”框中输入合法数字',
                        type: 'warning'
                    })
                    return false
                }
                dialogJsonCopy.spec = JSON.stringify(dialogJsonCopy.spec);
                that.alreadyClicked = true; //防止重复提交
                if(that.isNew){
                    json = dialogJsonCopy;
                    url = '/api/frontend/joint_purchase/normal/branch/order/create_slave_order';
                }else if(that.isEdit){
                    json = dialogJsonCopy;
                    url = "/api/frontend/joint_purchase/normal/branch/order/update_slave_order/"+that.editId;
                }else{
                    json = {
                        token: that.token,
                        attachments: that.attachments,
                        spec: dialogJsonCopy.spec,
                        actual_receive_time: that.dialogJson.receive_time
                    };
                    url = "/api/frontend/joint_purchase/normal/branch/order/sign_slave_order/"+that.editId;
                }
                that.$http.post(url, json).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.dialogVisible = false;
                        that.getData(that.id);
                    }else{
                        that.$alert(response.data.message , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    }
                    that.alreadyClicked = false;
                }).catch(function (error) {
                    that.alreadyClicked = false;
                    that.$alert(error , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                });
            },
            /**
             * 分公司同意货量价
             * @param  {Object} params 请求参数
             * @param  {Number} id     批次订单id
             */
            approveVolumePrice(params, id){
                let that = this;
                that.$api.branchConfirmVolumePrice_normal(params, id)
                    .then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.$message({
                                message: '已同意',
                                type: 'success'
                            })
                            //刷新页面数据
                            that.getData(that.id);
                            that.isCheckVolumePrice = false;
                            that.dialogVisible = false;
                        }else{
                            console.log(result.message);
                            that.$alert(result.message , '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        }
                    }).catch(error => {
                        that.dialogVisible = false;
                        console.log(error);
                        that.$alert(error,'提示',{
                            confirmButtonText: '知道了',
                            callback: action => {}
                        })
                    })
            },
            /**
             * 分公司驳回货量价
             * @param  {Object} params 请求参数
             * @param  {Number} id     批次订单id
             */
            rejectVolumePrice(params, id){
                let that = this;
                that.$api.branchConfirmVolumePrice_normal(params, id)
                    .then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.$message({
                                message: '已驳回',
                                type: 'success'
                            });
                            //刷新页面数据
                            that.getData(that.id);
                            that.isCheckVolumePrice = false;
                            that.dialogVisible = false;
                        }else{
                            console.log(result.message);
                            that.$alert(result.message , '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        }
                    }).catch(error => {
                        that.dialogVisible = false;
                        console.log(error);
                        that.$alert(error,'提示',{
                            confirmButtonText: '知道了',
                            callback: action => {}
                        })
                    })
            },
            /**
             * 分公司审核货量价
             * @param  {String} type 'APPROVE'同意；'REJECT'驳回
             */
            confirmVolumePrice(type){
                let that = this;
                let params = {
                    token: that.token
                };
                if(type == 'APPROVE'){
                    params.status = 'WAIT_BRANCH_CONFIRM_PRICE_AND_QUANTITY';
                    that.approveVolumePrice(params, that.dialogJson.slave_order_id);
                }else if(type == 'REJECT'){
                    params.status = 'BRANCH_CONFIRM_PRICE_AND_QUANTITY_REJECT';
                    that.$prompt('', '请输入驳回原因', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }).then(({ value }) => {
                        if(!value){
                            that.$message({
                                message: '原因不能为空',
                                type: 'warning'
                            })
                            return false
                        };
                        params.reject_reason = value;
                        that.rejectVolumePrice(params, that.dialogJson.slave_order_id);
                    }).catch(() => {
                        console.log('您取消了')
                    });
                }else{
                    console.warn('参数错误');
                }
            },
            handleFileChange(response, file, fileList){
                this.attachments.push({
                    path:response.response.newFileName,
                    original_name:response.response.originalFileName
                });
                //附件列表展示
                this.fileList = fileList.map(item => {
                    item.id = item.uid;
                    if(item.raw.type.indexOf('image') == -1){
                        item.isImg = false;
                    }else{
                        item.isImg = true;
                    }
                    return item
                });
            },
            beforeFileRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleFileRemove(file, fileList) {
                this.attachments = fileList.map((item)=>{
                    return item.response.response;
                })
            },
            //自定义附件列表-删除附件
            deleteAttachment(index){
                this.fileList.splice(index,1);
                //更新提交时的附件列表
                this.attachments = this.fileList.map((item)=>{
                    let attachment = new Object();
                    attachment.path = item.response.response.newFileName;
                    attachment.original_name = item.response.response.originalFileName;
                    return attachment
                })
            },
            //上传进度
            handleProgress(event, file, fileList){
                this.uploadProgressVisible = true;
                this.uploadPercentage = event.percent;
                if(event.percent == 100){
                    this.uploadProgressVisible = false;
                    this.uploadPercentage = 0;
                }
            },
            addThisRow(){
                this.dialogJson.spec.push({
                    diameter:'0',
                    num:'0',
                    is_seismic:'0',
                    length:'9',
                    remark: '',
                    price: 0,
                    webPrice: 0,
                    group_price: 0
                });
            },
            deleteThisRow(index){
                this.dialogJson.spec.splice(index, 1);
            },
            seeItem(){
                let that = this;
                let id = that.id;
                that.$prompt('', '请输入关闭原因', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    if(!value){
                        that.$alert("原因不能为空" , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                        return false
                    };
                    let params = {
                        token:that.token,
                        close_reason :  value
                    };
                    that.$http.get('/api/frontend/joint_purchase/normal/branch/order/apply_close_order/'+id, {
                        params
                    }).then(function (response) {
                        if(response.data.msg_code == 100000){
                            // that.getTabList(that.currentPage);
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
                }).catch(() => {
                });
            },
            //批次订单号修改
            indexMethod(index){
                return '批次' + (index + 1);
            },
            //获取订单详情
            getData(id){
                let that = this;
                let params = {
                    token : that.token
                }
                that.$http.get('/api/frontend/joint_purchase/normal/branch/order/detail/'+id, {
                    params
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.orderState =  response.data.response.status == 'PENDING' ? "履约中" : response.data.response.status == 'CLOSING' ? "关闭中":"已结束";
                        that.orderN = response.data.response.order_no;
                        that.data1 = [];
                        let specifications = JSON.parse(response.data.response.demand_purchase.demand.category.spec);
                        response.data.response.spec = specifications.min +'-'+specifications.max;
                        that.data1.push(response.data.response);
                        that.data1[0].project_code=response.data.response.demand_purchase.demand.project_code;

                        that.created_at = response.data.response.created_at;

                        that.dialogPlace = response.data.response.reference_address;
                        that.dialogFs = response.data.response.demand_purchase.demand.quoted_price_website == "MY_STEEL" ? "我的钢铁":"西本";

                        if(response.data.response.quote_result!=""){
                            that.priceType=JSON.parse(response.data.response.demand_purchase.branch_approve_price);
                        }else{
                            that.priceType=[];
                        }
                        that.data2 = response.data.response.slave_orders.map(item => {
                            item.brand_name=response.data.response.demand_purchase.demand.category.name;
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
                                case 'WAIT_GROUP_CONFIRM_PAY':
                                    item.statusN = "线上支付待集团审核"
                                    break;
                                case 'WAIT_ZHUNIU_CONFIRM_PAY':
                                    item.statusN = "线上支付待筑牛审核"
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
                    that.$alert(error , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                });
            },
            //获取批次订单进度
            getStepsData(slave_order_id){
                let that = this;
                let params = {
                    token: that.token,
                    process_type: 'SLAVE_ORDER',
                    slave_order_id: slave_order_id
                };
                that.$api.branchBatchOrderProcess_normal(params)
                    .then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                            let stepsList = result.response.processes;
                            that.stepData.curStep = result.response.step;
                            that.stepData.steps = stepsList.map( (item, index) => {
                                //添加icon
                                switch (item.title) {
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
                                        item.icon = 'step-icon iconfont icon-jinbi';
                                        break;
                                }
                                //显示状态
                                if(item.status == 'STATUS_BRANCH_CONFIRM_REJECT'){
                                    item.current_status = 'error';
                                }
                                //自定义流程添加icon
                                /*
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
                                }*/
                                return item
                            })
                        }else{
                            console.log(result.message);
                            that.$alert(result.message , '提示', {
                                confirmButtonText: '知道了',
                                callback: action => {
                                }
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        that.$alert(error , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    });
            },
            //获取操作日志
            getStepsLog(id){
                let that = this;
                let params = {
                    token: that.token
                }
                //重置日志
                that.stepData.operateData.length = 0;
                that.$api.branchBatchOrderLogList_normal(params, id)
                    .then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                            let stepsList = result.response;
                            let length = stepsList.length;
                            if(stepsList.length == 0){ //空数组return
                                return false;
                            }
                            stepsList.forEach(function(element, index){
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
                                if(element.demand_status == 'STATUS_BRANCH_CONFIRM_REJECT'){
                                    item.approveStatus = '不通过';
                                }else if(element.demand_status == 'STATUS_SUPPLIER_CONFIRM_RECEIVER_MONEY'
                                    && that.currentPaidType != 'PAID_BEFORE'){
                                    item.approveStatus = '已完成';
                                }else if(element.demand_status == 'STATUS_BRANCH_SIGN'
                                    && that.currentPaidType == 'PAID_BEFORE'){
                                    item.approveStatus = '已完成';
                                }else{
                                    item.approveStatus = '通过';
                                }
                                that.stepData.operateData.push(item);
                            });
                        }else{
                            console.log(result.message);
                            that.$alert(result.message , '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                        that.$alert(error,'提示',{
                            confirmButtonText: '知道了',
                            callback: action => {}
                        })
                    })
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
            },
            //用户角色与流程角色求交集
            rolesIntersection(userRoles, flowRoles){
                let arr = [];
                flowRoles.forEach((flowItem, flowIndex) => {
                    userRoles.forEach((userItem, userIndex) => {
                        if(userItem == flowItem.examine_id){
                            arr.push(flowItem);
                        }
                    })
                })
                return arr
            },
            //列表状态显示
            showAuditStatus(records){
                let currentUserRoles = JSON.parse(this.$store.state.currentUserRoles);
                let status;
                let rolesIntersection = [];
                if(records.length == 0){
                    status = '已完成';
                }else{
                    status = '待' + records[0].examine_name + '审核';
                    if(currentUserRoles && currentUserRoles.length > 0){
                        rolesIntersection = this.rolesIntersection(currentUserRoles, records);
                        status = rolesIntersection.length > 0 ? '待' + rolesIntersection[0].examine_name + '审核' : status;
                    }
                }
                return status
            },
            /**
             * 发货数量改变改变计算货量价
             * @param  {Object} item 当前批次订单规格
             */
            calculatePriceForNum(item){
                let that = this;
                let reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
                if(that.isNew){ //创建批次订单不调接口计算价格
                    return false
                }
                if(reg.test(item.num)){
                    let params = {
                        token:that.token,
                        configure_id:item.id,
                        type:'GROUP_ACTUAL_MONEY',
                        price:item.webPrice,
                        num: item.num
                    }
                    that.$api.NetworkPriceCount_branch_normal(params).then(response=>{
                        if(response.data.msg_code===100000){
                            item.group_total_money = response.data.response.groupActualMoney;
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
            },
            //保留两位小数
            roundedToTwoDecimals(value){
                let number = parseFloat(value);
                return number.toString() == 'NaN' ? '--' : number.toFixed(2)
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
            that.id = that.$route.params.id;
            // 设置下token
            if(!that.$cookies.get("ZL_token")){
                that.$router.push({path: '/login'})
            }else{
                that.token = that.$cookies.get("ZL_token");
            };
            that.getData(that.id);
            that.getAuthority()
        }
    }
</script>
<style lang="less" scoped>
    .fl{
        float: left;
    }
    .downloadA{
        text-decoration: none;
        height: 30px;
        line-height: 30px;
    }
    .nomalBtn1.tabelBtn{
        width: 80px;
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
    .web-price-date{
        margin-bottom: 15px;
    }
</style>

