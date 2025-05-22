<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const store = useStore();

const navLinks = [
  { name: "Карта", path: "/map", icon: "pi pi-map" },
  { name: "Події", path: "/events", icon: "pi pi-calendar" },
  { name: "FAQ", path: "/faq", icon: "pi pi-question-circle" },
];

const isActiveLink = (routePath: string) => route.path === routePath;

const user = computed(() => store.getters["auth/getUser"]);
const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);

const handleLogout = () => {
  store.dispatch("auth/logout");
  router.push("/login");
};
</script>

<template>
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container-fluid">
      <RouterLink class="navbar-brand text-white fw-bold fs-4" to="/">
        LitterHunter
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse justify-content-between"
        id="navbarNav"
      >
        <ul class="navbar-nav d-flex justify-content-center flex-grow-1">
          <li v-for="link in navLinks" :key="link.path" class="nav-item mx-3">
            <RouterLink
              class="nav-link navbar-main-link fs-5"
              :class="{ active: isActiveLink(link.path) }"
              :to="link.path"
            >
              <i :class="link.icon" class="me-2"></i>
              {{ link.name }}
            </RouterLink>
          </li>
        </ul>

        <ul class="navbar-nav align-items-center">
          <li v-if="isAuthenticated && user" class="nav-item dropdown ms-3 fs-5">
            <a
              class="nav-link dropdown-toggle d-flex align-items-center"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <img
                :src="user.avatar"
                class="rounded-circle me-2"
                alt="avatar"
                width="35"
                height="35"
              />
              {{ user.fullName }}
            </a>
            <ul class="dropdown-menu custom-dropdown">
              <li>
                <RouterLink class="dropdown-item" to="/">Профіль</RouterLink>
              </li>
              <li>
                <a
                  class="dropdown-item d-flex align-items-center"
                  href="#"
                  @click.prevent="handleLogout"
                >
                  <i class="pi pi-sign-out me-2"></i> Вийти
                </a>
              </li>
            </ul>
          </li>

          <li v-if="!isAuthenticated && !['/login', '/register'].includes(route.path)" class="nav-item ms-3">
            <RouterLink class="btn btn-success me-2" to="/login">Увійти</RouterLink>
          </li>
          <li v-if="!isAuthenticated && !['/login', '/register'].includes(route.path)" class="nav-item">
            <RouterLink class="btn btn-outline-light" to="/register">Зареєструватись</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<style scoped src="./NavBar.css"></style>
