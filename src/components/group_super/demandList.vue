<template>
    <div>
        <h3>联采需求列表</h3>
<!--         <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="全部" class="width90">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="待成本部审核" value="PENDING"></el-option>
                    <el-option label="待联采部审核" value="DEPARTMENT_PENDING"></el-option>
                    <el-option label="已驳回" value="REJECT"></el-option>
                    <el-option label="已完成" value="APPROVE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="nomalBtn1" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form> -->
        <el-table :data="demandLists" style="width: 100%" border>
            <el-table-column prop="project_name" label="项目名"></el-table-column>
            <el-table-column prop="project_number" label="项目编码"></el-table-column>
            <el-table-column prop="category_name" label="产品"></el-table-column>
            <el-table-column prop="category_spec" label="规格"></el-table-column>
            <el-table-column prop="purchase_num" label="拟采数量" v-if="quantityBtn"></el-table-column>
            <el-table-column prop="purchase_num" label="核准数量" v-if="authorizedBtn"></el-table-column>
            <el-table-column prop="goods_amount" label="已核货量" width="200" v-if="approvedVolumeBtn">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.goods_amount" placeholder="已核货量" :disabled="scope.row.disable" @blur="goodNum(scope.row)"></el-input><i class="iconfont icon-qianbipencil82 exitfont" @click="editamount(scope.row)" v-if="editVolumeBtn"></i>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <!-- <el-tag v-if="scope.row.status == 'PENDING'" type="warning">待审核</el-tag> -->
                    <div v-if="scope.row.status == 'CUSTOM_EXAMINE_WAIT'" type="warning">{{ scope.row.custom_status }}</div>
                    <div v-if="scope.row.status == 'APPROVE'" type="success">已完成</div>
                    <div v-if="scope.row.status == 'REJECT'" type="danger">已驳回</div>
               </template>
            </el-table-column>
            <el-table-column prop="created_at" label="发布时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="260">
                <template slot-scope="scope">
                    <template>
                        <div class="nomalBtn1 tabelBtn" v-if="agreeBtn && scope.row.currentBtn" @click="accountingApprove(scope.row.id, scope.row.currentBtn.id)">同意</div>
                        <div class="nomalBtn1 tabelBtn tabelBtn1" v-if="disagreeBtn && scope.row.currentBtn" @click="accountingReject(scope.row.id, scope.row.currentBtn.id)">驳回</div>
                    </template>
                    <div v-show="lookDetial" class="nomalBtn1 tabelBtn"  @click="showDetail(scope.row.id)">查看详情</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageCont" v-if='total>10'>
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :currentPage="currentPage"
                @current-change="current_change">
            </el-pagination>
        </div>

        <!-- 拒绝原因 start -->
        <el-dialog title="驳回" :visible.sync="rejectDialogVisible" width="50%" center>
            <el-form :model="rejectForm">
                <el-form-item>
                    <el-input placeholder="请输入驳回原因" type="textarea" v-model="rejectForm.reject_reason" :rows="8"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rejectDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="rejectConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 拒绝原因 end -->

        <!-- 同意 start -->
        <el-dialog title="同意" :visible.sync="approveDialogVisible" width="50%" center>
            <el-form :model="approveForm" label-width="150px" class="textareaLabel">
                <el-form-item label="报价截止时间">
                    <el-date-picker v-model="approveForm.deadline" type="datetime" value-format= 'yyyy-MM-dd HH:mm:ss' placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="联采说明" style="width:525px">
                    <el-input type="textarea" v-model="approveForm.remark" resize="none"></el-input>
                </el-form-item>
                <el-form-item label="上传附件" >
                    <el-upload
                            :action="this.$api.upload_file_url"
                            :on-remove="handleFileRemove"
                            :before-remove="beforeFileRemove"
                            :data="{column:'joint_purchase',category:'publish_demand'}"
                            multiple
                            :on-success="handleFileChange"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">您可以将招标文件或者其他您认为需要让供应商知晓的内容以附件形式上传</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="approveDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="approveConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 同意 end -->
        <!-- 核算部同意 start -->
        <el-dialog title="同意" :visible.sync="accountingApproveDialog" width="50%" center>
            <el-form :model="accountingApproveForm" label-width="150px" class="textareaLabel">
                <el-form-item label="报价截止时间">
                    <el-date-picker
                        v-model="accountingApproveForm.deadline"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        :picker-options="dateOptions"></el-date-picker>
                </el-form-item>
                <el-form-item label="联采说明" style="width:525px">
                    <el-input type="textarea" v-model="accountingApproveForm.remark" resize="none"></el-input>
                </el-form-item>
                <el-form-item label="上传附件" >
                    <el-upload
                            :action="this.$api.upload_file_url"
                            :on-remove="accountingHandleFileRemove"
                            :before-remove="accountingBeforeFileRemove"
                            :data="{column:'joint_accounting_purchase',category:'publish_accounting_demand'}"
                            multiple
                            :on-success="accountingHandleFileChange"
                            :file-list="accountingFileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">您可以将招标文件或者其他您认为需要让供应商知晓的内容以附件形式上传</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="accountingApproveDialog = false">取 消</el-button>
                <el-button type="primary" @click="accountingApproveConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 核算部同意 end -->
        <!-- 核算部拒绝原因 start -->
        <el-dialog title="驳回" :visible.sync="accountingRejectDialog" width="50%" center>
            <el-form :model="accountingRejectForm">
                <el-form-item>
                    <el-input
                        placeholder="请输入驳回原因(50个字符以内)"
                        type="textarea"
                        v-model="accountingRejectForm.reject_reason"
                        :rows="8"
                        :maxlength="50"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="accountingRejectDialog = false">取 消</el-button>
                <el-button type="primary" @click="accountingRejectConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 核算部拒绝原因 end -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                token: '',
                formInline: {
                    status: '',
                },
                demandLists: [],
                copyParams:{token:''},
                total:0,
                currentPage:0,
                detailDialogVisible: false,
                demand: {supplier_name: ''},
                rejectDialogVisible: false,
                rejectForm: {reject_reason:'', id:''},
                approveDialogVisible: false,
                fileList: [],
                approveForm: {id: '', deadline:'', remark:'', attachments:[]},
                accountingApproveDialog: false,
                accountingApproveForm: {
                    id: '',
                    deadline:'',
                    remark:'',
                    attachments:[],
                    record_id: ''
                },
                accountingRejectDialog: false,
                accountingRejectForm: {
                    reject_reason: '',
                    id: '',
                    record_id: ''
                },
                accountingFileList: [],
                orderNum:"",
                tableData1:[],
                tableData2:[],
                dealLine:"",
                remark:"",
                url_prefix: '/api/frontend/joint_purchase/super',
                dateOptions: {
                    disabledDate(time) {
                      return time.getTime() <= Date.now();
                    }
                },
                //按钮权限显示
                lookDetial: false,
                agreeBtn: false,
                disagreeBtn: false,
                approvedVolumeBtn: false,
                editVolumeBtn:false,
                quantityBtn:false,
                authorizedBtn:false
            };
        },
        methods: {
            //已核货量的接口
            editamount(row){
                row.disable = !row.disable;
            },
            goodNum(row){
                let that=this;
                let reg = /^[0-9]*$/;
                console.log(row.goods_amount)
                if(!reg.test(row.goods_amount)){
                    that.$alert('已核货量请输入数字');
                    return false;
                }
                let params = {token: that.token};
                params.id=row.id;
                params.verify_goods_amount=row.goods_amount;
                that.ZN_POST(that.url_prefix +'/group/demand/purchases/amount', params,function(data){
                    row.disable=true;
                    that.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                })
            },
            onSubmit() {
                let that = this;
                let params = {
                    current_page:1,
                    per_page:10,
                    token:that.copyParams.token
                };
                if(that.formInline.project_name){
                    params.project_name = that.formInline.project_name
                }
                if(that.formInline.status != 'all'){
                    params.status = that.formInline.status
                }
                if(that.formInline.category_id && that.formInline.category_id != undefined ){
                    params.category_id = that.formInline.category_id
                }
                that.copyParams = params;

                that.getDemandLists(1);
            },
            getDemandLists: function(page){
                let that = this;
                let params = that.copyParams;
                that.currentPage = page;
                params.current_page = page;
                params.per_page = 8;
                params.status = this.formInline.status;
                let url = that.url_prefix + '/group/demand/lists';
                that.$http.get(url, {params}).then(function (response) {
                    if(response.data.msg_code === 100000) {
                        that.total = response.data.response.total;
                        that.demandLists = response.data.response.data.map((item) => {
                            let element = {
                                id: item.id,
                                branch_name: item.member.member_auth.auth_name,
                                project_name: item.project_name,
                                category_name: item.category.name,
                                purchase_num: item.purchase_num,
                                created_at: item.created_at,
                                status: item.status,
                                project_number: item.project_code,
                                goods_amount: item.verify_goods_amount,
                                disable: true,
                                records: item.records,
                                currentBtn: null
                            };

                            let specifications = JSON.parse(item.category_spec);
                            element.category_spec = specifications.category_spec_min +'-'+specifications.category_spec_max;

                            //流程审核中的按钮及状态显示
                            if(item.status == 'CUSTOM_EXAMINE_WAIT'){
                                element.custom_status = that.showAuditStatus(item.records);
                                if(that.showFlowsAuditBtn(item.records).length > 0){
                                    element.currentBtn = that.showFlowsAuditBtn(item.records)[0];
                                }
                            }
                            return element;
                        });
                    } else {
                        that.$alert(response.data.message , '警告', {confirmButtonText: '确定', callback: action => {}});
                    }
                }).catch(function (error) {
                    console.log(error);
                    that.$alert(error , '警告', {confirmButtonText: '确定', callback: action => {}});
                });
            },
            current_change(currentPage){
                this.currentPage = currentPage;
                this.getDemandLists(currentPage);
            },
            showDetail(id){
                this.$router.push({path: '/group_super/demanddetail_super/' + id});
            },
            rejectApply: function (id) {
                let that = this;
                that.rejectDialogVisible = true;
                that.rejectForm.id = id;
            },
            rejectConfirm: function () {
                let that = this;
                if (that.rejectForm.reject_reason == ''){
                    that.$alert('请填写驳回原因' , '警告', {confirmButtonText: '确定', callback: action => {that.canClick = !that.canClick;}});
                    return false;
                }
                that.$http.post(that.url_prefix + '/super/group/demand/auth/' + that.rejectForm.id, {
                    'token': that.token,
                    'status': 'REJECT',
                    'reject_reason': that.rejectForm.reject_reason
                }).then(function (response) {
                    if (response.data.msg_code === 100000) {
                        that.rejectForm.id = '';
                        that.rejectForm.reject_reason = '';
                        that.rejectDialogVisible = false;
                        window.location.reload();
                    } else {
                        that.$alert(response.data.message , '警告', {confirmButtonText: '确定', callback: action => {that.canClick = !that.canClick;}});
                    }
                }).catch(function (error) {
                    that.$alert(error , '警告', {confirmButtonText: '确定', callback: action => {that.canClick = !that.canClick;}});
                });
            },
            //自定义审核
            accountingApprove(id, record_id){ //弹框
                let that = this;
                let url = that.url_prefix + '/group/demand/detail/' + id;
                that.accountingApproveForm.id = id;
                that.accountingApproveForm.record_id = record_id;
                let params = {
                    token: that.token
                };
                that.ZN_GET(url,params,function(data){
                    that.accountingApproveForm.deadline = data.response.deadline;
                    that.accountingApproveDialog = true;
                })
            },
            accountingApproveConfirm(){ //确认
                let that = this;
                let url = that.url_prefix + '/group/demand/custom_examine/' + that.accountingApproveForm.id + '/' + that.accountingApproveForm.record_id;
                let params = {
                    token: that.token,
                    status: 'APPROVE',
                    remark: that.accountingApproveForm.remark,
                    attachments: that.accountingApproveForm.attachments,
                    deadline: that.accountingApproveForm.deadline
                };
                that.ZN_POST(url,params,function(data){
                    that.accountingApproveDialog = false;
                    window.location.reload();
                })
            },
            accountingReject(id, record_id){ //拒绝弹框
                let that = this;
                that.accountingRejectDialog = true;
                that.accountingRejectForm.id = id;
                that.accountingRejectForm.record_id = record_id;
            },
            accountingRejectConfirm(){ //拒绝确认
                let that = this;
                if (!that.accountingRejectForm.reject_reason){
                    that.$alert('请填写驳回原因' , '提示', {confirmButtonText: '确定', callback: action => {that.canClick = !that.canClick;}});
                    return false;
                };
                let params = {
                    'token': that.token,
                    'status': 'REJECT',
                    'reject_reason': that.accountingRejectForm.reject_reason
                };
                let url = that.url_prefix + '/group/demand/custom_examine/' + that.accountingRejectForm.id + '/' + that.accountingRejectForm.record_id;
                that.ZN_POST(url,params,function(data){
                    that.accountingRejectForm.id = '';
                    that.accountingRejectForm.reject_reason = '';
                    that.accountingRejectDialog = false;
                    window.location.reload();
                })
            },
            approveApply: function (id) {
                let params = this.copyParams;
                let that = this;
                that.approveForm.id = id;
                that.$http.get(that.url_prefix + '/group/demand/detail/' + this.approveForm.id, {params}).then(function (response) {
                    if(response.data.msg_code === 100000) {
                        that.approveForm.deadline = response.data.response.deadline;
                        that.approveDialogVisible = true;
                    } else {
                        that.$alert(response.data.message , '警告', {confirmButtonText: '确定', callback: action => {}});
                    }
                }).catch(function (error) {
                    that.$alert(error , '警告', {confirmButtonText: '确定', callback: action => {}});
                });
            },
            approveConfirm: function () {
                let that = this;
                that.$http.post(that.url_prefix + '/group/demand/auth/' + that.approveForm.id, {
                    'token': that.token,
                    'status': 'APPROVE',
                    'remark': that.approveForm.remark,
                    'attachments': that.approveForm.attachments,
                    'deadline': that.approveForm.deadline
                }).then(function (response) {
                    if (response.data.msg_code === 100000) {
                        that.approveDialogVisible = false;
                        window.location.reload();
                    } else {
                        that.$alert(response.data.message , '警告', {confirmButtonText: '确定', callback: action => {that.canClick = !that.canClick;}});
                    }
                }).catch(function (error) {
                    that.$alert(error , '警告', {confirmButtonText: '确定', callback: action => {that.canClick = !that.canClick;}});
                });
            },
            handleFileRemove(file, fileList) {
                this.approveForm.attachments = fileList.map((item)=>{
                    return item.response.response;
                })
            },
            beforeFileRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleFileChange(response, file, fileList){
                this.approveForm.attachments.push({
                    path:response.response.newFileName,
                    original_name:response.response.originalFileName
                });
            },
            accountingHandleFileRemove(file, fileList) {
                this.accountingApproveForm.attachments = fileList.map((item)=>{
                    return {
                        path: item.response.response.newFileName,
                        original_name: item.response.response.originalFileName
                    }
                })
            },
            accountingBeforeFileRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            accountingHandleFileChange(response, file, fileList){
                this.accountingApproveForm.attachments.push({
                    path:response.response.newFileName,
                    original_name:response.response.originalFileName
                });
            },
            //权限按钮
            getAuthority(){
                let that = this;
                if(that.$store.getters.authForGroup.JointPurchaseDemandList&&that.$store.getters.authForGroup.JointPurchaseDemandList.transfers.length!=0){
                    that.$store.getters.authForGroup.JointPurchaseDemandList.transfers.map(item => {
                        if(item.power_transfer_name.indexOf('查看详情') != -1){
                            that.lookDetial = true;
                        }else if(item.power_transfer_name.indexOf('审核') != -1){
                            that.agreeBtn = true;
                        }else if(item.power_transfer_name.indexOf('驳回') != -1){
                            that.disagreeBtn = true;
                        }else if(item.power_transfer_name.indexOf('已核货量') != -1){
                            that.approvedVolumeBtn = true;
                        }else if(item.power_transfer_name.indexOf('编辑') != -1){
                            that.editVolumeBtn = true;
                        }else if(item.power_transfer_name.indexOf('拟采数量') != -1){
                            that.quantityBtn = true;
                        }else if(item.power_transfer_name.indexOf('核准数量') != -1){
                            that.authorizedBtn = true;
                        }
                    });
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
            }
        },
        mounted(){
            let that = this;
            // 设置下token
            if(!that.$cookies.get("ZL_token")){
                that.$router.push({path: '/login'})
            }else{
                that.token = that.$cookies.get("ZL_token");
                that.copyParams.token = that.$cookies.get("ZL_token");
            }
            //权限
            that.getAuthority();
            // 获得需求列表
            that.getDemandLists(1);
        },
    };
</script>

<style lang="less" scoped>
    .nomalBtn1.tabelBtn{
        width: 80px;
    }
    .nomalBtn1.tabelBtn1{
        width: 40px;
    }
    .el-dialog--center .el-dialog__body {
        padding-bottom: 0;
    }
    .headC{
        height: 40px;
        line-height: 40px;
        background-color: #2793f4;
        color: #fff;
        font-size: 14px;
        margin-bottom: 1%;
        padding-left: 1%;
        span{
            margin-left:10%;
            &:last-child{
                float: right;
                padding-right: 1%;
            }
        }
    }
    .cont{
        border: 1px solid #ccc;
        .conts{
            height: 30px;
            line-height: 30px;
            text-align: left;
            padding-left: 10px;
            border-bottom: 1px solid #ccc;
            &:last-child{
                border-bottom: none;
            }
        }
    }
    .el-input{
        width: 65%;
    }
    .exitfont{
        color: #0576DB;
        cursor: pointer;
        font-size: 20px;
    }
</style>