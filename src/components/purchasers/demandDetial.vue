<template>
    <div>
        <h2>项目信息</h2>
        <!-- :model="formInline"  -->
        <el-form :inline="true"  label-width="150px">
            <el-form-item label="项目名称">
                <span class="requiredSpan">*</span>
                <el-input v-model="dialogJson.project_name" placeholder="请输入项目名称" class="width210" :disabled="!isInput"></el-input>
            </el-form-item>
            <el-form-item label="项目编码">
                <span class="requiredSpan">*</span>
                <el-input v-model="dialogJson.project_code" placeholder="请输入项目编号" class="width210" :disabled="!isInput"></el-input>
            </el-form-item> 
        </el-form>
        <h2>联采产品</h2>
        <!-- :model="formInline" -->
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
                <!-- :value='dialogJson.category_type' -->
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
        <!-- :model="formInline"  -->
        <h2>联采规则</h2>
        <el-form :inline="true"  label-width="150px">
            <el-form-item label="供应商报价截止时间">
                <span class="requiredSpan">*</span>
                <el-date-picker
                    v-model="dialogJson.deadline"
                    type="datetime"
                    value-format= 'yyyy-MM-dd HH:mm:ss'
                    placeholder="选择日期时间"
                    :disabled="!isInput"
                    :picker-options="dateOptions">
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
                    :on-preview="handlePreview"
                    :on-progress="handleProgress"
                    :data="{column:'joint_purchase',category:'publish_demand'}"
                    multiple
                    :on-success="handleFileChange"
                    :file-list="fileList"
                    :show-file-list="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">您可以将招标文件或者其他您认为需要让供应商知晓的内容以附件形式上传</div>
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
         <h2>收货信息</h2>
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
            <el-form-item label="验收人联系电话">
                <span class="requiredSpan">*</span>
                <el-input v-model="dialogJson.consignee_mobile" placeholder="请输入验证人联系电话" class="width350" :disabled="!isInput"></el-input>
            </el-form-item> 
            <el-form-item label="验收人身份证号">
                <span class="requiredSpan hidden">*</span>
                <el-input v-model="dialogJson.consignee_identity_card" placeholder="请输入验证人身份证号" class="width350" :disabled="!isInput"></el-input>
            </el-form-item> 
            <h2>订单方式</h2>
            <el-form-item label="请选择参考网站">
                <span class="requiredSpan">*</span>
                <el-radio-group v-model="dialogJson.quoted_price_website" :disabled="!isInput">
                    <el-radio label="XB">西本</el-radio>
                    <el-radio label="MY_STEEL">我的钢铁</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="报价参考地">
                <span class="requiredSpan">*</span>
                <el-cascader
                    :options="optionsAdds"
                    @active-item-change="handleAddrsItemChange"
                    :props="props"
                    @change='selectChangeAddrsdialog'
                    v-model="dialogAddrs"
                    class="width350"
                    :disabled="!isInput"
                ></el-cascader>
            </el-form-item> 
            <div style="position:relative;">
            <el-form-item label="支付方式" style="width:525px">
                <!-- <span class="requiredSpan">*</span> -->
                <el-input type="textarea" v-model="dialogJson.pay_description" :autosize="{minRows: 8}" resize="none" :disabled="!isInput"></el-input>                
            </el-form-item>
            <el-main>
                <div class="example" :class="{fold: exampleFold}">
                    <p>A:需方每批先付定货款，供方后发货；每批货价格按款到账日“XX网（如我的钢铁或西本网，扬州市建筑钢材价格行情）”指定范围内同厂家同规格下浮XX元/吨。</p>
                    <p>
                        说明/备注：（由联采部对应合同条款，编辑进去）
                        且遇网价涨价时不涨，遇降价时按款到账日“XX网（如我的钢铁或西本网，扬州市建筑钢材价格行情）”指定范围内同厂家同规格下浮XX元/吨。若“XX网（如我的钢铁或西本网，扬州市建筑钢材价格行情）”一天内有多次报价时，以网站当日同厂家同规格多次报价平均数为准。若遇星期六、星期日，则按本周五价格执行；若款到账日该网站无报价，则以每批款到账日前最后一次价格为主。
                    </p>
                    <p>B：每月10日，付清上月产生的所有货款；价格按货到工地日“XX网（如我的钢铁或西本网，扬州市建筑钢材价格行情）”指定范围内同厂家同规格下浮XX元/吨。</p>
                    <p>
                        说明/备注：（由联采部对应合同条款，编辑进去）
                        若“XX网（如我的钢铁或西本网，扬州市建筑钢材价格行情）”一天内有多次报价时，以网站当日同厂家同规格多次报价平均数为准。若遇星期六、星期日，则按本周五价格执行；若货到工地日该网站无报价，则以每批货到工地日前最后一次价格为主。
                    </p>
                    <p>C:每批货到工地日， 每90天付清该批货款；价格按货到工地日“XX网（如我的钢铁或西本网，扬州市建筑钢材价格行情）”指定范围内同厂家同规格上浮XX元/吨。</p>
                    <p>
                        说明/备注：（由联采部对应合同条款，编辑进去）
                        若“XX网（如我的钢铁或西本网，扬州市建筑钢材价格行情）”一天内有多次报价时，以网站当日同厂家同规格多次报价平均数为准。若遇星期六、星期日，则按本周五价格执行；若货到工地日该网站无报价，则以每批货到工地日前最后一次价格为主。
                    </p>
                    <div class="fold-btn-div" :class="{'unfold-btn-div': unfoldBtnDiv}">
                        <el-button type="text" @click="showExample">{{ exampleFold ? '更多详情' : '收起' }}</el-button>
                    </div>
                </div>
            </el-main>
            </div>
            <el-form-item >
                <el-checkbox style="margin-left:-150px;" v-model="dialogJson.is_recommend_supplier" @change="defaultPriceF">我有推荐供应商</el-checkbox>
            </el-form-item>
            <el-form-item label="推荐供应商(企业名称)">
                <!-- <span class="requiredSpan">*</span> -->
                <el-input v-model="dialogJson.supplier_company_name" placeholder="请输入供应商名称" class="width180" :class="{border333:!isInputs}" :disabled="!isInputs"></el-input>
            </el-form-item> 
            <el-form-item label="推荐供应商联系人">
                <!-- <span class="requiredSpan">*</span> -->
                <el-input v-model="dialogJson.supplier_name" placeholder="请输入供应商联系人" class="width180" :class="{border333:!isInputs}" :disabled="!isInputs"></el-input>
            </el-form-item> 
            <el-form-item label="推荐供应商联系方式">
                <!-- <span class="requiredSpan">*</span> -->
                <el-input v-model="dialogJson.supplier_mobile" placeholder="请输入供应商联系方式" class="width180" :class="{border333:!isInputs}" :disabled="!isInputs"></el-input>
            </el-form-item> 
            <el-form-item >
                <el-checkbox v-model="dialogChecked">阅读采购协议</el-checkbox>
            </el-form-item>
        </el-form> 
            
        <span slot="footer" class="dialog-footer">
            <el-button @click="before" v-show="objectBtn">取 消</el-button>
            <el-button type="primary" @click="addDemand" v-if="hasEdit&&okBtn" :disabled="demandSubmitDisabled">确 定</el-button>
        </span>

        <!-- 图片弹框预览 -->
        <el-dialog title="查看图片" :visible.sync="imgVisible" width="60%" >
            <div><img :src='imgurl' style="margin: 0 auto;display: inherit;width: 100%"/></div>
        </el-dialog>

    </div>
