<template>
    <div class="payment-mode-wrapper">
        <h3 class="payment-title">选择支付方式</h3>
        <el-tabs v-model="activeName" @tab-click="handleTapClick">
            <el-tab-pane label="在线网银支付" name="onLineTab">
                <el-form ref="form" label-width="120px" v-model="onLine">
                    <el-form-item label="付款方户名" style="float:left" class="clearfix">
                        <span class="requiredSpan">&nbsp;&nbsp;</span>
                        <el-input v-model="onLine.payer_name" placeholder="请输入付款方户名" class="width260" >
                            <i slot="suffix" class="el-input__icon iconfont icon-wode" @click="openAccountWindow('payer')"  style="cursor:pointer"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="付款方账号" style="margin-bottom: 0;margin-left:400px;">
                        <span class="requiredSpan">&nbsp;&nbsp;</span>
                        <el-input v-model="onLine.payer_account" placeholder="请输入付款方账号" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item label="选择银行" style="margin-bottom:50px;">
                        <span class="requiredSpan">*</span>
                        <el-select v-model="onLine.payer_bank_name" placeholder="请选择银行" class="width260">
                            <el-option v-for="(item,index) in payer_bankName" :label="item.bank_name" :value="item.bank_name" :key='index'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收款方户名" style="float:left" class="clearfix">
                        <span class="requiredSpan">*</span>
                        <el-input v-model="onLine.payee_name" placeholder="请输入收款方户名" class="width260">
                            <i slot="suffix" class="el-input__icon iconfont icon-wode" @click="openAccountWindow('payee')"  style="cursor:pointer"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="收款方账号" style="margin-bottom: 0;margin-left:400px;">
                        <span class="requiredSpan">*</span>
                        <el-input v-model="onLine.payee_account" placeholder="请输入收款方账号" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item label="选择银行" style="margin-bottom:50px;">
                        <span class="requiredSpan">*</span>
                        <el-select v-model="onLine.payee_bank_name" placeholder="请选择银行" class="width260">
                            <el-option v-for="(item,index) in payee_bankName" :label="item.bank_name" :value="item.bank_name" :key='index'></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="金额（元）">
                        <span class="requiredSpan">*</span>
                        <el-input v-model.trim="onLine.money" placeholder="请输入金额" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item label="确认金额（元）">
                        <span class="requiredSpan">*</span>
                        <el-input v-model.trim="onLine.confirmation_money" placeholder="请再次确认输入金额" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span class="requiredSpan">&nbsp;&nbsp;</span>
                        <el-button type="primary" class="nomalBtn1" @click="onLineSubmit" >确定支付</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="线下网银支付" name="offLineTab">
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
                <el-form ref="form" :inline="true" :model="accountWindow" style="text-align:center;">
                    <el-form-item>
                        <el-input v-model="accountWindow.keyWords" placeholder="请输入关键词进行查询" class="width260"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="nomalBtn1" @click="searchAccount" >查询</el-button>
                    </el-form-item>
                </el-form>
                <el-radio-group v-model="accountWindow.accountSelected" v-for="(value, index) in accountWindow.accountList" :key="index">
                    <el-radio :label="value" border>
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
            activeName: 'onLineTab',
            order_no: '',
            order_id: '',
            project_code: '',
            product_name: '',
            //线上
            onLine:{
                payer_name: '',
                payer_bank_name: '',
                payer_account: '',
                payee_bank_name: '',
                payee_name: '',
                payee_account: '',
                money: '',
                confirmation_money: ''
            },
            payer_bankName:[],
            payee_bankName:[],
            //线下
            offLine:{
                group_pay_amount: '',
                group_pay_amount_input: '',
                attachments: [] //附件
            },
            //上传附件
            fileList:[],
            uploadProgressVisible:false,
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
        }
    },
    created(){
        this.token = this.$cookies.get('ZL_token');
        this.order_no = this.$route.params.order_no;
        this.order_id = this.$route.params.order_id;
        this.project_code = decodeURIComponent(this.$route.query.code);
        this.product_name = decodeURIComponent(this.$route.query.name);
        this.getGroupPayAmount();
        this.getBankNameList();
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
    },
    methods:{
        //选择银行接口
        getBankNameList(){
			let that = this;
			let params = {
				token: that.token,
				type: 'group',
			};
			that.$api.bank_nameList_normal(params).then(response => {
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
            that.$api.orderReportCount_normal(params)
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
        //tab点击
        handleTapClick(tab,event){
            
        },
        //上传文件的方法
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
        //自定义附件列表-删除附件
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
        //上传进度
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
            let params = {
                token: that.token,
                type: 'GroupToZhuNiu',
                slave_order_code: that.order_no,
                slave_order_id: that.order_id,
                project_code: that.project_code,
                product_name: that.product_name,
                payer_bank_name: that.onLine.payer_bank_name,
                payer_name: that.onLine.payer_name,
                payer_account: that.onLine.payer_account,
                payee_bank_name: that.onLine.payee_bank_name,
                payee_name: that.onLine.payee_name,
                payee_account: that.onLine.payee_account,
                money: that.onLine.money,
                confirmation_money: that.onLine.confirmation_money
            }
            if(Object.keys(params).some(key => !params[key])){ //参数非空校验
                that.$message({
                    message: '请完善信息',
                    type: 'warning'
                })
                return false
            }
            if(that.onLine.money != that.onLine.confirmation_money){
                that.$message({
                    message: '两次金额不一致，请确认后再提交！',
                    type: 'warning'
                });
                return false
            }
            that.$api.groupPayToZhuniu_normal(params).then(response => {
                let result = response.data;
                if(result.msg_code == 100000){
                    that.$router.replace({name: 'groupPayResultUnderReview'})
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
            that.$api.slaveOrderPay_normal(params, that.order_id)
                .then(response => {
                    let result = response.data;
                    if(result.msg_code == 100000){
                        that.$message({
                            message: '支付成功',
                            type: 'success'
                        })
                        that.$router.replace({name: 'grouporderL'})
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
                current_page: that.accountWindow.current_page,
                per_page: 10
            }
            if(accountType == 'payer'){
                params.type = 'group';
            }else if(accountType == 'payee'){
                params.type = 'zhuniu'
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
            return that.$api.bank_accountList_normal(params).then(response => {
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
            this.getAccountList({accountType: this.accountWindow.type, account_name: this.accountWindow.keyWords});
        },
        //回填账户数据
        backFillAccount(){
            let account = this.accountWindow.accountSelected;
            if(!account){
                this.$message({
                    message: '请选择账户！',
                    type: 'warning'
                })
                return false
            }
            if(this.accountWindow.type == 'payer'){
                this.onLine.payer_name = account.account_name;
                this.onLine.payer_bank_name = account.bank_name;
                this.onLine.payer_account = account.account;
            }else{
                this.onLine.payee_name = account.account_name;
                this.onLine.payee_bank_name = account.bank_name;
                this.onLine.payee_account = account.account;
            }
            this.closeAccountWindow();
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
.payment-mode-wrapper .el-dialog__header{
    background: #fff;
}
.payment-mode-wrapper .el-dialog__title{
    color: #333;
}
.payment-mode-wrapper .el-dialog__body{
    max-height: 500px;
    overflow-y: scroll;
}
</style>

<style scoped lang="less">
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
