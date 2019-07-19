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
                    <span slot="title">我发布的联采需求</span>
                </el-menu-item>
                <el-menu-item index="3" @click=herf(3)>
                    <i class="iconfont icon-dingdan2"></i>
                    <span slot="title">订单列表</span>
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
                        <el-menu-item index="9"  @click=herf(9)>
                            <i class="iconfont icon-mimaxiugai"></i>
                            <span>密码修改</span>
                        </el-menu-item>
                        <el-menu-item index="10"  @click=herf(10)>
                            <i class="iconfont icon-shoujihao"></i>
                            <span>注册手机号修改</span>
                        </el-menu-item>
                        <el-menu-item index="12"  @click=herf(12)>
                            <i class="iconfont icon-zhanghao"></i>
                            <span>多账号设置</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-menu-item index="11"  @click=herf(11)>
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
                indexN:"1"
            }
        },
        methods: {
            herf(num){
                let that = this;
                if(num == 1){
                    that.$router.push({path: '/purchmy'})
                }else if(num == 2){
                    that.$router.push({path: '/demand'})
                }else if(num == 3){
                    that.$router.push({path: '/purchorder'})
                }else if(num == 11){
                    that.$router.push({path: '/purchmsg'})
                }else if(num == 4){
                    that.$router.push({path: '/purchaccount'})
                }else if(num == 5){
                    that.$router.push({path: '/purchrecord'})
                }else if(num == 6){
                    that.$router.push({path: '/purchname'})
                }else if(num == 7){
                    that.$router.push({path: '/purchlogo'})
                }else if(num == 9){
                    that.$router.push({path: '/purchpassword'})
                }else if(num == 10){
                    that.$router.push({path: '/purchphone'})
                }else if(num == 12){
                    that.$router.push({path: '/multiAccoun'})
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
    .el-submenu [class^=el-icon-],.el-menu-item [class^=el-icon-]{
        height: 24px;
        background-size: 18px 18px;
        background-repeat:no-repeat;
        background-position: center center;
    }
    .icon1{
        background-image: url(../../assets/purch/icon1Y.png);
    }
    .icon2{
        background-image: url(../../assets/purch/icon2Y.png);
    }
    .icon3{
        background-image: url(../../assets/purch/icon3Y.png);
    }
    .icon4{
        background-image: url(../../assets/purch/icon4Y.png);
    }
    .icon5{
        background-image: url(../../assets/purch/icon5Y.png);
    }
    .icon4S1{
        background-image: url(../../assets/purch/icon4SY.png);
    }
    .icon4S2{
        background-image: url(../../assets/purch/icon4SR.png);
    }
    .el-menu-item.is-active ,.el-menu-item:hover {
        .icon4S1{
            background-image: url(../../assets/purch/icon4SF.png);
        }
        .icon4S2{
            background-image: url(../../assets/purch/icon4SL.png);
        }
    } 
    .el-menu-item.is-active ,.el-menu-item:hover ,.el-submenu.is-active ,.el-submenu:hover {
        .el-submenu__title{
            color: #fff;
        }
        .icon1{
            background-image: url(../../assets/purch/icon1F.png);
        }
        .icon2{
            background-image: url(../../assets/purch/icon2F.png);
        }
        .icon3{
            background-image: url(../../assets/purch/icon3F.png);
        }
        .icon4{
            background-image: url(../../assets/purch/icon4F.png);
        }
        .icon5{
            background-image: url(../../assets/purch/icon5F.png);
        }
    }
    .el-submenu__title:hover  .icon4{
        background-image: url(../../assets/purch/icon4F.png);
    }
    .is-active.is-opened .el-submenu__title span{
        color: #fff;
    }
</style>