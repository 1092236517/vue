import group from '@/pages/groupP'
import groupmy from '@/components/group/groupmy'
import groupdemandList from '@/components/group/demandList'
import groupdemandDetail from '@/components/group/demandDetail'
import groupDemandOrderDetail from '@/components/group/GroupDemandOrderDetail'
import grouporderL from '@/components/group/orderL'
import grouporder from '@/components/group/order'
import grouporderReport from '@/components/group/OrderReports'
import groupmodeOfPayment from '@/components/group/modeOfPayment'
import groupPaymentInformationList from '@/components/group/PaymentInformationList'
import groupAccountInformation from '@/components/group/AccountInformation'
import groupAccountInformationAdd from '@/components/group/AccountInformationAdd'
import groupNetworkPriceManagement from '@/components/group/NetworkPriceManagement'
import groupNetworkPriceManagementDetail from '@/components/group/NetworkPriceManagementDetails'
import groupOffice from '@/components/group/office'
import groupJointData from '@/components/group/groupJointData'
import groupJointDataDetail from '@/components/group/groupJointDataDetail'
import groupPaymentManage from '@/components/group/paymentManage'
import groupPaymentAdd from '@/components/group/paymentAdd'
import multiAccount from '@/components/group/multiAccount'
import collectionList from '@/components/group/collectionList'
import collectionDetail from '@/components/group/collectionDetail'
import groupRolesManage from '@/components/group/RolesManage'
import grouprolesAdd from '@/components/group/rolesAdd'
import groupGroupList from '@/components/group/workGroupList'
import groupworkGroupAdd from '@/components/group/workGroupAdd'
import groupUserAdd from '@/components/group/UserAdd'
import groupProcessFlowList from '@/components/group/ProcessFlowList'
import groupCreateProcessFlow from '@/components/group/CreateProcessFlow'
import groupApplyProcessFlow from '@/components/group/ApplyProcessFlow'
import groupProcessFlowListForBatchOrder from '@/components/group/ProcessFlowListForBatchOrder'
import groupCreateProcessFlowForBatchOrder from '@/components/group/CreateProcessFlowForBatchOrder'
import groupApplyProcessFlowForBatchOrder from '@/components/group/ApplyProcessFlowForBatchOrder'
import groupPayResultUnderReview from '@/components/group/PayResultUnderReview'
import groupPayResultApproved from '@/components/group/PayResultApproved'
import groupAccount from '@/components/group/Account'
import groupRecord from '@/components/group/Record'
import groupPhone from '@/components/group/Phone'
import groupPassword from '@/components/group/Password'
import groupLogo from '@/components/group/Logo'
import groupRealname from '@/components/group/Realname'
import groupMsgCenter from '@/components/group/msgCenter'

