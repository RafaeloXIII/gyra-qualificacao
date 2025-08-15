import { createRouter, createWebHistory } from 'vue-router'
import QualificarCliente from '@/components/QualificarCliente.vue'
import Marketing from '@/components/Marketing.vue'
import Home from '@/components/Home.vue'
import PinPage from '@/components/PinPage.vue'
import ListarReport from '@/components/ListarReport.vue'

const routes = [
  { path: '/',                name: 'home',         component: Home },
  { path: '/pin',             name: 'pin',          component: PinPage },
  { path: '/credito',         name: 'credito',      component: QualificarCliente, meta: { requiresAuth: true } },
  { path: '/marketing',       name: 'marketing',    component: Marketing,         meta: { requiresAuth: false } },
  { path: '/listarreport',    name: 'listarreport', component: ListarReport,      meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  // base stays /motorcredito/, so final URLs are /motorcredito/...
  history: createWebHistory('/motorcredito/'),
  routes
})

// PIN guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const granted   = localStorage.getItem('accessGranted')
    const expiresAt = parseInt(localStorage.getItem('accessExpiresAt'), 10)
    const now       = Date.now()

    if (granted === 'true' && expiresAt && now < expiresAt) {
      next()
    } else {
      localStorage.setItem('redirectAfterPin', to.fullPath)
      localStorage.removeItem('accessGranted')
      localStorage.removeItem('accessExpiresAt')
      // important: no /motorcredito here, the base adds it
      next('/pin')
    }
  } else {
    next()
  }
})

export default router
