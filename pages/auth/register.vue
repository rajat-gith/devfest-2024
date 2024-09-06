<template>
  <div class="register-wrapper">
    <div class="register-content">
      <!-- Left Pane with Optimized Image Size -->
      <div class="left-pane">
        <img src="/img/common/profile_bg.webp" alt="Registration Image" />
      </div>

      <!-- Right Pane with Scrollable Form -->
      <div class="right-pane">
        <div class="form-container">
          <h2>Register</h2>
          <form @submit.prevent="handleRegister" class="register-form">
            <div class="form-group">
              <label for="name">Name:</label>
              <input
                type="text"
                id="name"
                v-model="name"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input
                type="password"
                id="password"
                v-model="password"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="form-group">
              <label for="phone">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                v-model="phone"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="form-group">
              <label>Are you a:</label>
              <div class="radio-group">
                <div>
                  <input
                    type="radio"
                    id="student"
                    value="student"
                    v-model="userType"
                    :disabled="isLoading"
                  />
                  <label for="student">Student</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="professional"
                    value="professional"
                    v-model="userType"
                    :disabled="isLoading"
                  />
                  <label for="professional">Professional</label>
                </div>
              </div>
            </div>
            <div v-if="userType === 'professional'" class="form-group">
              <div class="flex-row">
                <div class="flex-item">
                  <label for="companyName">Company Name:</label>
                  <input
                    type="text"
                    id="companyName"
                    v-model="companyName"
                    :disabled="isLoading"
                  />
                </div>
                <div class="flex-item">
                  <label for="designation">Designation:</label>
                  <input
                    type="text"
                    id="designation"
                    v-model="designation"
                    :disabled="isLoading"
                  />
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Social Links:</label>
              <div class="flex-row">
                <div class="flex-item">
                  <label for="linkedin">LinkedIn:</label>
                  <input
                    type="url"
                    id="linkedin"
                    v-model="linkedin"
                    :disabled="isLoading"
                  />
                </div>
                <div class="flex-item">
                  <label for="github">GitHub:</label>
                  <input
                    type="url"
                    id="github"
                    v-model="github"
                    :disabled="isLoading"
                  />
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="website">Other Website:</label>
              <input
                type="url"
                id="website"
                v-model="website"
                :disabled="isLoading"
              />
            </div>
            <button type="submit" :disabled="isLoading">
              <span v-if="!isLoading">Register</span>
              <div v-else class="loader"></div>
            </button>
          </form>
          <p class="redirect-link">
            Already registered?
            <a href="/auth/login">Login here</a>
          </p>
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";




export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      phone: "",
      userType: "",
      companyName: "",
      designation: "",
      linkedin: "",
      github: "",
      website: "",
      error: "",
      isLoading: false,
    };
  },
  methods: {
    async handleRegister() {
      this.isLoading = true;
      this.error = "";

      try {
        const auth = getAuth();
        const db = getFirestore();

        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;

        // Prepare user data for Firestore
        const userData = {
          name: this.name,
          email: this.email,
          phone: this.phone,
          userType: this.userType,
          linkedin: this.linkedin,
          github: this.github,
          website: this.website,
        };

        if (this.userType === "professional") {
          userData.companyName = this.companyName;
          userData.designation = this.designation;
        }

        // Save user data in Firestore
        await setDoc(doc(db, "users", user.uid), userData);

        // Registration successful
        console.log("User registered successfully:", user.uid);
        // Redirect to dashboard or show success message
        this.$router.push("/");
      } catch (error) {
        console.error("Error registering user:", error);
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.register-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  max-height: 90vh;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.left-pane {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.left-pane img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 40px;
  box-sizing: border-box;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: clamp(1.5rem, 5vw, 2rem);
  color: #333;
}

.register-form {
  display: flex;
  flex-direction: column;
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
  padding: 12px 16px;
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
  padding: 12px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #218838;
}

.redirect-link {
  text-align: center;
  margin-top: 20px;
}

.redirect-link a {
  color: #4285f4;
  text-decoration: none;
  font-weight: 500;
}

.redirect-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: #ff0000;
  text-align: center;
  margin-top: 15px;
}

.radio-group {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.radio-group div {
  display: flex;
  align-items: center;
}

.flex-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.flex-item {
  flex: 1 1 calc(50% - 7.5px);
  min-width: 150px;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #28a745;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .register-content {
    flex-direction: column;
    max-height: none;
  }

  .left-pane {
    display: none;
  }

  .right-pane {
    width: 100%;
    padding: 30px;
  }

  .form-container {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .register-wrapper {
    padding: 10px;
  }

  .right-pane {
    padding: 20px;
  }

  .flex-row {
    flex-direction: column;
  }

  .flex-item {
    flex: 1 1 100%;
  }
}

@media (max-width: 480px) {
  .register-wrapper {
    padding: 0;
  }

  .register-content {
    border-radius: 0;
    min-height: 100vh;
  }

  .right-pane {
    padding: 20px 15px;
  }

  h2 {
    font-size: 1.5rem;
  }

  input,
  button {
    font-size: 14px;
  }
}
</style>
