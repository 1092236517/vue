<template>
    <div>
        <div class="content">
            <img :src="src" alt="详情">        
        </div>
    </div>

</template>

<script>
    export default {
        data(){
        	return {
                id: '',
                src: '',
        		imgList: [
                    {
                        id: 1,
                        src: require('../../assets/jointdata/hefei.png')
                    },
                    {
                        id: 2,
                        src: require('../../assets/jointdata/meiguiyuanerqi.png')
                    },
                    {
                        id: 3,
                        src: require('../../assets/jointdata/meiguiyuansanqi.png')
                    }
                ]
        	}
        },
        methods: {
            showDetail(){
                for(let i = 0; i < this.imgList.length; i++ ){
                    if(this.imgList[i].id == this.id){
                        this.src = this.imgList[i].src;
                        break;
                    }
                }
            }
        },
        mounted(){
            this.id = this.$route.params.id;
        	// 设置下token
        	if(!this.$cookies.get("ZL_token")){
        	    this.$router.push({path: '/login'})
        	}else{
        	    this.token = this.$cookies.get("ZL_token");
        	};
            this.showDetail();
        }
    }
</script>


<style lang="less" scoped>
    .content{
        width: 100%;
        img{
            width: 100%;
        }
    }
</style>