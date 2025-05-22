<script setup lang="ts">
import { reactive } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { toast } from "vue3-toastify";
import { loginUser } from "../../services/authService";
import type { AuthResponse, LoginRequest } from "../../types/auth";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const form = reactive({
  email: "",
  password: "",
  errorMessage: "",
  showPassword: false,
  isLoading: false,
});

const togglePasswordVisibility = () => {
  form.showPassword = !form.showPassword;
};

const handleLogin = async () => {
  form.isLoading = true;
  form.errorMessage = "";

  try {
    const loginData: LoginRequest = {
      email: form.email,
      password: form.password,
    };

    const response: AuthResponse = await loginUser(loginData);

    store.dispatch('auth/login', {
      token: response.token,
      user: {
        id: response.user._id,
        fullName: response.user.fullName,
        avatar: response.user.avatar,
        points: response.user.points,
      }
      
    });

    toast.success("Вхід успішний!");

    router.push("/");  
  } catch (err) {
    toast.error("Неправильна електронна пошта або пароль");
    form.errorMessage = "Спробуйте ще раз";
  } finally {
    form.isLoading = false;
  }
};

const handleGoogleLogin = () => {
  alert("Вхід через Google ще не реалізовано");
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-custom">
    <div class="bg-white p-3 rounded shadow form-container">
      <div class="p-4 rounded">
        <h2 class="text-center mb-4 title">Вхід</h2>

        <div class="form-group mb-3">
          <label for="email" class="text-label">Електронна пошта</label>
          <div class="input-group">
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              id="email"
              placeholder="Email"
            />
            <span class="input-group-text"><i class="pi pi-envelope"></i></span>
          </div>
        </div>

        <div class="form-group mb-3">
          <label for="password" class="text-label">Пароль</label>
          <div class="input-group">
            <input
              v-model="form.password"
              :type="form.showPassword ? 'text' : 'password'"
              class="form-control"
              id="password"
              placeholder="Пароль"
            />
            <span class="input-group-text" @click="togglePasswordVisibility">
              <i :class="form.showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
            </span>
          </div>
        </div>

        <div v-if="form.errorMessage" class="text-danger mb-2">
          {{ form.errorMessage }}
        </div>

        <button
          class="btn login-btn w-100 mb-2"
          @click="handleLogin"
          :disabled="form.isLoading"
        >
          <span
            v-if="form.isLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{ form.isLoading ? "Вхід..." : "Увійти" }}
        </button>

        <button class="btn btn-outline-dark w-100" @click="handleGoogleLogin">
          <i class="pi pi-google me-2"></i> Увійти через Google
        </button>

        <div class="text-center mt-3">
          <small>
            Не маєте акаунта?
            <RouterLink class="text-link fw-bold" to="/register">
              Зареєструватися
            </RouterLink>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./LoginForm.css"></style>
