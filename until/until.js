export default {
    install:function(Vue,opt){
    	/*
    	 *公用POST请求
    	 * @successCallback: 成功回调函数
    	 * @rejectCallback: 失败回调函数
    	 */
    	Vue.prototype.ZN_POST = function(url,data,successCallback,rejectCallback){
    		let context = this;
    		context.$http.post(url,data)
    			.then((response) => {
    				let result = response.data;
    				if(successCallback && typeof successCallback == 'function'){
    					if(result.msg_code == 100000){
    						successCallback(result);
    					}else{
    						if(rejectCallback && typeof rejectCallback == 'function'){
    							rejectCallback(result);
    						}else{
    							context.$alert(result.message,'提示',{
    								confirmButtonText: '知道了',
    								callback: action => {
    									//todo
    								}
    							})
    						}
    					}
    				}
    			}).catch((error) => {
    				console.log(error);
    				context.$alert(error,'提示',{
    					confirmButtonText: '知道了',
    					callback: action => {
    						//todo
    					}
    				})
    			})
    	};
    	/*
    	 *公用GET请求
    	 * @successCallback: 成功回调函数
    	 * @rejectCallback: 失败回调函数
    	 */
    	Vue.prototype.ZN_GET = function(url,params,successCallback,rejectCallback){
    		let context = this;
    		context.$http.get(url,{params})
    			.then((response) => {
    				let result = response.data;
    				if(successCallback && typeof successCallback == 'function'){
    					if(result.msg_code == 100000){
    						successCallback(result);
    					}else{
    						if(rejectCallback && typeof rejectCallback == 'function'){
    							rejectCallback(result);
    						}else{
    							context.$alert(result.message,'提示',{
    								confirmButtonText: '知道了',
    								callback: action => {
    									//todo
    								}
    							})
    						}
    					}
    				}
    			}).catch((error) => {
    				console.log(error);
    				context.$alert(error,'提示',{
    					confirmButtonText: '知道了',
    					callback: action => {
    						//todo
    					}
    				})
    			})
    	};

        /*
         * 时间对象转字符串
         */
        Vue.prototype.dateToString = function(date){
            date = new Date(date);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = date.getDate() + ' ';
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return Y + M + D + h + m + s;
		}
		// 格式化时间
		Date.prototype.Format = function (fmt) {
			var o = {
				"M+": this.getMonth() + 1, // 月份
				"d+": this.getDate(), // 日
				"h+": this.getHours(), // 小时
				"m+": this.getMinutes(), // 分
				"s+": this.getSeconds(), // 秒
				"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
				"S": this.getMilliseconds() // 毫秒
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
					return fmt;
		}
		//数组去重
		Vue.prototype.DuplicateRemove = function(data){
			for(let i=0;i<data.length;i++){
				for(let j=i+1;j<data.length;j++){
					if(data[i].id==data[j].id){
						data.splice(j,1);
						j--;
					}
				}
			};
			return data;
		}
        //"+、-"转换为"上浮、下浮"
        Vue.prototype.signToWords = function(value){
            let result = value.toString();
            let sign = result.charAt(0);
            if(sign == '+'){
                return '上浮 ' + result.slice(1)
            }else if(sign == '-'){
                return '下浮 ' + result.slice(1)
            }else{
                return '上浮 ' + result
            }
        }
        /**
         * 倒计时
         * @param  {Number} time 设置倒计时起始时间，单位秒
         * @param  {Function} handle   倒计时结束前每次调用的处理函数，参数为当前剩余时间
         * @return {Object}      返回Promise对象
         */
        Vue.prototype.countDown = function(time, handle){
            if(typeof time != 'number') throw '请输入数字'
            let countDownTime = time;
            let timer;
            return new Promise((resolve, reject) => {
                function setTime(){
                    if(countDownTime === 0){
                        clearTimeout(timer);
                        resolve()
                    }else{
                        countDownTime--;
                        timer = setTimeout(setTime, 1000);
                        if(typeof handle == 'function'){
                            handle(countDownTime);
                        }
                    }
                }
                setTime();
            })
		};
		//数字显示两位小数 四舍五入
		Vue.prototype.toDecimal = function(x){
			var f = parseFloat(x);
			if (isNaN(f)) {
				return false;
			}
			var f = Math.round(x * 100) / 100;
			var s = f.toString();
			var rs = s.indexOf('.');
			if (rs < 0) {
				rs = s.length;
				s += '.';
			}
			while (s.length <= rs + 2) {
				s += '0';
			}
			return s;
		};
    }
}