</template>

<script>
import attachmentList from '../public/attachmentList'
export default {
    name: "demandDetial",
    data(){
        return{
            isInput:true,
            isInputs:true,
            // token
            token:"",
            // 有无提交按钮
            hasEdit:false,
            // 是否为编辑
            isEdit:false,
            // 编译时的 id
            editId:0,
            // 默认分类
            dialogCascader:[],
            // 默认地址
            dialogAddr:[],
            dialogAddrs:[],//参考地址
            // 分类列表
            options2: [],
            // 地址列表
            optionsAdd:[],
            optionsAdds:[],
            props: {
                label:'label',
                value: 'id',
                children: 'sons'
            },
            hasClick:[],
            hasClickAdd:[],
            hasClickAdds:[],
            hasPlaceholderMax:[],
            placeholderMax:"最大可采购数量8888吨",
            fileList:[],
            dialogJson:{
                token:'',
                attachments:[],//附件
                brand_name:'',//品牌
                category_spec_min:'',
                category_spec_max:'',
                purchase_num:'',//数量
                project_name:'',//项目名称
                project_code:'',//项目编号
                remark:'',//联采说明
                deadline:'',//截止时间
                consignee_identity_card:'',//验收人身份证
                consignee_mobile:'',//验收人联系电话
                consignee_name:'',//验收人名称
                quoted_price_website:'XB',//参考网址
                is_recommend_supplier:true,//是否有供应商
                delivery_address_detail:'',//详细地址
                category_id:0,//产品分类
                category_type:'',
                delivery_address_district_id:'',//地址区县
                reference_province_id:'',
                reference_city_id:'',
                supplier_name:'',
                supplier_company_name:'',
                supplier_mobile:'',
                pay_description:''
            },
            dialogChecked:true,
            //图片弹窗
            imgVisible:false,
            imgurl:'',
            exampleFold: true,
            unfoldBtnDiv: false,
            uploadPercentage: 0,
            uploadProgressVisible: false,
            //权限
            okBtn:false,
            objectBtn:false,
            dateOptions: {
                disabledDate(time) {
                  return time.getTime() <= Date.now();
                }
            },
            //禁止提交联采需求
            demandSubmitDisabled: false
        }
    },
    components: {
        attachmentList
    },
    methods:{
        //权限按钮
        getAuthority(){
            let that=this;
            that.$store.getters.authForGroup.NormalBranchMyDemandList.transfers.map(item=>{
                if(item.power_transfer_name.indexOf('确定')!=-1){
                    that.okBtn=true;
                }else if(item.power_transfer_name.indexOf('取消')!=-1){
                    that.objectBtn=true;
                }
            });
        },
        showThisItem(id){
            let that = this;
            let params = {
                token:that.token
            };
            that.$http.get('/api/frontend/joint_purchase/normal/branch/demand/detail/'+id ,{ params }).then(function (response) {
                if(response.data.msg_code === 100000){
                    let thisData = response.data.response;
                    let joint_filelist = [];
                    let accounting_filelist = [];
                    // if(thisData.is_recommend_supplier==0){
                    //     that.isInputs=false;
                    // }else{
                    //     that.isInputs=true;
                    // }
                    that.dialogJson = {
                        brand_name: thisData.brand_name,//品牌
                        purchase_num:thisData.purchase_num,//数量
                        project_name:thisData.project_name,//项目名称
                        project_code:thisData.project_code,//项目编号
                        remark:thisData.remark,//联采说明
                        deadline:thisData.deadline,//截止时间
                        consignee_identity_card:thisData.consignee_identity_card,//验收人身份证
                        consignee_mobile:thisData.consignee_mobile,//验收人联系电话
                        consignee_name:thisData.consignee_name,//验收人名称
                        quoted_price_website:thisData.quoted_price_website,//参考网址
                        is_recommend_supplier:(thisData.is_recommend_supplier==0)?false:true,//是否有供应商
                        delivery_address_detail:thisData.delivery_address_detail,//详细地址
                        category_id:thisData.category.id,//产品分类
                        category_type:thisData.category.type,
                        delivery_address_district_id:thisData.delivery_address_district_id,//地址区县
                        reference_city_id:thisData.reference_city_id,
                        reference_province_id:thisData.reference_province_id,
                        supplier_name:thisData.supplier_name,
                        supplier_company_name:thisData.supplier_company_name,
                        supplier_mobile:thisData.supplier_mobile,
                        pay_description:thisData.pay_description,
                    };
                    let specifications = JSON.parse(thisData.category_spec)
                    that.dialogJson.category_spec_min = specifications.category_spec_min ;//规格最小值
                    that.dialogJson.category_spec_max = specifications.category_spec_max ;//规格最大值
                    if (that.hasClick.indexOf( thisData.category.parent_id) === -1) {
                        that.hasClick.push(thisData.category.parent_id);
                        that.getSelect(2,thisData.category.parent_id);
                    }
                    that.dialogCascader = [thisData.category.parent_id , thisData.category.id];
                    if (that.hasClickAdd.indexOf(thisData.delivery_address_province_id) === -1) {
                        that.hasClickAdd.push(thisData.delivery_address_province_id);
                        that.getAdd(1,thisData.delivery_address_province_id,0);
                    };
                    if (that.hasClickAdd.indexOf(thisData.delivery_address_city_id) === -1) {
                        that.hasClickAdd.push(thisData.delivery_address_city_id);
                        that.getAdd(2,thisData.delivery_address_city_id,thisData.delivery_address_province_id);
                    };
                    if (that.hasClickAdds.indexOf(thisData.reference_province_id) === -1) {
                        that.hasClickAdds.push(thisData.reference_province_id);
                        that.getAdds(2,thisData.reference_province_id);
                    };
                    
                    that.dialogAddr = [ 
                        thisData.delivery_address_province_id ,thisData.delivery_address_city_id,thisData.delivery_address_district_id
                    ];
                    that.dialogAddrs=[
                        thisData.reference_province_id ,thisData.reference_city_id,
                    ]
                    that.dialogJson.attachments = thisData.attachments;
                    //附件分开展示
                    thisData.attachments.forEach(function(element, index){
                        if(element.business_type == 'DEMAND'){ //分公司
                            joint_filelist.push({
                                name: element.original_name,
                                url: element.path
                            });
                        }else if(element.business_type == 'DEMAND_DEPARTMENT_AUTH'){ //核算部
                            accounting_filelist.push({
                                name: element.original_name,
                                url: element.path
                            })
                        }
                    });
                    if(accounting_filelist.length > 0){
                        that.fileList = accounting_filelist;
                    }else{
                        that.fileList = joint_filelist;
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
        release(){
            let that=this;
            that.isInput = true;
            this.hasEdit = true;
            this.isEdit = false;
            that.dialogJson = {
                brand_name:'',//品牌
                purchase_num:'',//数量
                project_name:'',//项目名称
                project_code:'',//项目编号
                remark:'',//联采说明
                deadline:'',//截止时间
                consignee_identity_card:'',//验收人身份证
                consignee_mobile:'',//验收人联系电话
                consignee_name:'',//验收人名称
                quoted_price_website:'XB',//参考网址
                //dialogAddrs:[],//参考地址
                is_recommend_supplier:true,//是否有供应商
                delivery_address_detail:'',//详细地址
                category_id:0,//产品分类
                category_type:'',
                delivery_address_district_id:'',//地址区县
                reference_city_id:'',
                supplier_name:'',
                supplier_company_name:'',
                supplier_mobile:'',
                pay_description:'',
            };
            that.dialogCascader = [];
            that.dialogAddr = [];
            that.dialogAddrs=[];
            that.dialogJson.attachments = [];
            that.fileList = [];
        },
        //是否有‘我有推荐供应商’
        defaultPriceF(){
            let that = this;
            if(that.dialogJson.is_recommend_supplier == true){
                that.isInputs=true;
            }else{
                that.isInputs=false;
            }
        },
        //确定按钮
        addDemand(){
            let that = this;
            that.demandSubmitDisabled = true; //防止重复提交
            that.dialogJson.token = that.token;
            let url ="";
            if(that.isEdit){
                url = '/api/frontend/joint_purchase/normal/branch/demand/update/'+that.editId
            }else{
                url = '/api/frontend/joint_purchase/normal/branch/demand/publish'
            }
            that.$http.post(url, that.dialogJson).then(function (response) {
                that.demandSubmitDisabled = false;
                if(response.data.msg_code == 100000){
                    that.$router.push({path: '/demand'})
                }else{
                    that.$alert(response.data.message , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                            that.canClick = !that.canClick;
                        }
                    });
                }
            }).catch(function (error) {
                that.demandSubmitDisabled = false;
                that.$alert(error , '警告', {
                    confirmButtonText: '确定',
                    callback: action => {
                        that.canClick = !that.canClick;
                    }
                });
            });
        },
        
        //产品分类
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
            that.$http.get('/api/frontend/joint_purchase/normal/category/lists', {
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
                        that.getMaxPurchaseNum(that.options2[1].type ,that.options2[1].id);
                        // 获得默认价格之类
                        //that.defaultPriceSetting(that.options2[1].type);
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
                if(hasPlaceholder == 0){
                    that.getMaxPurchaseNum(type , id);
                }
            }else{
                for (let i = 0; i<that.hasPlaceholderMax.length ; i++){
                    if(that.hasPlaceholderMax[i].id == val[0]){
                        that.placeholderMax = that.hasPlaceholderMax[i].placeholderMax;
                        return
                    }
                }
            };
        },
        selectChangedialog(val){
            let that = this;
            if(val.length > 1){
                this.dialogJson.category_id = val[1];
                for(let i = 0; i <that.options2.length ; i++ ){
                    if(val[0] == that.options2[i].id){
                        that.dialogJson.category_type = that.options2[i].type
                        return
                    }
                }
            }else{
                this.dialogJson.category_id = 0
            }
        },
        //收货地址
        getAdd(a,b,c){
            let that = this;
            let params = {
                token:that.token
            };
            if(a!=0){
                params.parent_id = b;
            }
            that.$http.get('/api/frontend/region/list', {
                params
            }).then(function (response) {
                if(response.data.msg_code == 100000){
                    if(a==0){
                        that.optionsAdd = response.data.response.map((item)=> {
                            return {
                                label:item.region_name,
                                id:item.id,
                                parent_id:b,
                                sons:[]
                            }
                        });
                        return;
                    }else if(a == 1){
                        for(let i = 0 ; i < that.optionsAdd.length; i++ ){
                            if(that.optionsAdd[i].id == b){
                                that.optionsAdd[i].sons = response.data.response.map((item)=> {
                                    return {
                                        label : item.region_name,
                                        id:item.id,
                                        parent_id:b,
                                        sons:[]
                                    }
                                });
                                return
                            }
                        }
                    }else{
                        for(let i = 0 ; i < that.optionsAdd.length; i++ ){
                            if(that.optionsAdd[i].id == c){
                                let thisItem = 0;
                                for(let j = 0; j<that.optionsAdd[i].sons.length; j++){
                                    if(that.optionsAdd[i].sons[j].id == b){
                                        thisItem += 1;
                                        that.optionsAdd[i].sons[j].sons = response.data.response.map((item)=> {
                                            return {
                                                label : item.region_name,
                                                parent_id:b,
                                                id:item.id
                                            }
                                        });
                                        return
                                    }
                                };
                                if(thisItem<1){
                                    that.getAdd(a,b,c);
                                    return false
                                }
                                
                            }
                        };
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
        getAdds(a,b){
            let that = this;
            let params = {
                token:that.token
            };
            if(a!=0){
                params.parent_id = b;
            }
            that.$http.get('/api/frontend/region/list', {
                params
            }).then(function (response) {
                if(response.data.msg_code == 100000){
                    if(a==0){
                        that.optionsAdds = response.data.response.map((item)=> {
                            return {
                                label:item.region_name,
                                id:item.id,
                                parent_id:b,
                                sons:[]
                            }
                        });
                        return;
                    }else{
                        for(let i = 0 ; i < that.optionsAdds.length; i++ ){
                            if(that.optionsAdds[i].id == b){
                                that.optionsAdds[i].sons = response.data.response.map((item)=> {
                                    return {
                                        label : item.region_name,
                                        id:item.id,
                                        parent_id:b,
                                    }
                                });
                                return
                            }
                        };
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
        handleAddrItemChange(val){
            let length = val.length;
            let that = this;
            if(length == 1){
                if (that.hasClickAdd.indexOf(val[length -1]) === -1) {
                    that.hasClickAdd.push(val[length -1]);
                    that.getAdd(1,val[0],0)
                }
            }else{
                if (that.hasClickAdd.indexOf(val[length -1]) === -1) {
                    that.hasClickAdd.push(val[length -1]);
                    that.getAdd(2,val[1],val[0])
                }
            };
        },
        handleAddrsItemChange(val){
            let length = val.length;
            let that = this;
            if(val.length == 1){
               if (that.hasClickAdds.indexOf(val[length -1]) === -1) {
                    that.hasClickAdds.push(val[length -1]);
                    that.getAdds(1,val[0]);
                }
            }else{
                this.dialogJson.reference_city_id = 0
            }
        },
        selectChangeAddrdialog(val){
            this.dialogJson.delivery_address_district_id = val[2];
        },
        selectChangeAddrsdialog(val){
            this.dialogJson.reference_province_id=val[0];
            this.dialogJson.reference_city_id = val[1];
        },
        //采购数量接口
        getMaxPurchaseNum(type,id){
            let that = this;
            let params = {
                token:that.token,
                category_type:type
            };
            that.$http.get('/api/frontend/joint_purchase/normal/branch/demand/calculate_max_purchase_num',{
                params
            }).then(function (response) {
                if(response.data.msg_code == 100000){
                    that.placeholderMax = '最大可采购数量'+response.data.response+'吨';
                    that.hasPlaceholderMax.push({
                        id,
                        type,
                        placeholderMax :'最大可采购数量'+response.data.response+'吨'
                    })
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
        //上传文件的方法
        handleFileRemove(file, fileList) {
            this.dialogJson.attachments = fileList.map((item)=>{
                return item.response.response;
            })
        },
        beforeFileRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        handleFileChange(response, file, fileList){
            this.dialogJson.attachments.push({
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
            this.dialogJson.attachments = this.fileList.map((item)=>{
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
            if(file.raw.type.indexOf("image")>-1){
                that.imgVisible=true;
                that.imgurl=file.url;
            }
        },
        //取消按钮
        before(){
            let that = this;
            that.$router.push({path: '/demand'})
        },
        //支付方式文本收起放下
        showExample(){
            this.exampleFold = !this.exampleFold;
            this.unfoldBtnDiv = !this.unfoldBtnDiv;
        }
    },
    mounted(){
        let that = this;
        that.id = that.$route.params.id;
        that.edit = that.$route.params.isedit;
        // 设置下token
        if(!that.$cookies.get("ZL_token")){
            that.$router.push({path: '/login'})
        }else{
            that.token = that.$cookies.get("ZL_token");
        };
        // 设置分类第一层
        that.getSelect(1,0);
        // 地址分层
        that.getAdd(0,0,0);
        that.getAdds(0,0);
        that.getAuthority();
        if(that.id != '-1'){
            if(that.edit==1){
                that.hasEdit = true;
                that.isEdit = true;
                that.editId = that.id;
                that.isInput = true;
                that.isInputs = true;
            }else{
                that.isInputs = false;
                that.isInput = false;
                that.hasEdit = false;
            }
            that.showThisItem(that.id);
        }else{
            that.release();
        };
        
    },
}
</script>

<style lang="less" scoped>
    .hidden{
        visibility: hidden;
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
    .el-main{
        height: auto;
        overflow-y: hidden;
        width: 40%;
        position: absolute;
        right: 0;
        top: -80%;
    }
    .example{
        position: relative;
    }
    .example p:nth-child(2n){
        color: #aaa;
    }
    .example p:nth-child(2n+1){
        color: #333;
    }
    .fold{
        height: 300px;
        overflow: hidden;
    }
    .fold-btn-div{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        padding-top: 100px;
        height: 50px;
        text-align: center;
        background: linear-gradient(-180deg,rgba(255,255,255,0) 0%,#fff 70%);
    }
    .unfold-btn-div{
        bottom: -50px;
        background: 0;
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