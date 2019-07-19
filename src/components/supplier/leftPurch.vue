<template>
    <div>
        <div @click="logoToMain" class="loginImage"></div>

        <el-col >
            <!-- :span="12" -->
            <!-- <h5>自定义颜色</h5> -->
            <el-menu :default-active="indexN">
                <el-menu-item index="1" @click=herf(1)>
                    <i class="iconfont icon-shouye"></i>
                    <span slot="title">我的筑牛</span>
                </el-menu-item>
                <el-menu-item index="2"  @click=herf(2)>
                    <i class="iconfont icon-dingdan"></i>
                    <span slot="title">我的联采报价</span>
                </el-menu-item>
                <el-menu-item index="3" @click=herf(3)>
                    <i class="iconfont icon-dingdan2"></i>
                    <span slot="title">我的订单</span>
                </el-menu-item>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="iconfont icon-wenjianjia"></i>
                        <span>我的账户</span>
                    </template>
                    <el-menu-item-group >
                        <el-menu-item index="5"  @click=herf(5)>
                            <i class="iconfont icon-wenjianjia-copy"></i>
                            <span>我的账户</span>
                        </el-menu-item>
                        <el-menu-item index="6"  @click=herf(6)>
                            <i class="iconfont icon-jiaoyijilu"></i>
                            <span>交易记录</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="16" @click=herf(16)>
                    <i class="iconfont icon-jiage"></i>
                    <span slot="title">收款信息列表</span>
                </el-menu-item>
                <el-menu-item index="15"  @click=herf(15)>
                    <i class="iconfont icon-jiage"></i>
                    <span>账户信息</span>
                </el-menu-item>
                <el-submenu  index="7">
                    <template slot="title"  >
                        <i class="icon-shezhi iconfont"></i>
                        <span>系统设置</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="8"  @click=herf(8)>
                            <i class="iconfont icon-shimingrenzheng"></i>
                            <span>实名认证</span>
                        </el-menu-item>
                        <el-menu-item index="9"  @click=herf(9)>
                            <i class="iconfont icon-logo"></i>
                            <span>LOGO设置</span>
                        </el-menu-item>
                        <el-menu-item index="11"  @click=herf(11)>
                            <i class="iconfont icon-mimaxiugai"></i>
                            <span>密码修改</span>
                        </el-menu-item>
                        <el-menu-item index="12"  @click=herf(12)>
                            <i class="iconfont icon-shoujihao"></i>
                            <span>注册手机号修改</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="13"  @click=herf(13)>
                    <i class="iconfont icon-xiaoxi1"></i>
                    <span slot="title">消息中心</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </div>
</template>

<script>
    export default {
        name: "left-purch",
        data(){
            return {
                indexN:'1'
            }
        },
        methods: {
            herf(num){
                let that = this;
                // 1、我的筑牛   2、联采报价  3、订单   5、我的账户  6、交易记录  8、实名认证 9、logo  设置  11  密码修改  12 注册手机   13消息中心
                if(num == 1){
                    that.$router.push({path: '/suppliermy'})
                }else if(num == 2){
                    that.$router.push({path: '/supplieroffer'})
                }else if(num == 3){
                    that.$router.push({path: '/supplierorder'})
                }else if(num == 5){
                    that.$router.push({path: '/supplieraccount'})
                }else if(num == 6){
                    that.$router.push({path: '/supplierrecord'})
                }else if(num == 8){
                    that.$router.push({path: '/suppliername'})
                }else if(num == 9){
                    that.$router.push({path: '/supplierlogo'})
                }else if(num == 11){
                    that.$router.push({path: '/supplierpassword'})
                }else if(num == 12){
                    that.$router.push({path: '/supplierphone'})
                }else if(num == 13) {
                    that.$router.push({path: '/suppliermsg'})
                }else if(num == 15) { //账户信息列表
                    that.$router.push({path: '/supplieraccountinformation'})
                }else if(num == 16){ //收款信息列表
                    that.$router.push({name: 'paymentReceiveList_supplier'})
                }
            },
            //点击logo跳到首页
            logoToMain(){
                window.location.href = 'http://www.zhuniu.com';
            }
        },
        mounted(){
            this.indexN = this.$route.meta.indexN;
        }
    }
</script>

<style lang="less" scoped>
    .loginImage{
        height: 100px;
        background-image: url(../../assets/login.png);
        background-repeat:no-repeat;
        background-size:140px 60px;
        background-position: 25px 20px;
    }
</style>