import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Catalog.vue'

const router = createRouter({
  history: createWebHistory(""),
  routes: [
    {
      path: '/catalog',
      name: 'catalog',
      component: HomeView
    },
    {
      path: '/addproduct',
      name: 'addproduct',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AddPage.vue')
    },
    {
      path:'/',
      name:'Home',
      component: () => import('../views/Catalog.vue')

    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import('../views/EditProduct.vue')
    },
    {
      path:'/login',
      name: 'login',
      component: () => import('../views/LoginForm.vue')
    }
  ]
})

export default router
