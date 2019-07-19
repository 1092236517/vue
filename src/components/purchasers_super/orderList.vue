<template>
    <div>
        <h3>订单列表</h3>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="订单号">
                <el-input v-model="formInline.order_no" placeholder="订单号" class="width150"></el-input>
            </el-form-item>
            <el-form-item label="分类">
                <el-cascader
                    :options="options2"
                    @active-item-change="handleItemChange"
                    :props="props"
                    @change='selectChange'
                    class="width210"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="全部" class="width120">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="履约中" value="PENDING"></el-option>
                    <el-option label="关闭中" value="CLOSING"></el-option>
                    <el-option label="已结束" value="FINISHED"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目名称">
                <el-input v-model="formInline.project_name" placeholder="项目名称" class="width150"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" class="nomalBtn1" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column v-for="(value,key) in tableJson"  :prop="key" :label="value" :key="value">
            </el-table-column>
            <el-table-column label="驳回原因" width="180">
                <template slot-scope="scope">
                    <div class="rejectBtn" @click="showRejectReason(scope.row.close_reject_reason)" v-if="scope.row.close_status == 'GROUP_AUTH_REJECT'">{{ scope.row.close_reject_reason }}</div>
                </template>
            </el-table-column>
            <el-table-column  label="操作" width="270">
                <template slot-scope="scope">
                    <div class="nomalBtn1 tabelBtn" v-if='scope.row.status == "履约中"&&establishBtn' @click="editItem(scope.row)">创建批次</div>
                    <div class="nomalBtn1 tabelBtn" v-if='scope.row.status == "履约中"&&closureBtn' @click="seeItem(scope.row.id)">申请关闭</div>
                    <div class="nomalBtn1 tabelBtn" v-if="lookBtn" @click="order(scope.row.id)">订单详情</div>
                </template>
            </el-table-column >
        </el-table>
        <div class="pageCont" v-if='total>10'>
            <el-pagination background layout="prev, pager, next" :total="total" :currentPage="currentPage"  @current-change="current_change"></el-pagination>
        </div>


        <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="80%">
            <div>报价参考网站: {{ dialogFs }}</div>
            <div>
                <span>报价参考地： </span>
                <span>{{ dialogPlace }}</span>
            </div>
            <el-form>
                <el-form-item label="支付方式">
                    <span class="requiredSpan">*</span>
                    <el-select v-model="dialogJson.paid_type" placeholder="请选择支付方式" class="width350" >
                        <el-option :label="item.description" :value="item.description" v-for="(item,index) in priceType" :key="index"></el-option>
                        <!-- <el-option label="每月10日，结清上月贷款" value="PAID_AFTER_IN_TENTH"></el-option>
                        <el-option label="货到工地，90天内结算所欠货款" value="PAID_AFTER_IN_NINETIETH"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="计划收货时间(必须当前时间两日后)">
                    <span class="requiredSpan">*</span>
                    <el-date-picker
                        v-model="dialogJson.receive_time"
                        type="datetime"
                        value-format= 'yyyy-MM-dd HH:mm:ss'
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <div class="onelineDiv">参数详情  <div class="nomalBtn1 "  @click="addThisRow">添加一栏</div></div>
                 <el-table :data="dialogJson.spec" border style="width: 100%">
                    <el-table-column prop="brand_name" label="产品名">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.brand_name" placeholder="产品名"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="diameter" label="直径（mm）">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.diameter" placeholder="直径"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="数量（吨）">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.num" placeholder="吨"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_seismic" label="抗震需求">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.is_seismic" placeholder="请选择">
                                <el-option label="抗震" value="1"></el-option>
                                <el-option label="不抗震" value="0"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="length"
                        label="长度（米）">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.length" placeholder="请选择">
                                <el-option label="9" value="9"></el-option>
                                <el-option label="12" value="12"></el-option>
                                <el-option label="无需求" value="0"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="webPrice" label="网上标价（元）" v-if="allocationShow">
                        <template slot-scope="scope">
                            <div>{{ scope.row.webPrice || '--' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalPrice" label="总额（元）" v-if="allocationShow">
                        <template slot-scope="scope">
                            <div>{{ scope.row.totalPrice || '--' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <div class="thisDiv" @click='deleteThisRow(scope.$index, scope.row)'>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDemand" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "order-list",
        data() {
            return {
                dialogVisible:false,
                dialogName:"创建批次订单",
                per_page:10,
                total:0,
                currentPage:0,
                // token
                token:"",
                formInline: {
                    order_no: '',
                    status: 'all',
                    category_id:'',
                    project_name:""
                },
                // 分类列表
                options2: [],
                props: {
                    label:'label',
                    value: 'id',
                    children: 'sons'
                },
                hasClick:[],
                hasClickAdd:[],
                copyParams:{
                    token:''
                },
                tableData: [],
                tableJson:{
                    "order_no":"订单编号",
                    "project_name":"项目名称",
                    "project_code":'项目编码',
                    "brand_name":"产品名",
                    'specifications':"规格",
                    'purchase_num':"数量",
                    "supplier_name":"供应商",
                    'status':"状态"
                },
                dialogJson:{
                    status:"PAID_BEFORE",
                    spec:[],
                    receive_time:''
                },
                dialogPlace:"",
                dialogFs:"",
                priceType:[],
                //按钮权限
                lookBtn:false,
                establishBtn:false,
                closureBtn:false,
                allocationShow:false
            }
        },
        methods: {
             //权限按钮
            getAuthority(){
                let that=this;
                that.$store.getters.authForGroup.BranchOrderList.transfers.map(item=>{
                    if(item.power_transfer_name.indexOf('订单详情')!=-1){
                        that.lookBtn=true;
                    }else if(item.power_transfer_name.indexOf('创建批次')!=-1){
                        that.establishBtn=true;
                    }else if(item.power_transfer_name.indexOf('申请关闭')!=-1){
                        that.closureBtn=true;
                    }else if(item.power_transfer_name.indexOf('批次订单配置显示')!=-1){
                        that.allocationShow = true;
                    }
                });
            },
            addThisRow(){
                this.dialogJson.spec.push({
                    brand_name:'',
                    diameter:'0',
                    num:'0',
                    is_seismic:'0',
                    length:'9',
                    remark:'',
                    price: 0,
                    webPrice: 0,
                    group_price: 0
                });
            },
            deleteThisRow(index){
                if(this.dialogJson.spec.length == 1){
                    this.$message({
                        message: '至少保留一行数据!',
                        type: 'warning'
                    });
                    return false
                }
                this.dialogJson.spec.splice(index, 1);
            },
            //提交批次订单
            addDemand(){
                let that = this;
                let params;
                if(that.dialogJson.paid_type == "" || that.dialogJson.receive_time == ""){
                    that.$alert("请先填写支付方式或收货时间");
                    return false;
                }
                params = JSON.parse(JSON.stringify(that.dialogJson));
                if(params.spec.some(item => !that.isNumber(item.diameter))){ //校验直径输入
                    that.$message({
                        message: '请在“直径”框输入合法数字',
                        type: 'warning'
                    })
                    return false
                }
                if(params.spec.some(item => !that.isNumber(item.num))){ //校验数量输入
                    that.$message({
                        message: '请在“数量”框中输入合法数字',
                        type: 'warning'
                    })
                    return false
                }
                params.spec = JSON.stringify(params.spec);
                that.$http.post('/api/frontend/joint_purchase/super/branch/order/create_slave_order', params).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.dialogVisible = false;
                        that.getTabList(that.currentPage);
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
                        callback: action => {}
                    });
                });
            },
            order(id){
                let that = this;
                that.$router.push({path: '/purchasers_super/orderN_super/'+id})
            },
            //创建批次订单
            editItem(item){
                let that = this;
                if(item.branch_approve_price){
                    that.priceType=JSON.parse(item.branch_approve_price);
                }else{
                    that.priceType=[];
                }
                that.dialogVisible = true;
                that.dialogJson = {
                    master_order_id:item.id,
                    token: that.token,
                    paid_type:"",
                    spec:[
                        {
                            brand_name: '',
                            diameter: '0',
                            num: '0',
                            is_seismic: '0',
                            length: '9',
                            remark: '',
                            price: 0,
                            webPrice: 0,
                            group_price: 0
                        }
                    ],
                    receive_time:''
                };
                that.dialogFs = item.quoted_price_website;
                that.getData(item.id);
            },
            seeItem(id){
                let that = this;
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
                    that.$http.get('/api/frontend/joint_purchase/super/branch/order/apply_close_order/'+id, {
                        params
                    }).then(function (response) {
                        if(response.data.msg_code == 100000){
                            that.getTabList(that.currentPage);
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
                }).catch(() => {});
            },
            getSelect(level,id){
                let that = this;
                let params = {
                    token:that.token
                };
                if(level == 1){
                    params.level = 1
                }else{
                    params.level = 2;
                    params.parent_id　= id;
                }
                that.$http.get('/api/frontend/joint_purchase/super/category/lists', {
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
                            that.options2.unshift({label : '清空',id:'0'});
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
                        }
                    });
                });
            },
            onSubmit() {
                let that = this;
                let params = {
                    current_page:1,
                    per_page:10,
                    token:that.token
                };
                if(that.formInline.order_no){
                    params.order_no = that.formInline.order_no
                }
                if(that.formInline.status != 'all'){
                    params.status = that.formInline.status
                }
                if(that.formInline.category_id && that.formInline.category_id != undefined ){
                    params.category_id = that.formInline.category_id
                }
                if(that.formInline.project_name){
                    params.project_name = that.formInline.project_name;
                }
                that.copyParams = params;
                that.getTabList(1);
            },
            handleItemChange(val) {
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
                };
            },
            selectChange(val){
                this.formInline.category_id = val[1];
            },
            current_change(currentPage){
                this.currentPage = currentPage;
                this.getTabList(currentPage);
            },
            getTabList(page){
                let that = this;
                let params = that.copyParams;
                that.currentPage = page;
                params.current_page = page;
                params.per_page = 10;
                params.token = that.token;
                that.$http.get('/api/frontend/joint_purchase/super/branch/order/lists', {
                    params
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.total = response.data.response.total;
                        that.tableData = response.data.response.data.map((item)=>{
                            let element = {
                                id:item.id,
                                order_no:item.order_no,
                                project_name:item.project_name,
                                project_code:item.demand_purchase.demand.project_code,
                                status:item.status == "PENDING"? "履约中" : item.status == "CLOSING" ? "关闭中" : "已结束",
                                supplier_name: item.supplier_name,
                                purchase_num :item.purchase_num,
                                brand_name: item.category.name,
                                close_status: item.close_status,
                                close_reject_reason: item.close_reject_reason || '-',
                                branch_approve_price: item.demand_purchase.branch_approve_price,
                                quoted_price_location:item.quoted_price_location,
                                quoted_price_website:item.quoted_price_website == "XB" ? "西本":"我的钢铁",
                                quote_result:item.quote_result
                            };
                            let specifications = JSON.parse(item.category_spec);
                            element.specifications = specifications.category_spec_min +'-'+specifications.category_spec_max;
                            return element;
                        });
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
            //展示驳回原因
            showRejectReason(reason){
                this.$alert(reason,'驳回原因', {
                    confirmButtonText: '确定',
                    callback: action => {}
                });
            },
            //获取订单详情
            getData(id){
                let that = this;
                let params = {
                    token : that.token
                }
                that.$http.get('/api/frontend/joint_purchase/super/branch/order/detail/'+id, {
                    params
                }).then(function (response) {
                    let result = response.data;
                    if(result.msg_code == 100000){
                        that.dialogPlace = result.response.reference_address;
                    }else{
                        that.$alert(response.data.message , '警告', {
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
                        }
                    });
                });
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
            that.getAuthority();
        }
    }
</script>
<style lang="less" scoped>
    .thisDiv{
        width: 20px;
        height: 20px;
        margin: 0 auto;
        cursor: pointer;
        background-size: 100% 100%;
        background-image: url(../../assets/purch/dele.png);
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
    .tabelBtn{
        width: 70px;
    }
    .priceDiv{
        width: 20%;
        margin-left: 5%;
        padding: 5px 2.5%;
        border: 1px solid #888;
        float: left;
        border-radius: 5px;
        height: 100px;
        margin-bottom: 30px;
        .title{
            line-height: 30px;
            font-size: 18px;
            color: #666;
        }
        .price{
            line-height: 20px;
            font-size: 14px;
            color: #888;
            input{
                outline: none;
                border: none;
                border-bottom: 1px solid #888;
                width: 60px;
                text-align: center;
            }
        }
    }
    .uploadButton{
        width: 200px;
        border-radius: 5px;
        position: relative;
        input{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999;
            opacity: 0;
        }
    }
    .addDiv{
        .addSpan{
            color: #999;
        }
    }
    h3{
        margin: 0;
        text-align: left;
    }
    form{
        margin-top: 20px;
    }
    .width350{
        width: 350px;
    }
    .width210{
        width: 210px;
    }
    .width180{
        width: 180px;
    }
    .width150{
        width: 150px;
    }
    .width120{
        width: 120px;
    }
    .width90{
        width: 90px;
    }
    .width60{
        width: 60px;
    }
    .rejectBtn{
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>