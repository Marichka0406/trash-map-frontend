<script setup lang="ts"></script>

<template>
  <section class="hero-section d-flex align-items-center text-white">
    <div class="overlay"></div>
    <div class="container text-start position-relative">
      <h1 class="display-4 fw-bold">Hunt for Trash – Clean the Planet!</h1>
      <p class="lead mt-4 fs-4">
        LitterHunter is an interactive platform that helps you locate and clean
        up trash in your community. Spot litter, mark it on the map, and earn
        rewards for keeping the environment clean!
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  background-image: url("../assets/ecology-image.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh; 
  padding: 4rem 1rem; 
  overflow: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6); 
  z-index: 1;
}

.container {
  z-index: 2;
  position: absolute; /* Абсолютне позиціонування */
  left: 0; /* Початок від лівого краю */
  width: 50%; /* Ширина 50% від екрану */
  padding-left: 2rem; /* Відступ зліва */
}
</style>
