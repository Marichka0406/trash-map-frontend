<script setup lang="ts">
import { reactive } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { registerUser } from "../../services/authService";
import { toast } from "vue3-toastify";
import { useStore } from "vuex";
import type { AuthResponse, RegisterRequest } from "../../types/auth"; 

const router = useRouter();
const store = useStore();

const form = reactive({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  showPassword: false,
  errorMessage: "",
  isLoading: false,
});

const togglePasswordVisibility = () => {
  form.showPassword = !form.showPassword;
};

const handleRegister = async () => {
  form.errorMessage = "";
  form.isLoading = true;

  if (
    !form.fullName ||
    !form.email ||
    !form.password ||
    !form.confirmPassword
  ) {
    toast.error("Будь ласка, заповніть всі поля");
    form.isLoading = false;
    return;
  }

  if (form.password !== form.confirmPassword) {
    toast.error("Паролі не збігаються");
    form.isLoading = false;
    return;
  }

  try {
    const newUser: RegisterRequest = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    };

    const response: AuthResponse = await registerUser(newUser);

    // Збереження користувача та токену в Vuex
    store.commit("setUser", {
      id: response.user._id,
      username: response.user.fullName,
      avatar: response.user.avatar,
      points: response.user.points,
    });

    store.commit("setToken", response.token);

    toast.success("Реєстрація пройшла успішно!");
    router.push("/");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Помилка реєстрації");
  } finally {
    form.isLoading = false;
  }
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-custom">
    <div class="bg-white p-3 rounded shadow form-container">
      <div class="p-4 rounded">
        <h2 class="text-center mb-4 title">Реєстрація</h2>

        <div class="form-group mb-3">
          <label class="text-label">Ім'я</label>
          <div class="input-group">
            <input
              v-model="form.fullName"
              type="text"
              class="form-control"
              placeholder="Введіть ім'я"
            />
            <span class="input-group-text"><i class="pi pi-user"></i></span>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="text-label">Електронна пошта</label>
          <div class="input-group">
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="Введіть email"
            />
            <span class="input-group-text"><i class="pi pi-envelope"></i></span>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="text-label">Пароль</label>
          <div class="input-group">
            <input
              v-model="form.password"
              :type="form.showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Створіть пароль"
            />
            <span class="input-group-text" @click="togglePasswordVisibility">
              <i :class="form.showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
            </span>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="text-label">Підтвердіть пароль</label>
          <div class="input-group">
            <input
              v-model="form.confirmPassword"
              :type="form.showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Підтвердіть пароль"
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
          class="btn login-btn w-100"
          @click="handleRegister"
          :disabled="form.isLoading"
        >
          <span
            v-if="form.isLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{ form.isLoading ? "Реєстрація..." : "Зареєструватися" }}
        </button>

        <div class="text-center mt-3">
          <small>
            Вже маєте акаунт?
            <RouterLink class="text-link fw-bold" to="/login">Увійти</RouterLink>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./RegisterForm.css"></style>
