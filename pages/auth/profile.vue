<template>
  <v-container>
    <div class="container">
      <div class="profile_container">
        <div class="bg_img"></div>
        <v-card class="profile-card">
          <v-card-text class="profile-card-content">
            <div class="text-center mb-6">
              <v-avatar size="150" class="mb-4">
                <v-img
                  v-if="userProfile.photoURL"
                  :src="userProfile.photoURL"
                  :key="userProfile.photoURL"
                ></v-img>
                <v-icon v-else size="150" color="grey darken-2">
                  mdi-account-circle
                </v-icon>
              </v-avatar>
              <v-file-input
                v-if="editMode"
                v-model="profileImage"
                accept="image/*"
                label="Upload New Image"
                prepend-icon="mdi-camera"
                class="mt-2"
              ></v-file-input>
            </div>

            <v-text-field
              v-if="editMode"
              v-model="userProfile.name"
              label="Name"
              outlined
              dense
              :disabled="loading"
              class="profile-field"
            ></v-text-field>
            <p v-else class="profile-field">{{ userProfile.name }}</p>

            <v-text-field
              v-if="editMode"
              v-model="userProfile.phone"
              label="Phone Number"
              outlined
              dense
              :disabled="loading"
              class="profile-field"
            ></v-text-field>
            <p v-else class="profile-field">
              <v-icon left>mdi-phone</v-icon>
              {{ userProfile.phone }}
            </p>

            <v-text-field
              v-if="editMode"
              v-model="userProfile.linkedin"
              label="LinkedIn"
              outlined
              dense
              :disabled="loading"
              class="profile-field"
            ></v-text-field>

            <v-text-field
              v-if="editMode"
              v-model="userProfile.github"
              label="GitHub"
              outlined
              dense
              :disabled="loading"
              class="profile-field"
            ></v-text-field>

            <v-text-field
              v-if="editMode"
              v-model="userProfile.website"
              label="Other Website"
              outlined
              dense
              :disabled="loading"
              class="profile-field"
            ></v-text-field>

            <div v-if="!editMode" class="social-buttons">
              <v-btn
                :href="userProfile.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="social-btn linkedin"
                :disabled="!userProfile.linkedin"
                style="cursor: pointer"
              >
                <v-icon left>mdi-linkedin</v-icon>
                LinkedIn
              </v-btn>
              <v-btn
                :href="userProfile.github"
                target="_blank"
                rel="noopener noreferrer"
                class="social-btn github"
                :disabled="!userProfile.github"
              >
                <v-icon left>mdi-github</v-icon>
                GitHub
              </v-btn>
              <v-btn
                :href="userProfile.website"
                target="_blank"
                rel="noopener noreferrer"
                class="social-btn other"
                :disabled="!userProfile.website"
              >
                <v-icon left>mdi-web</v-icon>
                Website
              </v-btn>
            </div>

            <v-skeleton-loader v-if="loading" type="text"></v-skeleton-loader>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn
              v-if="!editMode"
              @click="editMode = true"
              color="primary"
              class="action-button"
            >
              Edit Profile
            </v-btn>
            <v-btn
              v-if="editMode"
              @click="saveProfile"
              color="success"
              :loading="loading"
              class="action-button"
            >
              Save
            </v-btn>
            <v-btn
              v-if="editMode"
              @click="cancelEdit"
              color="error"
              class="action-button"
            >
              Cancel
            </v-btn>
            <v-btn
              @click="handleLogout"
              color="error"
              class="action-button ml-2"
            >
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "vue-router";

const userProfile = ref({
  name: "",
  phone: "",
  linkedin: "",
  github: "",
  website: "",
  photoURL: "",
});
const profileImage = ref(null);
const editMode = ref(false);
const loading = ref(false);
const error = ref(null);
const router = useRouter();

// Access Nuxt's injected Firebase services
const { $auth, $firestore, $storage } = useNuxtApp();

