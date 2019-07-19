import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		routeList: [
			//集团-super
			{
				tag: 'MyZhuNiu',
				route: '/group_super/my_super',
				icon: 'iconfont icon-shouye'
			},
			{
				tag: 'JointPurchaseCenter',
				route: null,
				redirect:'/group_super/demandList_super',
				icon: 'iconfont icon-renyuanguanli'
			},
			{
				tag: 'JointPurchaseDemandList',
				route: '/group_super/demandList_super',
				icon: ''
			},
			{
				tag: 'JointPurchaseOrderList',
				route: '/group_super/collectionList_super',
				icon: ''
			},
			{
				tag: 'OrderManage',
				route: null,
				redirect:'/group_super/orderL_super',
				icon: 'iconfont icon-dingdan2'
			},
			{
				tag: 'OrderList',
				route: '/group_super/orderL_super',
				icon: ''
			},
			{
				tag: 'SlaveOrderReport',
				route: '/group_super/orderReport_super',
				icon: ''
			},
			{
				tag: 'WebPriceManage',
				route: '/group_super/NetworkPriceManagement_super',
				icon: 'iconfont icon-jiage'
			},
			{
				tag: 'PayInfoList',
				route: '/group_super/PaymentInformationList_super',
				icon: 'iconfont icon-jiage'
			},
			{
				tag: 'MyBranch',
				route: '/group_super/Office_super',
				icon: 'iconfont icon-loufang'
			},
			{
				tag: 'MyAccount',
				route: null,
				redirect:'/group_super/account_super',
				icon: 'iconfont icon-wenjianjia'
			},
			{
				tag: 'MyAccountInfo',
				route: '/group_super/AccountInformation_super',
				icon: ''
			},
			{
				tag: 'MyReceiveAccountInfo',
				route: '/group_super/AccountInformationReceive_super',
				icon: ''
			},
			{
				tag: 'SecondMyAccount',
				route: '/group_super/account_super',
				icon: ''
			},
			{
				tag: 'TransactionRecord',
				route: '/group_super/record_super',
				icon: ''
			},
			{
				tag: 'SystemSettings',
				route: null,
				redirect:'/group_super/realname_super',
				icon: 'iconfont icon-shezhi'
			},
			{
				tag: 'Verified',
				route: '/group_super/realname_super',
				icon: ''
			},
			{
				tag: 'LOGO',
				route: '/group_super/logo_super',
				icon: ''
			},
			{
				tag: 'MultipleAccountSettings',
				route: '/group_super/multiAccount_super',
				icon: ''
			},
			{
				tag: 'ChangePassword',
				route: '/group_super/password_super',
				icon: ''
			},
			{
				tag: 'ChangePhone',
				route: '/group_super/phone_super',
				icon: ''
			},
			{
				tag: 'RoleManagement',
				route: '/group_super/rolesManage',
				icon: ''
			},
			{
				tag: 'GroupList',
				route: '/group_super/workGroupList',
				icon: ''
			},
			{
				tag: 'ProcessList',
				route: '/group_super/processFlowList',
				icon: ''
			},
			{
				tag: 'ManagementList',
				route: '/group_super/applyProcessFlow',
				icon: ''
			},
			{
				tag: 'MobileRoleManagement',
				route: '/group_super/MobileRoleManagement',
				icon: ''
			},
			{
				tag: 'MobileGroupList',
				route: '/group_super/MobileGroupList',
				icon: ''
			},
			{
				tag: 'slaveOrderProcessList',
				route: '/group_super/processFlowListForBatchOrder',
				icon: ''
			},
			{
				tag: 'slaveOrderManagementList',
				route: '/group_super/applyProcessFlowForBatchOrder',
				icon: ''
			},
			{
				tag: 'NewsCenter',
				route: '/group_super/msg_super',
				icon: 'iconfont icon-xiaoxi1'
			},
			{
				tag: 'JointPurchaseData',
				route: null,
				redirect:'/group_super/JointData_super',
				icon: 'iconfont icon-shujuzhanshi2'
			},
			{
				tag: 'JointPurchaseDataSummary',
				route: '/group_super/JointData_super',
				icon: ''
			},
			{
				tag: 'PaymentManagement',
				route: null,
				redirect: '/group_super/paymentManage',
				icon: 'iconfont icon-fukuanfangshisel'
			},
			{
				tag: 'SecondPaymentManagement',
				route: '/group_super/paymentManage',
				icon: ''
			},
			{
				tag: 'AddPayments',
				route: '/group_super/paymentAdd',
				icon: ''
			},
			//分公司-super
			{
				tag: 'BranchMyZhuNiu',
				route: '/purchasers_super/my_super',
				icon: 'iconfont icon-shouye'
			},
			{
				tag: 'BranchMyDemandList',
				route: '/purchasers_super/demand_super',
				icon: 'iconfont icon-dingdan'
			},
			{
				tag: 'BranchOrderList',
				route: '/purchasers_super/order_super',
				icon: 'iconfont icon-dingdan2'
			},
			{
				tag: 'BranchMyAccount',
				route: null,
				redirect:'/purchasers_super/account_super',
				icon: 'iconfont icon-wenjianjia'
			},
			{
				tag: 'BranchSecondMyAccount',
				route: '/purchasers_super/account_super',
				icon: ''
			},
			{
				tag: 'BranchTransactionRecord',
				route: '/purchasers_super/record_super',
				icon: ''
			},
			{
				tag: 'BranchSystemSettings',
				route: null,
				redirect:'/purchasers_super/name_super',
				icon: 'iconfont icon-shezhi'
			},
			{
				tag: 'BranchVerified',
				route: '/purchasers_super/name_super',
				icon: ''
			},
			{
				tag: 'BranchLogo',
				route: '/purchasers_super/logo_super',
				icon: ''
			},
			{
				tag: 'BranchChangePassword',
				route: '/purchasers_super/password_super',
				icon: ''
			},
			{
				tag: 'BranchChangePhone',
				route: '/purchasers_super/phone_super',
				icon: ''
			},
			{
				tag: 'BranchMultiAccount',
				route: '/purchasers_super/multiAccount_super',
				icon: ''
			},
			{
				tag:'BranchRoleManagement',
				route:'/purchasers_super/rolesManage',
				icon: ''
			},
			{
				tag:'BranchGroupList',
				route:'/purchasers_super/workGroupList',
				icon: ''
			},
			{
				tag: 'MobileBranchRoleManagement',
				route: '/purchasers_super/MobileRoleManagement',
				icon: ''
			},
			{
				tag: 'MobileBranchGroupList',
				route: '/purchasers_super/MobileGroupList',
				icon: ''
			},
			{
				tag: 'BranchNewsCenter',
				route: '/purchasers_super/msg_super',
				icon: 'iconfont icon-xiaoxi1'
			},

			//集团-normal
			{
				tag: 'NormalMyZhuNiu',
				route: '/group/my',
				icon: 'iconfont icon-shouye'
			},
			{
				tag: 'NormalJointPurchaseCenter',
				route: null,
				redirect:'/group/demandList',
				icon: 'iconfont icon-renyuanguanli'
			},
			{
				tag: 'NormalJointPurchaseDemandList',
				route: '/group/demandList',
				icon: ''
			},
			{
				tag: 'NormalJointPurchaseOrderList',
				route: '/group/collectionList',
				icon: ''
			},
			{
				tag: 'NormalOrderManage',
				route: null,
				redirect:'/group/orderL',
				icon: 'iconfont icon-dingdan2'
			},
			{
				tag: 'NormalOrderList',
				route: '/group/orderL',
				icon: 'iconfont icon-dingdan2'
			},
			{
				tag: 'NormalSlaveOrderReport',
				route: '/group/orderReport',
				icon: ''
			},
			{
				tag: 'NormalWebPriceManage',
				route: '/group/NetworkPriceManagement',
				icon: 'iconfont icon-jiage'
			},
			{
				tag: 'NormalPayInfoList',
				route: '/group/PaymentInformationList',
				icon: 'iconfont icon-jiage'
			},
			{
				tag: 'NormalMyBranch',
				route: '/group/Office',
				icon: 'iconfont icon-loufang'
			},
			{
				tag: 'NormalMyAccount',
				route: null,
				redirect:'/group/account',
				icon: 'iconfont icon-wenjianjia'
			},
			{
				tag: 'NormalMyAccountInfo',
				route: '/group/AccountInformation',
				icon: ''
			},
			{
				tag: 'NormalSecondMyAccount',
				route: '/group/account',
				icon: ''
			},
			{
				tag: 'NormalTransactionRecord',
				route: '/group/record',
				icon: ''
			},
			{
				tag: 'NormalSystemSettings',
				route: null,
				redirect:'/group/realname',
				icon: 'iconfont icon-shezhi'
			},
			{
				tag: 'NormalVerified',
				route: '/group/realname',
				icon: ''
			},
			{
				tag: 'NormalLOGO',
				route: '/group/logo',
				icon: ''
			},
			{
				tag: 'NormalMultipleAccountSettings',
				route: '/group/multiAccount',
				icon: ''
			},
			{
				tag: 'NormalChangePassword',
				route: '/group/password',
				icon: ''
			},
			{
				tag: 'NormalChangePhone',
				route: '/group/phone',
				icon: ''
			},
			{
				tag: 'NormalRoleManagement',
				route: '/group/rolesManage',
				icon: ''
			},
			{
				tag: 'NormalGroupList',
				route: '/group/workGroupList',
				icon: ''
			},
			{
				tag: 'NormalProcessList',
				route: '/group/processFlowList',
				icon: ''
			},
			{
				tag: 'NormalManagementList',
				route: '/group/applyProcessFlow',
				icon: ''
			},
			{
				tag: 'NormalslaveOrderProcessList',
				route: '/group/processFlowListForBatchOrder',
				icon: ''
			},
			{
				tag: 'NormalslaveOrderManagementList',
				route: '/group/applyProcessFlowForBatchOrder',
				icon: ''
			},
			{
				tag: 'NormalNewsCenter',
				route: '/group/msg',
				icon: 'iconfont icon-xiaoxi1'
			},
			{
				tag: 'NormalJointPurchaseData',
				route: null,
				redirect:'/group/JointData',
				icon: 'iconfont icon-shujuzhanshi2'
			},
			{
				tag: 'NormalJointPurchaseDataSummary',
				route: '/group/JointData',
				icon: ''
			},
			{
				tag: 'NormalPaymentManagement',
				route: null,
				redirect: '/group/paymentManage',
				icon: 'iconfont icon-fukuanfangshisel'
			},
			{
				tag: 'NormalSecondPaymentManagement',
				route: '/group/paymentManage',
				icon: ''
			},
			{
				tag: 'NormalAddPayments',
				route: '/group/paymentAdd',
				icon: ''
			},
			//分公司-normal
			{
				tag: 'NormalBranchMyZhuNiu',
				route: '/purchmy',
				icon: 'iconfont icon-shouye'
			},
			{
				tag: 'NormalBranchMyDemandList',
				route: '/demand',
				icon: 'iconfont icon-dingdan'
			},
			{
				tag: 'NormalBranchOrderList',
				route: '/purchorder',
				icon: 'iconfont icon-dingdan2'
			},
			{
				tag: 'NormalBranchMyAccount',
				route: null,
				redirect:'/purchaccount',
				icon: 'iconfont icon-wenjianjia'
			},
			{
				tag: 'NormalBranchSecondMyAccount',
				route: '/purchaccount',
				icon: ''
			},
			{
				tag: 'NormalBranchTransactionRecord',
				route: '/purchrecord',
				icon: ''
			},
			{
				tag: 'NormalBranchSystemSettings',
				route: null,
				redirect:'/purchname',
				icon: 'iconfont icon-shezhi'
			},
			{
				tag: 'NormalBranchVerified',
				route: '/purchname',
				icon: ''
			},
			{
				tag: 'NormalBranchLogo',
				route: '/purchlogo',
				icon: ''
			},
			{
				tag: 'NormalBranchChangePassword',
				route: '/purchpassword',
				icon: ''
			},
			{
				tag: 'NormalBranchChangePhone',
				route: '/purchphone',
				icon: ''
			},
			{
				tag: 'NormalBranchMultiAccount',
				route: '/multiAccoun',
				icon: ''
			},
			{
				tag:'NormalBranchRoleManagement',
				route:'/rolesManage',
				icon: ''
			},
			{
				tag:'NormalBranchGroupList',
				route:'/workGroupList',
				icon: ''
			},
			{
				tag: 'NormalBranchNewsCenter',
				route: '/purchmsg',
				icon: 'iconfont icon-xiaoxi1'
			}
		],
		sideBarMenuDataForGroup: window.localStorage.getItem('sideBarMenuDataForGroup') || null,
		currentUserRoles: window.localStorage.getItem('currentUserRoles') || null,
		currentUserRoleName: window.localStorage.getItem('currentUserRoleName') || null
	},
	mutations: {
		sign_in_for_group(state,data){
			if(data.data){
				window.localStorage.setItem('sideBarMenuDataForGroup', JSON.stringify(data.data));
			}
			if(data.roleIds){
				window.localStorage.setItem('currentUserRoles', JSON.stringify(data.roleIds));
			}
			if(data.identity){
				window.localStorage.setItem('currentUserRoleName', JSON.stringify(data.identity));
			}
			state.sideBarMenuDataForGroup = JSON.stringify(data.data);
			state.currentUserRoles = JSON.stringify(data.roleIds);
			state.currentUserRoleName = JSON.stringify(data.identity)
		},
		sign_out_for_group(state){
			window.localStorage.removeItem('sideBarMenuDataForGroup');
			window.localStorage.removeItem('currentUserRoles');
			window.localStorage.removeItem('currentUserRoleName');
			state.sideBarMenuDataForGroup = null;
			state.currentUserRoles = null;
			state.currentUserRoleName = null;
		}
	},
	getters: {
		authForGroup(state){ //平铺侧边栏数据和权限
			let authObj = {};
			let list = state.sideBarMenuDataForGroup;
			if(list){
				JSON.parse(list).forEach((item,idnex) => {
					if(item.child_channels.length == 0){
						authObj[item.tag] = {};
						authObj[item.tag]['tag'] = item.tag;
						authObj[item.tag]['transfers'] = item.transfers;
						authObj[item.tag]['name'] = item.name;
						authObj[item.tag]['id'] = item.id;
					}else{
						item.child_channels.forEach(function(childItem, childIdnex){
							authObj[childItem.tag] = {};
							authObj[childItem.tag]['tag'] = childItem.tag;
							authObj[childItem.tag]['transfers'] = childItem.transfers;
							authObj[childItem.tag]['name'] = childItem.name;
							authObj[childItem.tag]['id'] = childItem.id;
						})
					}
				})
			}
			return authObj
		},
		sideBarMenuDataWithIcon(state){ //侧边栏添加icon
			let sideBar = new Array();
			if(state.sideBarMenuDataForGroup){
				sideBar = JSON.parse(state.sideBarMenuDataForGroup).map((item, index) => {
					state.routeList.forEach((routeListItem, routeListIndex) => {
						if(routeListItem.tag == item.tag){
							item.icon = routeListItem.icon;
						}
					})
					if(item.child_channels.length > 0){
						item.child_channels.forEach((childItem, childIdnex) => {
							state.routeList.forEach((routeListItem, routeListIndex) => {
								if(routeListItem.tag == childItem.tag){
									childItem.icon = routeListItem.icon;
								}
							})
						})
					}
					return item
				})
			}
			return sideBar
		}
	}
})

export default store