import supplier from '@/pages/supplierP'
import suppliermy from '@/components/supplier/suppliermy'
import supplieroffer from '@/components/supplier/supplieroffer'
import supplierorder from '@/components/supplier/supplierorder'
import supplierorderdetial from '@/components/supplier/supplierorderdetial'
import supplierAccountInformation from '@/components/supplier/AccountInformation'
import supplierAccountInformationAdd from '@/components/supplier/AccountInformationAdd'
import supplieraccount from '@/components/supplier/supplieraccount'
import supplierrecord from '@/components/supplier/supplierrecord'
import phone from '@/components/supplier/phone'
import password from '@/components/supplier/password'
import logo from '@/components/supplier/logo'
import realname from '@/components/supplier/realname'
import suppliermsg from '@/components/supplier/suppliermsg'
import paymentReceiveList_supplier from '@/components/supplier/PaymentReceiveList'
import paymentReceiveDetail_supplier from '@/components/supplier/PaymentReceiveDetail'

const supplier_routes = [
	{
	    path:'/supplier',
	    name:'supplier',
	    component: supplier,
	    meta: {
	      requiresAuth: true
	    },
	    children:[
	        {
	            path: '/suppliermy',
	            name: 'suppliermy',
	            component: suppliermy,
	            meta: {
	                indexN:'1',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/supplieroffer',
	            name: 'supplieroffer',
	            component: supplieroffer,
	            meta: {
	                indexN:'2',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/supplierorder',
	            name: 'supplierorder',
	            component: supplierorder,
	            meta: {
	                indexN:'3',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/supplierorderdetial/:id/:mode',
	            name: 'supplierorderdetial',
	            component: supplierorderdetial,
	            meta: {
	                indexN:'3',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'/supplieraccountinformation',
	            name:'supplierAccountInformation',
	            component:supplierAccountInformation,
	            meta:{
	                indexN:'15',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'/supplieraccountinformationadd',
	            name:'supplierAccountInformationAdd',
	            component:supplierAccountInformationAdd,
	            meta:{
	                indexN:'15',
	                requiresAuth: true
	            }
	        },
	        {
	            path:'accountinformation/edit/:id',
	            name:'accountinformationEdit_supplier',
	            component:supplierAccountInformationAdd,
	            meta:{
	                indexN: '15',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/supplieraccount',
	            name: 'supplieraccount',
	            component: supplieraccount,
	            meta: {
	                indexN:'5',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/supplierrecord',
	            name: 'supplierrecord',
	            component: supplierrecord,
	            meta: {
	                indexN:'6',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/suppliername',
	            name: 'suppliername',
	            component: realname,
	            meta: {
	                indexN:'8',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/supplierlogo',
	            name: 'supplierlogo',
	            component: logo,
	            meta: {
	                indexN:'9',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/supplierpassword',
	            name: 'supplierpassword',
	            component: password,
	            meta: {
	                indexN:'11',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/supplierphone',
	            name: 'supplierphone',
	            component: phone,
	            meta: {
	                indexN:'12',
	                requiresAuth: true
	            }
	        },
	        {
	            path: '/suppliermsg',
	            name: 'suppliermsg',
	            component: suppliermsg,
	            meta: {
	                indexN:'13',
	                userId:3,
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'payment/receive/list',
	            name: 'paymentReceiveList_supplier',
	            component: paymentReceiveList_supplier,
	            meta: {
	                indexN: '16',
	                userId: 3,
	                requiresAuth: true
	            }
	        },
	        {
	            path: 'payment/receive/detail/:id',
	            name: 'paymentReceiveDetail_supplier',
	            component: paymentReceiveDetail_supplier,
	            meta: {
	                indexN: '16',
	                userId: 3,
	                requiresAuth: true
	            }
	        }
	    ]
	}
]

export default supplier_routes