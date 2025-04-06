<script setup lang="ts">
import { ref } from "vue";
import { useRoute, RouterLink } from "vue-router";

const route = useRoute();

const navLinks = [
  { name: "Map", path: "/map", icon: "pi pi-map" },
  { name: "Events", path: "/events", icon: "pi pi-calendar" },
  { name: "Blog", path: "/blog", icon: "pi pi-book" },
  { name: "FAQ", path: "/faq", icon: "pi pi-question-circle" },
];

const isActiveLink = (routePath: string) => route.path === routePath;

// Мок користувача
const user = ref({
  name: "Jane Smith",
  avatar: "https://randomuser.me/api/portraits/women/1.jpg",
});
</script>

<template>
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container-fluid">
      <!-- Логотип -->
      <RouterLink class="navbar-brand text-white fw-bold fs-4" to="/"
        >LitterHunter
      </RouterLink>

      <!-- Тогл -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Меню -->
      <div
        class="collapse navbar-collapse justify-content-between"
        id="navbarNav"
      >
        <!-- Центр: навігаційні лінки -->
        <ul class="navbar-nav mx-auto">
          <li v-for="link in navLinks" :key="link.path" class="nav-item mx-3">
            <RouterLink
              class="nav-link navbar-main-link fs-5"
              :class="{ active: isActiveLink(link.path) }"
              :to="link.path"
            >
              <i :class="link.icon" class="me-2"></i> <!-- Іконка PrimeIcons -->
              {{ link.name }}
            </RouterLink>
          </li>
        </ul>

        <!-- Правий край: або юзер, або кнопка логіну -->
        <ul class="navbar-nav align-items-center">
          <li v-if="user" class="nav-item dropdown ms-3 fs-5">
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
                width="30"
                height="30"
              />
              {{ user.name }}
            </a>
            <ul class="dropdown-menu">
              <li>
                <RouterLink class="dropdown-item" to="/">Profile</RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/login"
                  >Log Out</RouterLink
                >
              </li>
            </ul>
          </li>

          <li v-else class="nav-item ms-3">
            <RouterLink class="btn btn-success" to="/login">Login</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  background-color: #2b927f;
  box-shadow: 0 0 5px 2px rgba(96, 116, 104, 0.8);
}

.navbar-main-link,
.nav-link.dropdown-toggle {
  color: #9df8c5;
  transition: all 0.4s ease;
}

.navbar-main-link:hover,
.nav-link.navbar-main-link.active,
.nav-link.dropdown-toggle:hover {
  color: white;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.4);
}

.navbar-brand {
  transition: transform 0.4s ease;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.4);
}

.navbar-brand:hover {
  transform: scale(1.1);
}
</style>