const group_routes = [
	{
	    path:'/group',
	    name:'group',
	    component: group,
	    meta: {
	        requiresAuth: true
	    },
	    children:[
	        {
	            path: 'my',
	            name: 'groupmy',
	            component: groupmy,
	            meta: {
	                indexN:'NormalMyZhuNiu',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'demandList',
	            name: 'groupdemandList',
	            component: groupdemandList,
	            meta: {
	                indexN:'NormalJointPurchaseDemandList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'demandDetail/:id',
	            name: 'groupdemandDetail',
	            component: groupdemandDetail,
	            meta: {
	                indexN:'NormalJointPurchaseDemandList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'collectionList',
	            name: 'collectionList',
	            component: collectionList,
	            meta: {
	                indexN:'NormalJointPurchaseOrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'groupDemandOrderDetail/:id',
	            name: 'groupDemandOrderDetail',
	            component: groupDemandOrderDetail,
	            meta: {
	                indexN:'NormalJointPurchaseOrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'account',
	            name: 'groupaccount',
	            component: groupAccount,
	            meta: {
	                indexN:'NormalSecondMyAccount',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'record',
	            name: 'grouprecord',
	            component: groupRecord,
	            meta: {
	                indexN:'NormalTransactionRecord',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'orderL',
	            name: 'grouporderL',
	            component: grouporderL,
	            meta: {
	                indexN:'NormalOrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'order/:id',
	            name: 'grouporder',
	            component: grouporder,
	            meta: {
	                indexN:'NormalOrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'modeOfPayment/:order_no/:order_id',
	            name:'groupModeOfPayment',
	            component:groupmodeOfPayment,
	            meta:{
	                indexN:'',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'PaymentInformationList',
	            name:'groupPaymentInformationList',
	            component:groupPaymentInformationList,
	            meta:{
	                indexN:'NormalPayInfoList',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'AccountInformation',
	            name:'groupAccountInformation',
	            component:groupAccountInformation,
	            meta:{
	                indexN:'NormalMyAccountInfo',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'AccountInformationAdd',
	            name:'groupAccountInformationAdd',
	            component:groupAccountInformationAdd,
	            meta:{
	                indexN:'NormalMyAccountInfo',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'orderReport',
	            name: 'grouporderReport',
	            component: grouporderReport,
	            meta: {
	                indexN:'NormalOrderReport',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'NetworkPriceManagement',
	            name: 'groupNetworkPriceManagement',
	            component: groupNetworkPriceManagement,
	            meta: {
	                indexN:'NormalWebPriceManage',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'NetworkPriceManagementDetails/:id',
	            name: 'groupNetworkPriceManagementDetail',
	            component: groupNetworkPriceManagementDetail,
	            meta: {
	                indexN:'NormalWebPriceManage',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'Office',
	            name: 'groupOffice',
	            component: groupOffice,
	            meta: {
	                indexN:'NormalMyBranch',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'multiAccount',
	            name: 'groupmultiAccount',
	            component: multiAccount,
	            meta: {
	                indexN:'NormalMultipleAccountSettings',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'multiAccountEdit/:id',
	            name: 'groupmultiAccountEdit',
	            component: multiAccount,
	            meta: {
	                indexN:'NormalMultipleAccountSettings',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'phone',
	            name: 'groupphone',
	            component: groupPhone,
	            meta: {
	                indexN:'NormalChangePhone',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'password',
	            name: 'grouppassword',
	            component: groupPassword,
	            meta: {
	                indexN:'NormalChangePassword',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'logo',
	            name: 'grouplogo',
	            component: groupLogo,
	            meta: {
	                indexN:'NormalLOGO',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'realname',
	            name: 'grouprealname',
	            component: groupRealname,
	            meta: {
	                indexN:'NormalVerified',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'msg',
	            name: 'groupmsg',
	            component: groupMsgCenter,
	            meta: {
	                indexN:'NormalNewsCenter',
	                userId:1,
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'rolesManage',
	            name: 'groupRolesManage',
	            component: groupRolesManage,
	            meta: {
	                indexN: 'NormalRoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'rolesAdd/:id',
	            name: 'grouprolesAdd',
	            component: grouprolesAdd,
	            meta: {
	                indexN: 'NormalRoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'workGroupList',
	            name: 'groupGroupList',
	            component: groupGroupList,
	            meta: {
	                indexN: 'NormalGroupList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'workGroupAdd/:id',
	            name: 'groupworkGroupAdd',
	            component: groupworkGroupAdd,
	            meta: {
	                indexN: 'NormalGroupList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'userAdd',
	            name: 'groupUserAdd',
	            component: groupUserAdd,
	            meta: {
	                indexN: 'NormalMultipleAccountSettings',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'userEdit/:id',
	            name: 'groupUserEdit',
	            component: groupUserAdd,
	            meta: {
	                indexN: 'NormalMultipleAccountSettings',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'processFlowList',
	            name: 'groupProcessFlowList',
	            component: groupProcessFlowList,
	            meta: {
	                indexN: 'NormalProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'createProcessFlow',
	            name: 'groupCreateProcessFlow',
	            component: groupCreateProcessFlow,
	            meta: {
	                indexN: 'NormalProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'editProcessFlow/:id',
	            name: 'groupEditProcessFlow',
	            component: groupCreateProcessFlow,
	            meta: {
	                indexN: 'NormalProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'applyProcessFlow',
	            name: 'groupApplyProcessFlow',
	            component: groupApplyProcessFlow,
	            meta: {
	                indexN: 'NormalManagementList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'processFlowListForBatchOrder',
	            name: 'groupProcessFlowListForBatchOrder',
	            component: groupProcessFlowListForBatchOrder,
	            meta: {
	                indexN: 'NormalslaveOrderProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'createProcessFlowForBatchOrder',
	            name: 'groupCreateProcessFlowForBatchOrder',
	            component: groupCreateProcessFlowForBatchOrder,
	            meta: {
	                indexN: 'NormalslaveOrderProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'editProcessFlowForBatchOrder/:id',
	            name: 'groupEditProcessFlowForBatchOrder',
	            component: groupCreateProcessFlowForBatchOrder,
	            meta: {
	                indexN: 'NormalslaveOrderProcessList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'applyProcessFlowForBatchOrder',
	            name: 'groupApplyProcessFlowForBatchOrder',
	            component: groupApplyProcessFlowForBatchOrder,
	            meta: {
	                indexN: 'NormalslaveOrderManagementList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'jointdata',
	            name: 'groupjointdata',
	            component: groupJointData,
	            meta: {
	                indexN: 'NormalJointPurchaseDataSummary',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'jointdatadetail/:id',
	            name: 'groupjointdatadetail',
	            component: groupJointDataDetail,
	            meta: {
	                indexN: 'NormalJointPurchaseDataSummary',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'paymentManage',
	            name: 'groupPaymentManage',
	            component: groupPaymentManage,
	            meta: {
	                indexN: 'NormalSecondPaymentManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'paymentAdd',
	            name: 'groupPaymentAdd',
	            component: groupPaymentAdd,
	            meta: {
	                indexN: 'NormalAddPayments',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'payUnderReview',
	            name: 'groupPayResultUnderReview',
	            component: groupPayResultUnderReview,
	            meta: {
	                indexN: '',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'payApproved',
	            name: 'groupPayResultApproved',
	            component: groupPayResultApproved,
	            meta: {
	                indexN: '',
	                requiresAuth: true
	            }
	        }
	    ]
	}
]

export default group_routes