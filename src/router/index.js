import { createRouter, createWebHistory } from 'vue-router'
import QualificarCliente from '@/components/QualificarCliente.vue'
import Marketing from '@/components/Marketing.vue'
import Home from '@/components/Home.vue'
import PinPage from '@/components/PinPage.vue'
import ListarReport from '@/components/ListarReport.vue' // ✅ novo import

const routes = [
  { path: '/motorcredito', component: Home },
  { path: '/pin', component: PinPage },
  {
    path: '/credito',
    component: QualificarCliente,
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing',
    component: Marketing,
    meta: { requiresAuth: false }
  },
  {
    path: '/listarreport',
    component: ListarReport,
    meta: { requiresAuth: true }
  },
  { path: '/', redirect: '/motorcredito' }
]

const router = createRouter({
  history: createWebHistory('/motorcredito/'),
  routes
})

// ✅ Proteção por PIN para rotas com meta.requiresAuth
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const granted = localStorage.getItem('accessGranted');
    const expiresAt = parseInt(localStorage.getItem('accessExpiresAt'), 10);
    const now = Date.now();

    if (granted === 'true' && expiresAt && now < expiresAt) {
      next();
    } else {
      localStorage.setItem('redirectAfterPin', to.fullPath);
      localStorage.removeItem('accessGranted');
      localStorage.removeItem('accessExpiresAt');
      next('/motorcredito/pin');
    }
  } else {
    next();
  }
});

export default router
