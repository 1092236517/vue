<template>
    <div class="main-box">
        <!-- <left-purch class="leftDiv"></left-purch> -->
        <sideBarMenu :sideBarMenuList='sideBarMenuList' class="leftDiv" />
        <div>
            <head-purch class="headDiv"></head-purch>
            <router-view  class="mainDiv"/>
        </div>
    </div>
</template>

<script>
    //import leftPurch from '../components/purchasers/leftPurch'
    import sideBarMenu from '../components/public/SideBarMenu'
    import headPurch from '../components/purchasers/headPurch'

    export default {
        // name: "purchasersP"
        components:{sideBarMenu,headPurch},
        computed:{
            sideBarMenuList(){
                return this.$store.getters.sideBarMenuDataWithIcon
            }
        }
    }
</script>
<style scoped>
    .main-box{
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
    }
    .leftDiv{
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: #26313C;
        width: 250px;
        overflow: auto;
        z-index: 9;
    }
    /*滚动条样式*/
    .leftDiv::-webkit-scrollbar {/*滚动条整体样式*/
        width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 5px;
    }
    .leftDiv::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(255, 255, 255, 0.3);
    }
    .leftDiv::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 0;
        background: rgba(38, 49, 60, 0.1);
    }
    .headDiv{
        position: absolute;
        left: 250px;
        right: 0;
        top: 0;
        background-color: #409eff;
        line-height: 60px;
        height: 60px;
    }
    .mainDiv{
        position: absolute;
        left: 250px;
        right: 0;
        top: 60px;
        bottom: 0;
        padding: 40px;
    }
</style>