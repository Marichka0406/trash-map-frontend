import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import MapView from '../views/MapView.vue';
import BlogView from '../views/BlogView.vue';
import FAQView from '../views/FAQView.vue';
import EventsView from '../views/EventsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/map', name: 'map', component: MapView },
    { path: '/blog', name: 'blog', component: BlogView },
    { path: '/faq', name: 'faq', component: FAQView },
    { path: '/events', name: 'events', component: EventsView }
  ]
});

export default router;