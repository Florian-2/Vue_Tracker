import * as VueRouter from 'vue-router'

import HomePage from '../pages/Home.vue'
const LoginPage = () => import('../pages/Login.vue')
const NotFoundPage = () => import('../pages/NotFound.vue')
const SettingsPage = () => import('../pages/Settings.vue')
const RegisterPage = () => import('../pages/Register.vue')
const SettingsApp = () => import('../components/SettingsApp.vue')
const SettingsUser = () => import('../components/SettingsUser.vue')

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        {
            path: '/',
            alias: '/home',
            name: 'Home',
            component: HomePage,           
            meta: { 
                layout: true,
                title: "Accueil - VueTracker"
            },
            beforeEnter: [checkLoggedIn, checkJsonBinAccess],
            children: [
                {
                    path: 'home/:taskID',
                    component: HomePage
                }
            ]
        },
        {
            path: '/settings',
            name: 'Settings',
            component: SettingsPage,
            beforeEnter: [checkLoggedIn],
            meta: { 
                layout: true,
                title: "Paramètre - VueTracker"
            },
            children: [
                {
                    path: 'app',
                    component: SettingsApp,
                },
                {
                    path: 'user',
                    component: SettingsUser,
                }
            ]
        },
        {
            path: '/register',
            name: 'Register',
            component: RegisterPage,
            beforeEnter: [checkNotLoggedIn],
            meta: { 
                layout: false,
                title: "Inscription - VueTracker"
            },
        },
        {
            path: '/login',
            name: 'Login',
            beforeEnter: [checkNotLoggedIn],
            component: LoginPage,
            meta: { 
                layout: false,
                title: "Connexion - VueTracker"
            },
        },
        {
            path: '/notfound',
            name: 'NotFound',
            component: NotFoundPage,
            meta: { 
                layout: false,
                title: "Page introuvable - VueTracker"
            },
        },
        // {
        //     path: '/:wrongPath(.*)',
        //     redirect: (to) => {
        //         return { name: 'NotFound', params: { wrongPath: to.params.wrongPath } }
        //     }
        // }
    ]
})

function checkLoggedIn() 
{
    if (!localStorage.getItem('currentUser')) {
        return '/login'
    }
}

function checkNotLoggedIn() 
{
    if (localStorage.getItem('currentUser')) {
        return '/home'
    }
}

function checkJsonBinAccess() 
{
    if (!localStorage.getItem('jsonBinAccess')) {
        return '/settings/app'
    }
}

router.beforeEach((to, from) => document.title = to.meta.title);


/*
    Toutes ces méthodes peuvent prendre une fonction avec (to, from) OU un tableau avec des fonctions

    // Navigation guard globale:
        - beforeEach
        - afterEach

    // Navigation guard locale
        - beforeEnter
*/

export default router;