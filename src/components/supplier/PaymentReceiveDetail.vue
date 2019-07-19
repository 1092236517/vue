<template>
	<div class="payment-detail"
		v-loading="loading"
		element-loading-background="rgba(255, 255, 255, 0.8)">
		<h2 class="title">账户详情</h2>
		<div class="item-div">
			<span class="title">付款时间：</span>
			<el-input class="desc-input" v-model="pay_time" :disabled="disabled"></el-input>
		</div>
		<div class="item-wrapper">
			<div class="item-div">
				<span class="title">项目名称：</span>
				<el-input class="desc-input" v-model="project_name" :disabled="disabled"></el-input>
			</div>
			<div class="item-div">
				<span class="title">产品名称：</span>
				<el-input class="desc-input" v-model="product_name" :disabled="disabled"></el-input>
			</div>
			<div class="item-div">
				<span class="title">批次订单号：</span>
				<el-input class="desc-input" v-model="slave_order_code" :disabled="disabled"></el-input>
			</div>
		</div>
		<div class="item-div">
			<span class="title">付款单编号：</span>
			<el-input class="desc-input" v-model="payment_number" :disabled="disabled"></el-input>
		</div>
		<div class="item-div">
			<span class="title">交易流水号：</span>
			<el-input class="desc-input" v-model="batch_number" :disabled="disabled"></el-input>
		</div>
		<div class="item-div">
			<span class="title">收款人编号：</span>
			<el-input class="desc-input" v-model="receive_compony_code" :disabled="disabled"></el-input>
		</div>
		<div class="item-wrapper">
			<div class="item-div">
				<span class="title">付款账户名称：</span>
				<el-input class="desc-input" v-model="payer_name" :disabled="disabled"></el-input>
			</div>
			<div class="item-div">
				<span class="title">银行名称：</span>
				<el-input class="desc-input" v-model="payer_bank_name" :disabled="disabled"></el-input>
			</div>
			<div class="item-div">
				<span class="title">付款方账号：</span>
				<el-input class="desc-input" v-model="payer_account" :disabled="disabled"></el-input>
			</div>
		</div>
		<div class="item-div">
			<span class="title">加急程度：</span>
			<el-input class="desc-input" v-model="is_urgent" :disabled="disabled"></el-input>
		</div>
		<div class="item-wrapper">
			<div class="item-div">
				<span class="title">收款账户名称：</span>
				<el-input class="desc-input" v-model="payee_name" :disabled="disabled"></el-input>
			</div>
			<div class="item-div">
				<span class="title">银行名称：</span>
				<el-input class="desc-input" v-model="payee_bank_name" :disabled="disabled"></el-input>
			</div>
			<div class="item-div">
				<span class="title">收款方账号：</span>
				<el-input class="desc-input" v-model="payee_account" :disabled="disabled"></el-input>
			</div>
		</div>
		<div class="item-div">
			<span class="title">城市名称：</span>
			<el-input class="desc-input" v-model="location" :disabled="disabled"></el-input>
		</div>
		<div class="item-div">
			<span class="title">对公对私业务：</span>
			<el-input class="desc-input" v-model="is_to_company" :disabled="disabled"></el-input>
		</div>
		<div class="item-div">
			<span class="title">金额（元）：</span>
			<el-input class="desc-input" v-model="money" :disabled="disabled"></el-input>
		</div>
		<div class="item-div">
			<span class="title" style="vertical-align: top;">备注：</span>
			<el-input
				type="textarea"
				class="desc-input"
				style="width: 500px;"
				v-model="remark"
				:disabled="disabled"
				:autosize="{minRows: 3}"
				resize="none"></el-input>
		</div>
		<div class="item-div">
			<span class="title" style="vertical-align: top;">附件：</span>
			<div class="attachment-wrapper">
				<ul class="attachment-ul">
					<li v-for="(item, index) in attachments" :key="item.id">
						<p class="attachment-name">
							<span>{{ index + 1 }}、</span>
							{{ item.name }}
						</p>
						<div class="img-div" v-if="item.isImg">
							<img :src="item.url" alt="附件" @click="imgPreview(item.url)" title="点击预览">
						</div>
					</li>
				</ul>
				<!-- 图片弹框预览 -->
				<el-dialog title="图片预览" :visible.sync="imgVisible" width="60%" append-to-body>
				    <div><img :src='imgurl' style="margin: 0 auto;display: inherit;width: 100%"/></div>
				</el-dialog>
			</div>
		</div>
		<div class="button-div">
			<el-button class="cancel-btn" type="primary" plain @click="goToPaymentList">返回</el-button>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'PaymentReceiveDetail_supplier',
		data(){
			return {
				loading: false,
				token: '',
				disabled: true,
				id: '',
				slave_order_id: '',
				status: '',
				bank_payment_desc: '',
				pay_time: '',
				project_name: '',
				product_name: '',
				slave_order_code: '',
				payment_number: '',
				batch_number: '', //交易流水号
				receive_compony_code: '', //收款人编号
				payer_name: '',
				payer_bank_name: '',
				payer_account: '',
				is_urgent: '',
				payee_name: '',
				payee_bank_name: '',
				payee_account: '',
				location: '',
				is_to_company: '',
				money: '',
				remark: '',
				attachments: [],
				imgVisible: false,
				imgurl: ''
			}
		},
		created(){
			this.token = this.$cookies.get("ZL_token");
			this.id = this.$route.params.id;
			this.slave_order_id = this.$route.query.slave_order_id;
			this.getDetail(this.id);
		},
		methods: {
			//获取支付订单详情
			getDetail(id){
				let that = this;
				let params = {token: that.token};
				const imgReg = /\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/i;
				that.loading = true;
				that.$api.paymentReceiveDetail_supplier(params, id)
					.then(response => {
						let result = response.data;
						let paymentData = result.response.payInfo;
						that.loading = false;
						if(result.msg_code == 100000){
							that.status = paymentData.status || '-';
							that.bank_payment_desc = paymentData.bank_payment_desc || '-';
							that.pay_time = paymentData.pay_time || '-';
							that.project_name = paymentData.project_name || '-';
							that.product_name = paymentData.product_name || '-';
							that.slave_order_code = paymentData.slave_order_code || '-';
							that.payment_number = paymentData.payment_number || '-';
							that.batch_number = paymentData.batch_number || '-'; //交易流水号
							that.payer_name = paymentData.payer_name || '-';
							that.payer_bank_name = paymentData.payer_bank_name || '-';
							that.payer_account = paymentData.payer_account || '-';
							that.is_urgent = paymentData.is_urgent == 'PAY_URGENTLY' ? '加急' : '普通';
							that.payee_name = paymentData.payee_name || '-';
							that.payee_bank_name = paymentData.payee_bank_name || '-';
							that.location = paymentData.address_province + paymentData.address_city;
							that.is_to_company = paymentData.is_to_company == 'TO_COMPANY' ? '对公业务' : '对私业务';
							that.money = paymentData.money || '-';
							that.remark = paymentData.remark || '-';
							that.receive_compony_code = paymentData.receive_compony_code || '-'; //收款人编号
							that.payee_account = paymentData.payee_account || '-';
							that.attachments = paymentData.attachments.map(item => { //附件
								return {
									name: item.original_name,
									url: item.path,
									isImg: imgReg.test(item.original_name)
								}
							})
						}else{
							that.$alert(result.message, '提示', {
								confirmButtonText: '知道了',
								callback: action => {
									//todo
								}
							})
						}
					}).catch(error => {
						that.loading = false;
			            console.log(error);
			            that.$alert(error, '提示', {
			                confirmButtonText: '知道了',
			                callback: action => {
			                    //todo
			                }
			            })
			        })
			},
			//图片预览
			imgPreview(url){
				this.imgurl = url;
				this.imgVisible = true;
			},
			//返回到支付列表页
			goToPaymentList(){
				this.$router.push({name: 'paymentReceiveList_supplier'})
			}
		}
	}