const loadUserProfile = async () => {
  if ($auth.currentUser) {
    try {
      const uid = $auth.currentUser.uid;
      const userDocRef = doc($firestore, "users", uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        userProfile.value = docSnap.data();
        console.log(userProfile);
      } else {
        console.error("No such document!");
        error.value = "User profile not found!";
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      error.value = err.message;
    }
  } else {
    error.value = "No user is currently logged in.";
  }
};

const saveProfile = async () => {
  loading.value = true;

  try {
    const uid = $auth.currentUser.uid;

    // If a new image is selected, upload it to Firebase Storage
    let photoURL = userProfile.value.photoURL;
    if (profileImage.value) {
      const imageRef = storageRef($storage, `profileImages/${uid}`);
      await uploadBytes(imageRef, profileImage.value);
      photoURL = await getDownloadURL(imageRef);

      // Update the userProfile ref immediately
      userProfile.value.photoURL = photoURL;
    }

    const userDocRef = doc($firestore, "users", uid);

    // Prepare the update data
    const updateData = {
      name: userProfile.value.name,
      phone: userProfile.value.phone,
      linkedin: userProfile.value.linkedin,
      github: userProfile.value.github,
      website: userProfile.value.website,
    };

    // Only add photoURL if it is defined
    if (photoURL) {
      updateData.photoURL = photoURL;
    }

    // Update the user document in Firestore
    await updateDoc(userDocRef, updateData);

    // Update Firebase Authentication profile
    await updateProfile($auth.currentUser, {
      displayName: userProfile.value.name,
      photoURL,
    });

    editMode.value = false; // Exit edit mode
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Error updating profile.");
  } finally {
    loading.value = false;
    // Clear the profileImage ref after successful upload
    profileImage.value = null;
  }
};

// Cancel the edit and reload the profile
const cancelEdit = () => {
  editMode.value = false;
  loadUserProfile();
};

// Logout function
const handleLogout = async () => {
  try {
    await signOut($auth);
    localStorage.setItem("isLogin", "false");
    router.push("/auth/login");
  } catch (error) {
    console.error("Error logging out:", error);
    alert("Error logging out.");
  }
};

onMounted(() => {
  onAuthStateChanged($auth, (user) => {
    if (user) {
      loadUserProfile(user.uid);
    } else {
      error.value = "No user is currently logged in.";
      loading.value = false;
    }
  });
});
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  width: 1000px;
  margin: 0 auto;
  padding: 0 15px;
}

.profile_container {
  display: flex;
  flex-direction: row;
  width: 100%;
  border-radius: 50px;
  margin: 20px auto;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.bg_img {
  position: relative;
  flex: 1;
  min-height: 300px;
  background: url("public/img/common/profile_bg.png") center/cover no-repeat;
}

.profile-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #f5f5f5;
}

.profile-card-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
}

.profile-field {
  margin-bottom: 1rem;
  width: 100%;
}

.profile-field :deep(input) {
  font-weight: 500;
  color: #333;
}

.profile-field :deep(label) {
  font-weight: 500;
  color: #666;
}

.social-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.social-btn {
  flex: 1 1 30%;
  min-width: 120px;
  padding: 0.5rem;
  font-size: clamp(0.8rem, 2vw, 1rem);
  white-space: nowrap;
}

.linkedin {
  background-color: #0077b5;
  color: white;
}

.github {
  background-color: #000;
  color: white;
}

.other {
  background-color: #fbbf00;
  color: black;
}

.v-avatar {
  border: 3px solid #e0e0e0;
  width: clamp(100px, 20vw, 150px);
  height: clamp(100px, 20vw, 150px);
}

@media (max-width: 1024px) {
  .container {
    width: 90%;
  }

  .profile_container {
    flex-direction: column;
    border-radius: 25px;
  }

  .bg_img {
    height: 200px;
  }

  .profile-card {
    border-radius: 0 0 25px 25px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0;
  }

  .profile_container {
    margin: 10px;
    border-radius: 15px;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .social-buttons {
    flex-direction: row;
    justify-content: space-between;
  }

  .social-btn {
    flex: 0 1 calc(33.333% - 0.5rem);
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .container {
    width: 100%;
    padding: 0 10px;
  }

  .profile_container {
    margin: 0;
    border-radius: 0;
  }

  .bg_img {
    height: 150px;
  }

  .profile-card {
    padding: 1rem;
    border-radius: 0;
  }

  .social-buttons {
    flex-direction: column;
  }

  .social-btn {
    width: 100%;
  }
}
</style>
