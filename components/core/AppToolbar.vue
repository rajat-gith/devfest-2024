<template>
  <v-app-bar
    :elevation="0"
    fixed
    class="mt-0 px-2 toolbar-class mx-auto mt-4"
    rounded="xl"
    color="#eeeeee"
  >
    <v-app-bar-nav-icon
      class="d-md-none d-lg-none d-sm-flex d-flex"
      @click="drawerAction"
    ></v-app-bar-nav-icon>
    <NuxtLink to="/" class="px-2" style="text-decoration: none; color: black">
      <div class="d-flex">
        <v-img
          width="120"
          alt="logo"
          src="/assets/img/devfest-logo.svg"
          class="mr-2"
        ></v-img>
        <v-chip
          style="display: inline; background-color: white"
          variant="outlined"
          color="black"
          size="small"
          class="align-center pt-1"
          >{{ mainData.communityLocation.city }}</v-chip
        >
      </div>
    </NuxtLink>

    <v-spacer></v-spacer>
    <div class="mx-4 d-none d-sm-none d-md-flex d-lg-flex">
      <template v-for="(item, index) in navbarData" :key="index">
        <v-btn
          rounded
          size="small"
          style="text-transform: capitalize"
          :to="item.path"
          class="mx-1"
          v-if="item.visible"
          >{{ item.name }}</v-btn
        >
      </template>
    </div>

    <ClientOnly>
      <template v-if="isLoggedIn">
        <NuxtLink
          to="/auth/profile"
          class="d-md-flex d-lg-flex d-sm-flex d-none mr-3 no-decoration"
          style="text-decoration: none"
        >
          <v-btn
            rounded
            color="#FFD427"
            style="
              border: 1.5px solid #1e1e1e;
              color: black;
              text-transform: capitalize;
              text-decoration: none;
              font-weight: 100;
            "
            variant="flat"
          >
            Profile
          </v-btn>
        </NuxtLink>
      </template>
      <template v-else>
        <NuxtLink
          v-if="
            mainData &&
            mainData.eventInfo.registeration.link.length &&
            new Date(mainData.eventInfo.registeration.end_date) > new Date()
          "
          to="/auth/register"
          class="d-md-flex d-lg-flex d-sm-flex d-none mr-3 no-decoration"
          style="text-decoration: none"
        >
          <v-btn
            rounded
            color="#FFD427"
            style="
              border: 1.5px solid #1e1e1e;
              color: black;
              text-transform: capitalize;
              text-decoration: none;
              font-weight: 100;
            "
            variant="flat"
          >
            Register Now
          </v-btn>
        </NuxtLink>
      </template>
    </ClientOnly>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';


const { mainData, navbarData } = useJSONData();
const sidebar = useSideBar();
const auth = getAuth();
const router = useRouter();
const isLoggedIn = ref(false);

const drawerAction = () => {
  sidebar.value = !sidebar.value;
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});
</script>

<style scoped>
.v-card {
  max-width: 600px;
  margin: 20px auto;
}

.toolbar-class {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  margin-bottom: 80px;
  height: 64px;
}

/* Mobile breakpoint */
@media (max-width: 700px) {
  .toolbar-class {
    max-width: 100% !important;
    margin-left: auto !important;
    margin-right: auto !important;
    margin-top: 0 !important;
    border-radius: 0 !important;
  }
}

/* Tablet and larger screens */
@media (min-width: 700px) {
  .toolbar-class {
    max-width: 1000px !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
}
</style>
