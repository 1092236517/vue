<template>
    <div>
        <h2>添加付款方式</h2>
        <el-container>
            <el-aside width="60%">
                <p class="subtitle">付款方式描述</p>
                <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="content">
                </el-input>
                <div class="dateRadioDiv">
                    <p class="subtitle">时间选择</p>
                    <el-row class="dateRadioItem">
                        <el-col :span="6">
                            <el-radio v-model="dateRadio" label="PAY_IN_DAYS">货到工地日</el-radio>
                        </el-col>
                        <el-col :span="6">
                            <input class="dateInput" v-model="delayDays"/>天付款
                        </el-col>
                    </el-row>
                    <el-row class="dateRadioItem">
                        <el-col :span="6">
                            <el-radio v-model="dateRadio" label="DAY_IN_MONTH">每月付款日期</el-radio>
                        </el-col>
                        <el-col :span="6">
                            <input class="dateInput" v-model="payDate"/>日
                        </el-col>
                    </el-row>
                    </el-row>
                    <el-row class="dateRadioItem">
                        <el-col :span="12">
                            <el-radio v-model="dateRadio" label="PAY_IN_ANYTIME">其他（先发货后付款，支付日期不定）</el-radio>
                        </el-col>
                    </el-row>
                </div>
                <el-button type="primary" @click="submit">添加</el-button>
            </el-aside>
            <!-- <el-main>
                <div class="example" :class="{fold: exampleFold}">
                    <p>流程中显示A：（简洁）</p>
                    <p>
                        A:需方每批先付定货款，供方后发货；每批货价格按款到账日“我的钢铁网（扬州市建筑钢材价格行情）”指定范围内同厂家同规格下浮100元/吨。
                        说明/备注：（由联采部对应合同条款，编辑进去）
                        且遇网价涨价时不涨，遇降价时按款到账日“我的钢铁网（扬州市建筑钢材价格行情）”指定范围内同厂家同规格下浮100元/吨。若“我的钢铁网（扬州市建筑钢材价格行情）”一天内有多次报价时，以网站当日同厂家同规格多次报价平均数为准。若遇星期六、星期日，则按本周五价格执行；若款到账日该网站无报价，则以每批款到账日前最后一次价格为主。
                    </p>
                    <p>流程中显示B：（简洁）</p>
                    <p>
                        B：每月10日，付清上月产生的所有货款；价格按货到工地日“我的钢铁网（扬州市建筑钢材价格行情）”指定范围内同厂家同规格下浮30元/吨。
                        说明/备注：（由联采部对应合同条款，编辑进去）
                        若“我的钢铁网（扬州市建筑钢材价格行情）”一天内有多次报价时，以网站当日同厂家同规格多次报价平均数为准。若遇星期六、星期日，则按本周五价格执行；若货到工地日该网站无报价，则以每批货到工地日前最后一次价格为主。
                        流程中显示C：（简洁）
                    </p>
                    <p>
                        C:每批货到工地日， 每90天付清该批货款；价格按货到工地日“我的钢铁网（扬州市建筑钢材价格行情）”指定范围内同厂家同规格上浮80元/吨。
                        说明/备注：（由联采部对应合同条款，编辑进去）
                        若“我的钢铁网（扬州市建筑钢材价格行情）”一天内有多次报价时，以网站当日同厂家同规格多次报价平均数为准。若遇星期六、星期日，则按本周五价格执行；若货到工地日该网站无报价，则以每批货到工地日前最后一次价格为主。
                    </p>
                    <p>D:自定义</p>
                    <div class="fold-btn-div" :class="{'unfold-btn-div': unfoldBtnDiv}">
                        <el-button type="text" @click="showExample">{{ exampleFold ? '更多详情' : '收起' }}</el-button>
                    </div>
                </div>
            </el-main> -->
        </el-container>

    </div>
</template>

<script>
    export default{
        data(){
            return {
                token: '',
                content: '',
                dateRadio: 'PAY_IN_DAYS',
                delayDays: '',
                payDate: '',
                payAnytime: '0',
                exampleFold: true,
                unfoldBtnDiv: false,
                url: '/api/frontend/joint_purchase/super'
            }
        },
        created(){
            this.token = this.$cookies.get('ZL_token');
        },
        methods: {
            submit(){
                let that = this;
                let url = that.url + '/group/pay_type/add';
                let params = {
                    token: that.token,
                    description: that.content,
                    pay_type: that.dateRadio
                };
                let paymentMode = {
                    'PAY_IN_DAYS': that.delayDays,
                    'DAY_IN_MONTH': that.payDate,
                    'PAY_IN_ANYTIME': that.payAnytime
                }
                if(!that.content){
                    that.$message({
                        message: '请输入付款方式',
                        type: 'warning'
                    });
                    return false;
                }
                if(!paymentMode[that.dateRadio]){
                    that.$message({
                        message: '请输入天数',
                        type: 'warning'
                    });
                    return false;
                }
                params.point_day = paymentMode[that.dateRadio];
                that.ZN_POST(url, params, function(data){
                    that.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                })
            },
            showExample(){
                this.exampleFold = !this.exampleFold;
                this.unfoldBtnDiv = !this.unfoldBtnDiv;
            }
        }
    }
</script>


<style lang="less" scoped>
    .subtitle{
        font-size: 16px;
        color: #333;
        font-weight: bold;
    }
    .example{
        position: relative;
        margin-left: 20px;
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
    .dateRadioDiv{
        margin-bottom: 30px;
        font-size: 14px;
    }
    .dateRadioItem{
        padding-bottom: 15px;
    }
    .dateInput{
        width: 60px;
        border-radius: 5px;
        outline: 0;
        border: 1px solid #999;
        margin-right: 10px;
    }
</style>