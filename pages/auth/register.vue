<template>
  <div class="register-wrapper">
    <div class="register-container">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="phone">Phone Number:</label>
          <input type="tel" id="phone" v-model="phone" required />
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
              />
              <label for="student">Student</label>
            </div>
            <div>
              <input
                type="radio"
                id="professional"
                value="professional"
                v-model="userType"
              />
              <label for="professional">Professional</label>
            </div>
          </div>
        </div>
        <div v-if="userType === 'professional'" class="form-group">
          <div class="flex-row">
            <div class="flex-item">
              <label for="companyName">Company Name:</label>
              <input type="text" id="companyName" v-model="companyName" />
            </div>
            <div class="flex-item">
              <label for="designation">Designation:</label>
              <input type="text" id="designation" v-model="designation" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Social Links:</label>
          <div class="flex-row">
            <div class="flex-item">
              <label for="linkedin">LinkedIn:</label>
              <input type="url" id="linkedin" v-model="linkedin" />
            </div>
            <div class="flex-item">
              <label for="github">GitHub:</label>
              <input type="url" id="github" v-model="github" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="website">Other Website:</label>
          <input type="url" id="website" v-model="website" />
        </div>
        <button type="submit">Register</button>
      </form>
      <p class="redirect-link">
        Already registered?
        <a href="/auth/login">Login here</a>
      </p>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export default {
  name: "Register",
  setup() {
    const router = useRouter();
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const phone = ref("");
    const userType = ref("student");
    const companyName = ref("");
    const designation = ref("");
    const linkedin = ref("");
    const github = ref("");
    const website = ref("");
    const error = ref(null);
    const db = getFirestore();

    const handleRegister = async () => {
      try {
        // Register user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        const user = userCredential.user;

        // Add user details to Firestore
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: name.value,
          email: email.value,
          phone: phone.value,
          userType: userType.value,
          companyName:
            userType.value === "professional" ? companyName.value : null,
          designation:
            userType.value === "professional" ? designation.value : null,
          linkedin: linkedin.value,
          github: github.value,
          website: website.value,
          createdAt: new Date(),
        });

        console.log("User registered and added to Firestore:", user);
        router.push("/auth/login");
      } catch (err) {
        error.value = err.message;
        console.error("Error registering user:", err);
      }
    };

    return {
      name,
      email,
      password,
      phone,
      userType,
      companyName,
      designation,
      linkedin,
      github,
      website,
      error,
      handleRegister,
    };
  },
};
</script>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url("public/img/common/profile_bg.webp") center/cover no-repeat;
  padding: 20px;
  box-sizing: border-box;
}

.register-container {
  width: 100%;
  max-width: 500px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow-y: auto;
  max-height: 90vh;
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

@media (max-width: 768px) {
  .flex-row {
    flex-direction: column;
  }

  .flex-item {
    flex: 1 1 100%;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 20px;
  }

  input, button {
    padding: 10px;
    font-size: 14px;
  }

  .radio-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
