<template>
    <div>
        <div class="getRole" :title="roleName">
            所有角色： <span v-for="(item,key) in roleName" :key="key">{{item}} <i v-show="key != roleName.length-1">，</i> </span>
        </div>
        <div class="getOut" @click="getOutF">
            <span>退出</span>
        </div>
        <a class="to-old-edition" href="http://www.zhuniu.com/usercenter/">旧版</a>
    </div>
    
</template>

<script>
    export default {
        name: "head-purch",
        data(){
            return{
                roleName:[],
            }
        },
        created(){
            let currentUserRoleName = JSON.parse(this.$store.state.currentUserRoleName);
            this.roleName.push(currentUserRoleName.identity);
        },
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
        }
    }
</script>
<style lang="less" scoped>
    .getRole{
        width: calc(100% - 200px);
        float: left;
        color: #fff;
        text-align: left;
        padding-left: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
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