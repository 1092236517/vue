<template>
    <div class="payment-mode-wrapper" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.6)">
        <h3 class="payment-title">{{ pageTitle }}</h3>
        <el-tabs v-model="activeName" @tab-click="handleTapClick">
            <!-- 线上 -->
<!--             <el-tab-pane label="在线网银支付" name="onLineTab">
                <el-form ref="form" label-width="120px" v-model="onLine">
                    <el-form-item label="付款账号名称" class="clearfix">
                        <span class="requiredSpan">*</span>
                        <el-input v-model="onLine.payer_name" placeholder="请输入付款方户名" class="width260" >
                            <i slot="suffix" class="el-input__icon iconfont icon-wode" @click="openAccountWindow('payer')"  style="cursor:pointer"></i>
                        </el-input>
                        <span class="add-icon" @click="openCreateAccountWindow('payer')">+</span>
                    </el-form-item>
                    <el-form-item label="银行名称" style="float: left;">
                        <span class="requiredSpan">*</span>
                        <el-select v-model="onLine.payer_bank_name" placeholder="请选择银行" class="width260">
                            <el-option v-for="(item,index) in payer_bankName" :label="item.bank_name" :value="item.bank_name" :key='index'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="付款方账号" style="margin-left: 400px; margin-bottom: 0">
                        <span class="requiredSpan">*</span>
                        <el-input v-model="onLine.payer_account" placeholder="请输入付款方账号" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item label="加急程度">
                        <span class="requiredSpan">*</span>
                        <el-radio v-model="onLine.urgency_level" label="PAY_URGENTLY">加急</el-radio>
                        <el-radio v-model="onLine.urgency_level" label="PAY_NORMALLY">普通</el-radio>
                    </el-form-item>
                    <el-form-item label="收款账号名称" class="clearfix">
                        <span class="requiredSpan">*</span>
                        <el-input v-model="onLine.payee_name" placeholder="请输入收款方户名" class="width260">
                            <i slot="suffix" class="el-input__icon iconfont icon-wode" @click="openAccountWindow('payee')"  style="cursor:pointer"></i>
                        </el-input>
                        <span class="add-icon" @click="openCreateAccountWindow('payee')">+</span>
                    </el-form-item>
                    <el-form-item label="银行名称" style="float:left;">
                        <span class="requiredSpan">*</span>
                        <el-select v-model="onLine.payee_bank_name" placeholder="请选择银行" class="width260">
                            <el-option v-for="(item,index) in payee_bankName" :label="item.bank_name" :value="item.bank_name" :key='index'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收款方账号" style="margin-left: 400px; margin-bottom: 0">
                        <span class="requiredSpan">*</span>
                        <el-input v-model="onLine.payee_account" placeholder="请输入收款方账号" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item label="城市名称">
                        <span class="requiredSpan">*</span>
                        <el-cascader
                            :options="location_list"
                            @active-item-change="handleLocationItemChange"
                            @change="handleLocationChange"
                            :props="location_props"
                            v-model="onLine.location"
                            class="width260"></el-cascader>
                            <span class="tips">注：该选项为收款方开户行所在地级市</span>
                    </el-form-item>
                    <el-form-item label="对公对私业务">
                        <span class="requiredSpan">*</span>
                        <el-radio v-model="onLine.service_type" label="TO_COMPANY">对公业务</el-radio>
                        <el-radio v-model="onLine.service_type" label="TO_PRIVATE">对私业务</el-radio>
                    </el-form-item>
                    <el-form-item label="金额（元）">
                        <span class="requiredSpan">*</span>
                        <el-input v-model.trim="onLine.money" placeholder="请输入金额" class="width260"></el-input>
                        <span class="tips">注：金额填写币种为人民币</span>
                    </el-form-item>
                    <el-form-item label="确认金额（元）">
                        <span class="requiredSpan">*</span>
                        <el-input v-model.trim="onLine.confirmation_money" placeholder="请再次确认输入金额" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <span class="requiredSpan">&nbsp;&nbsp;</span>
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 3}"
                            resize="none"
                            placeholder="请输入备注信息(90字以内)"
                            v-model="onLine.remark"
                            :maxlength="90"
                            style="max-width: 500px"></el-input>
                    </el-form-item>
                    <el-form-item label="上传附件" >
                        <span class="requiredSpan">&nbsp;&nbsp;</span>
                        <el-upload
                            :action="this.$api.upload_file_url"
                            :on-preview="handlePreview"
                            :on-progress="handleProgressForOnline"
                            :data="{column:'joint_purchase',category:'publish_demand'}"
                            multiple
                            :on-success="handleFileChangeForOnline"
                            :file-list="fileListOfOnline"
                            :show-file-list="false" style="margin-top: -39px;margin-left: 12px;">
                                <el-button size="small" type="primary" class="upload-btn"><i class="el-icon-upload el-icon--right"></i>点击上传</el-button>
                                <div slot="tip" class="el-upload__tip"></div>
                        </el-upload>
                        
                        <div v-if="uploadProgressVisibleOfOnline" style="width: 50%">
                            <el-progress :percentage="uploadPercentageOfOnline"></el-progress>
                        </div>
                        
                        <attachmentList
                            :attachmentList="fileListOfOnline"
                            @delete-attachment="deleteAttachmentForOnline">
                        </attachmentList>
                    </el-form-item>
                    <el-form-item>
                        <span class="requiredSpan">&nbsp;&nbsp;</span>
                        <el-button type="primary" class="nomalBtn1" @click="onLineSubmit" >确定支付</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane> -->
            <!-- 线下 -->
            <el-tab-pane label="线下网银支付" name="offLineTab" v-if="!isEdit">
                <el-form ref="form" label-width="80px" v-model="offLine">
                    <el-form-item label="支付金额">
                        <span class="requiredSpan">*</span>
                        <el-input v-model.trim="group_pay_amount_format" placeholder="支付金额" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item label="上传附件" >
                        <span class="requiredSpan">*</span>
                        <el-upload
                            :action="this.$api.upload_file_url"
                            :on-preview="handlePreview"
                            :on-progress="handleProgress"
                            :data="{column:'joint_purchase',category:'publish_demand'}"
                            multiple
                            :on-success="handleFileChange"
                            :file-list="fileList"
                            :show-file-list="false" style="margin-top: -39px;margin-left: 12px;">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">您可以将招标文件或其他您认为需要让报价供应商知晓的内容以附件形式上传，上传支持jpg、jpeg、gif、png、docx、xls、xlsx、pdf格式。</div>
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
                    <el-form-item>
                        <span class="requiredSpan">&nbsp;&nbsp;</span>
                        <el-button type="primary" class="nomalBtn1" @click="offLineSubmit" >确定支付</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>

        <!-- 图片弹框预览 -->
        <el-dialog title="查看图片" :visible.sync="imgVisible" width="60%" >
            <div><img :src='imgurl' style="margin: 0 auto;display: inherit;width: 100%"/></div>
        </el-dialog>
        <!-- 户名弹窗 -->
        <el-dialog :title="accountWindow.title" :visible.sync="accountWindow.visible" width="40%" center :before-close="closeAccountWindow">
            <div class="accountCon">
                <el-form ref="form" :inline="true" v-model="accountWindow" style="text-align:center;">
                    <el-form-item>
                        <el-input v-model="accountWindow.keyWords" placeholder="请输入关键词进行查询" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="nomalBtn1" @click="searchAccount" >查询</el-button>
                    </el-form-item>
                </el-form>
                <el-radio-group v-model="accountWindow.accountSelected" v-for="(value, index) in accountWindow.accountList" :key="index">
                    <el-radio :label="JSON.stringify(value)" border>
                        <p class="title">户名：{{ value.account_name }}</p>
                        <p class="title">银行：{{ value.bank_name }}</p>
                        <p class="title">付款方账号：{{ value.account }}</p>
                    </el-radio>
                </el-radio-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <div class="pagination" v-if="accountWindow.total > 10">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="accountWindow.total"
                        :currentPage="accountWindow.currentPage"
                        @current-change="current_change">
                    </el-pagination>
                </div>
                <el-button @click="closeAccountWindow">取消</el-button>
                <el-button type="primary" @click="backFillAccount">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 创建收、付款方弹窗 -->
        <el-dialog
            :title="createAccountWindow.title"
            :visible.sync="createAccountWindow.visible"
            width="500px"
            center
            :before-close="closeCreateAccountWindow">
            <div class="accountCon">
                <el-form ref="form" label-width="120px" v-model="createAccountWindow">
                    <el-form-item label="企业编号" v-if="createAccountWindow.type == 'payer'">
                        <span class="requiredSpan">*</span>
                        <el-input v-model="createAccountWindow.enterprise_code" placeholder="请输入企业编号" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item label="账户名称">
                        <span class="requiredSpan">*</span>
                        <el-input v-model="createAccountWindow.account_name" placeholder="请输入账户名称" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item label="开户行">
                        <span class="requiredSpan">*</span>
                        <el-select v-model="createAccountWindow.deposit_bank" placeholder="请输入开户行名称" class="width260">
                            <el-option v-for="(item,index) in payer_bankName" :label="item.bank_name" :value="item.bank_name" :key='index'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="账号">
                        <span class="requiredSpan">*</span>
                        <el-input v-model="createAccountWindow.account" placeholder="请输入账号" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item label="城市名称">
                        <span class="requiredSpan">*</span>
                        <el-cascader
                            :options="location_list"
                            @active-item-change="handleLocationItemChange"
                            @change="handleLocationChange"
                            :props="location_props"
                            v-model="createAccountWindow.location"
                            class="width260"></el-cascader>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="closeCreateAccountWindow">取消</el-button>
                <el-button class="confirm-btn" type="primary" @click="createAccount(createAccountWindow.type)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import attachmentList from '../public/attachmentList'
