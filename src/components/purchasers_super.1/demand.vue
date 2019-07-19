<template>
    <div >
        <h3>我发布的联采需求列表</h3>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="项目名称">
                <el-input v-model="formInline.project_name" placeholder="项目名称" class="width180"></el-input>
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
                <el-select v-model="formInline.status" placeholder="全部" class="width90">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="待审核" value="PENDING"></el-option>
                    <el-option label="已驳回" value="REJECT"></el-option>
                    <el-option label="已完成" value="APPROVE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="nomalBtn1" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item v-show="addBtn">
                <el-button type="primary" class="nomalBtn2" @click="release">发布需求</el-button>
            </el-form-item>
        </el-form>
        <el-table
        :data="tableData"
        border
        style="width: 100%">
            <el-table-column v-for="(value,key) in tableJson"  :prop="key" :label="value" :key="value">
            </el-table-column>
            <el-table-column  label="操作" width="210">
                <template slot-scope="scope">
                    <div class="nomalBtn1 tabelBtn" v-if='scope.row.statusN == 1' @click="editItem(scope.row.id)" v-show="editBtn">编辑</div>
                    <div class="nomalBtn1 tabelBtn width60" v-if='scope.row.statusN == 1' @click="editItem1(scope.row)" v-show="rejectBtn">驳回原因</div>
                    <div class="nomalBtn1 tabelBtn" @click="viewDetails(scope.row.id)" v-if="lookBtn">查看</div>
                    <div v-else>--</div>
                </template>
            </el-table-column >
        </el-table>
        <div class="pageCont" v-if='total>10'>
            <el-pagination background layout="prev, pager, next" :total="total" :currentPage="currentPage"  @current-change="current_change"></el-pagination>
        </div>
        <!-- <el-dialog
            :title="dialogName"
            :visible.sync="dialogVisible"
            width="80%"
            :before-close="handleClose">
            <h2>联采产品</h2>
            :model="formInline"
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item label="产品名称">
                    <span class="requiredSpan">*</span>
                    <el-cascader
                        :options="options2"
                        @active-item-change="handleItemChange"
                        :props="props"
                        @change='selectChangedialog'
                        v-model="dialogCascader"
                        class="width210"
                        :disabled="!isInput"
                    ></el-cascader>
                     :value='dialogJson.category_type' 
                </el-form-item>
                <el-form-item label="品牌">
                    <span class="requiredSpan">*</span>
                    <el-input v-model="dialogJson.brand_name" placeholder="请输入品牌" class="width120" :disabled="!isInput"></el-input>
                </el-form-item> 
                <el-form-item label="数量">
                    <span class="requiredSpan">*</span>
                    <el-input v-model="dialogJson.purchase_num" :placeholder="placeholderMax" class="width180" :disabled="!isInput"></el-input>
                </el-form-item> 
                <el-form-item label="产品规格">
                    <span class="requiredSpan">*</span>
                    <el-input v-model="dialogJson.category_spec_min" placeholder="最小" class="width60" :disabled="!isInput"></el-input>
                    <span>—</span>
                    <el-input v-model="dialogJson.category_spec_max" placeholder="最大" class="width60" :disabled="!isInput"></el-input>
                </el-form-item> 
            </el-form>
            <h2>联采项目信息</h2>
           :model="formInline"  
            <el-form :inline="true"  label-width="150px">
                <el-form-item label="项目名称">
                    <span class="requiredSpan">*</span>
                    <el-input v-model="dialogJson.project_name" placeholder="项目名称" class="width210" :disabled="!isInput"></el-input>
                </el-form-item> 
                <h2>联采规则</h2>
                <el-form-item label="供应商报价截止时间">
                    <span class="requiredSpan">*</span>
                    <el-date-picker
                        v-model="dialogJson.deadline"
                        type="datetime"
                        value-format= 'yyyy-MM-dd HH:mm:ss'
                        placeholder="选择日期时间"
                        :disabled="!isInput">
                    </el-date-picker>
                </el-form-item> 
            </el-form>
            <div class="addDiv">发票要求：增值税发票<span class="addSpan">(交易过程中涉及的开票都采用增值税发票)</span></div>
            <el-form ref="form"  label-width="150px" class="textareaLabel">
                <el-form-item label="联采说明" style="width:525px">
                    <el-input type="textarea" v-model="dialogJson.remark" resize="none" :disabled="!isInput"></el-input>
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
            <h2>联采规则</h2>
            <el-form ref="form" label-width="150px">
                <el-form-item label="收货地址">
                    <span class="requiredSpan">*</span>
                    <el-cascader
                        :options="optionsAdd"
                        @active-item-change="handleAddrItemChange"
                        :props="props"
                        @change='selectChangeAddrdialog'
                        v-model="dialogAddr"
                        class="width350"
                        :disabled="!isInput"
                    ></el-cascader>
                </el-form-item> 
                <el-form-item label="详细地址">
                    <span class="requiredSpan">*</span>
                    <el-input v-model="dialogJson.delivery_address_detail" placeholder="请输入详细地址" class="width350" :disabled="!isInput"></el-input>
                </el-form-item> 
                <el-form-item label="验收人姓名">
                    <span class="requiredSpan">*</span>
                    <el-input v-model="dialogJson.consignee_name" placeholder="请输入验收人姓名" class="width350" :disabled="!isInput"></el-input>
                </el-form-item> 
                <el-form-item label="验证人联系电话">
                    <span class="requiredSpan">*</span>
                    <el-input v-model="dialogJson.consignee_mobile" placeholder="请输入验证人联系电话" class="width350" :disabled="!isInput"></el-input>
                </el-form-item> 
                <el-form-item label="验证人身份证号">
                    <span class="requiredSpan">*</span>
                    <el-input v-model="dialogJson.consignee_identity_card" placeholder="请输入验证人身份证号" class="width350" :disabled="!isInput"></el-input>
                </el-form-item> 
                <h2>订单方式</h2>
                <el-form-item label="请选择参考网站">
                    <span class="requiredSpan">*</span>
                    <el-radio-group v-model="dialogJson.quoted_price_website" :disabled="!isInput">
                        <el-radio label="XB" @change="quotedPriceWebsite">西本</el-radio>
                        <el-radio label="MY_STEEL" @change="quotedPriceWebsite">我的钢铁</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="报价参考地">
                    <span class="requiredSpan">*</span>
                    <el-input v-model="dialogJson.quoted_price_location" placeholder="请输入参考地" class="width180" :disabled="!isInput"></el-input>
                </el-form-item> 
                <el-form-item label="是否默认价格">
                    <el-radio-group v-model="defaultPrice" @change="defaultPriceF" :disabled="!isInput">
                        <el-radio label="0" >默认</el-radio>
                        <el-radio label="1" >其他价格</el-radio>
                    </el-radio-group>
                </el-form-item> 
                <div v-for="(price,key) in priceArr" :key="key" class="priceDiv">
                    <div class="title">{{price.title}}</div>
                    <div class="price">
                        <span v-if="dialogJson.quoted_price_website == 'XB' ">西本</span>
                        <span v-else>我的钢铁</span>
                        {{price.nomal}}
                        <input type="text"  :disabled="defaultPrice == '0'" v-model="price.nomalPrice"/>
                        {{price.unit}} 
                    </div>
                </div>
                <div style="clear:both;"></div>
                <el-form-item label="推荐供应商" v-if='defaultPrice != "0"'>
                    <span class="requiredSpan">*</span>
                    <el-input v-model="recommendedMan" placeholder="请输入推荐供应商" class="width180"></el-input>
                </el-form-item> 
                <el-form-item label="推荐供应商号码" v-if='defaultPrice != "0"'>
                    <span class="requiredSpan">*</span>
                    <el-input v-model="recommendedTel" placeholder="请输入供应商号码" class="width180"></el-input>
                </el-form-item> 
                <el-form-item >
                    <el-checkbox v-model="dialogChecked">阅读采购协议</el-checkbox>
                </el-form-item> 
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDemand" v-if="hasEdit">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
    export default {
        name: "demand",
        data() {
            return {
                isInput:true,
                per_page:10,
                // token
                token:"",
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
                formInline: {
                    project_name: '',
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
                tableData: [
                ],
                dialogVisible:false,
                tableJson:{
                    "project_name":"项目名称",
                    "project_code":"项目编码",
                    "brand_name":"产品名",
                    'specifications':"规格",
                    'purchase_num':"拟采数量",
                    'verify_goods_amount': '已核货量',
                    'created_at':"发布日期",
                    'deadline':"截止日期",
                    'status':"状态"
                },
                dialogName:'发布需求',
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
                priceArr:{
                   item1: {
                        title:"每批先付订货款，后发货，价格按款到帐日",
                        nomal:"参考价",
                        nomalPrice:0,
                        unit:"元/吨" 
                    },
                    item2:{
                        title:"每月10日，结清上月贷款",
                        nomal:"参考价",
                        nomalPrice:0,
                        unit:"元/吨"
                    },
                    item3:{
                        title:"货到工地，90天内结算所欠货款",
                        nomal:"参考价",
                        nomalPrice:0,
                        unit:"元/吨"
                    }
                },
                recommendedMan:'',
                recommendedTel:'',
                dialogChecked:true,
                defaultPriceNum:{},
                lastRecordId:'',
                //按钮权限
                addBtn:false,
                editBtn:false,
                rejectBtn:false,
                lookBtn:false,
            }
        },
        methods: {
            //权限按钮
            getAuthority(){
                let that=this;
                that.$store.getters.authForGroup.BranchMyDemandList.transfers.map(item=>{
                    if(item.power_transfer_name.indexOf('发布需求')!=-1){
                        that.addBtn=true;
                    }else if(item.power_transfer_name.indexOf('查看')!=-1){
                        that.lookBtn=true;
                    }else if(item.power_transfer_name.indexOf('编辑')!=-1){
                        that.editBtn=true;
                    }else if(item.power_transfer_name.indexOf('驳回')!=-1){
                        that.rejectBtn=true;
                    }
                });
            },
            editItem1(val){
                this.$alert(val.reject_reason , '驳回消息', {
                    confirmButtonText: '确定',
                    callback: action => {
                    }
                });
            },
            
            editItem(id){
                this.hasEdit = true;
                this.isEdit = true;
                this.editId = id;
                this.isInput = true;
                // 数据展示
                //this.showThisItem(id);
                this.$router.push({path: '/purchasers_super/demandDetial_super/'+id+'/'+1})
            },
            seeItem(id){
                this.isInput = false;
                this.hasEdit = false;
                //this.showThisItem(id);
                let that = this;
                that.$router.push({path: '/purchasers_super/demandDetial_super/'+id+'/'+0})
            },
            //查看详情
            viewDetails(id){
                this.$router.push({path: '/purchasers_super/branchDemandDetail_super/' + id})
            },
            // showThisItem(id){
            //     let that = this;
            //     let params = {
            //         token:that.token
            //     };
            //     that.$http.get('/api/frontend/joint_purchase/super/branch/demand/detail/'+id, {
            //         params
            //     }).then(function (response) {
            //         if(response.data.msg_code == 100000){
            //             let thisData = response.data.response;
            //             let joint_filelist = [];
            //             let accounting_filelist = [];
            //             that.dialogJson = {
            //                 brand_name: thisData.brand_name,
            //                 purchase_num:thisData.purchase_num,
            //                 project_name:thisData.project_name,
            //                 remark:thisData.remark,
            //                 deadline:thisData.deadline,
            //                 consignee_identity_card:thisData.consignee_identity_card,
            //                 consignee_mobile:thisData.consignee_mobile,
            //                 consignee_name:thisData.consignee_name,
            //                 quoted_price_website:thisData.quoted_price_website,
            //                 quoted_price_location:thisData.quoted_price_location,
            //                 delivery_address_detail:thisData.delivery_address_detail,
            //                 category_id:thisData.category.id,
            //                 category_type:thisData.category.type,
            //                 delivery_address_district_id:thisData.delivery_address_district_id
            //             };
            //             let specifications = JSON.parse(thisData.category_spec)
            //             that.dialogJson.category_spec_min = specifications.category_spec_min ;
            //             that.dialogJson.category_spec_max = specifications.category_spec_max ;
            //             if (that.hasClick.indexOf( thisData.category.parent_id) === -1) {
            //                 that.hasClick.push(thisData.category.parent_id);
            //                 that.getSelect(2,thisData.category.parent_id);
            //             }
            //             that.dialogCascader = [thisData.category.parent_id , thisData.category.id];
            //             if (that.hasClickAdd.indexOf(thisData.delivery_address_province_id) === -1) {
            //                 that.hasClickAdd.push(thisData.delivery_address_province_id);
            //                 that.getAdd(1,thisData.delivery_address_province_id,0);
            //             };
            //             if (that.hasClickAdd.indexOf(thisData.delivery_address_city_id) === -1) {
            //                 that.hasClickAdd.push(thisData.delivery_address_city_id);
            //                 that.getAdd(2,thisData.delivery_address_city_id,thisData.delivery_address_province_id);
            //             };
            //             that.dialogAddr = [ 
            //                 thisData.delivery_address_province_id ,thisData.delivery_address_city_id,thisData.delivery_address_district_id
            //             ];
            //             that.defaultPrice = thisData.is_recommend_supplier + '';
            //             that.recommendedTel = thisData.supplier_mobile;
            //             that.recommendedMan = thisData.supplier_name;
            //             if(thisData.is_recommend_supplier != "0"){
            //                 that.priceArr.item1.nomalPrice = thisData.supplier_index_of_paid_before;
            //                 that.priceArr.item2.nomalPrice = thisData.supplier_index_of_paid_after_in_tenth;
            //                 that.priceArr.item3.nomalPrice = thisData.supplier_index_of_paid_after_in_ninetieth;
            //             }else{
            //                 if(thisData.quoted_price_website == "XB"){
            //                     that.priceArr.item1.nomalPrice = thisData.quoted_price_record.my_steel_paid_before_index;
            //                     that.priceArr.item2.nomalPrice = thisData.quoted_price_record.my_steel_paid_after_index_in_tenth;
            //                     that.priceArr.item3.nomalPrice = thisData.quoted_price_record.my_steel_paid_after_index_in_ninetieth;
            //                 }else{
            //                     that.priceArr.item1.nomalPrice = thisData.quoted_price_record.xb_paid_before_index;
            //                     that.priceArr.item2.nomalPrice = thisData.quoted_price_record.xb_paid_after_index_in_tenth;
            //                     that.priceArr.item3.nomalPrice = thisData.quoted_price_record.xb_paid_after_index_in_ninetieth;
            //                 }
            //             }
            //             that.dialogJson.attachments = thisData.attachments;
            //             // that.fileList = thisData.attachments.map((item)=>{
            //             //     return  {name: item.original_name,
            //             //      url: item.path}
            //             // });
            //             //附件分开展示
            //             thisData.attachments.forEach(function(element, index){
            //                 if(element.business_type == 'DEMAND'){ //分公司
            //                     joint_filelist.push({
            //                         name: element.original_name,
            //                         url: element.path
            //                     });
            //                 }else if(element.business_type == 'DEMAND_DEPARTMENT_AUTH'){ //核算部
            //                     accounting_filelist.push({
            //                         name: element.original_name,
            //                         url: element.path
            //                     })
            //                 }
            //             });
            //             if(accounting_filelist.length > 0){
            //                 that.fileList = accounting_filelist;
            //             }else{
            //                 that.fileList = joint_filelist;
            //             }
            //             that.dialogVisible = true;
            //         }else{
            //             that.$alert(response.data.message , '警告', {
            //                 confirmButtonText: '确定',
            //                 callback: action => {
            //                 }
            //             });
            //         }
            //     }).catch(function (error) {
            //         that.$alert(error , '警告', {
            //             confirmButtonText: '确定',
            //             callback: action => {
            //                 // that.canClick = !that.canClick;
            //             }
            //         });
            //     });
            // },
            // quotedPriceWebsite(){
            //     let that = this;
            //     if(that.dialogJson.quoted_price_website == 'XB'){
            //         that.priceArr.item3.nomalPrice = that.defaultPriceNum.xb_paid_after_index_in_ninetieth;
            //         that.priceArr.item2.nomalPrice = that.defaultPriceNum.xb_paid_after_index_in_tenth;
            //         that.priceArr.item1.nomalPrice = that.defaultPriceNum.xb_paid_before_index;
            //     }else{
            //         that.priceArr.item3.nomalPrice = that.defaultPriceNum.my_steel_paid_after_index_in_ninetieth;
            //         that.priceArr.item2.nomalPrice = that.defaultPriceNum.my_steel_paid_after_index_in_tenth;
            //         that.priceArr.item1.nomalPrice = that.defaultPriceNum.my_steel_paid_before_index;
            //     }
            // },
            // defaultPriceSetting(type){
            //     let that = this;
            //     let params = {
            //         token:that.token
            //     };
            //     that.$http.get('/api/frontend/joint_purchase/super/iron_quoted_price_record/last_record',{
            //         params
            //     }).then(function (response) {
            //         if(response.data.msg_code == 100000){
            //             that.lastRecordId = response.data.response.id;
            //             that.defaultPriceNum.my_steel_paid_after_index_in_ninetieth = response.data.response.my_steel_paid_after_index_in_ninetieth;
            //             that.defaultPriceNum.my_steel_paid_after_index_in_tenth = response.data.response.my_steel_paid_after_index_in_tenth;
            //             that.defaultPriceNum.my_steel_paid_before_index = response.data.response.my_steel_paid_before_index;
            //             that.defaultPriceNum.xb_paid_after_index_in_ninetieth = response.data.response.xb_paid_after_index_in_ninetieth;
            //             that.defaultPriceNum.xb_paid_after_index_in_tenth = response.data.response.xb_paid_after_index_in_tenth;
            //             that.defaultPriceNum.xb_paid_before_index = response.data.response.xb_paid_before_index;
            //             if(that.dialogJson.quoted_price_website == 'XB'){
            //                 that.priceArr.item3.nomalPrice = that.defaultPriceNum.xb_paid_after_index_in_ninetieth;
            //                 that.priceArr.item2.nomalPrice = that.defaultPriceNum.xb_paid_after_index_in_tenth;
            //                 that.priceArr.item1.nomalPrice = that.defaultPriceNum.xb_paid_before_index;
            //             }else{
            //                 that.priceArr.item3.nomalPrice = that.defaultPriceNum.my_steel_paid_after_index_in_ninetieth;
            //                 that.priceArr.item2.nomalPrice = that.defaultPriceNum.my_steel_paid_after_index_in_tenth;
            //                 that.priceArr.item1.nomalPrice = that.defaultPriceNum.my_steel_paid_before_index;
            //             }
            //         }else{
            //             that.$alert(response.data.message , '警告', {
            //                 confirmButtonText: '确定',
            //                 callback: action => {
            //                 }
            //             });
            //         }
            //     }).catch(function (error) {
            //         that.$alert(error , '警告', {
            //             confirmButtonText: '确定',
            //             callback: action => {
            //                 // that.canClick = !that.canClick;
            //             }
            //         });
            //     });
            // },
            // defaultPriceF(){
            //     let that = this;
            //     if(that.defaultPrice == 1){
            //         if(that.dialogJson.quoted_price_website != 'XB'){
            //             that.priceArr.item3.nomalPrice = that.defaultPriceNum.my_steel_paid_after_index_in_ninetieth;
            //             that.priceArr.item2.nomalPrice = that.defaultPriceNum.my_steel_paid_after_index_in_tenth;
            //             that.priceArr.item1.nomalPrice = that.defaultPriceNum.my_steel_paid_before_index;
            //         }else{
            //             that.priceArr.item3.nomalPrice = that.defaultPriceNum.xb_paid_after_index_in_ninetieth;
            //             that.priceArr.item2.nomalPrice = that.defaultPriceNum.xb_paid_after_index_in_tenth;
            //             that.priceArr.item1.nomalPrice = that.defaultPriceNum.xb_paid_before_index;
            //         }
            //     }
            // },
            // addDemand(){
            //     let that = this;
            //     that.dialogJson.token = that.token;
            //     that.dialogJson.quoted_price_record_id = that.lastRecordId;
            //     that.dialogJson.is_recommend_supplier = that.defaultPrice;
            //     if(that.defaultPrice != '0'){
            //         that.dialogJson.supplier_name = that.recommendedMan ;
            //         that.dialogJson.supplier_mobile = that.recommendedTel;
            //         that.dialogJson.supplier_index_of_paid_before = that.priceArr.item1.nomalPrice;
            //         that.dialogJson.supplier_index_of_paid_after_in_tenth = that.priceArr.item2.nomalPrice;
            //         that.dialogJson.supplier_index_of_paid_after_in_ninetieth = that.priceArr.item3.nomalPrice;
            //     };
            //     let url ="";
            //     if(that.isEdit){
            //         url = '/api/frontend/joint_purchase/super/branch/demand/update/'+that.editId
            //     }else{
            //         url = '/api/frontend/joint_purchase/super/branch/demand/publish'
            //     }
            //     that.$http.post(url, that.dialogJson).then(function (response) {
            //         if(response.data.msg_code == 100000){
            //             that.getTabList(1);
            //             that.dialogVisible = false;
            //         }else{
            //             that.$alert(response.data.message , '警告', {
            //                 confirmButtonText: '确定',
            //                 callback: action => {
            //                     that.canClick = !that.canClick;
            //                 }
            //             });
            //         }
            //     }).catch(function (error) {
            //         that.$alert(error , '警告', {
            //             confirmButtonText: '确定',
            //             callback: action => {
            //                 that.canClick = !that.canClick;
            //             }
            //         });
            //     });
            // },
            // handleClose(){
            //     // 关闭前
            //     this.dialogVisible = false;
            // },
            release(){
                let that=this;
                let id='-1';
                that.$router.push({path: '/purchasers_super/demandDetial_super/'+id+'/'+1})
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
                }
                params.parent_id　= id;
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
                            // 输入 最高采购 数据
                            // that.getMaxPurchaseNum(that.options2[1].type ,that.options2[1].id);
                            // 获得默认价格之类
                            // that.defaultPriceSetting(that.options2[1].type);
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
            // getAdd(a,b,c){
            //     let that = this;
            //     let params = {
            //         token:that.token
            //     };
            //     if(a!=0){
            //         params.parent_id = b;
            //     }
            //     that.$http.get('/api/frontend/region/list', {
            //         params
            //     }).then(function (response) {
            //         if(response.data.msg_code == 100000){
            //             if(a==0){
            //                 that.optionsAdd = response.data.response.map((item)=> {
            //                     return {
            //                         label:item.region_name,
            //                         id:item.id,
            //                         parent_id:b,
            //                         sons:[]
            //                     }
            //                 });
            //                 return;
            //             }else if(a == 1){
            //                 for(let i = 0 ; i < that.optionsAdd.length; i++ ){
            //                     if(that.optionsAdd[i].id == b){
            //                         that.optionsAdd[i].sons = response.data.response.map((item)=> {
            //                             return {
            //                                 label : item.region_name,
            //                                 id:item.id,
            //                                 parent_id:b,
            //                                 sons:[]
            //                             }
            //                         });
            //                         return
            //                     }
            //                 }
            //             }else{
            //                 for(let i = 0 ; i < that.optionsAdd.length; i++ ){
            //                     if(that.optionsAdd[i].id == c){
            //                         let thisItem = 0;
            //                         for(let j = 0; j<that.optionsAdd[i].sons.length; j++){
            //                             if(that.optionsAdd[i].sons[j].id == b){
            //                                 thisItem += 1;
            //                                 that.optionsAdd[i].sons[j].sons = response.data.response.map((item)=> {
            //                                     return {
            //                                         label : item.region_name,
            //                                         parent_id:b,
            //                                         id:item.id
            //                                     }
            //                                 });
            //                                 return
            //                             }
            //                         };
            //                         if(thisItem<1){
            //                             that.getAdd(a,b,c);
            //                             return false
            //                         }
                                    
            //                     }
            //                 }
            //             }
            //         }else{
            //             that.$alert(response.data.message , '警告', {
            //                 confirmButtonText: '确定',
            //                 callback: action => {
            //                 }
            //             });
            //         }
            //     }).catch(function (error) {
            //         that.$alert(error , '警告', {
            //             confirmButtonText: '确定',
            //             callback: action => {
            //             }
            //         });
            //     });
            // },
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

                that.getTabList(1);
            },
            // handleAddrItemChange(val){
            //     let length = val.length;
            //     let that = this;
            //     if(length == 1){
            //         if (that.hasClickAdd.indexOf(val[length -1]) === -1) {
            //             that.hasClickAdd.push(val[length -1]);
            //             that.getAdd(1,val[0],0)
            //         }
            //     }else{
            //         if (that.hasClickAdd.indexOf(val[length -1]) === -1) {
            //             that.hasClickAdd.push(val[length -1]);
            //             that.getAdd(2,val[1],val[0])
            //         }
            //     }
            // },
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
                    let hasPlaceholder = 0;
                    for (let i = 0; i<that.hasPlaceholderMax.length ; i++){
                        if(that.hasPlaceholderMax[i].type == type){
                            hasPlaceholder += 1;
                            that.placeholderMax = that.hasPlaceholderMax[i].placeholderMax;
                            return
                        }
                    }
                    // if(hasPlaceholder == 0){
                    //     that.getMaxPurchaseNum(type , id);
                    // }
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
            // selectChangedialog(val){
            //     let that = this;
            //     if(val.length > 1){
            //         this.dialogJson.category_id = val[1];
            //         for(let i = 0; i <that.options2.length ; i++ ){
            //             if(val[0] == that.options2[i].id){
            //                 that.dialogJson.category_type = that.options2[i].type
            //                 return
            //             }
            //         }
            //     }else{
            //         this.dialogJson.category_id = 0
            //     }
            // },
            // selectChangeAddrdialog(val){
            //     this.dialogJson.delivery_address_district_id = val[2];
            // },
            current_change(currentPage){
                this.currentPage = currentPage;
                this.getTabList(currentPage);
            },
            getTabList:function(page){
                let params = this.copyParams;
                let that = this;
                that.currentPage = page;
                params.current_page = page;
                params.per_page = 10;
                that.$http.get('/api/frontend/joint_purchase/super/branch/demand/lists', {
                    params
                }).then(function (response) {
                    if(response.data.msg_code == 100000){
                        that.total = response.data.response.total;
                        that.tableData = response.data.response.data.map((item)=>{
                            let element = {
                                id:item.id,
                                brand_name: item.category.name,
                                deadline:  item.deadline,
                                created_at: item.created_at,
                                purchase_num: item.purchase_num,
                                project_name: item.project_name,
                                project_code: item.project_code,
                                verify_goods_amount: item.verify_goods_amount || '--'
                            };
                            if(item.status == 'REJECT'){
                                element.status = "拒绝";
                                element.statusN = 1;
                                element.reject_reason = item.reject_reason;
                            }else if(item.status == 'APPROVE'){
                                element.status = "同意";
                                element.statusN = 2;
                            }else{
                                element.status = "待审核";
                                element.statusN = 3;
                            };
                            if(!item.supplier_name){
                                element.supplier_name = "-"
                            }else{
                                element.supplier_name = item.supplier_name
                            };
                            if(!item.supplier_mobile){
                                element.supplier_mobile = "-"
                            }else{
                                element.supplier_mobile = item.supplier_mobile
                            };
                            let specifications = JSON.parse(item.category_spec)
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
                            // that.canClick = !that.canClick;
                        }
                    });
                });
            },
            // getMaxPurchaseNum(type,id){
            //     let that = this;
            //     let params = {
            //         token:that.token,
            //         category_type:type
            //     };
            //     that.$http.get('/api/frontend/joint_purchase/super/branch/demand/calculate_max_purchase_num',{
            //         params
            //     }).then(function (response) {
            //         if(response.data.msg_code == 100000){
            //             that.placeholderMax = '最大可采购数量'+response.data.response+'吨';
            //             that.hasPlaceholderMax.push({
            //                 id,
            //                 type,
            //                 placeholderMax :'最大可采购数量'+response.data.response+'吨'
            //             })
            //         }else{
            //             that.$alert(response.data.message , '警告', {
            //                 confirmButtonText: '确定',
            //                 callback: action => {
            //                 }
            //             });
            //         }
            //     }).catch(function (error) {
            //         that.$alert(error , '警告', {
            //             confirmButtonText: '确定',
            //             callback: action => {
            //                 // that.canClick = !that.canClick;
            //             }
            //         });
            //     });
            // },
            // handleFileRemove(file, fileList) {
            //     this.dialogJson.attachments = fileList.map((item)=>{
            //         return item.response.response;
            //     })
            // },
            // beforeFileRemove(file, fileList) {
            //     return this.$confirm(`确定移除 ${ file.name }？`);
            // },
            // handleFileChange(response, file, fileList){
            //     this.dialogJson.attachments.push({
            //         path:response.response.newFileName,
            //         original_name:response.response.originalFileName
            //     });
            // }
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
            // 设置分类第一层
            that.getSelect(1,0);
            // // 地址分层
            // that.getAdd(0,0,0);
            // 获得 列表数据
            that.getTabList(1);
            that.getAuthority();
        }
    }
</script>
<style lang="less" scoped>
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
</style>