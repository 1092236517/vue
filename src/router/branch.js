import purchasers from '@/pages/purchasersP'
import purchdemand from '@/components/purchasers/demand'
import purchdemandDetial from '@/components/purchasers/demandDetial'
import purchOrderL from '@/components/purchasers/orderList'
import purchmy from '@/components/purchasers/purchmy'
import purchorderN from '@/components/purchasers/order'
import branchDemandDetail from '@/components/purchasers/branchDemandDetail'
import branchMultiAccount from '@/components/purchasers/multiAccount'
import branchUserAdd from '@/components/purchasers/UserAdd'
import branchRolesManage from '@/components/purchasers/RolesManage'
import branchrolesAdd from '@/components/purchasers/rolesAdd'
import branchGroupList from '@/components/purchasers/workGroupList'
import branchworkGroupAdd from '@/components/purchasers/workGroupAdd'
import branchAccount from '@/components/purchasers/Account'
import branchRecord from '@/components/purchasers/Record'
import branchPhone from '@/components/purchasers/Phone'
import branchPassword from '@/components/purchasers/Password'
import branchLogo from '@/components/purchasers/Logo'
import branchRealname from '@/components/purchasers/Realname'
import branchMsgCenter from '@/components/purchasers/msgCenter'

const branch_routes = [
	{
	    path:'/purchasers',
	    name:'purchasers',
	    component: purchasers,
	    meta: {
	        requiresAuth: true
	    },
	    children:[
	        {
	            path: '/purchmy',
	            name: 'purchmy',
	            component: purchmy,
	            meta: {
	                indexN:'NormalBranchMyZhuNiu',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/demand',
	            name: 'purchdemand',
	            component: purchdemand,
	            meta: {
	                indexN:'NormalBranchMyDemandList',
	                requiresAuth: true
	            }
			},
			{
	            path: '/demandDetial/:id/:isedit',
	            name: 'purchdemandDetial',
	            component: purchdemandDetial,
	            meta: {
	                indexN:'NormalBranchMyDemandList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/branchDemandDetail/:id',
	            name: 'branchDemandDetail',
	            component: branchDemandDetail,
	            meta: {
	                indexN: 'NormalBranchMyDemandList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/purchorder',
	            name: 'purchorder',
	            component: purchOrderL,
	            meta: {
	                indexN:'NormalBranchOrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/purchorderN/:id',
	            name: 'purchorderN',
	            component: purchorderN,
	            meta: {
	                indexN:'NormalBranchOrderList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/purchaccount',
	            name: 'purchaccount',
	            component: branchAccount,
	            meta: {
	                indexN:'NormalBranchSecondMyAccount',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/purchrecord',
	            name: 'purchrecord',
	            component: branchRecord,
	            meta: {
	                indexN:'NormalBranchTransactionRecord',
	                requiresAuth: true
	            }
	        },

	        {
	            path: '/purchphone',
	            name: 'purchphone',
	            component: branchPhone,
	            meta: {
	                indexN:'NormalBranchChangePhone',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/purchpassword',
	            name: 'purchpassword',
	            component: branchPassword,
	            meta: {
	                indexN:'NormalBranchChangePassword',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/purchlogo',
	            name: 'purchlogo',
	            component: branchLogo,
	            meta: {
	                indexN:'NormalBranchLogo',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/purchname',
	            name: 'purchname',
	            component: branchRealname,
	            meta: {
	                indexN:'NormalBranchVerified',
	                requiresAuth: true
	            }
			},
			{
	            path: '/multiAccoun',
	            name: 'branchMultiAccount',
	            component: branchMultiAccount,
	            meta: {
	                indexN: 'NormalBranchMultiAccount',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/multiAccountEdit/:id',
	            name: 'branchMultiAccountEdit',
	            component: branchMultiAccount,
	            meta: {
	                indexN: 'NormalBranchMultiAccount',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/purchmsg',
	            name: 'purchmsg',
	            component: branchMsgCenter,
	            meta: {
	                indexN:'NormalBranchNewsCenter',
	                userId:2,
	                requiresAuth: true
	            }
			},
			{
	            path: '/rolesManage',
	            name: 'branchRolesManage',
	            component: branchRolesManage,
	            meta: {
	                indexN: 'NormalBranchRoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/rolesAdd/:id',
	            name: 'branchrolesAdd',
	            component: branchrolesAdd,
	            meta: {
	                indexN: 'NormalBranchRoleManagement',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/workGroupList',
	            name: 'branchGroupList',
	            component: branchGroupList,
	            meta: {
	                indexN: 'NormalBranchGroupList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/workGroupAdd/:id',
	            name: 'branchworkGroupAdd',
	            component: branchworkGroupAdd,
	            meta: {
	                indexN: 'NormalBranchGroupList',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/userAdd',
	            name: 'branchUserAdd',
	            component: branchUserAdd,
	            meta: {
	                indexN: 'NormalBranchMultiAccount',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/userEdit/:id',
	            name: 'branchUserEdit',
	            component: branchUserAdd,
	            meta: {
	                indexN: 'NormalBranchMultiAccount',
	                requiresAuth: true
	            }
	        },
	    ]
	}
]

export default branch_routes