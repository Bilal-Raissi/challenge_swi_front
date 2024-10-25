import { createRouter, createWebHistory } from 'vue-router'
import ArticleList from '@/views/ArticleList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/article-list'
    },
    {
      path: '/article-list',
      component: ArticleList
    }
  ]
})

export default router;
