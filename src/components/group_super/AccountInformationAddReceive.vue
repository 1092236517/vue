<template>
    <div class="add-account-wrapper">
		<h2 class="title">{{ isEdit ? '编辑收款方账户' : '添加收款方账户' }}</h2>
        <div class="content" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.3)">
            <p class="tips">提示：请输入公司账户信息</p>
			<el-form ref="form" label-width="80px" v-model="accountForm">
				<el-form-item label="账户名称">
					<span class="requiredSpan">*</span>
					<el-input v-model.trim="accountForm.account_name" placeholder="请输入账户名称" class="width260"></el-input>
				</el-form-item>
				<el-form-item label="开户行">
					<span class="requiredSpan">*</span>
					<el-select v-model="accountForm.bank_name" placeholder="请输入开户行" class="width260">
						<el-option v-for="(item,index) in bankName" :label="item.bank_name" :value="item.bank_name" :key='index'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="账号">
					<span class="requiredSpan">*</span>
					<el-input v-model.trim="accountForm.account" placeholder="请输入账号" class="width260"></el-input>
				</el-form-item>
				<el-form-item label="城市名称">
				    <span class="requiredSpan">*</span>
				    <el-cascader
				        :options="location_list"
				        @active-item-change="handleLocationItemChange"
				        @change="handleLocationChange"
				        :props="location_props"
				        v-model="accountForm.location"
				        class="width260"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="nomalBtn1" @click="addPayAccount" >添加</el-button>
				</el-form-item>
			</el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
			token: '',
			loading: false,
			isEdit: false,
			id: '',
			bankName: [],
			accountForm: {
				bank_name: '',
				account: '',
				account_name: '',
				location: []
			},
			location_list: [],
			location_props: {
			    label: 'region_name',
			    value: 'id'
			}
        }
	},
	created(){
		this.token = this.$cookies.get("ZL_token");
		this.getbankNameList();
		//初始化省份
		this.getRegionList().then(result => {
		    this.location_list = result.map(item => {
		        return {
		            region_name: item.region_name,
		            id: item.id,
		            children: []
		        }
		    })
		});
		//判断编辑还是新增
		if(this.$route.name == 'groupAccountInformationReceiveEdit_super'){
			this.isEdit = true;
			this.id = this.$route.params.id;
			this.getAccountDetail(this.id);
		}
	},
	methods:{
		//新增或者编辑支付账户
		addPayAccount(){
			let that = this;
			let params = {
				token: that.token,
				bank_name: that.accountForm.bank_name,
				account: that.accountForm.account,
				account_name: that.accountForm.account_name,
				type:'group',
				address_province_id: that.accountForm.location[0],
				address_city_id: that.accountForm.location[1],
				account_type: 'ACCOUNT_RECEIVE'
			};
			if(that.validator()){
				that.$message({
					message: '您有未填项',
					type: 'warning'
				})
				return false
			}
			if(that.isEdit){
				that.$api.bank_accountEdit(params, that.id).then(response => {
					if(response.data.msg_code === 100000){
						that.$message({
						    message: '修改成功',
						    type: 'success'
						});
						that.$router.push({name: 'groupAccountInformationReceive_super'});
					}else{
						that.$alert(response.data.message , '提示', {
							confirmButtonText: '确定',
							callback: action => {
							}
						});
					}
				}).catch(error=>{
					console.log(error);
				})
			}else{
				that.$api.bank_accountAdd(params).then(response => {
					if(response.data.msg_code===100000){
						that.$message({
						    message: '创建成功',
						    type: 'success'
						});
						that.$router.push({name: 'groupAccountInformationReceive_super'});
					}else{
						that.$alert(response.data.message , '提示', {
							confirmButtonText: '确定',
							callback: action => {
							}
						});
					}
				}).catch(error=>{
					console.log(error);
				})
			}
		},
		//获取银行列表
		getbankNameList(){
			let that = this;
			let params = {
				token :that.token,
				type: 'group',
			};
			that.$api.bank_nameList(params).then(response => {
				if(response.data.msg_code === 100000){
					that.bankName = response.data.response;
				}else{
					that.$alert(response.data.message , '提示', {
						confirmButtonText: '确定',
						callback: action => {
						}
					});
				}
			}).catch(error=>{
				console.log(error)
			})
		},
		//校验表单
		validator(){
			return Object.keys(this.accountForm).some(key => {
				return !this.accountForm[key]
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
		/**
		 * 获取账户信息
		 * @param  {Number} id 账户id
		 */
		async getAccountDetail(id){
			let that = this;
			that.loading = true;
			let params = {token: that.token};
			let {data} = await that.$api.bank_accountDetail(params, id);
			let provinceId = data.response.address_province_id;
			let cityId = data.response.address_city_id;
			let provinceIndex = that.location_list.findIndex(item => item.id == provinceId);
			that.location_list[provinceIndex]['children'] = await that.getRegionList(provinceId);
			this.accountForm = {
				bank_name: data.response.bank_name,
				account: data.response.account,
				account_name: data.response.account_name,
				location: [provinceId, cityId]
			};
			that.loading = false;
		}
	}
}
</script>

<style lang='less' scoped>
    .add-account-wrapper{
    	.title{
    		margin-top: 0;
    		margin-bottom: 10px;
    	}
		.content{
			background: #fff;
			padding: 0 20px 30px 0;
			.width260{
				width: 260px;
			}
            .tips{
                font-size: 12px;
                font-weight: 400;
                color: #999;
            }
		}
	}
</style>
