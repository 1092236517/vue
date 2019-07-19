<template>
    <div class="main-box">
        <sideBarMenu :sideBarMenuList='sideBarMenuList' class="leftDiv" />
        <div class="el-menu">
            <head-purch class="headDiv"></head-purch>
            <router-view  class="mainDiv"/>
        </div>
    </div>
</template>

<script>
    import sideBarMenu from '../components/public/SideBarMenu'
    import headPurch from '../components/group_super/headPurch'

    export default {
        name: "groupPage_super",
        components:{sideBarMenu,headPurch},
        computed:{
            sideBarMenuList(){
                return this.hideSideBarItem('PayInfoList', 'MyAccountInfo') //'PayInfoList', 'MyAccountInfo'在线支付相关菜单tag
            }
        },
        methods: {
            /**
             * 隐藏侧边栏指定的菜单选项
             * @param  {...Array} hideArr 传入任意项参数
             * @return {Array}            隐藏指定项后的侧边栏数组
             */
            hideSideBarItem(...hideArr){
                let sideBarAfterHide = [];
                if(hideArr.length == 0){
                    return this.$store.getters.sideBarMenuDataWithIcon
                }
                this.$store.getters.sideBarMenuDataWithIcon.forEach(parentItem => {
                    if(parentItem.child_channels.length == 0){ //没有子菜单
                        if(!this.isIncluded(parentItem, hideArr)){
                            sideBarAfterHide.push(parentItem);
                        }
                    }else{
                        if(!this.isIncluded(parentItem, hideArr)){
                            parentItem.child_channels = parentItem.child_channels.filter(childItem => {
                                return !this.isIncluded(childItem, hideArr)
                            })
                            sideBarAfterHide.push(parentItem);
                        }
                    }
                })
                return sideBarAfterHide
            },
            /**
             * 检测数组中是否包含指定选项
             * @param  {String | Number}  item 指定选项
             * @param  {Array}  arr  要检测的数组
             * @return {Boolean}      是否包含
             */
            isIncluded(item, arr){
                return arr.includes(item.tag)
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
    .el-menu{
        position: absolute;
        left: 250px;
        right: 0;
        top: 0;
        height: 100%;
        background-color: #fff;
    }
    .headDiv{
        /* position: absolute;
        left: 250px;
        right: 0;
        top: 0; */
        background-color: #409eff;
        line-height: 60px;
        height: 60px;
    }
    .mainDiv{
        /* position: absolute; */
        /* left: 250px; */
        right: 0;
        top: 60px;
        bottom: 0;
        padding:40px;
    }
</style>