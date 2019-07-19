<template>
    <div class="status-wrapper">
    	<div class="logoTitle">LOGO设置</div>
	    <div class="logoBox">
	    	<img :src="default_img" />
	    	<p class="uploat-btn-wrapper">
	    		<label class="upload-btn" for="upload" @click="openClipWindow" v-show="uploadBtn">上传图片</label>
	    		<input type="file" id="upload" @change="uploadImg">
	    	</p>
	    	<p>仅支持JPEG、JPG、GIF、PNG格式的图片文件<br>文件不能大于2M</p>
	    </div>
	    <div class="clip-wrapper" v-show="cropperShow">
	    	<vueCropper
	    	  	ref="cropper"
	    	  	:img="cropperOption.src"
	    	  	:outputSize="cropperOption.size"
	    	  	:outputType="cropperOption.outputType"
	    	  	:autoCrop="cropperOption.autoCrop"
	    	  	:autoCropWidth="cropperOption.autoCropWidth"
	    	  	:autoCropHeight="cropperOption.autoCropHeight"
	    	  	:fixedBox="cropperOption.fixedBox">
	    	</vueCropper>
	    	<div class="clip-btn-div">
	    		<el-button type="primary" class="clip-btn" @click="closeClipWindow">返回</el-button>
	    		<el-button type="primary" class="clip-btn" @click="submitImg">确认</el-button>
	    		<el-button type="primary" class="clip-btn" @click="previewImg('blob')">预览</el-button>
	    	</div>
	    </div>
    </div>
    
</template>

