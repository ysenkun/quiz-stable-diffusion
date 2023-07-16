import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InputUsername from '../views/InputUsername.vue'
import SelectView from '../views/SelectView.vue'
import QuizView from '../views/QuizView.vue'
import AnswerView from '../views/AnswerView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/input',
    name: 'Input',
    component: InputUsername
  },
  {
    path: '/select',
    name: 'select',
    component: SelectView
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: QuizView
  },
  {
    path: '/answer',
    name: 'answer',
    component: AnswerView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
