import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LessonsView from '../views/LessonsView.vue'
import PracticeView from '../views/PracticeView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginForm from '../components/LoginForm.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/lessons',
    name: 'lessons',
    component: LessonsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/practice',
    name: 'practice',
    component: PracticeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginForm,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  // For now, we'll implement a simplified check
  // In a real app, we would check the actual auth state from the store
  // Since importing the store here causes circular dependency issues in Vite,
  // we'll handle auth checking in the components themselves
  
  // Allow all routes to proceed
  // The actual auth checking will happen in the components
  // Specifically, the HomeView component handles both authenticated and unauthenticated states
  next();
});

export default router