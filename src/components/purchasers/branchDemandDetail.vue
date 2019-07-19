<template>
    <div class="contain">
        <div class="step-bar-div">
			<stepBar :stepData="stepData" />
		</div>
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
                    <!-- <el-table-column prop="price" label="期望成交价（元/吨）"></el-table-column> -->
                    <el-table-column prop="business" label="推荐供应商"></el-table-column>
                    <el-table-column prop="businessphone" label="推荐供应商电话"></el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 选择付款方式及确认价格 -->
        <!-- <div class="payment-mode-div" v-if="branchAUditStatus == 'PRE_FINISH'">
            <p class="subtitle">选择付款方式及确认价格</p>
            <el-table :data="paymentModeData" :span-method="SpanMethod"  border style="width: 100%;">
                <el-table-column prop="productName" label="产品名称"></el-table-column>
                <el-table-column prop="brand" label="品牌"></el-table-column>
                <el-table-column prop="amount" label="数量（吨）"></el-table-column>
                <el-table-column prop="type" label="规格"></el-table-column>
                <el-table-column prop="priceweb" label="价格参考网站"></el-table-column>
                <el-table-column prop="pricelocal" label="价格参考地区"></el-table-column>
                <el-table-column prop="dealtype" label="选择付款方式">
                    <template slot-scope="scope">
                        <el-checkbox-group v-model="selectedPaymentModeList">
                          <el-checkbox :label="scope.row.paymentMode">{{ scope.row.description}}</el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-table-column>
                <el-table-column prop="dealPrice" label="成交价（元/吨）"></el-table-column>
            </el-table>
        </div> -->
        <div class="cont_3">
            <div class="cont_31">
                <div class="contH">联采规则</div>
                <div class="stateCon">
                    <div class="sCon">
                        <div class="first">
                            <div class="conH" style="width:150px;">供应商报价截止时间：</div>
                            <div class="conC">{{deadline}}</div>
                        </div>
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
        </div>
        <!-- <div class="operate-div" v-if="branchAUditStatus == 'PRE_FINISH'">
            <el-button type="primary" @click="confirmDemand" v-show="agreeBtn">确认并提交</el-button>
            <el-button type="primary" plain @click="rejectDemand" v-show="rejectBtn">驳回</el-button>
        </div> -->
    </div>
</template>