export default {
    name: 'paymentMode',
    components: {
        attachmentList
    },
    data(){
        return {
            token: '',
            loading: false,
            isEdit: false,
            activeName: 'offLineTab',
            order_no: '',
            order_id: '',
            pay_info_id: '',
            project_code: '',
            product_name: '',
            project_name: '',
            location_list: [],
            location_props: {
                label: 'region_name',
                value: 'id'
            },
            //线上
            onLine:{
                payer_name: '',
                payer_bank_name: '',
                payer_account: '',
                payee_bank_name: '',
                payee_name: '',
                payee_account: '',
                money: '',
                confirmation_money: '',
                urgency_level: 'PAY_URGENTLY',
                service_type: '',
                location: [],
                remark: '',
                attachments: []
            },
            payer_bankName:[],
            payee_bankName:[],
            //线下
            offLine:{
                group_pay_amount: '',
                group_pay_amount_input: '',
                attachments: [] //附件
            },
            //线下上传附件
            fileList:[],
            uploadProgressVisible:false,
            uploadPercentage: 0,
            //线上上传附件
            fileListOfOnline: [],
            uploadProgressVisibleOfOnline: false,
            uploadPercentageOfOnline: 0,
            //图片预览
            imgVisible:false,
            imgurl:'',
            //户名弹窗
            accountWindow: {
                title: '',
                visible: false,
                keyWords: '',
                type: '',
                accountSelected: '',
                accountList: [],
                currentPage: 1,
                total: 0
            },
            //创建收、付款方弹窗
            createAccountWindow: {
                type: '',
                enterprise_code: '',
                title: '',
                visible: false,
                account_name: '',
                deposit_bank: '',
                account: '',
                location: []
            }
        }
    },
    computed: {
        group_pay_amount_format: {
            get: function(){
                return this.toDecimal(this.offLine.group_pay_amount) || ''
            },
            set: function(value){
                this.offLine.group_pay_amount_input = value;
            }
        },
        pageTitle(){
            return this.isEdit ? '编辑在线支付' : '选择支付方式'
        }
    },
    created(){
        this.token = this.$cookies.get('ZL_token');
        this.isEdit = this.$route.name == 'groupModeOfPaymentEdit_super';
        this.order_no = this.$route.params.order_no;
        this.order_id = this.$route.params.order_id;
        this.project_code = decodeURIComponent(this.$route.query.code);
        this.product_name = decodeURIComponent(this.$route.query.name);
        this.project_name = decodeURIComponent(this.$route.query.project_name);
        this.pay_info_id = this.$route.query.pay_info_id && decodeURIComponent(this.$route.query.pay_info_id);
        this.getBankNameList();
        if(this.isEdit){
            Promise.all([this.getRegionList(), this.getOnlinePayDetail(this.pay_info_id)]) //初始化省份和编辑在线支付时，获取支付详情
                .then(result => {
                    const regionList = result[0]; //省份列表
                    const detailData = result[1]; //在线支付详情data
                    this.location_list = regionList.map(item => {
                        return {
                            region_name: item.region_name,
                            id: item.id,
                            children: []
                        }
                    })
                    let detailObj = {
                        payer_name: detailData.payer_name,
                        payer_bank_name: detailData.payer_bank_name,
                        payer_account: detailData.payer_account,
                        payee_bank_name: detailData.payee_bank_name,
                        payee_name: detailData.payee_name,
                        payee_account: detailData.payee_account,
                        money: detailData.money,
                        urgency_level: detailData.is_urgent,
                        service_type: detailData.is_to_company,
                        location: [detailData.address_province_id, detailData.address_city_id],
                        remark: detailData.remark
                    };
                    detailObj.attachments = detailData.attachments.map(item => {
                        return {
                            original_name: item.original_name,
                            path: item.path
                        }
                    })
                    this.backFillDetail(detailObj);
                }).catch(error => {
                    console.log(error);
                    this.$alert(error, '提示', {
                        confirmButtonText: '知道了',
                        callback: action => {}
                    })
                })
        }else{
            this.getGroupPayAmount();
            //回填付款方的默认账户
            this.getAccountList({accountType: 'payer', status: 'Using'})
                .then(result => {
                    if(result.response.data.length > 0){
                        let account = result.response.data[0];
                        this.onLine.payer_name = account.account_name;
                        this.onLine.payer_bank_name = account.bank_name;
                        this.onLine.payer_account = account.account;
                    }
                });
            //初始化省份
            this.getRegionList().then(result => {
                this.location_list = result.map(item => {
                    return {
                        region_name: item.region_name,
                        id: item.id,
                        children: []
                    }
                })
            })
        }
    },
    methods:{
        //选择银行接口
        getBankNameList(){
			let that = this;
			let params = {
				token: that.token,
				type: 'group',
			};
			that.$api.bank_nameList(params).then(response => {
				if(response.data.msg_code === 100000){
                    that.payer_bankName = response.data.response;
                    that.payee_bankName = response.data.response;
				}else{
					that.$alert(result.message , '提示', {
						confirmButtonText: '确定',
						callback: action => {
						}
					});
				}
			}).catch(error => {
				console.log(error)
			})
		},
        //获取线下集团支付总额
        getGroupPayAmount(){
            let that = this;
            let params = {
                token: that.token,
                order_no: that.order_no
            };
            that.$api.orderReportCount(params)
                .then(response => {
                    let result = response.data;
                    if(result.msg_code == 100000){
                        that.offLine.group_pay_amount = result.response.count;
                        that.offLine.group_pay_amount_input = result.response.count;
                        that.onLine.money = that.toDecimal(result.response.count);
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
         * 获取省市县的列表
         * @param  {Number} parentId 父级ID
         * @return {Array}          当前父级ID下的子列表
         */
        getRegionList(parentId){
            let that = this;
            let params = {token: that.token};
            if(parentId){
                params.parent_id = parentId;
            }
            return that.$api.regionList(params)
                .then(response => {
                    let result = response.data;
                    if(result.msg_code == 100000){
                        return result.response
                    }else{
                        console.log(result);
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
        //tab点击
        handleTapClick(tab,event){

        },
        /**
         * 判断location是否有子列表
         * @param  {Number}  index 索引值
         * @return {Boolean}
         */
        hasChildren(index){
            if(this.location_list[index]['children'] && this.location_list[index]['children'].length > 0){
                return true
            }
            return false
        },
        //处理父级选项变化
        handleLocationItemChange(val){ //val各父级选项组成的数组
            const level = val.length;
            let parentId = val[level - 1];
            if(level >= 2){ //显示省、市
                return false
            }
            const index = this.location_list.findIndex(item => item.id == parentId);
            if(this.hasChildren(index)){ //防止重复请求
                return false
            }
            this.getRegionList(parentId)
                .then(result => {
                    if(index != -1){
                        this.location_list[index]['children'] = result.map(item => {
                            let element = {
                                id: item.id,
                                region_name: item.region_name
                            };
                            return element
                        });
                    }else{
                        console.log(`找不到该parentId： ${parentId}`)
                    }
                })
        },
        //处理地址变化
        handleLocationChange(val){ //val是当前值

        },
        //online--上传文件的方法
        handleFileChangeForOnline(response, file, fileList){
            this.onLine.attachments.push({
                path: response.response.newFileName,
                original_name: response.response.originalFileName
            });
            //附件列表展示
            this.fileListOfOnline = fileList.map(item => {
                item.id = item.uid;
                if(item.raw.type.indexOf('image') == -1){
                    item.isImg = false;
                }else{
                    item.isImg = true;
                }
                return item
            });
        },
        //online--自定义附件列表-删除附件
        deleteAttachmentForOnline(index){
            this.fileListOfOnline.splice(index,1);
            //更新提交时的附件列表
            this.onLine.attachments = this.fileListOfOnline.map((item)=>{
                let attachment = new Object();
                attachment.path = item.response.response.newFileName;
                attachment.original_name = item.response.response.originalFileName;
                return attachment
            })
        },
        //online--上传进度
        handleProgressForOnline(event, file, fileList){
            this.uploadProgressVisibleOfOnline = true;
            this.uploadPercentageOfOnline = event.percent;
            if(event.percent == 100){
                this.uploadProgressVisibleOfOnline = false;
                this.uploadPercentageOfOnline = 0;
            }
        },
        //offline--上传文件的方法
        handleFileChange(response, file, fileList){
            this.offLine.attachments.push({
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
        //offline--自定义附件列表-删除附件
        deleteAttachment(index){
            this.fileList.splice(index,1);
            //更新提交时的附件列表
            this.offLine.attachments = this.fileList.map((item)=>{
                let attachment = new Object();
                attachment.path = item.response.response.newFileName;
                attachment.original_name = item.response.response.originalFileName;
                return attachment
            })
        },
        //offline--上传进度
        handleProgress(event, file, fileList){
            this.uploadProgressVisible = true;
            this.uploadPercentage = event.percent;
            if(event.percent == 100){
                this.uploadProgressVisible = false;
                this.uploadPercentage = 0;
            }
        },
        //图片预览
        handlePreview(file){
            let that=this;
            if(file.raw.type.indexOf("image") > -1){
                that.imgVisible = true;
                that.imgurl = file.url;
            }
        },
        //判断是否为浮点数
        isFloatingNumber(num){
            let reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
            return reg.test(num)
        },
        //线上支付提交
        onLineSubmit(){
            let that = this;
            const api_OnlineSubmit = that.isEdit ? that.$api.groupPayToZhuniuEdit: that.$api.groupPayToZhuniu;
            let params = {
                token: that.token,
                type: 'GroupToZhuNiu',
                slave_order_code: that.order_no,
                slave_order_id: that.order_id,
                project_code: that.project_code,
                product_name: that.product_name,
                project_name: that.project_name,
                payer_bank_name: that.onLine.payer_bank_name,
                payer_name: that.onLine.payer_name,
                payer_account: that.onLine.payer_account,
                payee_bank_name: that.onLine.payee_bank_name,
                payee_name: that.onLine.payee_name,
                payee_account: that.onLine.payee_account,
                money: that.onLine.money,
                confirmation_money: that.onLine.confirmation_money,
                is_urgent: that.onLine.urgency_level,
                is_to_company: that.onLine.service_type,
                address_province_id: that.onLine.location[0],
                address_city_id: that.onLine.location[1]
            }
            if(Object.keys(params).some(key => !params[key])){ //参数非空校验
                that.$message({
                    message: '请完善信息',
                    type: 'warning'
                })
                return false
            }
            if(that.onLine.remark){
                params.remark = that.onLine.remark;
            }
            if(that.onLine.attachments.length > 0){
                params.attachments = that.onLine.attachments;
            }
            if(!that.isFloatingNumber(that.onLine.money) || !that.isFloatingNumber(that.onLine.confirmation_money)){
                that.$message({
                    message: '请输入合法金额！',
                    type: 'warning'
                });
                return false
            }
            if(parseFloat(that.onLine.money) != parseFloat(that.onLine.confirmation_money)){
                that.$message({
                    message: '两次金额不一致，请确认后再提交！',
                    type: 'warning'
                });
                return false
            }
            api_OnlineSubmit(params, that.pay_info_id).then(response => {
                let result = response.data;
                if(result.msg_code == 100000){
                    that.$router.replace({name: 'groupPayResultUnderReview_super'})
                }else{
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
                    callback: action => {
                        //todo
                    }
                })
            })
        },
        //线下支付提交
        offLineSubmit(){
            let that = this;
            let params = {
                token: that.token,
                attachments: that.offLine.attachments,
                group_pay_amount: that.offLine.group_pay_amount_input,
                payment_method: 'GROUP_PAY_OFF_LINE'
            };
            if(!that.isFloatingNumber(that.offLine.group_pay_amount_input)){
                that.$message({
                    message: '请输入合法数字',
                    type: 'warning'
                })
                return false
            }
            if(that.offLine.attachments.length == 0){
                that.$message({
                    type: 'warning',
                    message: '请上传附件'
                });
                return false
            }
            that.$api.slaveOrderPay(params, that.order_id)
                .then(response => {
                    let result = response.data;
                    if(result.msg_code == 100000){
                        that.$message({
                            message: '支付成功',
                            type: 'success'
                        })
                        that.$router.replace({name: 'grouporderL_super'})
                    }else{
                        that.$alert(result.message , '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    }
                }).catch(error => {
                        that.$alert(error , '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                })
        },
        /**
         * 打开账户弹窗
         * @param  {String} accountType 账户类型，值为payer(付款方)/payee(收款方)
         */
        openAccountWindow(accountType){
            if(accountType == 'payer'){
                this.accountWindow.title = '付款方';
            }else if(accountType == 'payee'){
                this.accountWindow.title = '收款方';
            }else{
                console.warn('请传递正确参数');
                return false
            }
            this.accountWindow.type = accountType;
            this.getAccountList({accountType});
            this.accountWindow.visible = true;
        },
        //关闭账户弹窗
        closeAccountWindow(){
            //重置数据
            this.accountWindow.visible = false;
            this.accountWindow.title = '';
            this.accountWindow.accountList.length = 0;
            this.accountWindow.keyWords = '';
            this.accountWindow.accountSelected = '';
            this.accountWindow.type = '';
            this.accountWindow.total = 0;
            this.accountWindow.currentPage = 1;
        },
        /**
         * 获取账户列表
         * @param  {String} options.accountType  账户类型，值为payer(付款方)/payee(收款方)
         * @param  {String} options.status       账户当前状态，值为UnUsed/Using
         * @param  {String} options.account_name 账户名称
         * @return {Object} Promise对象
         */
        getAccountList({accountType, status, account_name}){
            let that = this;
            let params = {
                token: that.token,
                current_page: that.accountWindow.currentPage,
                per_page: 10
            }
            if(accountType == 'payer'){
                params.account_type = 'ACCOUNT_PAY';
            }else if(accountType == 'payee'){
                params.account_type = 'ACCOUNT_RECEIVE'
            }else{
                console.warn('参数错误');
                return false
            }
            if(status){
                params.status = status;
            }
            if(account_name){
                params.account_name = account_name;
            }
            return that.$api.bank_accountList(params).then(response => {
                let result = response.data;
                if(result.msg_code === 100000){
                    that.accountWindow.total = result.response.total;
                    that.accountWindow.accountList = result.response.data;
                }else{
                    that.$alert(result.message, '提示', {
                        confirmButtonText: '知道了',
                        callback: action => {
                            result.message
                        }
                    })
                }
                return result
            }).catch(error => {
                that.$alert(error,'提示',{
                    confirmButtonText: '知道了',
                    callback: action => {
                        //todo
                    }
                })
            })
        },
        //列表分页
        current_change(currentPage){
            this.accountWindow.currentPage = currentPage;
            this.getAccountList({accountType: this.accountWindow.type});
        },
        //搜索支付账户
        searchAccount(){
            this.accountWindow.total = 0; //搜索时重置总数
            this.accountWindow.currentPage = 1; //搜索时重置当前页
            this.getAccountList({
                accountType: this.accountWindow.type,
                account_name: this.accountWindow.keyWords
            });
        },
        //回填账户数据
        backFillAccount(){
            if(!this.accountWindow.accountSelected){
                this.$message({
                    message: '请选择账户！',
                    type: 'warning'
                })
                return false
            }
            let account = JSON.parse(this.accountWindow.accountSelected);
            if(this.accountWindow.type == 'payer'){
                this.onLine.payer_name = account.account_name;
                this.onLine.payer_bank_name = account.bank_name;
                this.onLine.payer_account = account.account;
            }else{
                let province_id = account.address_province_id;
                let city_id = account.address_city_id;
                let province_index = this.location_list.findIndex(item => item.id == province_id);
                this.onLine.payee_name = account.account_name;
                this.onLine.payee_bank_name = account.bank_name;
                this.onLine.payee_account = account.account;
                this.onLine.location = [province_id, city_id];
                this.getRegionList(province_id) //获取所在省的城市列表
                    .then(result => {
                        this.location_list[province_index]['children'] = result;
                    })
            }
            this.closeAccountWindow();
        },
        /**
         * 打开添加账户弹窗
         * @param  {String} type type的值是：'peyer'(付款方)和'payee(收款方)'
         */
        openCreateAccountWindow(type){
            let title = {
                payer: '添加付款方账户',
                payee: '添加收款方账户'
            }
            this.createAccountWindow.type = type;
            this.createAccountWindow.title = title[type] || '添加账户';
            this.createAccountWindow.visible = true;
        },
        //关闭添加账户弹窗
        closeCreateAccountWindow(){
            this.createAccountWindow.visible = false;
            //重置数据
            this.createAccountWindow.type = '';
            this.createAccountWindow.title = '';
            this.createAccountWindow.enterprise_code = '';
            this.createAccountWindow.account_name = '';
            this.createAccountWindow.deposit_bank = '';
            this.createAccountWindow.account = '';
            this.createAccountWindow.location = [];
        },
        /**
         * 创建收、付款方账户
         * @param  {String} type type的值是：'peyer'(付款方)和'payee(收款方)'
         */
        createAccount(type){
            let that = this;
            let params = {
                token: that.token,
                type: 'group',
                bank_name: that.createAccountWindow.deposit_bank,
                account: that.createAccountWindow.account,
                account_name: that.createAccountWindow.account_name,
                address_province_id: that.createAccountWindow.location[0],
                address_city_id: that.createAccountWindow.location[1]
            };
            if(type == 'payer'){
                params.compony_code = that.createAccountWindow.enterprise_code;
                params.account_type = 'ACCOUNT_PAY';
            }else if(type == 'payee'){
                params.account_type = 'ACCOUNT_RECEIVE';
            }
            if(Object.keys(params).some(key => !params[key])){ //参数非空校验
                that.$message({
                    message: '请完善信息',
                    type: 'warning'
                })
                return false
            }
            that.$api.bank_accountAdd(params)
                .then(response => {
                    let result = response.data;
                    if(result.msg_code == 100000){
                        that.$message({
                            message: '付款账户添加成功！',
                            type: 'success'
                        })
                    }else{
                        console.log(result);
                        that.$alert(result.message, '提示', {
                            confirmButtonText: '知道了',
                            callback: action => {
                                result.message
                            }
                        })
                    }
                    that.closeCreateAccountWindow();
                }).catch(error => {
                    console.log(error);
                    that.$alert(error,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {
                            //todo
                        }
                    })
                })
        },
        /**
         * 获取在线支付详情页信息
         * @param  {Number} id 批次订单id
         */
        getOnlinePayDetail(id){
            let that = this;
            let params = {
                token: that.token
            };
            that.loading = true;
            return that.$api.groupPayToZhuniuDetail(params, id)
                .then(response => {
                    let result = response.data;
                    let detailData = result.response;
                    that.loading = false;
                    if(result.msg_code === 100000){
                        return detailData
                    }else{
                        that.$alert(result.message, '提示', {
                            confirmButtonText: '知道了',
                            callback: action => {
                                result.message
                            }
                        })
                    }
                }).catch(error => {
                    that.loading = false;
                    console.log(error);
                    that.$alert(error,'提示',{
                        confirmButtonText: '知道了',
                        callback: action => {
                            //todo
                        }
                    })
                })
        },
        /**
         * 编辑在线支付时，回填页面数据
         * @param  {Object} detailObj 详情页数据
         */
        backFillDetail(detailObj){
            const imgReg = /\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/i;
            this.onLine.payer_name = detailObj.payer_name;
            this.onLine.payer_bank_name = detailObj.payer_bank_name;
            this.onLine.payer_account = detailObj.payer_account;
            this.onLine.payee_bank_name = detailObj.payee_bank_name;
            this.onLine.payee_name = detailObj.payee_name;
            this.onLine.payee_account = detailObj.payee_account;
            this.onLine.money = detailObj.money;
            this.onLine.urgency_level = detailObj.urgency_level;
            this.onLine.service_type = detailObj.service_type;
            this.onLine.location = detailObj.location;
            this.onLine.remark = detailObj.remark;
            this.onLine.attachments = detailObj.attachments;
            this.fileListOfOnline = detailObj.attachments.map(item => { //模拟上传数据
                return {
                    name: item.original_name,
                    url: item.path,
                    isImg: imgReg.test(item.original_name),
                    response: {
                        response: {
                            newFileName: item.path,
                            originalFileName: item.original_name
                        }
                    },
                    raw: {
                        type: imgReg.test(item.original_name) ? 'image/jpeg' : ''
                    }
                }
            });
            const province_id = detailObj.location[0]
            let province_index = this.location_list.findIndex(item => item.id == province_id);
            this.getRegionList(province_id) //获取所在省的城市列表
                .then(result => {
                    this.location_list[province_index]['children'] = result;
                })
        }
    }
}
</script>

<style>
.accountCon .el-radio__input{
    float: left;
    margin-top: 45px;
}
.accountCon .el-radio__label{
    width: 50%;
    display: inline-block;
    padding-left: 10px;
    line-height: 16px;
    font-size: 14px;
}
.payment-mode-wrapper .el-tabs__item{
    color: #999;
}
.payment-mode-wrapper .el-tabs__item.is-active,
.payment-mode-wrapper .el-tabs__item:hover{
    color: #0576DB;
}
.payment-mode-wrapper .el-tabs__active-bar{
    background-color: #0576DB;
}
.payment-mode-wrapper .el-tabs__header{
    margin-bottom: 20px;
}
.payment-mode-wrapper .el-dialog{
    border-radius: 8px;
    overflow: hidden;
}
.payment-mode-wrapper .el-dialog__header{
    background: #fff;
}
.payment-mode-wrapper .el-dialog__title{
    color: #333;
    font-size: 22px;
    font-weight: 600;
}
.payment-mode-wrapper .el-dialog__body{
    max-height: 500px;
    overflow-y: auto;
}
</style>

<style scoped lang="less">
    @color: #0576DB;
    .payment-mode-wrapper{
        .add-icon{
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 28px;
            vertical-align: middle;
            border: 1px solid #D7D7D7;
            border-radius: 4px;
            margin-left: 10px;
            text-align: center;
            font-size: 26px;
            font-weight: 600;
            color: #0576DB;
            cursor: pointer;
        }
        .tips{
            font-size: 12px;
            color: #999;
            margin-left: 10px;
        }
        .upload-btn{
            background-color: @color;
        }
        .confirm-btn{
            background-color: @color;
        }
        .cancel-btn{
            color: @color;
            border: 1px solid @color;
        }
    }
    .payment-title{
        color: #0576DB;
        margin-top: 0;
    }
    .width260{
        width: 260px;
    }
    .el-upload__tip{
        width:402px;
        line-height: 21px;
        font-size:8px;
        font-weight:400;
        color:rgba(153,153,153,1);
    }
    .icon-wode{
        color:#0576DB;
    }
    .el-radio-group{
        margin: 20px 20px;
        display: block;
    }
    .el-radio.is-bordered{
        height: auto;
        width: 100%;
        border: none;
        border-bottom: 1px solid #dcdfe6;
        border-radius: 0;
    }
    .el-radio span:first-child{
        float: right;
        margin-top: 2.5%;
    }
    .payment-mode-wrapper .pagination{
        padding-bottom: 20px;
    }
</style>
