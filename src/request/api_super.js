/*
 *api(super)接口统一管理
 */
import axios from './http.js'

const api_super = {
	/*
	 *super模式(江建定制版)api
	 */
	//集团
	usersListNew(params){ //新版获取用户列表
		return axios.get('/api/frontend/member/account/power/list', {params})
	},

	usersList(params){ //获取用户列表
		return axios.get('/api/frontend/member/account/list', {params})
	},

	roles(params){ //获取用户角色
		return axios.get('/api/frontend/power/group/member/roles', {params})
	},

	groups(params){ //获取用户组
		return axios.get('/api/frontend/power/group/member/groups', {params})
	},

	userAdd(params){ //新增用户
		return axios.post('/api/frontend/member/account/add', params)
	},

	accountInfo(params){ //账户详情
		return axios.get('/api/frontend/member/account/power/detail', {params})
	},

	userGroupAdd(params){ //账户编辑,添加组
		return axios.post('/api/frontend/power/group/member/group/add', params)
	},

	userGroupDelete(params){ //账户编辑,删除组
		return axios.post('/api/frontend/power/group/member/group/delete', params)
	},

	userUpdate(params,token){ //更新用户
		return axios.post('/api/frontend/member/account/power/update/?token=' + token, params)
	},

	permissionsList(params){ //权限列表
		return axios.get('/api/frontend/power/group/transfer/lists', {params})
	},

	roleCategory(params){ //角色类别下拉选
		return axios.get('/api/frontend/power/group/tag/lists', {params})
	},

	roleCreat(params){ //角色新建
		return axios.post('/api/frontend/power/group/role/create', params)
	},

	roleUpdate(params){ //角色更新
		return axios.post('/api/frontend/power/group/role/update', params)
	},

	rolesList(params){ //角色管理列表
		return axios.get('/api/frontend/power/group/role/lists',{params})
	},

	rolesDelete(params){ //角色删除
		return axios.post('/api/frontend/power/group/role/delete',params)
	},

	groupMember(params){ //组成员列表
		return axios.get('/api/frontend/power/group/member/lists', {params})
	},

	groupCreat(params){ //组创建
		return axios.post('/api/frontend/power/group/group/create',params)
	},

	groupDetial(params){ //组详情
		return axios.get('/api/frontend/power/group/group/detail',{params})
	},

	groupUpdate(params){ //组修改
		return axios.post('/api/frontend/power/group/group/update',params)
	},

	groupList(params){ //获取组列表
		return axios.get('/api/frontend/power/group/group/lists', {params})
	},

	groupDelete(params){ //组删除
		return axios.post('/api/frontend/power/group/group/delete', params)
	},

	// MOBILE START
	mobilepermissionsList(params){ //权限列表
		return axios.post('/api/frontend/power/group/transfer/mobile/lists', params)
	},

	mobileroleCreat(params){ //角色新建
		return axios.post('/api/frontend/power/branch/role/mobile/create', params)
	},

	mobileRoleUpdate(params){ //角色更新
		return axios.post('/api/frontend/power/group/role/mobile/update', params)
	},

	mobileRolesList(params){ //角色管理列表
		return axios.get('/api/frontend/power/group/role/mobile/lists',{params})
	},

	mobilegroupCreat(params){ //组创建
		return axios.post('/api/frontend/power/group/group/mobile/create',params)
	},

	mobileGroupDetial(params){ //组详情
		return axios.get('/api/frontend/power/group/group/mobile/detail',{params})
	},

	mobileGroupUpdate(params){ //组修改
		return axios.post('/api/frontend/power/group/group/mobile/update',params)
	},

	//MOBILE END


	jointLog(params){ //操作日志
		return axios.get('/api/frontend/joint_purchase/super/joint_log/lists', {params})
	},

	demandDetail(params, id){ //获取联采需求详情
		return axios.get('/api/frontend/joint_purchase/super/group/demand/detail/' + id, {params})
	},

	demandAuth(params, id){ //成本部审核需求订单
		return axios.post('/api/frontend/joint_purchase/super/group/demand/auth/' + id, params)
	},

	processFlowList(params){ //快捷流程列表
		return axios.get('/api/frontend/joint_purchase/super/group/examine/shortcut/list', {params})
	},

	processFlowAdd(params){ //添加快捷流程
		return axios.post('/api/frontend/joint_purchase/super/group/examine/shortcut/add', params)
	},

	processFlowDetail(params, id){ //子流程详情
		return axios.get('/api/frontend/joint_purchase/super/group/examine/shortcut/detail/' + id, {params})
	},

	processFlowDelete(params){ //删除快捷流程
		return axios.post('/api/frontend/joint_purchase/super/group/examine/shortcut/del', params)
	},

	processFlowApply(params){ //集团添加&修改审核流程
		return axios.post('/api/frontend/joint_purchase/super/group/examine/create', params)
	},

	processFlowApplyDetail(params){ //应用中的审核流程详情
		return axios.get('/api/frontend/joint_purchase/super/group/examine/detail', {params})
	},

	processFlowApplyList(params){ //所属角色及子流程列表
		return axios.get('/api/frontend/joint_purchase/super/group/examine/list', {params})
	},

	demandProcess(params, id){ //需求状态进度
		return axios.get('/api/frontend/joint_purchase/super/joint_log/demandProcess/' + id, {params})
	},

	customExamine(params, demandId, recordId){ //自定义审核
		return axios.post('/api/frontend/joint_purchase/super/group/demand/custom_examine/' + demandId + '/' + recordId, params)
	},

	processFlowListForBatchOrder(params){ //批次订单快捷流程列表
		return axios.get('/api/frontend/joint_purchase/super/group/order/examine/shortcut/list', {params})
	},

	processFlowAddForBatchOrder(params){ //批次订单添加快捷流程
		return axios.post('/api/frontend/joint_purchase/super/group/order/examine/shortcut/add', params)
	},

	processFlowDetailForBatchOrder(params, id){ //批次订单子流程详情
		return axios.get('/api/frontend/joint_purchase/super/group/order/examine/shortcut/detail/' + id, {params})
	},

	processFlowDeleteForBatchOrder(params){ //批次订单删除快捷流程
		return axios.post('/api/frontend/joint_purchase/super/group/order/examine/shortcut/del', params)
	},

	processFlowApplyForBatchOrder(params){ //批次订单集团添加&修改审核流程
		return axios.post('/api/frontend/joint_purchase/super/group/order/examine/create', params)
	},

	processFlowApplyDetailForBatchOrder(params){ //批次订单应用中的审核流程详情
		return axios.get('/api/frontend/joint_purchase/super/group/order/examine/detail', {params})
	},

	processFlowApplyListForBatchOrder(params){ //批次订单所属角色及子流程列表
		return axios.get('/api/frontend/joint_purchase/super/group/order/examine/list', {params})
	},

	customExamineForBatchOrder(params, orderId, recordId){ //批次订单自定义审核
		return axios.post('/api/frontend/joint_purchase/super/group/order/examine/customexamine/' + orderId + '/' + recordId, params)
	},

	departmentSignCheckForBatchOrder(params, id){ //批次订单成本部确认签收
		return axios.post('/api/frontend/joint_purchase/super/group/order/slave_order_department_sign_check/' + id, params)
	},

	signCheckForBatchOrder(params, id){ //批次订单联采部确认签收
		return axios.post('/api/frontend/joint_purchase/super/group/order/slave_order_sign_check/' + id, params)
	},

	groupBatchOrderProcess(params){ //集团批次订单状态进度
		return axios.get('/api/frontend/joint_purchase/super/group/process/lists', {params})
	},

	groupBatchOrderLogList(params, slave_order_no){ //集团批次订单操作日志
		return axios.get('/api/frontend/joint_purchase/super/group/process/logs/' + slave_order_no, {params})
	},

	orderReportList(params){//订单报表列表
		return axios.get('/api/frontend/joint_purchase/super/group/slave/order/lists',{params})
	},
	orderReportSum(params){//订单报表总量
		return axios.get('/api/frontend/joint_purchase/super/group/slave/order/sum',{params})
	},
	orderReportCount(params){//订单报表总价
		return axios.get('/api/frontend/joint_purchase/super/group/slave/order/count',{params})
	},

	NetworkPriceCount(params){ //批次订单财务部写入网价显示总额
		return axios.get('/api/frontend/joint_purchase/super/group/order/configure_actual_money', {params})
	},

	NetworkPriceUpdate(params, id){ //批次订单财务部写入网价确定按钮
		return axios.post('/api/frontend/joint_purchase/super/group/order/slave_order_price/' + id, params)
	},

	slaveOrderPay(params, slave_order_id){ //集团支付批次订单
		return axios.post('/api/frontend/joint_purchase/super/group/order/slave_order_pay/' + slave_order_id, params)
	},

	//集团 --- 银行账户
	bank_accountAdd(params){ //支付账户的添加
		return axios.post('/api/frontend/joint_purchase/super/group/bank_account/add', params)
	},

	bank_accountDetail(params, id){ //收付款账户详情
		return axios.get('/api/frontend/joint_purchase/super/group/bank_account/detail/' + id, {params})
	},

	bank_accountEdit(params, id){ //收付款账户的编辑
		return axios.post('/api/frontend/joint_purchase/super/group/bank_account/edit/' + id, params)
	},

	bank_nameList(params){ //银行名称列表
		return axios.get('/api/frontend/joint_purchase/super/group/bank_account/bank_list', {params})
	},

	bank_accountList(params){ //支付账户列表
		return axios.get('/api/frontend/joint_purchase/super/group/bank_account/lists', {params})
	},

	bank_accountDelete(params){ //支付账户删除
		return axios.post('/api/frontend/joint_purchase/super/group/bank_account/delete', params)
	},

	bank_accountSetDefault(params){ //设为默认账户
		return axios.post('/api/frontend/joint_purchase/super/group/bank_account/set', params)
	},

	//集团---支付信息列表
	payInformationList(params){ //支付信息列表
		return axios.get('/api/frontend/joint_purchase/super/group/web_pay/lists', {params})
	},

	groupPayToZhuniu(params){ //集团线上支付给筑牛
		return axios.post('/api/frontend/joint_purchase/super/group/web_pay/add', params)
	},

	groupPayToZhuniuDetail(params, id){ //集团线上支付给筑牛-详情
		return axios.get('/api/frontend/joint_purchase/super/group/web_pay/detail/' + id, {params})
	},

	groupPayToZhuniuEdit(params, pay_info_id){ //集团线上支付给筑牛-编辑
		return axios.post('/api/frontend/joint_purchase/super/group/web_pay/edit/' + pay_info_id, params)
	},

	grouptConfirmToPay(params){ //集团确定支付给筑牛
		return axios.post('/api/frontend/joint_purchase/super/group/web_pay/confirmpay ', params)
	},

	//分公司
	//多账号设置
	//新建账号
	branchroles(params){ //获取账户的角色列表
		return axios.get('/api/frontend/power/branch/member/roles', {params})
	},

	branchgroups(params){ //获取账户的组列表
		return axios.get('/api/frontend/power/branch/member/groups', {params})
	},

	branchuserAdd(params){ //新增账户
		return axios.get('/api/frontend/joint_purchase/super/branch/child/account/add', {params})
	},

	branchaccountInfo(params){ //账户详情
		return axios.get('/api/frontend/joint_purchase/super/branch/child/account/detail',{params})
	},

	branchuserUpdate(params){ //账户更新
		return axios.post('/api/frontend/joint_purchase/super/branch/child/account/update', params)
	},

	//组列表
	// branchgroupMember(params){ //组成员列表
	// 	return axios.get('/api/frontend/power/branch/member/lists', {params})
	// },
	branchgroupList(params){ //获取组列表
		return axios.get('/api/frontend/power/branch/group/lists', {params})
	},

	branchgroupDelete(params){ //组删除
		return axios.post('/api/frontend/power/branch/group/delete', params)
	},
	//组添加
	branchusersList(params){ //组添加账户列表
		return axios.get('/api/frontend/joint_purchase/super/branch/child/account/list',{params})
	},

	branchgroupCreat(params){ //组创建
		return axios.post('/api/frontend/power/branch/group/create',params)
	},

	branchgroupDetial(params){ //组详情
		return axios.get('/api/frontend/power/branch/group/detail',{params})
	},

	branchgroupUpdate(params){ //组修改
		return axios.post('/api/frontend/power/branch/group/update',params)
	},

	//角色管理
	branchrolesList(params){ //角色管理列表  and 组添加角色列表
		return axios.get('/api/frontend/power/branch/role/lists',{params})
	},

	branchrolesDelete(params){ //角色删除
		return axios.post('/api/frontend/power/branch/role/delete',params)
	},
	//新建角色
	branchroleCategory(params){ //角色类别下拉选
		return axios.get('/api/frontend/power/branch/tag/lists', {params})
	},

	branchroleCreat(params){ //角色新建
		return axios.post('/api/frontend/power/branch/role/create', params)
	},

	branchroleUpdate(params){ //角色更新
		return axios.post('/api/frontend/power/branch/role/update', params)
	},

	branchpermissionsList(params){ //权限列表（暂时不用）
		return axios.get('/api/frontend/power/branch/transfer/lists', {params})
	},

	//mobile start
	mobilebranchgroupCreat(params){ //组创建
		return axios.post('/api/frontend/power/branch/group/mobile/create',params)
	},

	mobilebranchgroupDetial(params){ //组详情
		return axios.get('/api/frontend/power/branch/group/mobile/detail',{params})
	},

	mobilebranchgroupUpdate(params){ //组修改
		return axios.post('/api/frontend/power/branch/group/mobile/update',params)
	},

	//角色管理
	mobilebranchroleCreat(params){ //角色新建
		return axios.post('/api/frontend/power/branch/role/mobile/create', params)
	},

	mobilebranchrolesList(params){ //角色管理列表  and 组添加角色列表
		return axios.get('api/frontend/power/branch/role/mobile/lists',{params})
	},

	mobilebranchroleUpdate(params){ //角色更新
		return axios.post('/api/frontend/power/branch/role/mobile/update', params)
	},

	mobilebranchpermissionsList(params){ //权限列表（暂时不用）
		return axios.get('/api/frontend/power/branch/transfer/mobile/lists', {params})
	},
	//mobile end

	//订单货量价
	branchConfirmVolumePrice(params, id){ //分公司确认货量价
		return axios.post('/api/frontend/joint_purchase/super/branch/order/confirm_slave_order/' + id, params)
	},

	//进度条（guanxiajie）
	branchBatchOrderProcess(params){ //分公司批次订单状态进度
		return axios.get('/api/frontend/joint_purchase/super/branch/process/lists', {params})
	},

	branchBatchOrderLogList(params, slave_order_no){ //分公司批次订单操作日志
		return axios.get('/api/frontend/joint_purchase/super/branch/process/logs/' + slave_order_no, {params})
	},

	NetworkPriceCount_branch(params){ //批次订单分公司显示总额
		return axios.get('/api/frontend/joint_purchase/super/branch/order/configure_actual_money', {params})
	},

	//供应商
	supplierProgress(params){ //供应商批次订单进度条和日志
		return axios.get('/api/frontend/joint_purchase/super/supplier/process/lists', {params})
	},

	NetworkPriceCount_supplier(params){ //批次订单供应商写入网价显示总额
		return axios.get('/api/frontend/joint_purchase/super/supplier/order/configure_actual_money', {params})
	},

	//供应商 --- 银行账户
	bank_accountAdd_supplier(params){ //银行账户的添加
		return axios.post('/api/frontend/joint_purchase/super/supplier/bank_account/add', params)
	},

	bank_accountEdit_supplier(params, id){ //银行账户的编辑
		return axios.post('/api/frontend/joint_purchase/super/supplier/bank_account/edit/' + id, params)
	},

	bank_nameList_supplier(params){ //银行名称列表
		return axios.get('/api/frontend/joint_purchase/super/supplier/bank_account/bank_list', {params})
	},

	bank_accountList_supplier(params){ //银行账户列表
		return axios.get('/api/frontend/joint_purchase/super/supplier/bank_account/lists', {params})
	},

	bank_accountDelete_supplier(params){ //银行账户删除
		return axios.post('/api/frontend/joint_purchase/super/supplier/bank_account/delete', params)
	},

	bank_accountSetDefault_supplier(params){ //设为默认账户
		return axios.post('/api/frontend/joint_purchase/super/supplier/bank_account/set', params)
	},

	paymentReceiveList_supplier(params){ //供应商收款信息列表
		return axios.get('/api/frontend/joint_purchase/super/supplier/web_pay/lists', {params})
	},

	paymentReceiveDetail_supplier(params, id){ //供应商收款信息详情
		return axios.get('/api/frontend/joint_purchase/super/supplier/web_pay/detail/' + id, {params})
	},

	bank_accountDetail_supplier(params, id){ //供应闪收付款账户详情
		return axios.get('/api/frontend/joint_purchase/super/supplier/bank_account/detail/' + id, {params})
	}
}

export default api_super