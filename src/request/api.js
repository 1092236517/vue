/*
 *api接口统一管理
 */
import axios from './http.js'
import api_super from './api_super.js'
import api_normal from './api_normal.js'

const api = {
	/*
	 *公共api
	 */
	upload_file_url: 'http://ap.zhuniu.com/api/frontend/upload', //上传附件

	login(params){ //登录
		return axios.post('/api/frontend/member/login',params)
	},

	userInfo(params){ //获取用户信息
		return axios.get('/api/frontend/member/detail',{params})
	},

	smsVerificationCode(params){ //获取短信验证码
		return axios.post('/api/frontend/sms', params)
	},

	registerCheckVerificationCode(params){ //检测注册验证码是否正确
		return axios.get('/api/frontend/member/register/check_account', {params})
	},

	registerCheckUsername(params){ //检测注册用户名是否存在
		return axios.get('/api/frontend/member/register/check_name', {params})
	},

	register(params){ //注册
		return axios.post('/api/frontend/member/register', params)
	},

	usersList(params){ //获取用户列表
		return axios.get('/api/frontend/member/account/list', {params})
	},

	regionList(params){ //获取省市县列表
		return axios.get('/api/frontend/region/list', {params})
	},
	...api_super,
	...api_normal
}

export default api