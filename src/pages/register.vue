<template>
    <div class="centerDiv">
        <div class="headerDiv">
            <div class="loginDiv"></div>
        </div>
        <div class="bodyDiv">
            <el-steps :active="page" align-center  finish-status="success">
                <el-step title='验证手机号' ></el-step>
                <el-step title="设置登录密码" ></el-step>
                <!-- <el-step title="选择身份" ></el-step> -->
                <el-step title="注册成功" ></el-step>
            </el-steps>

            <div v-if='page == 0' class="inputDiv">
                <div class="lineInput">
                    <span class="item-label">验证手机号：</span>
                    <input name="phone" type="text" @input ='changePhone' :class="{phoneFalse : phoneFalse}" v-model.number="phone" placeholder="请输入手机号"/>
                </div>
                <div class="lineInput">
                    <span class="item-label">短信验证码：</span>
                    <input name="verification" type="text" class="verificationInput"  v-model.number='verification' placeholder="请输入短信验证码"/>
                    <div class="verificationBtn" @click="verificationBtnF" >{{ verificationBtn }}</div>
                </div>
                <div class="lineInput" style="text-align: center;">
                    <el-checkbox v-model="checked"></el-checkbox>
                    <span class="agreement" @click="readRefisterAgreement">我已阅读并同意《筑牛用户注册服务协议》</span>
                </div>
                <div class="lineButton" style="text-align: center;">
                    <div class="onlyOne nomalBtn" @click="firstBtn">下一步</div>
                </div>
                <div class="first" v-if='phoneFalse'  style="text-align: center;">
                    <div class="triangleDiv top"></div>
                    <div class="triangleDiv bottom"></div>
                    <i class="icon-gantanhao iconfont"></i><span>请输入正确的手机号</span>
                </div>
            </div>
            <div v-else-if="page == 1"  class="inputDiv">
                <div class="lineInput">
                    <span class="item-label">手机号：</span>
                    <div class="inputDiv2">{{ phone }}</div>
                </div>
                <div class="lineInput">
                    <span class="item-label">设置登录密码：</span>
                    <input name="password" :type="isPassword ? 'password' : 'text'" @input ='changePassword' :class="{phoneFalse : passwordFalse}" v-model="password" placeholder="数字与字母组合最少6位不超过16位"/>
                    <i class="iconfont thisBtn" :style="{'font-size':(isPassword ? 20 : 10)+'px' }" :class="{'icon-bukeshi':isPassword,'icon-keshi':!isPassword }" @click="showPassword"></i>
                </div>
                <div class="lineInput hasText" style="text-align: center;">
                    <span class="item-label">设置用户名：</span>
                    <input name="userName" type="text" @input ='changeUserName' :class="{phoneFalse : userNameFalse}" v-model="userName" placeholder="6到12个字符"/>
                    <div class="addDiv">用户名为字母和数字的组合</div>
                </div>
                <div class="lineButton">
                    <div class=" nomalBtn leftBtn" @click="secondBtn">上一步</div>
                    <div class=" nomalBtn rightBtn" @click="thirdBtn">下一步</div>
                </div>
                <div class="second" v-if='passwordFalse'  style="text-align: center;">
                    <div class="triangleDiv top"></div>
                    <div class="triangleDiv bottom"></div>
                    <i class="icon-gantanhao iconfont"></i><span>您输入的密码格式不正确</span>
                </div>
                <div class="third" v-if='userNameFalse'  style="text-align: center;">
                    <div class="triangleDiv top"></div>
                    <div class="triangleDiv bottom"></div>
                    <i class="icon-gantanhao iconfont"></i><span>您输入的格式不正确</span>
                </div>
            </div>
