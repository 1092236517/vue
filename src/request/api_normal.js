/*
 *api(normal)接口统一管理
 */
import axios from './http.js'

const api_normal = {
	/*
	 *normal模式api
	 */
	//集团
	usersListNew_normal(params){ //新版获取用户列表
		return axios.get('/api/frontend/joint_purchase/normal/member/account/power/list', {params})
	},

	roles_normal(params){ //获取用户角色
		return axios.get('/api/frontend/joint_purchase/normal/power/group/member/roles', {params})
	},

	groups_normal(params){ //获取用户组
		return axios.get('/api/frontend/joint_purchase/normal/power/group/member/groups', {params})
	},

	userAdd_normal(params){ //新增用户
		return axios.post('/api/frontend/joint_purchase/normal/member/account/add', params)
	},

	accountInfo_normal(params){ //账户详情
		return axios.get('/api/frontend/joint_purchase/normal/member/account/power/detail', {params})
	},

	userUpdate_normal(params,token){ //更新用户
		return axios.post('/api/frontend/joint_purchase/normal/member/account/power/update/?token=' + token, params)
	},

	rolesDelete_normal(params){ //角色删除
		return axios.post('/api/frontend/joint_purchase/normal/power/group/role/delete',params)
	},

	roleCategory_normal(params){ //角色类别下拉选
		return axios.get('/api/frontend/joint_purchase/normal/power/group/tag/lists', {params})
	},

	roleCreat_normal(params){ //角色新建
		return axios.post('/api/frontend/joint_purchase/normal/power/group/role/create', params)
	},

	roleUpdate_normal(params){ //角色更新
		return axios.post('/api/frontend/joint_purchase/normal/power/group/role/update', params)
	},

	groupList_normal(params){ //获取组列表
		return axios.get('/api/frontend/joint_purchase/normal/power/group/group/lists', {params})
	},

	groupDelete_normal(params){ //组删除
		return axios.post('/api/frontend/joint_purchase/normal/power/group/group/delete', params)
	},

	groupDetial_normal(params){ //组详情
		return axios.get('/api/frontend/joint_purchase/normal/power/group/group/detail',{params})
	},

	rolesList_normal(params){ //组角色管理列表and角色管理角色列表and角色详情页面角色详情
		return axios.get('/api/frontend/joint_purchase/normal/power/group/role/lists',{params})
	},

	usersList_normal(params){ //获取组账户列表
		return axios.get('/api/frontend/joint_purchase/normal/member/account/list', {params})
	},

	groupCreat_normal(params){ //组创建
		return axios.post('/api/frontend/joint_purchase/normal/power/group/group/create',params)
	},

	groupUpdate_normal(params){ //组修改
		return axios.post('/api/frontend/joint_purchase/normal/power/group/group/update',params)
	},

	jointLog_normal(params){ //操作日志
		return axios.get('/api/frontend/joint_purchase/normal/joint_log/lists', {params})
	},

	demandDetail_normal(params, id){ //获取联采需求详情
		return axios.get('/api/frontend/joint_purchase/normal/group/demand/detail/' + id, {params})
	},

	demandAuth_normal(params, id){ //成本部审核需求订单
		return axios.post('/api/frontend/joint_purchase/normal/group/demand/auth/' + id, params)
	},

	processFlowList_normal(params){ //快捷流程列表
		return axios.get('/api/frontend/joint_purchase/normal/group/examine/shortcut/list', {params})
	},

	processFlowAdd_normal(params){ //添加快捷流程
		return axios.post('/api/frontend/joint_purchase/normal/group/examine/shortcut/add', params)
	},

	processFlowDetail_normal(params, id){ //子流程详情
		return axios.get('/api/frontend/joint_purchase/normal/group/examine/shortcut/detail/' + id, {params})
	},

	processFlowDelete_normal(params){ //删除快捷流程
		return axios.post('/api/frontend/joint_purchase/normal/group/examine/shortcut/del', params)
	},

	processFlowApply_normal(params){ //集团添加&修改审核流程
		return axios.post('/api/frontend/joint_purchase/normal/group/examine/create', params)
	},

	processFlowApplyDetail_normal(params){ //应用中的审核流程详情
		return axios.get('/api/frontend/joint_purchase/normal/group/examine/detail', {params})
	},

	processFlowApplyList_normal(params){ //所属角色及子流程列表
		return axios.get('/api/frontend/joint_purchase/normal/group/examine/list', {params})
	},

	demandProcess_normal(params, id){ //需求状态进度
		return axios.get('/api/frontend/joint_purchase/normal/joint_log/demandProcess/' + id, {params})
	},

	customExamine_normal(params, demandId, recordId){ //自定义审核
		return axios.post('/api/frontend/joint_purchase/normal/group/demand/custom_examine/' + demandId + '/' + recordId, params)
	},

	processFlowListForBatchOrder_normal(params){ //批次订单快捷流程列表
		return axios.get('/api/frontend/joint_purchase/normal/group/order/examine/shortcut/list', {params})
	},

	processFlowAddForBatchOrder_normal(params){ //批次订单添加快捷流程
		return axios.post('/api/frontend/joint_purchase/normal/group/order/examine/shortcut/add', params)
	},

	processFlowDetailForBatchOrder_normal(params, id){ //批次订单子流程详情
		return axios.get('/api/frontend/joint_purchase/normal/group/order/examine/shortcut/detail/' + id, {params})
	},

	processFlowDeleteForBatchOrder_normal(params){ //批次订单删除快捷流程
		return axios.post('/api/frontend/joint_purchase/normal/group/order/examine/shortcut/del', params)
	},

	processFlowApplyForBatchOrder_normal(params){ //批次订单集团添加&修改审核流程
		return axios.post('/api/frontend/joint_purchase/normal/group/order/examine/create', params)
	},

	processFlowApplyDetailForBatchOrder_normal(params){ //批次订单应用中的审核流程详情
		return axios.get('/api/frontend/joint_purchase/normal/group/order/examine/detail', {params})
	},

	processFlowApplyListForBatchOrder_normal(params){ //批次订单所属角色及子流程列表
		return axios.get('/api/frontend/joint_purchase/normal/group/order/examine/list', {params})
	},

	customExamineForBatchOrder_normal(params, orderId, recordId){ //批次订单自定义审核
		return axios.post('/api/frontend/joint_purchase/normal/group/order/examine/customexamine/' + orderId + '/' + recordId, params)
	},

	departmentSignCheckForBatchOrder_normal(params, id){ //批次订单成本部确认签收
		return axios.post('/api/frontend/joint_purchase/normal/group/order/slave_order_department_sign_check/' + id, params)
	},

	signCheckForBatchOrder_normal(params, id){ //批次订单联采部确认签收
		return axios.post('/api/frontend/joint_purchase/normal/group/order/slave_order_sign_check/' + id, params)
	},

	groupBatchOrderProcess_normal(params){ //集团批次订单状态进度
		return axios.get('/api/frontend/joint_purchase/normal/group/process/lists', {params})
	},

	groupBatchOrderLogList_normal(params, slave_order_no){ //集团批次订单操作日志
		return axios.get('/api/frontend/joint_purchase/normal/group/process/logs/' + slave_order_no, {params})
	},

	orderReportList_normal(params){//订单报表列表
		return axios.get('/api/frontend/joint_purchase/normal/group/slave/order/lists',{params})
	},

	orderReportSum_normal(params){//订单报表总量
		return axios.get('/api/frontend/joint_purchase/normal/group/slave/order/sum',{params})
	},

	orderReportCount_normal(params){//订单报表总价
		return axios.get('/api/frontend/joint_purchase/normal/group/slave/order/count',{params})
	},

	NetworkPriceCount_normal(params){ //批次订单财务部写入网价显示总额
		return axios.get('/api/frontend/joint_purchase/normal/group/order/configure_actual_money', {params})
	},

	NetworkPriceUpdate_normal(params, id){ //批次订单财务部写入网价确定按钮
		return axios.post('/api/frontend/joint_purchase/normal/group/order/slave_order_price/' + id, params)
	},

	slaveOrderPay_normal(params, slave_order_id){ //集团支付批次订单
		return axios.post('/api/frontend/joint_purchase/normal/group/order/slave_order_pay/' + slave_order_id, params)
	},

	//集团 --- 银行账户
	bank_accountAdd_normal(params){ //支付账户的添加
		return axios.post('/api/frontend/joint_purchase/normal/group/bank_account/add', params)
	},

	bank_nameList_normal(params){ //银行名称列表
		return axios.get('/api/frontend/joint_purchase/normal/group/bank_account/bank_list', {params})
	},

	bank_accountList_normal(params){ //支付账户列表
		return axios.get('/api/frontend/joint_purchase/normal/group/bank_account/lists', {params})
	},

	bank_accountDelete_normal(params){ //支付账户删除
		return axios.post('/api/frontend/joint_purchase/normal/group/bank_account/delete', params)
	},

	bank_accountSetDefault_normal(params){ //设为默认账户
		return axios.post('/api/frontend/joint_purchase/normal/group/bank_account/set', params)
	},

	//集团---支付信息列表
	payInformationList_normal(params){ //支付信息列表
		return axios.get('/api/frontend/joint_purchase/normal/group/web_pay/lists', {params})
	},

	groupPayToZhuniu_normal(params){ //集团线上支付给筑牛
		return axios.post('/api/frontend/joint_purchase/normal/group/web_pay/add', params)
	},

	grouptConfirmToPay_normal(params){ //集团确定支付给筑牛
		return axios.post('/api/frontend/joint_purchase/normal/group/web_pay/confirmpay ', params)
	},

	//分公司
	branchaccountList_normal(params){ // 账户列表（修改）
		return axios.get('/api/frontend/joint_purchase/normal/branch/child/account/list', {params})
	},

	branchroles_normal(params){ //新增账号 -- 获取用户角色（修改）
		return axios.get('/api/frontend/joint_purchase/normal/power/branch/member/roles', {params})
	},

	branchgroups_normal(params){ //新增账号 -- 获取用户组（修改）
		return axios.get('/api/frontend/joint_purchase/normal/power/branch/member/groups', {params})
	},

	branchuserAdd_normal(params){ //新增账号 -- 新建用户账户
		return axios.get('/api/frontend/joint_purchase/normal/branch/child/account/add', {params})
	},

	branchaccountInfo_normal(params){ //新增账号 -- 用户详情
		return axios.get('/api/frontend/joint_purchase/normal/branch/child/account/detail',{params})
	},
	branchuserUpdate_normal(params){ //新增账号 -- 用户更新
		return axios.post('/api/frontend/joint_purchase/normal/branch/child/account/update', params)
	},

	branchrolesList_normal(params){ //角色管理列表 and  新增角色页面账户详情编辑回填  and 新增组页面添加角色的列表
		return axios.get('/api/frontend/joint_purchase/normal/power/branch/role/lists',{params})
	},

	branchrolesDelete_normal(params){ //角色删除
		return axios.post('/api/frontend/joint_purchase/normal/power/branch/role/delete',params)
	},

	branchroleCategory_normal(params){ //角色类别下拉选
		return axios.get('/api/frontend/joint_purchase/normal/power/branch/tag/lists', {params})
	},

	branchroleCreat_normal(params){ //角色新建
		return axios.post('/api/frontend/joint_purchase/normal/power/branch/role/create', params)
	},

	branchroleUpdate_normal(params){ //角色更新
		return axios.post('/api/frontend/joint_purchase/normal/power/branch/role/update', params)
	},

	branchgroupList_normal(params){ //获取组列表
		return axios.get('/api/frontend/joint_purchase/normal/power/branch/group/lists', {params})
	},

	branchgroupDelete_normal(params){ //组删除
		return axios.post('/api/frontend/joint_purchase/normal/power/branch/group/delete', params)
	},

	branchgroupDetial_normal(params){ //组详情
		return axios.get('/api/frontend/joint_purchase/normal/power/branch/group/detail',{params})
	},

	branchusersList_normal(params){ //组添加账户列表
		return axios.get('/api/frontend/joint_purchase/normal/branch/child/account/list',{params})
	},

	branchgroupCreat_normal(params){ //组创建
		return axios.post('/api/frontend/joint_purchase/normal/power/branch/group/create',params)
	},

	branchgroupUpdate_normal(params){ //组修改
		return axios.post('/api/frontend/joint_purchase/normal/power/branch/group/update',params)
	},

	branchpermissionsList_normal(params){ //权限列表（暂时不用）
		return axios.get('/api/frontend/joint_purchase/normal/power/branch/transfer/lists', {params})
	},

	branchConfirmVolumePrice_normal(params, id){ //分公司确认货量价
		return axios.post('/api/frontend/joint_purchase/normal/branch/order/confirm_slave_order/' + id, params)
	},

	branchBatchOrderProcess_normal(params){ //分公司批次订单状态进度
		return axios.get('/api/frontend/joint_purchase/normal/branch/process/lists', {params})
	},

	branchBatchOrderLogList_normal(params, slave_order_no){ //分公司批次订单操作日志
		return axios.get('/api/frontend/joint_purchase/normal/branch/process/logs/' + slave_order_no, {params})
	},

	NetworkPriceCount_branch_normal(params){ //批次订单分公司显示总额
		return axios.get('/api/frontend/joint_purchase/normal/branch/order/configure_actual_money', {params})
	},

	//供应商
	supplierProgress_normal(params){ //供应商批次订单进度条和日志
		return axios.get('/api/frontend/joint_purchase/normal/supplier/process/lists', {params})
	},

	NetworkPriceCount_supplier_normal(params){ //批次订单供应商写入网价显示总额
		return axios.get('/api/frontend/joint_purchase/normal/supplier/order/configure_actual_money', {params})
	},

}

export default api_normal