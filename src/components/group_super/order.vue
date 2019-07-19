<template>
    <div>
        <h3>订单详情</h3>
        <div class="titlediv">订单号：{{orderN}}
            <span class="rightSpan nomalBtn"  @click="function1(1)" v-if="hasClose">同意关闭</span>
            <span class="rightSpan nomalBtn"  @click="function1(2)"  v-if="hasClose">驳回关闭</span>
            <span class="rightSpan"  v-if="!hasClose">{{orderState}}</span>
        </div>
        <el-table
            :data="data1"
            border
            style="width: 100%">
            <el-table-column  prop="branch_name" label="需求方" >
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
            <el-table-column  v-else  label="操作" width="160" key="orderActive">
                <template slot-scope="scope">
                    <div v-if="closure && scope.row.status == 'PENDING'" class="tabelBtn1" @click="seeItem">申请关闭</div>
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
        <div class="titlediv">订单批次信息  </div>
        <el-table
            :data="data2"
            border
            style="width: 100%">
            <el-table-column label="批次号"><!--type="index" :index="indexMethod"-->
                <template slot-scope="scope">
                    <span>{{ scope.row.batch_number }}</span>
                    <span v-if="scope.row.is_copy === 1">({{ scope.row.copy_from }})</span>
                </template>
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
<!--                     <div class="nomalBtn1 tabelBtn" @click="seeItem1(scope.row, 2)" v-if="customCheckBtn && scope.row.currentBtn">审核批次</div>
                    <div class="nomalBtn1 tabelBtn" @click="seeItem1(scope.row, 2)" v-if="scope.row.status == 'WAIT_DEPARTMENT_SIGN_CHECK'" v-show="CostConfirmBtn">确认供货订单</div>
                    <div class="nomalBtn1 tabelBtn" @click="seeItem1(scope.row, 2)" v-if="scope.row.status == 'WAIT_SIGN_CHECK'" v-show="CombineConfirmBtn">确认供货订单</div> -->
                    <div class="nomalBtn1 tabelBtn" @click="seeItem1(scope.row, 1)" v-if="detailBtn">查看详情</div>
                    <div class="nomalBtn1 tabelBtn" @click="goToPay(scope.row)" v-if="scope.row.status == 'WAIT_GROUP_PAY' && PaymentBtn && groupCanPay(scope.row)">支付批次</div>
                    <div class="nomalBtn1 tabelBtn" @click="goToEdit(scope.row)" v-if="scope.row.is_can_edit && PaymentBtn">编辑</div>
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

        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="90%"
            >
            <div class="step-bar-div">
                <stepBar :stepData="stepData" />
            </div>
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
                            <div>{{scope.row.brand_name == '0' ? '--' : scope.row.brand_name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="diameter"
                        label="直径（mm）"
                        >
                        <template slot-scope="scope">
                            <div>{{scope.row.diameter == '0' ? '--' : scope.row.diameter}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="数量（吨）">
                        <template slot-scope="scope">
                            <div>{{scope.row.num == '0' ? '--' : scope.row.num}}</div>
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
                    <!-- todo start -->
                    <el-table-column prop="webPrice" label="当日网价" v-if="allocationShow">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.webPrice" placeholder="当日网价" @blur="comput(scope.row)" :disabled="isNum != 2 || allocationedit"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalPrice" label="总额" v-if="allocationShow">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.totalPrice" placeholder="总额" :disabled="true"></el-input>
                        </template>
                    </el-table-column>
                    <!-- todo end -->
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
                <el-button @click="checkForBatchOrder('APPROVE', dialogJson.status)" v-if="isNum == 2">同 意</el-button>
                <el-button type="primary" @click="checkForBatchOrder('REJECT', dialogJson.status)" v-if="isNum == 2 && dialogJson.status == 'CUSTOM_CHECKING'">驳 回</el-button>
                <el-button @click="dialogVisible = false" v-if="isNum == 1">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog
            :title="title"
            :visible.sync="dialogVisible1"
            width="60%"
            >
            <el-form>
                <el-form-item label="支付金额">
                    <span class="requiredSpan fl">*</span>
                    <el-input v-model="group_pay_amount" placeholder="支付金额" class="width150"></el-input>
                </el-form-item>
                <el-form-item label="上传附件">
                    <span class="requiredSpan fl">*</span>
                    <el-upload
                        :action="this.$api.upload_file_url"
                        :on-remove="handleFileRemove"
                        :before-remove="beforeFileRemove"
                        :data="{column:'purchasers',category:'order'}"
                        multiple
                        :on-success="handleFileChange"
                        :on-progress="handleProgress"
                        :file-list="fileList"
                        :show-file-list="false">
                            <el-button size="small" type="primary" >点击上传</el-button>
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
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickF1">提 交</el-button>
                <el-button @click="dialogVisible1 = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import stepBar from '@/components/public/stepBar'
    import attachmentList from '../public/attachmentList'
    export default {
        data(){
            return {
                title:'',
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
                dialogVisible1:false,
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
                originalGroup_pay_amount:"",
                hasClose: false,
                url_prefix: '/api/frontend/joint_purchase/super',
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
                project_code: '',
                product_name: '',
                //按钮权限
                closure: false,
                customCheckBtn: false,
                detailBtn: false,
                PaymentBtn: false,
                CostConfirmBtn: false,
                CombineConfirmBtn: false,
                currentBtn: '',
                allocationShow: false,
                allocationedit: true,

            }
        },
        components: {
            stepBar,
            attachmentList
        },
        methods: {
            //权限按钮
            getAuthority(){
                let that=this;
                if(that.$store.getters.authForGroup.OrderList && that.$store.getters.authForGroup.OrderList.transfers.length > 0){
                    that.$store.getters.authForGroup.OrderList.transfers.map(item=>{
                        if(item.power_transfer_name.indexOf('申请关闭')!=-1){
                            that.closure=true;
                        }else if(item.power_transfer_name.indexOf('审核批次') != -1){
                            that.customCheckBtn = true;
                        }else if(item.power_transfer_name.indexOf('查看详情') != -1){
                            that.detailBtn = true;
                        }else if(item.power_transfer_name.indexOf('支付批次') != -1){
                            that.PaymentBtn = true;
                        }else if(item.power_transfer_name.indexOf("成本部确认收货") != -1){
                            that.CostConfirmBtn = true;
                        }else if(item.power_transfer_name.indexOf("联采部确认收货") != -1){
                            that.CombineConfirmBtn = true;
                        }else if(item.power_transfer_name.indexOf('批次订单配置显示')!=-1){
                            that.allocationShow = true;
                        }else if(item.power_transfer_name.indexOf('批次订单配置编辑')!=-1){
                            that.allocationedit = false;
                        }
                    });
                }
            },
            //计算价格
            comput(val){
                let reg = /^\d+$/;
                if(reg.test(val.webPrice)){
                    val.totalPrice = val.num * val.webPrice || 0;
                }else{
                    this.$alert('请输入正确的当日网价（数字）');
                    val.webPrice = "";
                }
            },
            function1(num){
                let that = this;
                let params = {token: that.token};
                let title = "";
                if(num == 2){
                    // 同意关闭
                    params.close_status = "GROUP_AUTH_REJECT";
                    that.$prompt('', '请输入驳回原因', {
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
                        params.close_reject_reason = value;
                        that.$http.post(that.url_prefix + '/group/order/close_order_auth/' + that.id,params).then(function(response){
                                let result = response.data;
                                if(result.msg_code == 100000){
                                    that.getData(that.id);
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
                    });
                }else{
                    params.close_status = "WAIT_ZN_CONFIRM";
                    title = "同意申请";

                    that.$confirm(title,'提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        that.$http.post(that.url_prefix + '/group/order/close_order_auth/' + that.id,params).then(function(response){
                                let result = response.data;
                                if(result.msg_code == 100000){
                                    that.getData(that.id);
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
                        })
                    .catch(() => {
                        that.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    })
                }
            },
            //支付批次
            clickF1(){
                let that = this;
                let paymoney='';
                if(that.group_pay_amount == that.toDecimal(that.originalGroup_pay_amount)){ //潜在的bug：如果用户填写的数字和原始数据保留两位小数后的一样，则提交上去的则不是用户填写的
                    paymoney = that.originalGroup_pay_amount;
                }else{
                    paymoney = that.group_pay_amount;
                }
                that.$http.post(that.url_prefix + "/group/order/slave_order_pay/" + that.editId, {
                    token:that.token,
                    attachments:that.attachments,
                    group_pay_amount:paymoney,
                    payment_method: 'PAY_OFF_LINE'
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.dialogVisible1 = false;
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
            // 同意
            clickF(num,status){
                // num 1 同意  2 驳回
                let that = this;
                let json = {};
                let url;
                if(status == 'WAIT_CHECK'){
                    url = that.url_prefix + "/group/order/slave_order_department_check/"+ that.editId;
                }else if(status == 'DEPARTMENT_CHECK_PASS'){
                    url = that.url_prefix + "/group/order/slave_order_check/"+ that.editId;
                }else if(status == 'WAIT_DEPARTMENT_SIGN_CHECK'){
                    url = that.url_prefix + "/group/order/slave_order_department_sign_check/"+ that.editId;
                }else{
                    url = that.url_prefix + "/group/order/slave_order_sign_check/"+ that.editId;
                }
                if(num == 1){
                    json.token = that.token;
                    if(status == 'WAIT_CHECK'){
                        json.status = 'DEPARTMENT_CHECK_PASS';
                    }else if(status == 'DEPARTMENT_CHECK_PASS'){
                        json.status = 'CHECK_PASS';
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
                    }).catch(function (error) {
                        that.$alert(error , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    });
                }else{
                    that.$prompt('', '请输入驳回原因', {
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
                        json = {
                            token:that.token,
                            status: status == 'WAIT_CHECK' ? 'DEPARTMENT_CHECK_REJECT' : 'CHECK_REJECT',
                            reject_reason :  value
                        };
                        that.$http.post(url , json).then(function (response) {
                            if(response.data.msg_code == 100000){
                                that.getData(that.id);
                                that.dialogVisible = false;
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
                }
            },
            /**
             * 自定义审核
             * @param  {Object} params   请求参数
             * @param  {Number} orderId  批次订单ID
             * @param  {Number} recordId 本次审核操作的ID
             */
            customCheck(params, orderId, recordId){
                let that = this;
                that.$api.customExamineForBatchOrder(params, orderId, recordId)
                    .then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.dialogVisible = false;
                            that.getData(that.id);
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
            /**
             * 成本部确认签收
             * @param  {Object} params 请求参数
             * @param  {Number} id     批次订单id
             */
            departmentSignCheck(params, id){
                let that = this;
                that.$api.departmentSignCheckForBatchOrder(params, id)
                    .then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.dialogVisible = false;
                            that.getData(that.id);
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
            /**
             * 联采部确认签收
             * @param  {Object} params 请求参数
             * @param  {Number} id     批次订单id
             */
            signCheck(params, id){
                let that = this;
                that.$api.signCheckForBatchOrder(params, id)
                    .then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.dialogVisible = false;
                            that.getData(that.id);
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
            /**
             * 批次订单审核
             * @param  {String} type    'APPROVE'同意；'REJECT'驳回
             * @param  {String} status 状态
             */
            checkForBatchOrder(type, status){
                let that = this;
                let params = {
                    token: that.token,
                    spec: JSON.stringify(that.dialogJson.spec)
                };
                if(type == 'APPROVE'){
                    switch(status){
                        case 'CUSTOM_CHECKING':
                            params.status = 'CHECK_PASS';
                            that.customCheck(params, that.editId, that.currentBtn.id)
                            break;
                        case 'WAIT_DEPARTMENT_SIGN_CHECK':
                            that.departmentSignCheck(params, that.editId)
                            break;
                        case 'WAIT_SIGN_CHECK':
                            that.signCheck(params, that.editId)
                            break;
                        default:
                            console.log('未匹配到当前状态：' + status);
                            break;
                    }
                }else if(type == 'REJECT'){
                    that.$prompt('', '请输入驳回原因', {
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
                        params.status = 'CHECK_REJECT';
                        params.reject_reason = value;
                        if(status == 'CUSTOM_CHECKING'){
                            that.customCheck(params, that.editId, that.currentBtn.id)
                        }else{
                            console.log('未匹配到当前状态：' + status);
                        }
                    }).catch(() => {
                        console.log('您取消了')
                    });
                }else{
                    console.log('参数有误')
                }
            },
            // 跳转到支付页面
            goToPay(val){
                let that = this;
                let project_code = encodeURIComponent(that.project_code);
                let product_name = encodeURIComponent(that.product_name);
                let project_name = encodeURIComponent(that.project_name);
                that.$router.push({
                    name: 'groupModeOfPayment_super',
                    params: {
                        order_no: val.order_no,
                        order_id: val.id
                    },
                    query: {
                        code: project_code,
                        name: product_name,
                        project_name
                    }
                })
            },
            //编辑在线支付页面
            goToEdit(val){
                let project_code = encodeURIComponent(this.project_code);
                let product_name = encodeURIComponent(this.product_name);
                let project_name = encodeURIComponent(this.project_name);
                let pay_info_id = val.get_slave_order_pay_info.length > 0 && encodeURIComponent(val.get_slave_order_pay_info[0].id);
                this.$router.push({
                    name: 'groupModeOfPaymentEdit_super',
                    params: {
                        order_no: val.order_no,
                        order_id: val.id
                    },
                    query: {
                        code: project_code,
                        name: product_name,
                        project_name,
                        pay_info_id
                    }
                })
            },
            // 查看详情
            seeItem1(val, num){
                let that = this;
                that.editId = val.id;
                that.currentBtn = val.currentBtn;
                if(num == 1){
                    that.title = "查看第" + (val.batch_number || '--') + "批次订单";
                }else{
                    that.title = "审核第" + (val.batch_number || '--') + "批次订单";
                }
                that.isNum = num;

                let time = '';
                let spec = spec = val.get_slave_order_configures;
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
                    paid_type:val.paid_type,
                    spec,
                    receive_time:time,
                    pay_description: val.pay_description,
                    status: val.status,
                    pay_type: val.pay_type,
                    paid_type: val.paid_type
                };
                that.dialogVisible = true;
                //当前从订单付款方式
                that.currentPaidType = val.paid_type;
                //获取步骤条信息
                that.getStepsData(val.id);
                //获取操作日志
                that.getStepsLog(val.order_no)
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
                    that.$http.get(that.url_prefix + '/group/order/apply_close_order/'+id, {
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
            indexMethod(index){
                return '批次' + (index + 1);
            },
            //获取订单详情数据
            getData(id){
                let that = this;
                let params = {
                    token : that.token
                }
                let currentUserRoleName = JSON.parse(that.$store.state.currentUserRoleName).roles;
                that.$http.get(that.url_prefix + '/group/order/detail/'+id, {
                    params
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        // that.orderState =  response.data.response.status == 'PENDING' ? "履约中" : response.data.response.status == 'CLOSING' ? "关闭中":"已结束";

                        // close_status
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

                        that.project_code = response.data.response.demand.project_code;
                        that.product_name = response.data.response.demand_purchase.demand.category.name;
                        that.project_name = response.data.response.project_name;
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
                            // if(item.status == "CHECK_PASS"){
                            //     item.statusN = "已确认"
                            // }else if(item.status == "CHECK_REJECT"){
                            //     item.statusN = "已驳回"
                            // }else if(item.status == "WAIT_GROUP_PAY"){
                            //     item.statusN = "待支付"
                            // }else if(item.status == "WAIT_ZN_PAY"){
                            //     item.statusN = "待筑牛支付"
                            // }else if(item.status == "WAIT_SUPPLIER_CONFIRM_RECEIVE_MONEY"){
                            //     item.statusN = "待收款"
                            // }else if(item.status == "WAIT_SEND_GOODS"){
                            //     item.statusN = "待发货"
                            // }else if(item.status == "WAIT_SIGN"){
                            //     item.statusN = "待收货"
                            // }else if(item.status == "FINISHED"){
                            //     item.statusN = "已完成"
                            // }else if(item.status == 'WAIT_DEPARTMENT_SIGN_CHECK'){
                            //     item.statusN = "已收货待成本部审核"
                            // }else if(item.status == 'WAIT_SIGN_CHECK'){
                            //     item.statusN = "已收货待联采部审核"
                            // }else if(item.status == 'CUSTOM_CHECKING'){
                            //     //流程审核中的按钮及状态显示
                            //     item.statusN = that.showAuditStatus(item.records);
                            //     if(that.showFlowsAuditBtn(item.records).length > 0){
                            //         item.currentBtn = that.showFlowsAuditBtn(item.records)[0];
                            //     }
                            // }
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
                        if(!currentUserRoleName.some(role => role.name == '成本部' || role.name == '财务部')){ //成本部和财务部不显示供应商报价
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
                        }
                        for(let i=0;i<JSON.parse(response.data.response.quote_result).zn.length;i++){
                            let itemdata={
                                name:'筑牛报价',
                                supplier_name:"筑牛报价",
                                time:response.data.response.demand_purchase.demand_purchase_choosed_quoted_price_record.created_at,
                                description:JSON.parse(response.data.response.quote_result).zn[i].description,
                                price: that.signToWords(JSON.parse(response.data.response.quote_result).zn[i].price)
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
            //获取批次订单进度
            getStepsData(slave_order_id){
                let that = this;
                let params = {
                    token: that.token,
                    process_type: 'SLAVE_ORDER',
                    slave_order_id: slave_order_id
                };
                that.$api.groupBatchOrderProcess(params)
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
                                }
                                */
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
                that.$api.groupBatchOrderLogList(params, id)
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
            //流程审核按钮显示
            showFlowsAuditBtn(records){
                let currentUserRoles = JSON.parse(this.$store.state.currentUserRoles);
                let rolesIntersection = [];
                if(records.length > 0 && currentUserRoles && currentUserRoles.length > 0){
                    rolesIntersection = this.rolesIntersection(currentUserRoles, records);
                }
                return rolesIntersection
            },
            //财务部能否支付判断
            groupCanPay(item){
                let pay_type = item.paid_type;
                let can_pay = item.is_can_pay;
                if(pay_type == 'PAID_BEFORE'){
                    return true
                }
                if(pay_type != 'PAID_BEFORE' && can_pay){
                    return true
                }
                return false
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
            that.getAuthority();
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