import { createRouter, createWebHistory } from 'vue-router'
import QualificarCliente from '@/components/QualificarCliente.vue'
import Marketing from '@/components/Marketing.vue'
import Home from '@/components/Home.vue'
import PinPage from '@/components/PinPage.vue'

const routes = [
  { path: '/motorcredito', component: Home },
  { path: '/motorcredito/pin', component: PinPage },
  {
    path: '/motorcredito/credito',
    component: QualificarCliente,
    meta: { requiresAuth: true }
  },
  { path: '/motorcredito/marketing', component: Marketing },
  { path: '/', redirect: '/motorcredito' }
]

const router = createRouter({
  history: createWebHistory('/motorcredito/'),
  routes
})

// ✅ Rota protegida
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const granted = localStorage.getItem('accessGranted');
    const expiresAt = parseInt(localStorage.getItem('accessExpiresAt'), 10);
    const now = Date.now();

    if (granted === 'true' && expiresAt && now < expiresAt) {
      next();
    } else {
      localStorage.removeItem('accessGranted');
      localStorage.removeItem('accessExpiresAt');
      next('/motorcredito/pin');
    }
  } else {
    next();
  }
});

export default router
