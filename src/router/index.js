import { createRouter, createWebHistory } from 'vue-router'
import QuoteForm from '@/views/QuoteForm.vue'
import SchemeList from '@/views/SchemeList.vue'
import DictAdmin from '@/views/DictAdmin.vue'

const routes = [
  { path: '/', name: 'quote', component: QuoteForm },
  { path: '/schemes', name: 'schemes', component: SchemeList },
  { path: '/dict', name: 'dict', component: DictAdmin }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})