<script>
	import vueCropper from 'vue-cropper'
    export default {
    	data(){
    		return {
    			cropperShow: false,
    			previews: {},
    			lists: [],
    			default_img: require('../../assets/public/setLogo.png'),
    			cropperOption: {
    				img: '',
    				img_name: '',
    				img_new_name: '',
    				src: '',
    				size: 1,
    				full: false,
    				outputType: 'png',
    				canMove: true,
    				original: false,
    				canMoveBox: false,
    				autoCrop: true,
    				autoCropWidth: 200,
    				autoCropHeight: 200,
    				fixedBox: true
				},
				//权限按钮
				uploadBtn: false,
    		}
    	},
    	methods: {
			 //权限按钮
            getAuthority(){
                let that=this;
                if(that.$store.getters.authForGroup.LOGO&&that.$store.getters.authForGroup.LOGO.transfers.length!=0){
                    that.$store.getters.authForGroup.LOGO.transfers.map(item=>{
                        if(item.power_transfer_name.indexOf('上传图片') != -1){
                            that.uploadBtn = true;
                        }
                    });
                }else if(that.$store.getters.authForGroup.BranchLogo&&that.$store.getters.authForGroup.BranchLogo.transfers.length!=0){
                    that.$store.getters.authForGroup.BranchLogo.transfers.map(item=>{
                        if(item.power_transfer_name.indexOf('上传图片') != -1){
                            that.uploadBtn = true;
                        }
                    });
                }
            },
        	//获取用户信息
        	getUserInfo(){
        		let that = this;
        		let params = {token: that.token};
        		that.$http.get('/api/frontend/member/detail',{params})
        			.then(function(response){
        				let result = response.data;
        				if(result.msg_code == 100000){
                            if(result.response.member_auth.logo && !(/^http/.test(result.response.member_auth.logo))){
                                that.default_img = 'http://file001.zhuniu.com/' + result.response.member_auth.logo;
                            }else {
                                that.default_img = result.response.member_auth.logo || require('../../assets/default_portrait.jpg');
                            }
        				}else{
        					that.$alert(result.message , '警告', {
        					    confirmButtonText: '确定',
        					    callback: action => {
        					    }
        					});
        				}
        			}).catch(function(error){
        				that.$alert(error , '警告', {
        				    confirmButtonText: '确定',
        				    callback: action => {
        				    }
        				});
        			})
        	},    		
    		//打开裁剪框
    		openClipWindow(){
    			this.cropperShow = true;
    		},
    		closeClipWindow(){
    			this.cropperShow = false;
    		},
    		//上传图片
    		uploadImg(e){
    			let that = this;
    			let file = e.target.files[0];
    			if(!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
    				that.$alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种');
    				return false;
    			 }
    			that.cropperOption.img_name = file.name;
    			var reader = new FileReader();
    			reader.onload = (e) => {
    				let data;
    				if (typeof e.target.result === 'object') {
    					// 把Array Buffer转化为blob 如果是base64不需要
    					data = window.URL.createObjectURL(new Blob([e.target.result]));
    				}else{
    					data = e.target.result;
    				}
    				that.cropperOption.src = data
    			}
    			// 转化为base64
    			// reader.readAsDataURL(file)
    			// 转化为blob
    			reader.readAsArrayBuffer(file)
    		},
    		// 输出
    		finish(type){
    			let that = this;   			
    			if(type === 'blob'){
    				that.$refs.cropper.getCropBlob((data) => {
    					that.cropperOption.img = data;
    					that.uploadToSever(data);   					
    				})
    			}else{
    				that.$refs.cropper.getCropData((data) => {
    					that.cropperOption.img = data;
    				})
    			}
    		},
    		//预览图片
    		previewImg(type){
    			let test = window.open('about:blank')
    			test.document.body.innerHTML = '图片生成中..'
    			if(type === 'blob'){
    				this.$refs.cropper.getCropBlob((data) => {
    					this.cropperOption.img = data;
    					test.location.href = window.URL.createObjectURL(data); 					
    				})
    			}else{
    				this.$refs.cropper.getCropData((data) => {
    					this.cropperOption.img = data;
    					test.location.href = data;
    				})
    			}
    		},
    		//发送到服务器
    		uploadToSever(data){
    			let that = this;
    			let formData = new FormData();
    			formData.append('file',data,that.cropperOption.img_name);
    			formData.append('file_type','image');
    			formData.append('column','member');
    			formData.append('category','member_logo');
    			that.$http.post('/api/frontend/upload/',formData)
    				.then(function(response){
    					let result = response.data;
    					if(result.msg_code == 100000){
    						let logoData = {
    							token: that.token,
    							logo: result.response.newFileName
    						}
    						//确认
    						that.$http.post('/api/frontend/member/update/photo',logoData)
    							.then(function(response){
    								if(response.data.msg_code = 100000){
    									that.cropperOption.img_new_name = result.response.newFileName;
    									that.default_img = result.response.newFileName;
    									that.$message({
    										message: '上传成功',
    										type: 'success'
    									})
    								}
    							})
    					}else{
    						console.log(result.message);
    					}
    				}).catch(function (error) {
        	        	that.$alert(error , '警告', {
        	            	confirmButtonText: '确定',
        	            	callback: action => {
        	            	}
        	        	});
        	    	});
    		},
    		//提交图片
    		submitImg(){
    			this.$refs.cropper.stopCrop();
    			this.finish('blob');
    			this.cropperShow = false;
    		},
    		//API
    		startCrop () {
    			// start
    			this.$refs.cropper.startCrop()
    		},
    		stopCrop () {
    			//  stop
    			this.$refs.cropper.stopCrop()
    		},
    		clearCrop () {
    			// clear
    			this.$refs.cropper.clearCrop()
    		},
    		// 实时预览函数
    		realTime (data) {
    			this.previews = data
    		}
    	},
    	components: {
    		vueCropper
    	},
        mounted(){
			let that = this;
        	if(!that.$cookies.get("ZL_token")){
        	    that.$router.push({path: '/login'})
        	}else{
        	    that.token = that.$cookies.get("ZL_token");
        	}
        	//获取用户信息
			that.getUserInfo();
			if(that.$cookies.get("user_role")=="2"){
				that.uploadBtn = true;
			}else{
                that.getAuthority();
            }
        }
    }
</script>
<style lang="less" scoped>
// .status-wrapper{
// 	height: 1000px;
// }
	/*标题*/
	.logoTitle{
		font-size: 20px;
		font-weight: bold;
	}
	.logoBox{
		width: 400px;
		text-align: center;
		position: absolute;
		left: 45%;
		top: 25%;
		margin-left: -200px;
		line-height: 26px;
		color: #6C6C6C;
	}
	.logoBox img{
		width: 240px;
		display: block;
		margin-left: 80px;
	}
	.upload-btn{
		background: blue;
	}
	button.el-button--primary{
		width: 150px;
		margin-top: 20px;
		padding: 8px 0;
	}
	.uploat-btn-wrapper{
		text-align: center;
		.upload-btn{
			display: inline-block;
			width: 180px;
			height: 40px;
			line-height: 40px;
			color: #fff;
			background: #0576db;
			font-size: 18px;
			text-align: center;
			border-radius: 5px;
			cursor: pointer;
		}
		#upload{
			display: none;
		}		
	}
	.clip-wrapper{
		width: 80%;
		height: 80%;
		margin: 0 auto;
		.clip-btn-div{
			text-align: center;
			.clip-btn{
				margin-left: 30px;
			}
		}
	}
</style>