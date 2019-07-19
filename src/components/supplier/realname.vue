<template>
    <div>
        <div v-if="qualificationStauts == 'NOT'" v-show="statusWindow" class="status-wrapper">
            <div class="realNameTitle">实名认证</div>
            <div class="realNameBox">
                <p>您尚未实名认证！</p>
                <el-button @click="openInfoWindow" type="primary">去认证</el-button>
            </div>
        </div>
        <div v-else-if="qualificationStauts == 'APPROVE'" v-show="statusWindow" class="status-wrapper">
            <div class="realNameTitle">实名认证</div>
            <div class="realNameBox">
                <i class="iconfont icon-Shapecopy" style="color: #0576DB;font-size: 35px;"></i>
                <p>您已通过实名认证！</p>
                <el-button @click="openInfoWindow" type="primary">去查看</el-button>
            </div>
        </div>
        <div v-else-if="qualificationStauts == 'REJECT'" v-show="statusWindow" class="status-wrapper">
            <div class="realNameTitle">实名认证</div>
            <div class="realNameBox">
                <p>您已实名认证，未通过！</p>
                <el-button @click="openInfoWindow" type="primary">重新提交认证</el-button>
            </div>
        </div>
        <div v-else-if="qualificationStauts == 'VALID'" v-show="statusWindow" class="status-wrapper">
            <div class="realNameTitle">实名认证</div>
            <div class="realNameBox">
                <p>您已申请实名认证！待审核</p>
                <el-button @click="openInfoWindow" type="primary">去查看</el-button>
            </div>
        </div>

        <div v-if="infoWindowShow" class="info-wrapper">
            <h2>填写实名认证</h2>
            <el-form ref="infoForm" label-position="left" :rules="rules" :model="companyInfoData" label-width="140px">
                <p class="section-title">公司信息</p>
                <el-form-item label="公司名称：" prop="name">
                    <el-col :span="6">
                        <el-input v-model="companyInfoData.name" :disabled="is_authenticated"></el-input>
                    </el-col>
                    <el-col :span="9" class="tipsWrapper">
                        <span class="requireTag">*</span>
                        <span class="tips">请填写与营业执照一致的公司名称</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="法定代表人：" prop="corporation">
                    <el-col :span="6">
                        <el-input v-model="companyInfoData.corporation" :disabled="is_authenticated"></el-input>
                    </el-col>
                    <el-col :span="9" class="tipsWrapper">
                        <span class="requireTag">*</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="营业执照注册号：" prop="licenceno">
                    <el-col :span="6">
                        <el-input v-model="companyInfoData.licenceno" :disabled="is_authenticated"></el-input>
                    </el-col>
                    <el-col :span="9" class="tipsWrapper">
                        <span class="requireTag">*</span>
                        <span class="tips">请填写完整的营业执照的注册号</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="上传附件" prop="licence">
                    <el-upload
                        class="upload"
                        :action="this.$api.upload_file_url"
                        :data="{column:'joint_purchase',category:'publish_demand'}"
                        :before-upload="beforeUpload"
                        multiple
                        :limit="1"
                        :on-remove="handleRemove"
                        :on-exceed="handleExceed"
                        :on-success="handleSuccess"
                        :file-list="companyInfoData.fileList"
                        list-type="picture">
                        <el-button size="small" type="primary" :disabled="is_authenticated">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">
                            <p>1.业务认证需提供有效期3个月以上的营业执照</p>
                            <p>2.请保证营业执照上的信息清晰可见</p>
                            <p>3.只能上传jpg/png文件，且不超过6M</p>
                        </div>
                    </el-upload>
                </el-form-item>
                <ul class="saleCategorySelected clearfix">
                    <li v-for="(item,index) in companyInfoData.saleCategorySelected">
                        <span>{{ item.parent_name }}</span>
                        <span> / {{ item.child_name }}</span>
                        <span class="delete-btn" @click="deleteSaleSlected(index)">x</span>
                    </li>
                </ul>
                <el-form-item  label="销售范围">
                    <el-cascader
                        :options="companyInfoData.saleCategoryOptions"
                        @active-item-change="handleItemChange"
                        :props="props"
                        @change='selectChange'
                        v-model="companyInfoData.saleCurrentCategory"
                        class="width210"
                    ></el-cascader>
                </el-form-item>
            </el-form>
            <el-form ref="contactForm" label-position="left" :rules="rules" :model="contactInfoData" label-width="140px">
                <p class="section-title">联系方式</p>
                <el-form-item label="联系人手机号：" prop="mobile">
                    <el-col :span="6">
                        <el-input v-model="contactInfoData.mobile" placeholder="请输入手机号" :disabled="is_authenticated"></el-input>
                    </el-col>
                    <el-col :span="9" class="tipsWrapper">
                        <span class="requireTag">*</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="固定电话：">
                    <el-col :span="6">
                        <el-input v-model="contactInfoData.tel" placeholder="请输入电话" :disabled="is_authenticated"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="联系QQ：">
                    <el-col :span="6">
                        <el-input v-model="contactInfoData.qq" placeholder="请输入QQ" :disabled="is_authenticated"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="联系人：" prop="contacts">
                    <el-col :span="6">
                        <el-input v-model="contactInfoData.contacts" placeholder="请输入联系人姓名" :disabled="is_authenticated"></el-input>
                    </el-col>
                    <el-col :span="9" class="tipsWrapper">
                        <span class="requireTag">*</span>
                    </el-col>
                </el-form-item>
                <el-form-item label="部门：">
                    <el-col :span="6">
                        <el-input v-model="contactInfoData.department" placeholder="请输入部门" :disabled="is_authenticated"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="职位：">
                    <el-col :span="6">
                        <el-input v-model="contactInfoData.post" placeholder="请输入职位" :disabled="is_authenticated"></el-input>
                    </el-col>
                </el-form-item>
                <p class="section-title">联系地址</p>
                <el-form-item label="企业地址" prop="business_location">
                    <el-cascader
                        :options="optionsAdd"
                        @active-item-change="handleAddrItemChange"
                        :props="props"
                        v-model="address"
                        @change="addressChange"
                        :disabled="is_authenticated"
                        class="width350"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址：" prop="detail_address">
                    <el-col :span="6">
                        <el-input v-model="contactInfoData.detail_addr" placeholder="请输入详细地址" :disabled="is_authenticated"></el-input>
                    </el-col>
                    <el-col :span="9" class="tipsWrapper">
                        <span class="requireTag">*</span>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(['infoForm','contactForm'])">提交</el-button>
                    <el-button type="text" @click="closeInfoWindow">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            let that = this;
            let nameCheck = function(rule,value,callback){
                if(!value){
                    return callback(new Error('请输入公司名称'));
                }
            };
            let corporationCheck = function(rule,value,callback){
                if(!value){
                    return callback(new Error('请输入法定代表人'));
                }
            };
            let licencenoCheck = function(rule,value,callback){
                if(!value){
                    return callback(new Error('请输入营业执照注册号'));
                }
            };
            let licenceCheck = function(rule,value,callback){
                if(that.companyInfoData.fileList.length == 0){
                    return callback(new Error('请上传营业执照'));
                }
            };
            let mobileCheck = function(rule,value,callback){
                if(!value){
                    return callback(new Error('请输入手机号'));
                }
            };
            let contactsCheck = function(rule,value,callback){
                if(!value){
                    return callback(new Error('请输入联系人身份证号'));
                }
            };
            let businessLocationCheck = function(rule,value,callback){
                if(!value){
                    return callback(new Error('请输入公司名称'));
                }
            };
            return {
                qualificationStauts: '',
                is_authenticated: true,
                infoWindowShow: false,
                statusWindow: true,
                companyInfoData: {
                    name: '',
                    corporation: '',
                    licenceno: '',
                    fileList: [],
                    maxSize: 6, //单位M
                    saleCategoryOptions: [],
                    saleCategorySelected: [],
                    saleLocalData: [],
                    saleCurrentCategory: []
                },
                contactInfoData: {
                    mobile: '',
                    tel: '',
                    qq: '',
                    contacts: '',
                    department: '',
                    post: '',
                    detail_addr: ''
                },
                optionsAdd:[],
                props: {
                    label:'label',
                    value: 'id',
                    children: 'sons'
                },
                address: [],
                addressData: '',
                hasClickAdd:[],
                rules: {
                    name: [
                        {validator: nameCheck, trigger: 'blur' }
                    ],
                    corporation: [
                        {validator: corporationCheck, trigger: 'blur' }
                    ],
                    licenceno: [
                        {validator: licencenoCheck, trigger: 'blur' }
                    ],
                    licence: [
                        {validator: licenceCheck, trigger: 'change' }
                    ],
                    mobile: [
                        {validator: mobileCheck, trigger: 'blur' }
                    ],
                    contacts: [
                        {validator: contactsCheck, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            //打开认证弹窗
            openInfoWindow(){
                this.infoWindowShow = true;
                this.statusWindow = false;
            },
            //关闭认证弹窗
            closeInfoWindow(){
                this.infoWindowShow = false;
                this.statusWindow = true;
                this.companyInfoData.saleCategorySelected = [];
            },
            //获取用户信息
            getUserInfo(){
                let that = this;
                let params = {token: that.token};
                that.$http.get('/api/frontend/member/detail',{params})
                    .then(function(response){
                        let result = response.data;
                        let backfillInfoData = {};
                        let full_region = result.response.full_region;
                        that.qualificationStauts = result.response.auth_status;
                        that.is_authenticated = result.response.auth_status == 'APPROVE';
                        backfillInfoData.name = result.response.member_auth.auth_name;
                        backfillInfoData.corporation = result.response.member_auth.legal_person;
                        backfillInfoData.licenceno = result.response.member_auth.licenseno;
                        backfillInfoData.product_class = result.response.member_auth.product_class;
                        backfillInfoData.detail_addr = result.response.member_auth.detail_address;
                        if(result.response.member_extend){
                            backfillInfoData.mobile = result.response.member_extend.phone;
                            backfillInfoData.tel = result.response.member_extend.contact_tel;
                            backfillInfoData.qq = result.response.member_extend.qq;
                            backfillInfoData.contacts = result.response.member_extend.contacter;
                            backfillInfoData.department = result.response.member_extend.dept;
                            backfillInfoData.post = result.response.member_extend.position;
                        }
                        if(result.response.member_auth.license && !(/^http/.test(result.response.member_auth.license))){
                            backfillInfoData.fileList = [{
                                name: 'licence',
                                url: 'http://file001.zhuniu.com/' + result.response.member_auth.license,
                                newFileName: result.response.member_auth.license,
                            }];
                        }else {
                            backfillInfoData.fileList = [{
                                name: 'licence',
                                url: result.response.member_auth.license,
                                newFileName: result.response.member_auth.license
                            }];
                        }
                        if(full_region.length != 0){
                            that.getAdd(1,full_region[1].id,0);
                            that.getAdd(2,full_region[2].id,full_region[1].id);
                            that.address = [full_region[0].id,full_region[1].id,full_region[2].id];
                        }
                        that.backfillInfo(backfillInfoData);
                    }).catch(function (error) {
                        console.info(error);
                        that.$alert(error , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                            }
                        });
                    });
            },
            //回填信息
            backfillInfo(data){
                this.companyInfoData.name = data.name;
                this.companyInfoData.corporation = data.corporation;
                this.companyInfoData.licenceno = data.licenceno;
                this.companyInfoData.fileList = data.fileList;
                this.companyInfoData.product_class = data.product_class;
                this.contactInfoData.mobile = data.mobile;
                this.contactInfoData.tel = data.tel;
                this.contactInfoData.qq = data.qq;
                this.contactInfoData.contacts = data.contacts;
                this.contactInfoData.department = data.department;
                this.contactInfoData.post = data.post;
                this.contactInfoData.detail_addr = data.detail_addr;
            },
            //上传前校验
            beforeUpload(file){
                if(file.type.indexOf('image') == -1){
                    this.$message({
                        message: '只能上传图片！',
                        type: 'warning'
                    });
                    return false;
                }
                if(file.size > this.companyInfoData.maxSize * 1024 * 1024){
                    this.$message({
                        message: '当前图片大小超过6M！',
                        type: 'warning'
                    });
                    return false;
                }
            },
            //上传成功
            handleSuccess(response,file,fileList){
                let item = {
                    name: file.name,
                    url: file.url,
                    newFileName: response.response.newFileName,
                    originalFileName: response.response.originalFileName
                };
                this.companyInfoData.fileList.push(item);
            },
            //删除附件
            handleRemove(file,fileList){
                let file_arr = this.companyInfoData.fileList;
                let index;
                for(let i = 0; i < file_arr.length; i++){
                    if(file_arr[i].uid == file.uid){
                        index = i;
                        break;
                    }
                }
                this.companyInfoData.fileList.splice(index,1);
            },
            handleExceed(files,fileList){
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            //获取销售种类列表
            getSaleCategoryOptions(level,id){
                let that = this;
                let params = {
                    token:that.token
                };
                params.level = level;
                params.parent_id　= id;
                that.$http.get('/api/frontend/joint_purchase/normal/category/lists', {
                    params
                }).then(function(response){
                    let result = response.data;
                    if(result.msg_code == 100000){
                        if(level == 1){
                            // 这边将 要 将欲变化的 放进去
                            that.companyInfoData.saleCategoryOptions = result.response.map((item)=> {
                                return {
                                    type: item.type,
                                    label: item.name,
                                    id: item.id,
                                    sons: []
                                }
                            });
                            that.companyInfoData.saleCategoryOptions.unshift({label : '清空',id:'0'})
                        }else{
                            for(let i = 0; i < that.companyInfoData.saleCategoryOptions.length; i++){
                                if(that.companyInfoData.saleCategoryOptions[i].id == id){
                                    that.companyInfoData.saleCategoryOptions[i].sons = result.response.map((item)=> {
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
                    that.$alert(error , '警告', {
                        confirmButtonText: '确定',
                        callback: action => {
                        }
                    });
                });
            },
            //销售范围级联
            handleItemChange(val){
                let that = this;
                if (that.companyInfoData.saleLocalData.indexOf(val[0]) === -1) {
                    that.companyInfoData.saleLocalData.push(val[0]);
                    let id = 0;
                    let type = "";
                    for (let i = 0; i < that.companyInfoData.saleCategoryOptions.length; i++){
                        if(that.companyInfoData.saleCategoryOptions[i].id == val[0]){
                            id = that.companyInfoData.saleCategoryOptions[i].id;
                            type = that.companyInfoData.saleCategoryOptions[i].type;
                        }
                    }
                    that.getSaleCategoryOptions(2,id);
                }
            },
            //销售种类变更
            selectChange(val){
                let item = {};
                let list = this.companyInfoData.saleCategoryOptions;
                item.parent_id = val[0];
                item.parent_name = list[val[0]].label;
                item.child_id = val[1];
                for(let i = 0; i < list[val[0]].sons.length; i++){
                    if(list[val[0]].sons[i].id == val[1]){
                        item.child_name = list[val[0]].sons[i].label;
                        break;
                    }
                }
                //去重
                for(let i = 0; i < this.companyInfoData.saleCategorySelected.length; i++){
                    if(this.companyInfoData.saleCategorySelected[i].parent_id == val[0]
                        && this.companyInfoData.saleCategorySelected[i].child_id == val[1]){
                        return false;
                    }
                };
                this.companyInfoData.saleCategorySelected.push(item);
            },
            //删除选项
            deleteSaleSlected(index){
                this.companyInfoData.saleCategorySelected.splice(index,1);
            },
            //获取地址列表
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
                                        //that.getAdd(a,b,c);
                                        return false
                                    }
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
            //地址级联
            handleAddrItemChange(val){
                let length = val.length;
                let that = this;
                if(length == 1){
                    if (that.hasClickAdd.indexOf(val[length -1]) === -1) {
                        that.hasClickAdd.push(val[length -1]);
                        that.getAdd(1,val[0],0)
                    }
                }else{
                    if(that.hasClickAdd.indexOf(val[length -1]) === -1) {
                        that.hasClickAdd.push(val[length -1]);
                        that.getAdd(2,val[1],val[0])
                    }
                }
            },
            //地址变更
            addressChange(val){
                let list = this.optionsAdd;
                let item = {
                    province_id: val[0],
                    city_id: val[1],
                    county_id: val[2],
                };
                //遍历省市县的名字 省
                for(let i = 0; i < list.length; i++){
                    if(list[i].id == val[0]){
                        item.province_name = list[i].label;
                        //市
                        for(let j = 0; j < list[i].sons.length; j++){
                            if(list[i].sons[j].id == val[1]){
                                item.city_name = list[i].sons[j].label;
                                //县
                                for(let k = 0; k < list[i].sons[j].sons.length; k++){
                                    if(list[i].sons[j].sons[k].id == val[2]){
                                        item.county_name = list[i].sons[j].sons[k].label;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
                this.addressData = item;
            },
            //提交实名信息
            submitForm(formName){ //表单名字数组
                let that = this;
                let params = {};
                let licence = '';
                let validator = true;
                let url = '';
                for(let i = 0; i < formName.length; i++){
                    that.$refs[formName[i]].validate((valid) => {
                        if(!valid){
                            return validator = false;
                        }
                    })
                };
                if(!validator){ //校验
                    return false;
                }
                params.token = that.token;
                if(that.is_authenticated){ //已经通过认证，再编辑
                    url = '/api/frontend/member/authedit';
                    params.product_class = JSON.stringify(that.companyInfoData.saleCategorySelected);
                }else{
                    url = '/api/frontend/member/auth/supplier';
                    params.auth_name = that.companyInfoData.name;
                    params.legal_person = that.companyInfoData.corporation;
                    params.licenseno = that.companyInfoData.licenceno;
                    params.business_location = that.addressData.province_name + ',' + that.addressData.city_name
                        + ',' + that.addressData.county_name;
                    params.business_location_id = that.addressData.county_id;
                    params.detail_address = that.contactInfoData.detail_addr;
                    params.phone = that.contactInfoData.mobile;
                    params.contact_tel = that.contactInfoData.tel;
                    params.qq = that.contactInfoData.qq;
                    params.contacter = that.contactInfoData.contacts;
                    params.dept = that.contactInfoData.department;
                    params.position = that.contactInfoData.post;
                    params.product_class = JSON.stringify(that.companyInfoData.saleCategorySelected);
                    that.companyInfoData.fileList.forEach((item, index) => {
                        licence += item.newFileName;
                    });
                    params.license = licence;
                }
                that.$http.post(url,params)
                    .then(function(response){
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.$message({
                                message: '提交成功，请等待审核',
                                type: 'success'
                            })
                            that.getUserInfo();
                            that.closeInfoWindow();
                        }else{
                            that.$alert(result.message , '提示', {
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
            }
        },
        mounted(){
            let that = this;
            if(!that.$cookies.get("ZL_token")){
                that.$router.push({path: '/login'})
            }else{
                that.token = that.$cookies.get("ZL_token");
            }
            //获取用户信息
            this.getUserInfo();
            //获取销售种类
            that.getSaleCategoryOptions(1,0);
            // 地址分层
            that.getAdd(0,0,0);
        }
    }
</script>
<style lang="less" scoped>
    .clearfix:after {
        content: "." ;
        display: block ;
        height: 0 ;
        clear: both ;
        visibility: hidden ;
    }
    /*标题*/
    .realNameTitle{
        font-size: 20px;
        font-weight: bold;
    }
    .realNameBox{
        width: 200px;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 30%;
        margin-left: -100px;
        color: #6C6C6C;
    }
    button.el-button--primary{
        width: 150px;
        margin-top: 10px;
        padding: 8px 0;
    }
    .tipsWrapper{
        position: relative;
        .requireTag{
            position: absolute;
            top: 0;
            left: 0;
            color: red;
        }
        .tips{
            padding-left: 30px;
            color: #999;
        }
    }
    .upload{
        width: 50%;
    }
    .el-upload__tip p{
        margin: 0;
        line-height: 20px;
        color: #999;
    }
    .section-title{
        font-size: 18px;
        font-weight: 700;
    }
    .saleCategorySelected{
        margin-left: 140px;
        padding: 0;
        list-style: none;
        li{
            position: relative;
            float: left;
            list-style: none;
            padding: 5px;
            background: #f3f3f3;
            border: 1px solid #ccc;
            margin-right: 10px;
            margin-bottom: 5px;
            border-radius: 5px;
            .delete-btn{
                position: absolute;
                right: -3px;
                top: -10px;
                cursor: pointer;
            }
        }
    }
</style>