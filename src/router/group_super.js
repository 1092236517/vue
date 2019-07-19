import group_super from '@/pages/groupP_super'
import groupmy_super from '@/components/group_super/groupmy'
import groupdemandList_super from '@/components/group_super/demandList'
import groupdemandDetail_super from '@/components/group_super/demandDetail'
import grouporderL_super from '@/components/group_super/orderL'
import grouporder_super from '@/components/group_super/order'
import grouporderReport_super from '@/components/group_super/OrderReports'
import groupmodeOfPayment_super from '@/components/group_super/modeOfPayment'
import groupPaymentInformationList_super from '@/components/group_super/PaymentInformationList'
import groupPaymentDetail_super from '@/components/group_super/PaymentDetail'
import groupAccountInformation_super from '@/components/group_super/AccountInformation'
import groupAccountInformationReceive_super from '@/components/group_super/AccountInformationReceive'
import groupAccountInformationAdd_super from '@/components/group_super/AccountInformationAdd'
import groupAccountInformationAddReceive_super from '@/components/group_super/AccountInformationAddReceive'
import groupNetworkPriceManagement_super from '@/components/group_super/NetworkPriceManagement'
import groupNetworkPriceManagementDetail_super from '@/components/group_super/NetworkPriceManagementDetails'
import groupOffice_super from '@/components/group_super/office'
import groupJointData_super from '@/components/group_super/groupJointData'
import groupJointDataDetail_super from '@/components/group_super/groupJointDataDetail'
import groupPaymentManage_super from '@/components/group_super/paymentManage'
import groupPaymentAdd_super from '@/components/group_super/paymentAdd'
import multiAccount_super from '@/components/group_super/multiAccount'
import collectionList_super from '@/components/group_super/collectionList'
import collectionDetail_super from '@/components/group_super/collectionDetail'
import groupRolesManage_super from '@/components/group_super/RolesManage'
import grouprolesAdd_super from '@/components/group_super/rolesAdd'
import groupGroupList_super from '@/components/group_super/workGroupList'
import groupworkGroupAdd_super from '@/components/group_super/workGroupAdd'
import groupUserAdd_super from '@/components/group_super/UserAdd'
import groupProcessFlowList_super from '@/components/group_super/ProcessFlowList'
import groupCreateProcessFlow_super from '@/components/group_super/CreateProcessFlow'
import groupApplyProcessFlow_super from '@/components/group_super/ApplyProcessFlow'
import groupProcessFlowListForBatchOrder_super from '@/components/group_super/ProcessFlowListForBatchOrder'
import groupCreateProcessFlowForBatchOrder_super from '@/components/group_super/CreateProcessFlowForBatchOrder'
import groupApplyProcessFlowForBatchOrder_super from '@/components/group_super/ApplyProcessFlowForBatchOrder'
import groupManageLog_super from '@/components/group_super/ManageLog'
import groupPayResultUnderReview_super from '@/components/group_super/PayResultUnderReview'
import groupPayResultApproved_super from '@/components/group_super/PayResultApproved'
import groupAccount_super from '@/components/group_super/Account'
import groupRecord_super from '@/components/group_super/Record'
import groupPhone_super from '@/components/group_super/Phone'
import groupPassword_super from '@/components/group_super/Password'
import groupLogo_super from '@/components/group_super/Logo'
import groupRealname_super from '@/components/group_super/Realname'
import groupMsgCenter_super from '@/components/group_super/msgCenter'

import groupMobileRoleManagement from '@/components/group_super/MobileRoleManagement'
import groupMobileRolesAdd from '@/components/group_super/MobileRolesAdd'
import groupMobileGroupList from '@/components/group_super/MobileGroupList'
import groupMobileGroupAdd from '@/components/group_super/MobileGroupAdd'

