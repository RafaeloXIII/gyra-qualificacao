import { createRouter, createWebHistory } from 'vue-router'
import QualificarCliente from '@/components/QualificarCliente.vue'
import Marketing from '@/components/Marketing.vue'

const routes = [
  {
    path: '/motorcredito',
    component: () => import('@/components/Home.vue'), // nova página com links
  },
  {
    path: '/motorcredito/credito',
    component: QualificarCliente,
  },
  {
    path: '/motorcredito/marketing',
    component: Marketing,
  },
  {
    path: '/',
    redirect: '/motorcredito'
  }
]

const router = createRouter({
  history: createWebHistory('/motorcredito/'),
  routes,
})

export default router