<!--             <div v-else-if="page == 2"  class="inputDiv"  style="text-align: center;">
                <div >请选择身份</div>
                <div class="twoBtnDiv">
                    <div class="leftBBtn" :class="{isClick:identityN}"  @click="identityB(true)">我是供应商</div>
                    <div class="rightBBtn" :class="{isClick:!identityN}" @click="identityB(false)">我是采购商</div>
                </div>
                <div class="lineButton middleD">
                    <div class=" nomalBtn leftBtn" @click="secondBtn">上一步</div>
                    <div class=" nomalBtn rightBtn" @click="fourthBtn">下一步</div>
                </div>
            </div> -->
            <div v-else  class="inputDiv" style="text-align: center;">
                <div class="gotoImage">
                    <div class="suessccD"></div>注册成功！
                </div>
                <div class="gotologin">您可以使用用户名({{ userName }})或注册手机号({{ phone }})作为登录名，进行登录</div>
                <div class="lineButton">
                    <div class="onlyOne nomalBtn" @click="toLogin">去登录</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'register',
        data(){
            return {
                page: 0,
                phone: '',
                verification: '',
                verificationBtn: '发送验证码',
                verificationBool: true, //防止重复点击（别人写的逻辑--!）
                checked: true,
                phoneFalse: false,
                time: 0,
                password: '',
                passwordFalse: false,
                isPassword: true,
                userName: '',
                userNameFalse: false,
                identityN: true
            }
        },
        methods:{
            //跳转到登录
            toLogin(){
                this.$router.push({name: 'login'})
            },
            identityB(bool){
                this.identityN = bool;
            },
            //验证手机号
            firstBtn(){
                let that = this;
                let phoneReg = /^((13|14|15|17|18)\d{9})$/;
                let verificationCodeReg = /^\d{2,13}$/;
                let params;
                if(!that.phone || !phoneReg.test(that.phone)){ //手机号校验
                    that.phoneFalse = true;
                    that.$message({
                        message: '请输入正确的手机号',
                        type: 'warning'
                    })
                    return false
                }
                if(!that.verification || !verificationCodeReg.test(that.verification)){ //验证码校验
                    that.$message({
                        message: '请输入正确的验证码',
                        type: 'warning'
                    })
                    return false
                };
                if(!that.checked){ //注册协议校验
                    that.$alert('请同意筑牛用户注册', '提示', {
                        confirmButtonText: '确定'
                    });
                    return false
                }
                params = {
                    mobile: that.phone,
                    code: that.verification
                };
                that.$api.registerCheckVerificationCode(params)
                    .then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.$message({
                                message: '验证成功',
                                type: 'success'
                            })
                            that.page += 1;
                        }else{
                            that.$alert(result.message, '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    }).catch(function(error){
                        console.log(error);
                        that.$alert(error, '警告', {
                            confirmButtonText: '确定'
                        });
                    });
            },
            //密码显示和隐藏
            showPassword(){
                this.isPassword = !this.isPassword;
            },
            //返回到手机号校验
            secondBtn(){
                this.page -= 1;
            },
            //校验用户名
            thirdBtn(){
                let that = this;
                let passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
                let usernameReg = /^[a-zA-Z0-9]{6,12}$/;
                let params;
                if(!passwordReg.test(that.password)){ //密码校验
                    that.passwordFalse = true;
                    return false
                }
                if(!usernameReg.test(that.userName)){ //用户名校验
                    that.userNameFalse = true;
                    return false
                }
                params = {
                    user_name: that.userName
                };
                that.$api.registerCheckUsername(params)
                    .then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.page += 1;
                            that.fourthBtn();
                        }else{
                            that.$alert(result.message , '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    }).catch(function (error) {
                        that.$alert(error , '警告', {
                            confirmButtonText: '确定'
                        });
                    });
            },
            //注册
            fourthBtn(){
                let that = this;
                let params = {
                    mobile: that.phone,
                    password: that.password,
                    user_name: that.userName
                }
                that.$api.register(params)
                    .then(response => {
                        let result = response.data;
                        if(result.msg_code == 100000){
                            that.page += 2;
                        }else{
                            that.$alert(result.message , '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    }).catch(function(error){
                        console.log(error);
                        that.$alert(error, '警告', {
                            confirmButtonText: '确定'
                    });
                });
            },
            //用户名错误提示
            changeUserName(){
                this.userNameFalse = false
            },
            //密码错误提示
            changePassword(){
                this.passwordFalse = false
            },
            //手机错误提示
            changePhone(){
                this.phoneFalse = false
            },
            //获取短信验证码
            verificationBtnF(){
                let that = this;
                if(that.verificationBool){ //防止重复点击
                    that.verificationBool = false;
                    let reg = /^((13|14|15|17|18)\d{9})$/;
                    if(!reg.test(that.phone)){
                        that.phoneFalse = true;
                        that.verificationBool = true;
                        that.$message({
                            message: '请输入正确的手机号',
                            type: 'warning'
                        })
                        return false
                    }
                    let params = {mobile: that.phone};
                    that.$api.smsVerificationCode(params)
                        .then(function(response){
                        if(response.data.msg_code == 100000){
                            that.time = 60;
                            that.timer();
                        }else{
                            that.$alert(response.data.message , '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    that.verificationBool=true;
                                }
                            });
                        }
                    }).catch(function(error){
                        console.log(error);
                        that.$alert(error , '警告', {
                            confirmButtonText: '确定',
                            callback: action => {
                                that.verificationBool = true;
                            }
                        });
                    });
                }else{
                    that.$message({
                        message: '请勿重复点击',
                        type: 'warning'
                    })
                }
            },
            //倒计时
            timer(){
                if (this.time > 0) {
                    this.time--;
                    this.verificationBtn = `${this.time}s后重新获取`;
                    setTimeout(this.timer, 1000);
                }else{
                    this.time = 0;
                    this.verificationBtn = "获取验证码";
                    this.verificationBool = true;
                }
            },
            //阅读注册协议
            readRefisterAgreement(){

            }
        }
    }
