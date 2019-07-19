<template>
    <div>
        <h2>付款方式管理</h2>
        <el-form :inline="true" :model="paymentForm" class="demo-form-inline">
            <el-form-item label="类型筛选">
                <el-select v-model="paymentForm.mode" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已启用" value="enable"></el-option>
                    <el-option label="已禁用" value="disable"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">筛选</el-button>
            </el-form-item>
            <el-form-item class="addPaymentModeItem" v-show="addBtn">
                <el-button type="primary" @click="addPaymentMode" plain>+ 添加付款方式</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="paymentModeList"
            border
            style="width: 100%">
            <el-table-column
                prop="desc"
                label="付款方式描述">
            </el-table-column>
            <el-table-column
                prop="mode"
                label="价格时间规则">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-show="editBtn" :type="scope.row.type" @click="operate(scope.row)" size="mini">{{ scope.row.status == 'UNVISIBLE' ? '启用' : '禁用' }}</el-button>
                    <el-button v-show="deleteBtn" type="danger" plain @click="deleteMode(scope.row)" size="mini">删除</el-button>
                    <div v-show="noneBtn">--</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageCont">
            <el-pagination background layout="prev, pager, next" :total="total" :currentPage="curPage"  @current-change="goTo"></el-pagination>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                token: '',
                paymentForm: {
                    mode: ''
                },
                paymentModeList: [],
                total: 0,
                curPage: 1,
                url: '/api/frontend/joint_purchase/super',
                //权限按钮
                addBtn:false,
                deleteBtn:false,
                editBtn:false,
                noneBtn:false,
            }
        },
        created(){
            this.token = this.$cookies.get('ZL_token');
            this.getPaymentModeList();
            this.getAuthority();
        },
        methods: {
            //权限按钮
            getAuthority(){
                let that=this;
                if(that.$store.getters.authForGroup.SecondPaymentManagement.transfers.length!=0){
                    that.$store.getters.authForGroup.SecondPaymentManagement.transfers.map(item=>{
                        if(item.power_transfer_name.indexOf('添加付款方式')!=-1){
                            that.addBtn=true;
                        }else if(item.power_transfer_name.indexOf('删除')!=-1){
                            that.deleteBtn=true;
                        }else if(item.power_transfer_name.indexOf('禁用'||'启用')!=-1){
                            that.editBtn=true;
                        }
                    });
                }else{
                    that.noneBtn=true;
                }
            },
            //筛选
            submit(){
                this.curPage = 1;
                this.getPaymentModeList();
            },
            //跳转
            goTo(curPage){
                this.curPage = curPage;
                this.getPaymentModeList();
            },
            //跳转到添加支付方式页面
            addPaymentMode(){
                this.$router.push('/group_super/paymentadd');
            },
            //删除当前支付方式
            deleteMode(item){
                let that = this;
                let url = that.url + '/group/pay_type/del/' + item.id;
                let params = {
                    token: that.token
                }
                that.ZN_POST(url,params,function(data){
                    that.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    that.getPaymentModeList();
                })
            },
            //启用或禁用当前支付方式
            operate(item){
                let that = this;
                let url = that.url + '/group/pay_type/edit/' + item.id;
                let params = {
                    token: that.token
                };
                params.status = item.status == 'VISIBLE' ? 'UNVISIBLE' : 'VISIBLE';
                that.ZN_POST(url,params,function(data){
                    let tip = '';
                    item.status = params.status;
                    if(params.status == 'VISIBLE'){
                        item.type = 'danger';
                        tip = '启用';
                    }else{
                        item.type = 'primary';
                        tip = '禁用';
                    }
                    that.$message({
                        message: tip + '成功',
                        type: 'success'
                    });
                })
            },
            //获取付款方式列表
            getPaymentModeList(){
                let that = this;
                let url = that.url + '/group/pay_type/lists';
                let params = {
                    token: that.token,
                    per_page: 10,
                    current_page: that.curPage,
                };
                if(that.paymentForm.mode == 'enable'){
                    params.status = 'VISIBLE';
                }else if(that.paymentForm.mode == 'disable'){
                    params.status = 'UNVISIBLE';
                }else{
                    params.status = ''
                };
                that.ZN_GET(url,params,function(data){
                    that.total = data.response.total;
                    that.paymentModeList = data.response.data.map(item => {
                        let element = {};
                        element.id = item.id;
                        element.desc = item.description;
                        element.pay_type = item.pay_type;
                        element.point_day = item.point_day;
                        element.status = item.status;
                        element.type = item.status == 'VISIBLE' ? 'danger' : 'primary';
                        if(item.pay_type == 'PAY_IN_DAYS'){
                            element.mode = item.point_day + '天';
                        }else if(item.pay_type == 'DAY_IN_MONTH'){
                            element.mode = '每月' + item.point_day + '日';
                        }else if(item.pay_type == 'PAY_IN_ANYTIME'){
                            element.mode = '随时付款';
                        };
                        return element;
                    });
                })

            }
        }
    }
</script>


<style lang="less" scoped>
    .addPaymentModeItem{
        float: right;
    }
</style>