const group_super_routes = [
	{
	    path:'/group_super',
	    name:'group_super',
	    component: group_super,
	    meta: {
	        requiresAuth: true
	    },
	    children:[
	        {
	            path: 'my_super',
	            name: 'groupmy_super',
	            component: groupmy_super,
	            meta: {
	                indexN:'MyZhuNiu',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'demandList_super',
	            name: 'groupdemandList_super',
	            component: groupdemandList_super,
	            meta: {
	                indexN:'JointPurchaseDemandList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'demandDetail_super/:id',
	            name: 'groupdemandDetail_super',
	            component: groupdemandDetail_super,
	            meta: {
	                indexN:'JointPurchaseDemandList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'collectionList_super',
	            name: 'collectionList_super',
	            component: collectionList_super,
	            meta: {
	                indexN:'JointPurchaseOrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'collectionDetail_super/:id',
	            name: 'collectionDetail_super',
	            component: collectionDetail_super,
	            meta: {
	                indexN:'JointPurchaseOrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'account_super',
	            name: 'groupaccount_super',
	            component: groupAccount_super,
	            meta: {
	                indexN:'SecondMyAccount',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'record_super',
	            name: 'grouprecord_super',
	            component: groupRecord_super,
	            meta: {
	                indexN:'TransactionRecord',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'orderL_super',
	            name: 'grouporderL_super',
	            component: grouporderL_super,
	            meta: {
	                indexN:'OrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'order_super/:id',
	            name: 'grouporder_super',
	            component: grouporder_super,
	            meta: {
	                indexN:'OrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'modeOfPayment_super/:order_no/:order_id',
	            name:'groupModeOfPayment_super',
	            component:groupmodeOfPayment_super,
	            meta:{
	                indexN:'',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'super/modeOfPayment/edit/:order_no/:order_id',
	            name: 'groupModeOfPaymentEdit_super',
	            component: groupmodeOfPayment_super,
	            meta:{
	                indexN: '',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'PaymentInformationList_super',
	            name:'groupPaymentInformationList_super',
	            component:groupPaymentInformationList_super,
	            meta:{
	                indexN:'PayInfoList',
	                requiresAuth: true
	            }
	        },
	        {
	        	path: 'PaymentDetail_super/:id',
	        	name: 'groupPaymentDetail_super',
	        	component: groupPaymentDetail_super,
	        	meta: {
	        		indexN: 'PayInfoList',
	        		requiresAuth: true
	        	}
	        },
	        {
	            path:'AccountInformation_super',
	            name:'groupAccountInformation_super',
	            component:groupAccountInformation_super,
	            meta:{
	                indexN:'MyAccountInfo',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'AccountInformationReceive_super',
	            name: 'groupAccountInformationReceive_super',
	            component: groupAccountInformationReceive_super,
	            meta: {
	                indexN:'MyReceiveAccountInfo',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'AccountInformationAdd_super',
	            name:'groupAccountInformationAdd_super',
	            component:groupAccountInformationAdd_super,
	            meta:{
	                indexN:'MyAccountInfo',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'AccountInformationAddReceive_super',
	            name: 'groupAccountInformationAddReceive_super',
	            component: groupAccountInformationAddReceive_super,
	            meta: {
	                indexN: 'MyReceiveAccountInfo',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'AccountInformationEdit_super/:id',
	            name: 'groupAccountInformationEdit_super',
	            component: groupAccountInformationAdd_super,
	            meta: {
	                indexN:'MyAccountInfo',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'AccountInformationReceiveEdit_super/:id',
	            name: 'groupAccountInformationReceiveEdit_super',
	            component: groupAccountInformationAddReceive_super,
	            meta: {
	                indexN: 'MyReceiveAccountInfo',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'orderReport_super',
	            name: 'grouporderReport_super',
	            component: grouporderReport_super,
	            meta: {
	                indexN:'OrderReport',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'NetworkPriceManagement_super',
	            name: 'groupNetworkPriceManagement_super',
	            component: groupNetworkPriceManagement_super,
	            meta: {
	                indexN:'WebPriceManage',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'NetworkPriceManagementDetails_super/:id',
	            name: 'groupNetworkPriceManagementDetail_super',
	            component: groupNetworkPriceManagementDetail_super,
	            meta: {
	                indexN:'WebPriceManage',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'Office_super',
	            name: 'groupOffice_super',
	            component: groupOffice_super,
	            meta: {
	                indexN:'MyBranch',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'multiAccount_super',
	            name: 'groupmultiAccount_super',
	            component: multiAccount_super,
	            meta: {
	                indexN:'MultipleAccountSettings',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'multiAccountEdit_super/:id',
	            name: 'groupmultiAccountEdit_super',
	            component: multiAccount_super,
	            meta: {
	                indexN:'MultipleAccountSettings',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'phone_super',
	            name: 'groupphone_super',
	            component: groupPhone_super,
	            meta: {
	                indexN:'ChangePhone',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'password_super',
	            name: 'grouppassword_super',
	            component: groupPassword_super,
	            meta: {
	                indexN:'ChangePassword',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'logo_super',
	            name: 'grouplogo_super',
	            component: groupLogo_super,
	            meta: {
	                indexN:'LOGO',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'realname_super',
	            name: 'grouprealname_super',
	            component: groupRealname_super,
	            meta: {
	                indexN:'Verified',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'msg_super',
	            name: 'groupmsg_super',
	            component: groupMsgCenter_super,
	            meta: {
	                indexN:'NewsCenter',
	                userId:1,
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'rolesManage',
	            name: 'groupRolesManage_super',
	            component: groupRolesManage_super,
	            meta: {
	                indexN: 'RoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'rolesAdd/:id',
	            name: 'grouprolesAdd_super',
	            component: grouprolesAdd_super,
	            meta: {
	                indexN: 'RoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'workGroupList',
	            name: 'groupGroupList_super',
	            component: groupGroupList_super,
	            meta: {
	                indexN: 'GroupList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'workGroupAdd/:id',
	            name: 'groupworkGroupAdd_super',
	            component: groupworkGroupAdd_super,
	            meta: {
	                indexN: 'GroupList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'userAdd',
	            name: 'groupUserAdd_super',
	            component: groupUserAdd_super,
	            meta: {
	                indexN: 'MultipleAccountSettings',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'userEdit/:id',
	            name: 'groupUserEdit_super',
	            component: groupUserAdd_super,
	            meta: {
	                indexN: 'MultipleAccountSettings',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'processFlowList',
	            name: 'groupProcessFlowList_super',
	            component: groupProcessFlowList_super,
	            meta: {
	                indexN: 'ProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'createProcessFlow',
	            name: 'groupCreateProcessFlow_super',
	            component: groupCreateProcessFlow_super,
	            meta: {
	                indexN: 'ProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'editProcessFlow/:id',
	            name: 'groupEditProcessFlow_super',
	            component: groupCreateProcessFlow_super,
	            meta: {
	                indexN: 'ProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'applyProcessFlow',
	            name: 'groupApplyProcessFlow_super',
	            component: groupApplyProcessFlow_super,
	            meta: {
	                indexN: 'ManagementList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'processFlowListForBatchOrder',
	            name: 'groupProcessFlowListForBatchOrder_super',
	            component: groupProcessFlowListForBatchOrder_super,
	            meta: {
	                indexN: 'slaveOrderProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'createProcessFlowForBatchOrder',
	            name: 'groupCreateProcessFlowForBatchOrder_super',
	            component: groupCreateProcessFlowForBatchOrder_super,
	            meta: {
	                indexN: 'slaveOrderProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'editProcessFlowForBatchOrder/:id',
	            name: 'groupEditProcessFlowForBatchOrder_super',
	            component: groupCreateProcessFlowForBatchOrder_super,
	            meta: {
	                indexN: 'slaveOrderProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'applyProcessFlowForBatchOrder',
	            name: 'groupApplyProcessFlowForBatchOrder_super',
	            component: groupApplyProcessFlowForBatchOrder_super,
	            meta: {
	                indexN: 'slaveOrderManagementList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'manageLog',
	            name: 'groupManageLog_super',
	            component: groupManageLog_super,
	            meta: {
	                indexN: 'ManagementLog',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'jointdata_super',
	            name: 'groupjointdata_super',
	            component: groupJointData_super,
	            meta: {
	                indexN: 'JointPurchaseDataSummary',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'jointdatadetail_super/:id',
	            name: 'groupjointdatadetail_super',
	            component: groupJointDataDetail_super,
	            meta: {
	                indexN: 'JointPurchaseDataSummary',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'paymentManage',
	            name: 'groupPaymentManage_super',
	            component: groupPaymentManage_super,
	            meta: {
	                indexN: 'SecondPaymentManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'paymentAdd',
	            name: 'groupPaymentAdd_super',
	            component: groupPaymentAdd_super,
	            meta: {
	                indexN: 'AddPayments',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'payUnderReview',
	            name: 'groupPayResultUnderReview_super',
	            component: groupPayResultUnderReview_super,
	            meta: {
	                indexN: '',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'payApproved',
	            name: 'groupPayResultApproved_super',
	            component: groupPayResultApproved_super,
	            meta: {
	                indexN: '',
	                requiresAuth: true
	            }
			},
			{
	            path: 'MobileRoleManagement',
	            name: 'groupMobileRoleManagement',
	            component: groupMobileRoleManagement,
	            meta: {
	                indexN: 'MobileRoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'MobileRolesAdd/:id',
	            name: 'groupMobileRolesAdd',
	            component: groupMobileRolesAdd,
	            meta: {
	                indexN: 'MobileRoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'MobileGroupList',
	            name: 'groupMobileGroupList',
	            component: groupMobileGroupList,
	            meta: {
	                indexN: 'MobileGroupList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'MobileGroupAdd/:id',
	            name: 'groupMobileGroupAdd',
	            component: groupMobileGroupAdd,
	            meta: {
	                indexN: 'MobileGroupList',
	                requiresAuth: true
	            }
	        },
	    ]
	}
]

export default group_super_routes