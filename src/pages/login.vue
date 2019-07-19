<template>
    <div class="mainDiv"
        v-loading="loading"
        element-loading-background="rgba(255, 255, 255, 0.3)">
        <div class="centerDiv">
            <div class="inputDiv">
                <div class="headerView">
                    <div class="nameView">筑牛会员登录</div>
                </div>
                <div class="inputBox">
                    <i class="people"></i>
                    <input v-model.trim="name" type="text" placeholder="用户名/手机号"/>
                </div>
                <div class="inputBox">
                    <i class="password"></i>
                    <input v-model.trim="password"  type="password" @keyup.enter="login" placeholder="密码"/>
                </div>
                <div class="forgetBox">
                    <el-checkbox v-model="checked" style="float: left;letter-spacing: 1px; ">自动登录</el-checkbox>
                    <div class="buttonD" style="float: right;font-size: 14px" @click="forgetPassword">忘记密码？</div>
                </div>
                <div class="buttonView nomalBtn" @click="login">登录</div>
                <div class="hrefDiv">
                    <span class="registerBtn" @click="register">立即注册</span><span class="backToMain" @click="backToMain">返回首页</span>
                </div>
            </div>
            <div class="invertedImgDiv">
                <img src="../assets/login/daoying.png" alt="invertedImg">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return {
                token: '',
                name: '',
                password: '',
                checked: true,
                canClick: true, //禁止重复点击
                backUrl: ''
            }
        },
        computed: {
            loading(){
                return !this.canClick
            }
        },
        created(){
            this.backUrl = this.$route.query.url;
        },
        methods:{
            register(){
                this.$router.push({path: '/register'})
            },
            forgetPassword(){
                window.open('http://www.zhuniu.com/member/retrieve_pwd')
            },
            backToMain(){
                window.location.href = 'http://www.zhuniu.com'
            },
            //跳转
            href(tag){
                let that = this;
                that.$store.state.routeList.forEach(function(item, index){
                    if(tag == item.tag && item.route ){
                        that.$router.push({path: item.route})
                        return false
                    }else if(tag == item.tag && item.redirect){
                        that.$router.push({path: item.redirect})
                        return false
                    }
                })
            },
            /**
             * 存cookie
             * @param {String} options.token      token
             * @param {String} options.joint_mode 联采模式
             * @param {Number} options.user_role  登录身份  1 子公司; 2 供应商; 3 集团
             */
            setCookie({token, joint_mode, user_role}){
                joint_mode && this.$cookies.set('joint_mode', joint_mode, 60*60*8);
                user_role && this.$cookies.set('user_role', user_role, 60*60*8);
                if(token){
                    if(process.env.NODE_ENV === 'development'){
                        this.$cookies.set('ZL_token', token, 60*60*8);
                    }else{
                        this.$cookies.set('ZL_token', token, 60*60*8, null, '.zhuniu.com');
                    }
                }
            },
            /**
             * 获取侧边栏第一个tab的标识（tag）
             * @param  {Array} options.data      侧边栏数据
             * @param  {Number} options.user_role 登录身份 1 子公司; 2 供应商; 3 集团
             * @return {String}                   tab标识
             */
            getSideBarFirstItem({data, user_role}){
                const branch = 1;
                const supplier = 2;
                const group = 3;
                let tag;
                if(user_role != supplier){
                    if(data && data.length > 0){
                        if(data[0].child_channels && data[0].child_channels.length > 0){
                            tag = data[0].child_channels[0]['tag']
                        }else{
                            tag = data[0]['tag'];
                        }
                    }else{
                        tag = null;
                    }
                }
                return tag
            },
            /**
             * 按照身份进入不通入口
             * @param  {Number} user_role  登录身份 1 子公司; 2 供应商; 3 集团
             * @param  {String} joint_mode 联采模式
             * @param  {String} tag        侧边连tab标识
             */
            skipByRole(user_role, joint_mode, tag){
                const branch = 1;
                const supplier = 2;
                const group = 3;
                switch(user_role){
                    case group: //集团
                        if(tag){
                            this.href(tag);
                        }else{
                            this.$alert('该账号没有配置权限，请先配置再登录！', '提示')
                        }
                        break;
                    case supplier:
                        this.$router.push({path: '/supplieroffer'}); //供应商
                        break;
                    case branch: //分公司
                        if(tag){
                            this.href(tag);
                        }else{
                            this.$alert('该账号没有配置权限，请先配置再登录！', '提示')
                        }
                        break;
                    default:
                        window.location.href = 'http://www.zhuniu.com';
                        break;
                }
            },
            //登录
            login(){
                let that = this;
                let params = {};
                if(!that.canClick){
                    return false
                }
                that.canClick = false;
                if(!that.name){
                    that.$alert('请输入用户名', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            that.canClick = true;
                        }
                    });
                    return false
                }
                if(!that.password){
                    that.$alert('请输入密码', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            that.canClick = true;
                        }
                    });
                    return false
                }
                params.user_name = that.name;
                params.password = that.password;
                that.$api.login(params)
                    .then(response => {
                        let result = response.data;
                        let tag;
                        if(result.msg_code == 100000){
                            let token = result.response.token;
                            let joint_mode = result.response.joint_mode;
                            let user_role = result.response.user_role;
                            that.token = token;
                            that.getUserInfo()
                                .then(res => {
                                    that.canClick = true;
                                    if(that.backUrl){
                                        window.location.href = that.backUrl
                                        return
                                    }
                                    //设置cookie
                                    that.setCookie({token, joint_mode, user_role});
                                    //保存列表及权限数据
                                    that.$store.commit('sign_in_for_group', result.response);
                                    //获取侧边栏第一个tab标识
                                    tag = that.getSideBarFirstItem(result.response);
                                    //按照身份不通入口
                                    that.skipByRole(user_role, joint_mode, tag);
                                })
                        }else if(result.msg_code == '300003'){ //非联采会员
                            that.canClick = true;
                            that.$cookies.set('ZL_token', result.message, 60*60*8, null, '.zhuniu.com');
                            window.location.href = 'http://www.zhuniu.com/usercenter/';
                        }else{
                            that.$alert(result.message , '警告', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    that.canClick = true;
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
            //获取用户信息
            getUserInfo(){
        		let that = this;
        		let params = {token: that.token};
                return that.$api.userInfo(params)
                            .then(function(response){
                                let result = response.data;
                                if(result.msg_code == 100000){
                                    let userDataName="";
                                    let userDataSrc = "";
                                    if(result.response.member_auth.logo && !(/^http/.test(result.response.member_auth.logo))){
                                        userDataSrc = 'http://file001.zhuniu.com/' + result.response.member_auth.logo;
                                    }else {
                                        userDataSrc = result.response.member_auth.logo || require('../assets/default_portrait.jpg');
                                    }
                                    userDataName = result.response.member_auth.auth_name;
                                    that.$cookies.set('userDataName', userDataName, 60*60*8);
                                    that.$cookies.set('userDataSrc', userDataSrc, 60*60*8);
                                }else{
                                    console.log(result.message)
                                    that.$alert(result.message , '警告', {
                                        confirmButtonText: '确定',
                                        callback: action => {
                                        }
                                    });
                                }
                            }).catch(function(error){
                                console.log(error);
                                that.$alert(error , '警告', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                    }
                                });
                            })
            }
        }
    }