<script>
import stepBar from '@/components/public/stepBar'
export default {
    components: {stepBar},
    name:"branchDemandDetail",
    data(){
        return{
            token: '',
            id:'',
            service_role_id: '',
            demand_purchase_id: '',
            //联采信息
            state:"",
            state1:0,
            collectInfo:[],
            //采购信息
            tableData:[],
            paymentModeData: [],
            //联采规则
            count:0,
            deadline:"",
            remark:"",
            filement:"",
            url_prefix: '/api/frontend/joint_purchase/normal',
            branchAUditStatus: '',
            selectedPaymentModeList: [],
            spanArr: [],
            pos: 0,
            //流程进度条
            stepData: {
                curStep: 0,
                steps: [],
                operateData: [],
                demandStatus: ''
            },
            //权限
            agreeBtn:false,
            rejectBtn:false
        }
    },
    methods:{
         //权限按钮
        getAuthority(){
            let that=this;
            that.$store.getters.authForGroup.NormalBranchMyDemandList.transfers.map(item=>{
                if(item.power_transfer_name.indexOf('确认并提交')!=-1){
                    that.agreeBtn=true;
                }else if(item.power_transfer_name.indexOf('拒绝')!=-1){
                    that.rejectBtn=true;
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
        //获取联采需求详情
        getTabData(id){
            let that=this;
            that.tableData=[];
            let params = {
                token: that.token
            };
            let url = that.url_prefix + '/branch/demand/detail/' + id;
            that.ZN_GET(url,params,function(data){
                //联采需求单id
                that.demand_purchase_id = data.response.demand_purchase_id;
                //分公司审核状态
                if(data.response.purchase_demand){
                    that.branchAUditStatus = data.response.purchase_demand.status;
                }
                //基本信息
                that.collectInfo=[
                    {
                        name: "项目名称",
                        value: data.response.project_name || '--'
                    },
                    {
                        name: "项目编码",
                        value: data.response.project_code || '--'
                    },
                    {
                        name: "采购商",
                        value: data.response.member.member_auth.auth_name || '--'
                    },
                    {
                        name: "收货人",
                        value: data.response.consignee_name || '--'
                    },
                    {
                        name: "联系电话",
                        value: data.response.consignee_mobile || '--'
                    },
                    {
                        name: "收货人身份证",
                        value: data.response.consignee_identity_card || '--'
                    },
                    {
                        name: "收货地址",
                        value: (data.response.delivery_address_province + data.response.delivery_address_city) || '--' 

                    },
                    {
                        name: "详细地址",
                        value: (data.response.delivery_address_district + data.response.delivery_address_detail) || '--'
                    }
                ];
                if(data.response.status == "APPROVE"){
                    that.state = "同意";
                    that.state1 = 1;
                }else if(data.response.status == "REJECT"){
                    that.state = "拒绝";
                    that.state1 = 2;
                }else if(data.response.status == "CUSTOM_EXAMINE_WAIT"){
                    that.state = "审核中";
                    that.state1 = 0;
                }else{
                    that.state = "--";
                };
                //流程进度条
                that.stepData.demandStatus = data.response.status;

                //采购信息
                let purchaseData =  {
                    brandname: data.response.category.name || '--',
                    plane: data.response.brand_name || '--',
                    amount: data.response.purchase_num || '--',
                    priceweb: data.response.quoted_price_website == "XB" ? "西本" : "我的钢铁",
                    business: data.response.supplier_name || '--',
                    businessphone: data.response.supplier_mobile || '--',
                    pricelocal: data.response.reference_address || '--'
                };
                let specifications = JSON.parse(data.response.category_spec);
                purchaseData.type = specifications.category_spec_min + '-' + specifications.category_spec_max;
                purchaseData.dealtype = data.response.pay_description || '--';
                that.tableData.push(purchaseData);

                //选择付款方式
                if(data.response.purchase_demand){
                    let responsePaymentArr ;
                    let supplierPaymentArr ;
                    if(data.response.purchase_demand.total_quote_price){
                        responsePaymentArr = JSON.parse(data.response.purchase_demand.total_quote_price);
                        supplierPaymentArr = responsePaymentArr.zn;
                    }else{
                        supplierPaymentArr = [];

                    }

                    supplierPaymentArr.forEach(function(element, index){
                        let payment = {
                            name: data.response.category.name || '--',
                            productName: data.response.category.name || '--',
                            brand: data.response.brand_name || '--',
                            amount: data.response.purchase_num || '--',
                            priceweb: data.response.quoted_price_website == "XB" ? "西本" : "我的钢铁",
                            pricelocal: data.response.reference_address || '--'
                        }
                        payment.type = specifications.category_spec_min + '-' + specifications.category_spec_max;
                        payment.paymentMode = element;
                        payment.dealPrice = that.signToWords(element.price);
                        payment.description = element.description;
                        that.paymentModeData.push(payment);
                    });
                    //合格单元格
                    that.getSpanArr(that.paymentModeData, that.spanArr, that.pos)
                }

                //联采规则
                that.deadline = data.response.deadline || '--';
                if(data.response.purchase_demand){
                    that.remark = (data.response.purchase_demand.remark) || '--';
                }
                that.purchanseid = data.response.id;
                that.memberids = data.response.member.member_auth.id || '--';
                that.filement = data.response.attachments.map((item)=>{
                    let files={
                        name: item.original_name ||'--',
                        value: item.path || '--',
                    }
                    return files;
                });
            })
        },
        //获取进度
		getStepsData(){
			let that = this;
			let params = {
				token: that.token,
				demand_id: that.id
			}
			that.$api.demandProcess_normal(params, that.id)
				.then(response => {
					let result = response.data;
					if(result.msg_code == 100000){
						let stepsList = result.response.process;
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
						        case '订单已生成':
						            item.icon = 'step-icon iconfont icon-Shapecopy';
						            break;
						        default:
						            item.icon = 'step-icon iconfont icon-dingdan21';
						            break;
						    }
						    //显示状态
						    if(item.status == 'CHECK_REJECT'){
						        item.current_status = 'error';
						    }
						    if(item.status == 'BRANCH_REJECT'){
						    	item.current_status = 'error';
						    }
						    //自定义流程添加icon
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
						    return item
						})
					}else{
						that.$alert(result.message,'提示',{
							confirmButtonText: '知道了',
							callback: action => {
							//todo
							}
						})
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
		//获取操作日志
		getStepsLog(){
			let that = this;
			let params = {
			    token: that.token,
			    demand_id: that.id
			}
			that.stepData.operateData = []; //清空日志
			that.$api.jointLog_normal(params)
				.then(response => {
					let result = response.data;
					if(result.msg_code == 100000){
						let logList = result.response;
						let length = logList.length;
						if(logList.length == 0){ //空数组return
						    return false;
						}
						logList.forEach(function(element, index){
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
						    if(element.demand_status == 'REJECT'){
						    	item.approveStatus = '不通过';
						    }else if(element.demand_status == 'CHECK_REJECT'){
						    	item.approveStatus = '不通过';
						    }else if(element.demand_status == 'BRANCH_REJECT'){
                                item.approveStatus = '不通过';
                            }else if(element.demand_status == 'BRANCH_ACCEPECT'){
						    	item.approveStatus = '已完成';
						    }else{
						    	item.approveStatus = '通过';
						    }
						    that.stepData.operateData.push(item);
						});
						//显示当前状态
						// if(that.stepData.operateData[length - 1].demand_status == 'REJECT'){
						// 	that.stepData.operateData[length - 1].approveStatus = '不通过';
						// }else if(that.stepData.operateData[length - 1].demand_status == 'CHECK_REJECT'){
						// 	that.stepData.operateData[length - 1].approveStatus = '不通过';
						// }else if(that.stepData.operateData[length - 1].demand_status == 'BRANCH_ACCEPECT'){
						// 	that.stepData.operateData[length - 1].approveStatus = '已完成';
						// }
					}else{
						that.$alert(result.message,'提示',{
							confirmButtonText: '知道了',
							callback: action => {
							//todo
							}
						})
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
        //同意并提交需求
        confirmDemand(){
            let that = this;
            let url = that.url_prefix + '/branch/demand/examine/' + that.demand_purchase_id;
            let params = {
                token: that.token,
                status: 'FINISH',
                branch_approve_price: JSON.stringify(that.selectedPaymentModeList)
            };
            if(that.selectedPaymentModeList.length == 0){
                that.$message({
                    message: '请选择付款方式',
                    type: 'warning'
                })
                return
            }
            that.ZN_POST(url,params,function(data){
                that.branchAUditStatus = 'FINISH';
                //更新进度条
                that.getTabData(that.id);
                that.getStepsData();
                that.getStepsLog();
                that.$message({
                    message: '确认成功',
                    type: 'success'
                })
            })
        },
        //驳回
        rejectDemand(){
            let that = this;
            let url = that.url_prefix + '/branch/demand/examine/' + that.demand_purchase_id;
            let params = {
                token: that.token,
                status: 'PRE_FINISH_REJECT'
            };
            that.$prompt('请输入驳回理由：', '驳回订单', {
                confirmButtonText: '提交',
                cancelButtonText: '取消'
            }).then(({value}) => {
                if(!value){
                    that.$message({
                      message: '请输入驳回理由！',
                      type: 'warning'
                    });
                    return
                }
                params.branch_reject_reason = value;
                that.ZN_POST(url,params,function(data){
                    that.branchAUditStatus = 'PRE_FINISH_REJECT';
                    //更新进度条
                    that.getTabData(that.id);
                    that.getStepsData();
                    that.getStepsLog();
                    that.$message({
                        message: '提交成功',
                        type: 'success'
                    })
                })
            }).catch(error => {
                console.log(error);
            })
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
        //合并单元格-列
        SpanMethod({ row, column, rowIndex, columnIndex }){
            if(columnIndex != 6 && columnIndex != 7){
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return{
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
    },
    mounted(){
        this.getAuthority();
    },
    created(){
        let that = this;
        let id = that.$route.params.id;
        that.id = id;
        that.token = that.$cookies.get("ZL_token");
        that.getUserInfo();
        that.getTabData(id);
        that.getStepsData();
        that.getStepsLog();
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
                padding: .5%;
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
            }
        .payment-mode-div{
            .subtitle{
                width: 100%;
                height: 30px;
                line-height: 30px;
                text-align: left;
                color: #0576db;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 0;
                padding-left: 1%;
            }
        }
        .operate-div{
            margin-top: 30px;
        }
    }
</style>
