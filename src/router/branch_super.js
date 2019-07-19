import purchasers_super from '@/pages/purchasersP_super'
import purchdemand_super from '@/components/purchasers_super/demand'
import purchdemandDetial_super from '@/components/purchasers_super/demandDetial'
import purchOrderL_super from '@/components/purchasers_super/orderList'
import purchmy_super from '@/components/purchasers_super/purchmy'
import purchorderN_super from '@/components/purchasers_super/order'
import branchDemandDetail_super from '@/components/purchasers_super/branchDemandDetail'
import branchMultiAccount_super from '@/components/purchasers_super/multiAccount'
import branchUserAdd_super from '@/components/purchasers_super/UserAdd'
import branchRolesManage_super from '@/components/purchasers_super/RolesManage'
import branchrolesAdd_super from '@/components/purchasers_super/rolesAdd'
import branchGroupList_super from '@/components/purchasers_super/workGroupList'
import branchworkGroupAdd_super from '@/components/purchasers_super/workGroupAdd'
import branchManageLog_super from '@/components/purchasers_super/ManageLog'
import branchAccount_super from '@/components/purchasers_super/Account'
import branchRecord_super from '@/components/purchasers_super/Record'
import branchPhone_super from '@/components/purchasers_super/Phone'
import branchPassword_super from '@/components/purchasers_super/Password'
import branchLogo_super from '@/components/purchasers_super/Logo'
import branchRealname_super from '@/components/purchasers_super/Realname'
import branchMsgCenter_super from '@/components/purchasers_super/msgCenter'
import PurchaseAgreement_super from '@/components/purchasers_super/PurchaseAgreement'

import branchMobileRoleManagement from '@/components/purchasers_super/MobileRoleManagement'
import branchMobileRolesAdd from '@/components/purchasers_super/MobileRolesAdd'
import branchMobileGroupList from '@/components/purchasers_super/MobileGroupList'
import branchMobileGroupAdd from '@/components/purchasers_super/MobileGroupAdd'

const branch_super_routes = [
	{
	    path:'/purchasers_super',
	    name:'purchasers_super',
	    component: purchasers_super,
	    meta: {
	        requiresAuth: true
	    },
	    children:[
	        {
	            path: 'my_super',
	            name: 'purchmy_super',
	            component: purchmy_super,
	            meta: {
	                indexN:'BranchMyZhuNiu',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'demand_super',
	            name: 'purchdemand_super',
	            component: purchdemand_super,
	            meta: {
	                indexN:'BranchMyDemandList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'demandDetial_super/:id/:isedit',
	            name: 'purchdemandDetial_super',
	            component: purchdemandDetial_super,
	            meta: {
	                indexN:'BranchMyDemandList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'branchDemandDetail_super/:id',
	            name: 'branchDemandDetail_super',
	            component: branchDemandDetail_super,
	            meta: {
	                indexN: 'BranchMyDemandList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'order_super',
	            name: 'purchorder_super',
	            component: purchOrderL_super,
	            meta: {
	                indexN:'BranchOrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'orderN_super/:id',
	            name: 'purchorderN_super',
	            component: purchorderN_super,
	            meta: {
	                indexN:'BranchOrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'account_super',
	            name: 'purchaccount_super',
	            component: branchAccount_super,
	            meta: {
	                indexN:'BranchSecondMyAccount',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'record_super',
	            name: 'purchrecord_super',
	            component: branchRecord_super,
	            meta: {
	                indexN:'BranchTransactionRecord',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'phone_super',
	            name: 'purchphone_super',
	            component: branchPhone_super,
	            meta: {
	                indexN:'BranchChangePhone',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'password_super',
	            name: 'purchpassword_super',
	            component: branchPassword_super,
	            meta: {
	                indexN:'BranchChangePassword',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'logo_super',
	            name: 'purchlogo_super',
	            component: branchLogo_super,
	            meta: {
	                indexN:'BranchLogo',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'name_super',
	            name: 'purchname_super',
	            component: branchRealname_super,
	            meta: {
	                indexN:'BranchVerified',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'multiAccount_super',
	            name: 'branchMultiAccount_super',
	            component: branchMultiAccount_super,
	            meta: {
	                indexN: 'BranchMultiAccount',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'multiAccountEdit_super/:id',
	            name: 'branchMultiAccountEdit_super',
	            component: branchMultiAccount_super,
	            meta: {
	                indexN: 'BranchMultiAccount',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'msg_super',
	            name: 'purchmsg_super',
	            component: branchMsgCenter_super,
	            meta: {
	                indexN:'BranchNewsCenter',
	                userId:2,
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'rolesManage',
	            name: 'branchRolesManage_super',
	            component: branchRolesManage_super,
	            meta: {
	                indexN: 'BranchRoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'rolesAdd/:id',
	            name: 'branchrolesAdd_super',
	            component: branchrolesAdd_super,
	            meta: {
	                indexN: 'BranchRoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'workGroupList',
	            name: 'branchGroupList_super',
	            component: branchGroupList_super,
	            meta: {
	                indexN: 'BranchGroupList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'workGroupAdd/:id',
	            name: 'branchworkGroupAdd_super',
	            component: branchworkGroupAdd_super,
	            meta: {
	                indexN: 'BranchGroupList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'manageLog',
	            name: 'brnchManageLog_super',
	            component: branchManageLog_super,
	            meta: {
	                indexN: 'BranchManagementLog',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'userAdd',
	            name: 'branchUserAdd_super',
	            component: branchUserAdd_super,
	            meta: {
	                indexN: 'BranchMultiAccount',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'userEdit/:id',
	            name: 'branchUserEdit_super',
	            component: branchUserAdd_super,
	            meta: {
	                indexN: 'BranchMultiAccount',
	                requiresAuth: true
	            }
	        },
	        {
	        	path: 'agreement',
	        	name: 'purchaseAgreement_super',
	        	component: PurchaseAgreement_super,
	        	meta: {
	        		indexN: 'BranchMyDemandList',
	        		requiresAuth: true
	        	}
			},
			{
	            path: 'MobileRoleManagement',
	            name: 'branchMobileRoleManagement',
	            component: branchMobileRoleManagement,
	            meta: {
	                indexN: 'MobileBranchRoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'MobileRolesAdd/:id',
	            name: 'branchMobileRolesAdd',
	            component: branchMobileRolesAdd,
	            meta: {
	                indexN: 'MobileBranchRoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'MobileGroupList',
	            name: 'branchMobileGroupList',
	            component: branchMobileGroupList,
	            meta: {
	                indexN: 'MobileBranchGroupList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'MobileGroupAdd/:id',
	            name: 'branchMobileGroupAdd',
	            component: branchMobileGroupAdd,
	            meta: {
	                indexN: 'MobileBranchGroupList',
	                requiresAuth: true
	            }
	        },
	    ]
	}
]

export default branch_super_routes