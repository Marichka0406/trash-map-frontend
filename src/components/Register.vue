<script setup lang="ts">
import { reactive } from "vue";
import users from "../mocks/users.json";
import { useRouter, RouterLink } from "vue-router";
import { toast } from "vue3-toastify";

const router = useRouter();

const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  showPassword: false,
  errorMessage: "",
  isLoading: false,
});

const handleRegister = () => {
  form.errorMessage = "";
  form.isLoading = true;

  setTimeout(() => {
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      form.errorMessage = "Please fill in all fields";
    } else if (form.password !== form.confirmPassword) {
      form.errorMessage = "Passwords do not match";
    } else if (users.find((u) => u.email === form.email)) {
      form.errorMessage = "Email is already registered";
    } else {
      const newUser = {
        id: users.length + 1,
        name: form.username,
        email: form.email,
        password: form.password,
        avatar: `https://i.pravatar.cc/150?u=${form.username}`,
      };

      // Тут можна відправити нового користувача на бекенд.
      users.push(newUser);

      toast.success("Registration successful!");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }

    form.isLoading = false;
  }, 800);
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
        <h2 class="text-center mb-4 title">Sign Up</h2>

        <div class="form-group mb-3">
          <label class="text-label">Username</label>
          <div class="input-group">
            <input
              v-model="form.username"
              type="text"
              class="form-control"
              placeholder="Username"
            />
            <span class="input-group-text"><i class="pi pi-user"></i></span>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="text-label">Email</label>
          <div class="input-group">
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              placeholder="Email"
            />
            <span class="input-group-text"><i class="pi pi-envelope"></i></span>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="text-label">Create password</label>
          <div class="input-group">
            <input
              v-model="form.password"
              :type="form.showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Create password"
            />
            <span class="input-group-text" @click="togglePasswordVisibility">
              <i
                :class="form.showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"
              ></i>
            </span>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="text-label">Confirm password</label>
          <div class="input-group">
            <input
              v-model="form.confirmPassword"
              :type="form.showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Confirm password"
            />
            <span class="input-group-text" @click="togglePasswordVisibility">
              <i
                :class="form.showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
              ></i>
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
          {{ form.isLoading ? "Signing up..." : "Sign Up" }}
        </button>

        <div class="text-center mt-3">
          <small
            >Already have an account?
            <RouterLink class="text-link fw-bold" to="/login"
              >Login</RouterLink
            ></small
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
