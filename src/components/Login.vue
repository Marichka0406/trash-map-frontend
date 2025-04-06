<script setup lang="ts">
import { reactive } from "vue";
import users from "../mocks/users.json";
import { useRouter, RouterLink } from "vue-router";
import { toast } from "vue3-toastify";

const router = useRouter();

const form = reactive({
  email: "",
  password: "",
  errorMessage: "",
  showPassword: false,
  isLoading: false,
});

const handleLogin = () => {
  form.isLoading = true;
  setTimeout(() => {
    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (user) {
      toast.success("Login successful!");
      form.errorMessage = "";

      setTimeout(() => {
        router.push("/");
      }, 800); // даємо 1 секунду тосту на показ
    } else {
      toast.error("Invalid email or password");
    }

    form.isLoading = false;
  }, 800); // затримка 1 секунда
};

const handleGoogleLogin = () => {
  alert("Google login not implemented yet");
};

const togglePasswordVisibility = () => {
  form.showPassword = !form.showPassword;
};
</script>

<template>
  <div
    class="d-flex justify-content-center align-items-center vh-100 bg-custom"
  >
    <div class="bg-white p-3 rounded shadow form-container">
      <div class="p-4 rounded">
        <h2 class="text-center mb-4 title">Login</h2>

        <div class="form-group mb-3">
          <label for="email" class="text-label">Email</label>
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
          <label for="password" class="text-label">Password</label>
          <div class="input-group">
            <input
              v-model="form.password"
              :type="form.showPassword ? 'text' : 'password'"
              class="form-control"
              id="password"
              placeholder="Password"
            />
            <span class="input-group-text" @click="togglePasswordVisibility">
              <i
                :class="form.showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"
              ></i>
            </span>
          </div>
        </div>

        <div v-if="form.errorMessage" class="text-danger mb-2">
          {{ form.errorMessage }}
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <a href="#" class="small text-link">Forgot password?</a>
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
          {{ form.isLoading ? "Logging in..." : "Login" }}
        </button>
        <button class="btn btn-outline-dark w-100" @click="handleGoogleLogin">
          <i class="pi pi-google me-2"></i> Sign in with Google
        </button>

        <div class="text-center mt-3">
          <small
            >Don't have an account?
            <RouterLink class="text-link fw-bold" to="/register"
              >Sign Up
            </RouterLink></small
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  width: 500px;
  margin-top: 60px;
  box-shadow: 0 0 5px 2px rgba(152, 160, 155, 0.8);
}

.title {
  color: #2e7164;
}

.login-btn {
  background-color: #2e7164;
  box-shadow: 0 0 4px 1px rgba(100, 133, 113, 0.8);
  color: white;
  border: none;
}

.login-btn:hover {
  background-color: #265e54;
  color: white;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.4);
}

.text-link,
.text-label {
  color: #2e7164;
}

input::placeholder {
  color: #aaa;
}

.bg-custom {
  background-color: #265e54;
}

.input-group input {
  font-size: 1.1rem;
  padding: 10px;
  color: #2e7164;
}

.input-group span {
  font-size: 1.2rem;
  background-color: transparent;
}

.input-group span i {
  color: #2e7164;
  cursor: pointer; 
}

.form-group {
  margin-bottom: 1.5rem;
}

button {
  font-size: 1.1rem;
  padding: 10px;
}
</style>
