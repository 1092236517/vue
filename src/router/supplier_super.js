import supplier_super from '@/pages/supplierP_super'
import suppliermy_super from '@/components/supplier_super/suppliermy'
import supplieroffer_super from '@/components/supplier_super/supplieroffer'
import supplierorder_super from '@/components/supplier_super/supplierorder'
import supplierorderdetial_super from '@/components/supplier_super/supplierorderdetial'
import supplierAccountInformation_super from '@/components/supplier_super/AccountInformation'
import supplierAccountInformationAdd_super from '@/components/supplier_super/AccountInformationAdd'
import supplieraccount_super from '@/components/supplier_super/supplieraccount'
import supplierrecord_super from '@/components/supplier_super/supplierrecord'
import phone_super from '@/components/supplier_super/phone'
import password_super from '@/components/supplier_super/password'
import logo_super from '@/components/supplier_super/logo'
import realname_super from '@/components/supplier_super/realname'
import suppliermsg_super from '@/components/supplier_super/suppliermsg'

const supplier_super_routes = [
	{
	    path:'/supplier_super',
	    name:'supplier_super',
	    component: supplier_super,
	    meta: {
	      requiresAuth: true
	    },
	    children:[
	        {
	            path: 'my_super',
	            name: 'suppliermy_super',
	            component: suppliermy_super,
	            meta: {
	                indexN:'1',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'offer_super',
	            name: 'supplieroffer_super',
	            component: supplieroffer_super,
	            meta: {
	                indexN:'2',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'order_super',
	            name: 'supplierorder_super',
	            component: supplierorder_super,
	            meta: {
	                indexN:'3',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'supplierorderdetial/:id/:mode',
	            name: 'supplierorderdetial_super',
	            component: supplierorderdetial_super,
	            meta: {
	                indexN:'3',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'supplieraccountinformation',
	            name:'supplierAccountInformation_super',
	            component:supplierAccountInformation_super,
	            meta:{
	                indexN:'15',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'supplieraccountinformationadd',
	            name:'supplierAccountInformationAdd_super',
	            component:supplierAccountInformationAdd_super,
	            meta:{
	                indexN:'15',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'account_super',
	            name: 'supplieraccount_super',
	            component: supplieraccount_super,
	            meta: {
	                indexN:'5',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'record_super',
	            name: 'supplierrecord_super',
	            component: supplierrecord_super,
	            meta: {
	                indexN:'6',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'name_super',
	            name: 'suppliername_super',
	            component: realname_super,
	            meta: {
	                indexN:'8',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'logo_super',
	            name: 'supplierlogo_super',
	            component: logo_super,
	            meta: {
	                indexN:'9',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'password_super',
	            name: 'supplierpassword_super',
	            component: password_super,
	            meta: {
	                indexN:'11',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'phone_super',
	            name: 'supplierphone_super',
	            component: phone_super,
	            meta: {
	                indexN:'12',
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'msg_super',
	            name: 'suppliermsg_super',
	            component: suppliermsg_super,
	            meta: {
	                indexN:'13',
	                userId:3,
	                requiresAuth: true
	            }
	        }
	    ]
	}
]

export default supplier_super_routes