<template>
    <div>
        <div @click="logoToMain" class="loginImage">
            江苏省江建集团有限公司
        </div>

        <el-col >
            <el-menu :default-active="indexN">
                <el-menu-item index="1" @click=herf(1)>
                    <i class="iconfont icon-shouye"></i>
                    <span slot="title">我的筑牛</span>
                </el-menu-item>
                <el-submenu  index="2">
                    <template slot="title" >
                        <i class="iconfont icon-renyuanguanli"></i>
                        <span>联采中心</span>
                    </template>
                    <el-menu-item-group >
                        <el-menu-item index="21"  @click=herf(21)>
                            <span slot="title">联采需求列表</span>
                        </el-menu-item>
                        <el-menu-item index="22"  @click=herf(22)>
                            <span slot="title">联采单列表</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="14" @click=herf(14)>
                    <i class="iconfont icon-dingdan2"></i>
                    <span slot="title">订单列表</span>
                </el-menu-item>
                <el-menu-item index="15" @click=herf(15)>
                    <i class="iconfont icon-loufang"></i>
                    <span slot="title">我的分公司</span>
                </el-menu-item>
                <el-submenu  index="13">
                    <template slot="title" >
                        <i class="iconfont icon-wenjianjia"></i>
                        <span>我的账户</span>
                    </template>
                    <el-menu-item-group >
                        <el-menu-item index="4"  @click=herf(4)>
                            <i class="iconfont icon-wenjianjia-copy"></i>
                            <span>我的账户</span>
                        </el-menu-item>
                        <el-menu-item index="5"  @click=herf(5)>
                            <i class="iconfont icon-jiaoyijilu"></i>
                            <span>交易记录</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu  index="12">
                    <template slot="title"  >
                        <i class="iconfont icon-shezhi"></i>
                        <span>系统设置</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="6"  @click=herf(6)>
                            <i class="iconfont icon-shimingrenzheng"></i>
                            <span>实名认证</span>
                        </el-menu-item>
                        <el-menu-item index="7"  @click=herf(7)>
                            <i class="iconfont icon-logo"></i>
                            <span>LOGO设置</span>
                        </el-menu-item>
                        <el-menu-item index="8"  @click=herf(8)>
                            <i class="iconfont icon-zhanghao"></i>
                            <span>多账号设置</span>
                        </el-menu-item>
                        <el-menu-item index="9"  @click=herf(9)>
                            <i class="iconfont icon-mimaxiugai"></i>
                            <span>密码修改</span>
                        </el-menu-item>
                        <el-menu-item index="10"  @click=herf(10)>
                            <i class="iconfont icon-shoujihao"></i>
                            <span>注册手机号修改</span>
                        </el-menu-item>
                        <el-menu-item index="23"  @click=herf(23)>
                            <i class="iconfont icon-shoujihao"></i>
                            <span>角色管理</span>
                        </el-menu-item>
                        <el-menu-item index="24"  @click=herf(24)>
                            <i class="iconfont icon-shoujihao"></i>
                            <span>组列表</span>
                        </el-menu-item>
                        <el-menu-item index="25"  @click=herf(25)>
                            <i class="iconfont icon-shoujihao"></i>
                            <span>流程列表</span>
                        </el-menu-item>
                        <el-menu-item index="26"  @click=herf(26)>
                            <i class="iconfont icon-shoujihao"></i>
                            <span>管理流程</span>
                        </el-menu-item>
                        <el-menu-item index="27"  @click=herf(27)>
                            <i class="iconfont icon-shoujihao"></i>
                            <span>管理日志</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="11"  @click=herf(11)>
                    <i class="iconfont icon-xiaoxi1"></i>
                    <span slot="title">消息中心</span>
                </el-menu-item>
                <el-submenu  index="16">
                    <template slot="title" >
                        <i class="iconfont icon-shujuzhanshi2"></i>
                        <span>联采数据</span>
                    </template>
                    <el-menu-item-group >
                        <el-menu-item index="17"  @click=herf(17)>
                            <span>联采数据汇总</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu  index="18">
                    <template slot="title" >
                        <i class="iconfont icon-fukuanfangshisel"></i>
                        <span>付款方式管理</span>
                    </template>
                    <el-menu-item-group >
                        <el-menu-item index="19"  @click=herf(19)>
                            <span>付款方式管理</span>
                        </el-menu-item>
                        <el-menu-item index="20"  @click=herf(20)>
                            <span>添加付款方式</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-col>
    </div>
</template>

<script>
    export default {
        // name: "left-purch",
        data(){
            return {
                indexN:"1"
            }
        },
        methods: {
            herf(num){
                let that = this;
                if(num == 1){
                    that.$router.push({path: '/group_super/my_super'})
                }else if(num == 3){
                    that.$router.push({path: '/group_super/orderList_super'})
                }else if(num == 4){
                    that.$router.push({path: '/group_super/account_super'})
                }else if(num == 5){
                    that.$router.push({path: '/group_super/record_super'})
                }else if(num == 6){
                    that.$router.push({path: '/group_super/realname_super'})
                }else if(num == 7){
                    that.$router.push({path: '/group_super/logo_super'})
                }else if(num == 8){
                    that.$router.push({path: '/group_super/multiAccount_super'})
                }else if(num == 9){
                    that.$router.push({path: '/group_super/password_super'})
                }else if(num == 10){
                    that.$router.push({path: '/group_super/phone_super'})
                }else if(num == 11){
                    that.$router.push({path: '/group_super/msg_super'})
                }else if(num == 14){
                    that.$router.push({path: '/group_super/orderL_super'})
                }else if(num == 15){
                    that.$router.push({path: '/group_super/Office_super'})
                }else if(num == 17){
                    that.$router.push({path: '/group_super/JointData_super'})
                }else if(num == 19){
                    that.$router.push({path: '/group_super/paymentManage'})
                }else if(num == 20){
                    that.$router.push({path: '/group_super/paymentAdd'})
                }else if(num == 21){
                    that.$router.push({path: '/group_super/demandList_super'})
                }else if(num == 22){
                    that.$router.push({path: '/group_super/collectionList_super'})
                }else if(num == 23){
                    that.$router.push({path: '/group_super/rolesManage'})
                }else if(num == 24){
                    that.$router.push({path: '/group_super/workGroupList'})
                }else if(num == 25){
                    that.$router.push({path: '/group_super/ProcessFlowList'})
                }else if(num == 26){
                    that.$router.push({path: '/group_super/applyProcessFlow'})
                }else if(num == 27){
                    that.$router.push({path: '/group_super/manageLog'})
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
        padding-left: 100px;
        padding-top: 30px;
        padding-right: 30px;
        box-sizing: border-box;
        letter-spacing: 1px;
        color: #fff;
        background-image: url(../../assets/public/aside_logo.png);
        background-repeat:no-repeat;
        background-size: 65px 65px;
        background-position: 25px 20px;
    }
</style>