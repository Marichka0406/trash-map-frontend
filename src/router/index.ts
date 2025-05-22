import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import MapView from "../views/TrashMapView.vue";
import FAQView from "../views/FAQView.vue";
import EventsView from "../views/EventsView.vue";
import NotFoundView from "../views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/login", name: "login", component: LoginView },
    { path: "/register", name: "register", component: RegisterView },
    { path: "/map", name: "map", component: MapView },
    { path: "/faq", name: "faq", component: FAQView },
    { path: "/events", name: "events", component: EventsView },
    { path: "/:catchAll(.*)", name: "not-found", component: NotFoundView },
  ],
});

export default router;
