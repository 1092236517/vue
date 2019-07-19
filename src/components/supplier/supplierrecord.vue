<template>
    <div>
    	<h2>交易记录</h2>
    	<div class="tradeRecordDiv">
    		<el-form ref="form" label-position="left" :model="form" label-width="80px">
    			<el-form-item label="创建时间">
    			  	<el-col :span="4">
    			    	<el-date-picker type="date" placeholder="选择起始日期" v-model="form.start_date" style="width: 100%;"></el-date-picker>
    			  	</el-col>
    			  	<el-col class="line" :span="1">-</el-col>
					<el-col :span="4">
					  <el-date-picker type="date" placeholder="选择截止日期" v-model="form.end_date" style="width: 100%;"></el-date-picker>
					</el-col>
					<el-col :span="9"  class="date-shotcut">
						<span @click="dateShortcut(1)">近一个月 | </span>
						<span @click="dateShortcut(3)">近三个月 | </span>
						<span @click="dateShortcut(6)">近半年 | </span>
						<span @click="dateShortcut(12)">近一年</span>
					</el-col>
    			</el-form-item>
    		    <el-form-item label="类型">
    		      	<el-radio-group v-model="form.type" @change="radioChange">
    		        	<el-radio-button label="1">收入</el-radio-button>
    		        	<el-radio-button label="2">支出</el-radio-button>
    		      	</el-radio-group>
    		    </el-form-item>
    		    <el-form-item label="金额">
    		    	<el-col :span="4">
    		    		<el-input type="input" placeholder="请输入金额" v-model="form.start_price"></el-input>
    		    	</el-col>
    		    	<el-col class="line" :span="1">-</el-col>
    		    	<el-col :span="4">
    		    		<el-input type="input" placeholder="请输入金额" v-model="form.end_price"></el-input>
    		    	</el-col>
    		    </el-form-item>
    		    <el-form-item>
    		      	<el-button type="primary" @click="getList">搜索</el-button>
    		    </el-form-item>
    		</el-form>

    		<div class="listDiv">
    			<div class="incomeDiv">
    				<p>交易记录</p>
    				<ul class="list">
    					<li v-for="(item,index) in orderList" :key="item.id">
    						<span class="time">{{ item.time }}</span><span class="type">{{ item.type }}</span><span class="money">{{ item.money | currency }}</span>
    					</li>
    				</ul>
    				<div class="pageCont" v-if="total>10">
    				    <el-pagination background layout="prev, pager, next" :total="total" :current-page="curPage"  @current-change="goTo"></el-pagination>
    				</div>
    			</div>
    		</div>
    	</div>
    </div>
</template>

<script>
    export default {
        name: "supplieraccount",
        data(){
        	return {
        		form: {
        			type: '1',
        			start_date: '',
        			end_date: '',
        			start_price: '',
        			end_price: ''
        		},
        		curPage: 1,
        		perPage: 10,
        		total: 0,
				orderList: [],
        	}
        },
        methods: {
        	//时间选择快捷方式
        	dateShortcut(months){ //months:月数
        		let start_date = new Date();
        		let end_date = new Date();
                start_date.setMonth(start_date.getMonth() - months);
        		this.form.start_date = start_date;
        		this.form.end_date = end_date;
        	},
            /**
             * 格式化时间
             * @param  {Object} date 时间对象
             * @param  {String} type 'start'|'end'补足时分秒'00:00:00'|'23:59:59'
             * @return {String}      格式化时间字符串'yyyy-MM-dd'
             */
            formatDate(date, type){
                let year = date.getFullYear();
                let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
                let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
                let time = {
                    start: '00:00:00',
                    end: '23:59:59'
                }
                return year + '-' + month + '-' + day + ' ' + (time[type] || '00:00:00');
            },
        	//校验
        	validator(){
        		let reg = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
        		if(this.form.start_price && !reg.test(+this.form.start_price)){
        			this.$message({
        				message: '起始金额输入数字非法！',
        				type: 'warning'
        			});
        			return false
        		}
        		if(this.form.end_price && !reg.test(+this.form.end_price)){
        			this.$message({
        				message: '截止金额输入数字非法！',
        				type: 'warning'
        			});
        			return false
        		}
        		if(parseFloat(this.form.start_price) >parseFloat(this.form.end_price)){
        			this.$message({
        				message: '输入范围有误！',
        				type: 'warning'
        			});
        			return false
        		}
        		return true;
        	},
        	//获取列表
        	getList(){
        		let that = this;
        		let params = {};
        		if(!this.validator()){
        			return false;
        		}
        		params.token = that.token;
        		params.current_page = that.curPage;
        		params.per_page = that.perPage;
        		params.log_type = that.form.type;
        		params.start_date = that.form.start_date ? that.formatDate(that.form.start_date, 'start') : '';
        		params.end_date = that.form.end_date ? that.formatDate(that.form.end_date, 'end') : '';
        		if(that.form.start_price){
        			params.start_price = that.form.start_price;
        		}
        		if(that.form.end_price){
        			params.end_price = that.form.end_price;
        		}
        		that.$http.get('/api/frontend/member/quota/lists',{params})
        			.then(function(response){
        				let result = response.data;
        				if(result.msg_code = 100000){
        					let curList = result.response.data.map((item,index) => {
        						let element = {
        							id: item.id,
        							time: item.created_at,
        							money: item.quota
        						};
        						if(that.form.type == '1'){
        							element.type = '收入';
        						}else{
        							element.type = '支出';
        						};
        						return element;
        					})
        					that.orderList = curList;
        					that.total = result.response.total;
        				}else{
        					that.$alert(result.message , '警告', {
        					    confirmButtonText: '确定',
        					    callback: action => {
        					        // that.canClick = !that.canClick;
        					    }
        				    })
        				}
        			}).catch(function(error){
        				that.$alert(error , '警告', {
        				    confirmButtonText: '确定',
        				    callback: action => {
        				        // that.canClick = !that.canClick;
        				    }
        			    })
        			})
        	},
        	//翻页
        	goTo(currentPage){
				this.curPage = currentPage;
				this.getList();
        	},
            //交易tab切换
            radioChange(){
                //重置当前页数和总数
                this.curPage = 1;
                this.total = 0;
            }
        },
        mounted(){
        	// 设置下token
        	if(!this.$cookies.get("ZL_token")){
        	    this.$router.push({path: '/login'})
        	}else{
        	    this.token = this.$cookies.get("ZL_token");
        	}
        	//获取列表
			this.getList();
        }
    }
</script>

<style lang="less" scoped>
	.tradeRecordDiv{
		.line{
			text-align: center;
		}
		.date-shotcut{
			padding-left: 30px;
			span{
				padding-left: 10px;
				cursor: pointer;
			}
		}
	}
	.listDiv ul,.listDiv li{
		list-style: none;
		padding: 0;
	}
	.listDiv{
		margin-top: 30px;
		.incomeDiv,.expenseDiv{
			border: 1px solid #ccc;
			padding-left: 30px;
			padding-right: 30px;
			li{
				padding-bottom: 10px;
				border-bottom: 1px solid #ccc;
			}
			.time{
				display: inline-block;
				width: 40%;
			}
			.type{
				display: inline-block;
				width: 30%;
			}
			.money{
				display: inline-block;
				width: 30%;
			}
		}
	}
</style>