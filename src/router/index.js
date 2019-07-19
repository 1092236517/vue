import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import register from  '@/pages/register'
import group_routes from './group.js'
import branch_routes from './branch.js'
import supplier_routes from './supplier.js'
import group_super_routes from './group_super.js'
import branch_super_routes from './branch_super.js'
import supplier_super_routes from './supplier_super.js'
import error from '@/pages/error'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            redirect:'/login'
        },
        {
            path:'/login',
            name:'login',
            component: login
        },
        {
            path:'/register',
            name:'register',
            component:register
        },
        ...group_routes,
        ...branch_routes,
        ...supplier_routes,
        ...group_super_routes,
        ...branch_super_routes,
        {
            path: '*',
            name: 'error',
            component: error
        }
    ]
})

//登录验证
router.beforeEach((to, from, next) => {
    let isLogin = window.$cookies.get('ZL_token'); //是否登录
    if(to.matched.some(record => record.meta.requiresAuth)){ //需要登录权限
        if(!isLogin){
            if(to.path == '/login'){
                next();
            }else{
                next({
                    path: '/login',
                    query: {redirect: to.fullPath}
                });
            }
        }else{
            if(Object.keys(from.query).length == 0){
                next();
            }else{
                let redirect = from.query.redirect;
                if(to.path == redirect){
                    next();
                }else{
                    next({path: redirect});
                }
            }
        }
    }else{
        next();
    }
    return
})

export default router
