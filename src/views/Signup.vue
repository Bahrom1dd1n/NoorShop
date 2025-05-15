<template>
  <div class="signup-container">
    <div class="signup-form">
      <h2>Create Account</h2>
      <form @submit.prevent="handleSignup">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            required
            placeholder="Enter your full name"
          />
        </div>
        <div class="form-group">
          <label for="login">Username</label>
          <input
            type="text"
            id="login"
            v-model="login"
            required
            placeholder="Enter your username"
          />
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            v-model="phone"
            required
            placeholder="Enter your phone number"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Enter your password"
            minlength="6"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            placeholder="Confirm your password"
          />
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" :disabled="loading || !isFormValid">
          {{ loading ? 'Creating Account...' : 'Sign Up' }}
        </button>
        <p class="login-link">
          Already have an account? <router-link to="/login">Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/auth';

export default {
  name: 'Signup',
  setup() {
    const router = useRouter();
    const name = ref('');
    const login = ref('');
    const phone = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const error = ref('');
    const loading = ref(false);

    const isFormValid = computed(() => {
      return (
        name.value.trim() &&
        login.value.trim() &&
        phone.value.trim() &&
        password.value.length >= 6 &&
        password.value === confirmPassword.value
      );
    });

    const handleSignup = async () => {
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match';
        return;
      }

      try {
        loading.value = true;
        error.value = '';
        await authService.register({
          branch_id: 'aa541fcc-bf74-11ee-ae0b-166244b65504', // Default branch ID
          login: login.value,
          name: name.value,
          password: password.value,
          phone: phone.value
        });
        router.push('/'); // Redirect to home page after successful signup
      } catch (err) {
        error.value = err.message || 'Failed to create account. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    return {
      name,
      login,
      phone,
      password,
      confirmPassword,
      error,
      loading,
      isFormValid,
      handleSignup,
    };
  },
};
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.signup-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #357abd;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
}

.login-link a {
  color: #4a90e2;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 