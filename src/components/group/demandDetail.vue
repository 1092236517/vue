<template>
	<div>
		<div class="step-bar-div">
			<stepBar :stepData="stepData" />
		</div>
		<h2>联采需求详情</h2>
		<div class="headC">{{ demand.supplier_name }}<span>联采单号：{{ demand.orderNum }}</span><span>发布时间：{{ demand.updated_at }}</span></div>
		<el-table :data="demandData" style="width: 100%">
		    <el-table-column fixed prop="demand_status" label="订单状态"></el-table-column>
		    <el-table-column fixed prop="project_name" label="项目名称"></el-table-column>
		    <el-table-column fixed prop="order_no" label="项目编码"></el-table-column>
		    <el-table-column fixed prop="address" label="收货地址"></el-table-column>
		    <el-table-column fixed prop="detial_address" label="详细地址"></el-table-column>
		    <el-table-column fixed prop="resiver" label="收货人"></el-table-column>
		    <el-table-column fixed prop="resiver_phone" label="收货人联系电话"></el-table-column>
		    <el-table-column fixed prop="resiver_card" label="收货人身份证"></el-table-column>
		</el-table>
		<el-table :data="orderData" :span-method="SpanMethod" border style="width: 100%">
		    <el-table-column fixed prop="name" label="产品名"></el-table-column>
		    <el-table-column fixed prop="brandname" label="品牌"></el-table-column>
		    <el-table-column fixed prop="spec" label="规格"></el-table-column>
		    <el-table-column fixed prop="amount" label="数量"></el-table-column>
		    <el-table-column fixed prop="supplier" label="推荐供应商"></el-table-column>
		    <el-table-column fixed prop="dealtype" label="付款方式"></el-table-column>
		    <!-- <el-table-column fixed prop="price" label="期望成交价"></el-table-column> -->
		    <el-table-column fixed prop="supplierphon" label="推荐供应商电话"></el-table-column>
		</el-table>
		<div class="headC" style="margin-bottom:0;">联采规则</div>
		<div class="cont">
		    <div class="conts">供应商报价截止时间：{{demand.dealLine}}</div>
		    <div class="conts">发票要求：增值税发票</div>
		    <div class="conts">联采说明：{{demand.remark}}</div>
		</div>
		<div class="btns-div">
		    <div class="nomalBtn1 tabelBtn" v-if="demand.currentBtn" @click="accountingApprove()" v-show="agreeBtn">同意</div>
		    <div class="nomalBtn1 tabelBtn" v-if="demand.currentBtn" @click="accountingReject()" v-show="disagreeBtn">驳回</div>
		</div>
		<!-- 成本部同意 -->
		<el-dialog title="同意" :visible.sync="accountingApproveDialog" width="50%" center>
		    <el-form :model="accountingApproveForm" label-width="150px" class="textareaLabel">
		        <el-form-item label="报价截止时间">
		            <el-date-picker v-model="accountingApproveForm.deadline" type="datetime" value-format= 'yyyy-MM-dd HH:mm:ss' placeholder="选择日期时间"></el-date-picker>
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
		<!-- 核算部拒绝原因 -->
		<el-dialog title="驳回" :visible.sync="accountingRejectDialog" width="50%" center>
		    <el-form :model="accountingRejectForm">
		        <el-form-item>
		            <el-input placeholder="请输入驳回原因" type="textarea" v-model="accountingRejectForm.reject_reason" :rows="8"></el-input>
		        </el-form-item>
		    </el-form>
		    <span slot="footer" class="dialog-footer">
		        <el-button @click="accountingRejectDialog = false">取 消</el-button>
		        <el-button type="primary" @click="accountingRejectConfirm">确 定</el-button>
		    </span>
		</el-dialog>
	</div>
</template>

