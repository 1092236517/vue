<template>
    <div>
        <div class="getOut" @click="getOutF">
            <span>退出</span>
        </div>
        <a class="to-old-edition" href="http://www.zhuniu.com/usercenter/">旧版</a>
    </div>
    
</template>

<script>
    export default {
        name: "head-purch",
        methods: {
            getOutF(){
                if(process.env.NODE_ENV === 'development'){
                    this.$cookies.remove('ZL_token')
                }else{
                    this.$cookies.remove("ZL_token", null, '.zhuniu.com');
                }
                this.$cookies.remove('userDataName');
                this.$cookies.remove('userDataSrc');
                this.$store.commit('sign_out_for_group');
                this.$router.push({path: '/login'});
            }
        },
    }
</script>
<style lang="less" scoped>
    .to-old-edition{
        float: right;
        color: #fff;
    }
    .getOut{
        width: 100px;
        float: right;
        color: #fff;
        cursor: pointer;
        text-align: center;
        i{
            display: inline-block;
            width: 18px;
            height: 18px;
            background-size: 100% 100%;
            background-image: url(../../assets/purch/getOut.png);
            position: relative;
            top: 3px;
            right: 5px;
        }
    }
</style>