</script>
<style lang="less" scoped>
    .gotoImage{
        width: 200px;
        height: 85px;
        margin: 0 auto;
        line-height: 85px;
        font-weight: 600;
        .suessccD{
            width: 85px;
            height: 85px;
            float: left;
            background-size: 100% 100%;
            background-image: url(../assets/register/success.png);
        }
    }
    .gotologin{
        width: 587px;
        margin: 25px auto;
    }
    .centerDiv {
        .headerDiv {
            height: 120px;
            background-color: #0576DB;
            div {
                width: 1200px;
                height: 100px;
                margin: 0 auto;
            }
            .loginDiv {
                background-size: 208px 80px;
                background-repeat: no-repeat;
                background-image: url(../assets/register/login.png);
                background-position-y: 20px;
            }
        }
        .bodyDiv{
            .twoBtnDiv{
                height: 68px;
                width: 600px;
                margin: 55px auto;
                line-height: 68px;
                font-size: 16px;
                .leftBBtn,.rightBBtn{
                    width: 150px;
                    padding: 0 30px;
                    margin: 0 20px;
                    display: inline-block;
                    background-size: 100% 100%;
                    cursor: pointer;
                    background-image: url(../assets/register/bg1.png);
                    color: #999;
                    &.isClick{
                        color: #00B4F5;
                        background-image: url(../assets/register/bg1.jpg);
                    }
                }
            }
            width: 1200px;
            margin: 0 auto;
            margin-top: 80px;
            .inputDiv{
                margin-top: 110px;
                position: relative;
                .lineInput{
                    position: relative;
                    width: 450px;
                    height: 35px;
                    margin: 0 auto 30px;
                    font-size: 14px;
                    &.hasText{
                        height: 57px;
                    }
                    .item-label{
                        display: block;
                        float: left;
                        width: 150px;
                        text-align: right;
                        line-height: 35px;
                        color: #333;
                    }
                    input{
                        display: block;
                        float: left;
                        width: 274px;
                        border: 1px #999 solid;
                        line-height: 33px;
                        border-radius: 5px;
                        outline: none;
                        padding: 0 0 0 10px;
                    }
                    .thisBtn{
                        cursor: pointer;
                        width: 35px;
                        height: 35px;
                        font-size: 20px;
                        line-height: 35px;
                        position: absolute;
                        right: 18px;
                        top: 0;
                    }
                    .inputDiv2{
                        float: left;
                        width: 274px;
                        line-height: 35px;
                        padding: 0 0 0 10px;
                        text-align: left;
                    }
                    .phoneFalse{
                        border: 1px #f7532d solid;
                    }
                    .verificationInput{
                        width: 160px;
                    }
                    .verificationBtn{
                        border: 1px #00B4F5 solid;
                        float: left;
                        line-height: 33px;
                        width: 100px;
                        margin-left: 10px;
                        border-radius: 5px;
                        color: #00B4F5;
                        cursor: pointer;
                        text-align: center;
                    }
                    .addDiv{
                        clear: both;
                        width: 450px;
                        margin-left: 150px;
                        text-align: left;
                        color: #999;
                        line-height: 22px;
                        font-size: 14px;
                    }
                }
                .lineButton{
                    width: 450px;
                    height: 35px;
                    margin: 0 auto 30px;
                    &.middleD{
                        .leftBtn{
                            margin-left: 100px;
                        }
                    }
                    .onlyOne{
                        line-height: 35px;
                        padding: 0 30px;
                        margin: 0 auto;
                        border-radius: 5px;
                        display:inline-block;
                    }
                    .leftBtn{
                        line-height: 35px;
                        padding: 0 30px;
                        float: left;
                        margin-left: 150px;
                        border-radius: 5px;
                        display:inline-block;
                    }
                    .rightBtn{
                        line-height: 35px;
                        padding: 0 30px;
                        float: left;
                        margin-left: 30px;
                        border-radius: 5px;
                        display:inline-block;
                    }
                }
                .first,.second,.third{
                    background-color:#f7532d;
                    color: #fff;
                    height: 35px;
                    width: 208px;
                    position: absolute;
                    top: 0;
                    right: 163px;
                    line-height: 35px;
                    i{
                        margin-right: 10px;
                    }
                    .triangleDiv{
                        position: absolute;
                        left: 0;
                        width: 0;
                        height: 0;
                        &.top{
                            top: 0;
                            border-top:9px solid #fff;
                            border-left: 9px solid #fff;
                            border-right: transparent solid 9px;
                            border-bottom: 9px solid transparent;
                        }
                        &.bottom{
                            bottom: 0;
                            border-bottom:9px solid #fff;
                            border-left: 9px solid #fff;
                            border-right: transparent solid 9px;
                            border-top: 9px solid transparent;
                        }
                    }
                }
                .second{
                    top: 65px;
                    right: 144px;
                    width: 240px;
                }
                .third{
                    top: 130px;
                    right: 184px;
                    width: 200px;
                }
            }
        }
        .agreement{
            position: relative;
            color: #999;
            cursor: pointer;
        }
        .agreement:hover{
            color: #0576DB;
        }
        .agreement:before{
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 0;
            height: 1px;
            background: #0576DB;
            transition: all .3s ease;
        }
        .agreement:hover:before{
            width: 100%;
            left: 0;
        }
    }
</style>