</script>
<style lang="less" scoped>
    .mainDiv{
        height: 100%;
        background: url(../assets/login/background.png) no-repeat center center;
        background-size: cover;
        position: relative;
        min-width: 100%;
        min-height: 100%;
        overflow: hidden;
    }
    .centerDiv{
        position: relative;
        width: 1200px;
        margin: 0 auto;
        .headerDiv{
            position: absolute;
            top: -150px;
            left: 0;
            height: 120px;
            line-height: 120px;
            text-align: left;
            cursor: pointer;
            div{
                float: left;
            }
            .loginDiv{
                margin-top: 50px;
                width: 158px;
                height: 79px;
                background-size: 100% 100%;
                background-image: url(../assets/login/zhuniu_logo.png);
            }
            .titleDiv{
                display: block;
                margin-top: 40px;
                margin-left: 20px;
                padding-left:20px ;
                border-left: 1px solid #c4c4c4;
                font-size: 28px;
                height: 40px;
                line-height: 40px;
            }
        }
        .inputDiv{
            width: 410px;
            height: 500px;
            background-color: #fff;
            position: relative;
            z-index: 999;
            margin-top: 12%;
            margin-left: auto;
            margin-right: auto;
            border-radius:10px;
            .headerView{
                padding-top: 60px;
                height: 58px;
                line-height: 58px;
                .nameView{
                    text-align: center;
                    font-size: 26px;
                    padding-left: 20px;
                    color: #0576DB;
                }
            }
            .inputBox{
                margin: 30px 65px 0;
                width: 280px;
                height: 40px;
                border: 1px #EBEBEB solid;
                border-radius: 5px;
                position: relative;
                input{
                    position: absolute;
                    left: 36px;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    outline: none;
                    border: none;
                    width: 244px;
                    height: 38px;
                }
                .people{
                    position: absolute;
                    top: 11px;
                    left: 10px;
                    display: block;
                    width: 16px;
                    height: 18px;
                    background-size: 100% 100%;
                    background-image: url(../assets/login/user.png);
                }
                .password{
                    position: absolute;
                    top: 11px;
                    left: 10px;
                    display: block;
                    width: 15px;
                    height: 17px;
                    background-size: 100% 100%;
                    background-image: url(../assets/login/password_icon.png);
                }
            }
            .forgetBox{
                margin: 30px 67px 0;
                height: 26px;
                line-height: 26px;
                .buttonD{
                    float: right;
                    font-size: 14px;
                    cursor: pointer;
                }
            }
            .buttonView{
                margin: 30px 65px 0;
                height: 40px;
                line-height: 40px;
                font-size: 20px;
                border-radius:5px;
            }
            .hrefDiv{
                margin-top: 30px;
                text-align: center;
                color: #333;
                cursor: pointer;
                .registerBtn{
                    padding-right: 48px;
                    color: #0576DB;
                    border-right: 1px solid #EBEBEB;
                    font-size: 14px;
                    &:hover{
                        text-decoration-line: underline;
                    } 
                }
                .backToMain{
                    color: #666;
                    padding-left: 48px;
                    font-size: 14px;
                    &:hover{
                        text-decoration-line: underline;
                    }
                }
            }
        }
        .invertedImgDiv{
            width: 480px;
            margin: 1px auto 0;
            img{
                width: 100%;
            }
        }
    }
</style>