<script>
	import stepBar from '@/components/public/stepBar'
	export default{
		data(){
			return {
				token: '',
				id: '',
				demand: {},
				demandData: [],
				orderData: [],
				stepData: {
					curStep: 0,
					steps: [],
					operateData: [],
					demandStatus: ''
				},
				accountingFileList: [],
				accountingApproveDialog: false,
				accountingApproveForm: {
					id: '',
					deadline: '',
					remark: '',
					attachments: []
				},
				accountingRejectDialog: false,
				accountingRejectForm: {
					reject_reason: '',
					id: ''
				},
				agreeBtn:false,
				disagreeBtn:false
			}
		},
		components: {
			stepBar
		},
		methods: {
			//权限按钮
            getAuthority(){
				let that = this;
                that.$store.getters.authForGroup.NormalJointPurchaseDemandList.transfers.map(item => {
					if(item.power_transfer_name.indexOf('审核') != -1){
                        that.agreeBtn = true;
                    }else if(item.power_transfer_name.indexOf('驳回') != -1){
                        that.disagreeBtn = true;
                    }
				});
            },
			//联采需求详情
			getDetail(id){
				let that = this;
				let params = {
					token: that.token
				};
				that.$api.demandDetail_normal(params,id).then(response => {
					let result = response.data;
					if(result.msg_code == 100000){
						that.demand.supplier_name = result.response.supplier_name;
						if(result.response.purchase_demand){
						    that.demand.orderNum = !result.response.purchase_demand.order_no ? "--" : result.response.purchase_demand.order_no;
						}else{
						    that.demand.orderNum= '--';
						}
						that.demand.updated_at = result.response.updated_at;
						that.demand.status = result.response.status;
						let arr = result.response;
						let status = "";
						if(arr.status == "REJECT" ){
						    status = "已驳回"
						}else if(arr.status == "APPROVE"){
						    status = "已完成"
						}else if(arr.status == "PENDING"){
						    status = "待审核"
						}else{
						    status = "--"
						};
						that.demandData=[{
						    demand_status: status,
						    project_name: arr.project_name,
						    order_no: arr.project_code || '--',
						    address: arr.delivery_address_province+arr.delivery_address_city,
						    detial_address: arr.delivery_address_district+arr.delivery_address_detail,
						    resiver: arr.consignee_name,
						    resiver_phone: arr.consignee_mobile,
						    resiver_card: arr.consignee_identity_card,
						}];
						let itemData = {
						    name:arr.category.name,
						    brandname:arr.brand_name,
						    spec:"",
						    amount:arr.purchase_num,
						    supplier:arr.supplier_name,
						    dealtype:"",
						    price:"",
						    supplierphon:arr.supplier_mobile,
						};
						let spec = JSON.parse(arr.category_spec);
						itemData.spec = spec.category_spec_min + "--" + spec.category_spec_max;
						itemData.dealtype = arr.pay_description;
						//itemData.price = priceArr[items];
						that.orderData.push(itemData);
						that.demand.dealLine = arr.deadline;
						that.demand.remark = arr.remark;
						that.demand.records = arr.records;
						that.demand.currentBtn = null;
						that.detailDialogVisible = true;
						that.accountingApproveForm.deadline = result.response.deadline;
						that.stepData.demandStatus = arr.status;
						//流程审核中的按钮及状态显示
						if(arr.status == 'CUSTOM_EXAMINE_WAIT'){
						    that.demand.custom_status = that.showAuditStatus(arr.records);
						    if(that.showFlowsAuditBtn(arr.records).length > 0){
						        that.demand.currentBtn = that.showFlowsAuditBtn(arr.records)[0];
						    }
						}
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
			//合并列
			SpanMethod({row,column,rowIndex,columnIndex}){
			    if(columnIndex!=5&&columnIndex!=6){
			        if(rowIndex%3===0){
			            return{
			                rowspan:3,
			                colspan:1,
			            }
			        }else{
			            return{
			                rowspan:0,
			                colspan:0,
			            }
			        }
			    }
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
			//删除附件
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
			//成本部同意
			accountingApprove(){ //弹框
				this.accountingApproveForm.id = this.id;
				this.accountingApproveDialog = true;
			},
			accountingApproveConfirm(){ //确认
			    let that = this;
			    let params = {
			        token: that.token,
			        status: 'APPROVE',
			        remark: that.accountingApproveForm.remark,
			        attachments: that.accountingApproveForm.attachments,
			        deadline: that.accountingApproveForm.deadline
			    };
			    that.$api.customExamine_normal(params, that.id, that.demand.currentBtn.id)
			    	.then(response => {
			    		let result = response.data;
			    		if(result.msg_code == 100000){
			    			that.accountingApproveDialog = false;
			    			that.$message({
			    				message: '操作成功',
			    				type: 'success'
			    			})
			    			that.getDetail(that.id);
			    			this.getStepsData();
			    			this.getStepsLog();
			    		}else{
			    			that.$message({
			    				message: `操作失败。错误信息：${result.message}`,
			    				type: 'warning'
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
			//成本部拒绝
			accountingReject(){ //弹框
				this.accountingRejectDialog = true;
				this.accountingRejectForm.id = this.id;
			},
			accountingRejectConfirm(){ //驳回
				let that = this;
				if (!that.accountingRejectForm.reject_reason){
				    that.$alert('请填写驳回原因', '提示', {
				    	confirmButtonText: '确定',
				    	callback: action => {
				    		//todo
				    	}
				    });
				    return false;
				};
				let params = {
				    'token': that.token,
				    'status': 'REJECT',
				    'reject_reason': that.accountingRejectForm.reject_reason
				};
				that.$api.customExamine_normal(params, that.id, that.demand.currentBtn.id)
					.then(response => {
						let result = response.data;
						if(result.msg_code == 100000){
							that.accountingRejectDialog = false;
							that.$message({
								message: '操作成功',
								type: 'success'
							})
							that.getDetail(that.id);
							this.getStepsData();
							this.getStepsLog();
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
			this.getAuthority();
		},
		created(){
			this.token = this.$cookies.get("ZL_token");
			this.id = this.$route.params.id;
			this.getDetail(this.$route.params.id);
			this.getStepsData();
			this.getStepsLog();
		}
	}
</script>

<style lang="less" scoped>
    .nomalBtn1.tabelBtn{
        width: 80px;
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
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
    .step-bar-div{
    	margin-bottom: 30px;
    }
    .btns-div{
    	margin-top: 50px;
    	text-align: center;
    }
</style>