</script>

<style>
	.payment-detail .el-input__inner{
		height: 32px;
		line-height: 32px;
	}
</style>
<style lang="less" scoped>
	@color: #0576DB;
	.payment-detail{
		.title{
			color: @color;
			margin: 0;
		}
		.item-wrapper{
			display: flex;
			flex-wrap: wrap;
		}
		.item-div{
			font-size: 16px;
			margin-top: 20px;
			.title{
				display: inline-block;
				color: #333;
				width: 120px;
				text-align: right;
				padding-right: 10px;
			}
			.desc{
				color: #666;
			}
			.desc-input{
				width: 200px;
			}
			.payment-wait{
				color: @color;
			}
			.payment-success{
				color: #05DB79;
			}
			.payment-error{
				color: #FF0000;
			}
			.payment-default{
				color: #999;
			}
			.attachment-ul,.attachment-ul li{
				list-style: none;
			}
			.attachment-wrapper{
				display: inline-block;
				width: 80%;
				max-width: 500px;
			}
			.attachment-ul{
				padding-left: 0;
			}
			.attachment-ul .img-div{
				width: 100px;
			}
			.attachment-name{
				font-size: 12px;
				line-height: 24px;
				padding-left: 10px;
				padding-right: 10px;
				margin-top: 0;
				color: #999;
			}
			.img-div{
				padding-left: 30px;
				cursor: pointer;
			}
			.img-div img{
				width: 100%;
			}
		}
		.button-div{
			width: 400px;
			text-align: center;
			margin-top: 30px;
			.cancel-btn, .confirm-btn{
				width: 90px;
				height: 30px;
				line-height: 30px;
				padding: 0;
			}
		}
	}
</style>