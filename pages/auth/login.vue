<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="image-pane">
        <img src="public/img/common/profile_bg.webp" alt="Login background" />
      </div>
      <div class="form-pane">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Email:</label>
            <input type="email" id="username" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <button type="submit">Login</button>
          <p v-if="message" class="message">{{ message }}</p>
        </form>
        <div class="register-link">
          <p>
            If you don't have an account,
            <NuxtLink to="/auth/register">register here</NuxtLink>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const message = ref("");

    const handleLogin = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log("User logged in successfully.");
        router.push("/");
        localStorage.setItem("isLogin", true);
      } catch (err) {
        message.value = "Invalid credentials. Please try again.";
        console.error("Error logging in:", err);
      }
    };

    return {
      email,
      password,
      message,
      handleLogin,
    };
  },
};
</script>

<style scoped>
/* Container and wrapper for login */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* background: url("public/img/common/profile_bg.webp") center/cover no-repeat; */
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.image-pane {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-pane img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-pane {
  flex: 1;
  padding: 40px;
}

/* Typography for the form */
h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

input {
  width: 100%;
  padding: 14px 16px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  outline: none;
}

button {
  width: 100%;
  padding: 14px;
  background-color: #4285f4;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3367d6;
}

.message {
  color: #ff0000;
  text-align: center;
  margin-top: 15px;
}

/* Link section for register */
.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #4285f4;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

/* Media queries for responsiveness */
@media (max-width: 1024px) {
  .form-pane {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 500px;
  }

  .image-pane {
    display: none;
  }

  .form-pane {
    padding: 20px;
  }

  input,
  button {
    padding: 12px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .form-pane {
    padding: 15px;
  }

  input,
  button {
    padding: 10px;
    font-size: 14px;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>
