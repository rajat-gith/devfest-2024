<template>
  <v-container fluid class="">
    <v-row justify-center align="center">
      <v-col md="6" sm="6" cols="12">
        <h1 class="responsive-h1 my-4">
          Cloud Community Day <br />
          {{ mainData.communityLocation.city }} 2024
        </h1>
        <p class="" :style="{ maxWidth: '90%' }">
          {{ mainData.eventInfo.description.short }}
        </p>

        <p class="my-5">
          <span class="mr-4">
            <v-icon class="mr-1">mdi-calendar-month</v-icon>
            {{ mainData.eventInfo.date }}
          </span>

          <span class="mr-4">
            <v-icon class="mr-1">mdi-map-legend</v-icon>
            <a
              :href="mainData.eventInfo.venue.map_link"
              target="_blank"
              style="color: black"
            >
              {{ mainData.eventInfo.venue.address }}
            </a>
          </span>
        </p>

        <ClientOnly>
          <template v-if="isLoggedIn">
            <NuxtLink
              to="/auth/profile"
              class="d-md-flex d-lg-flex d-sm-flex d-none mr-3 no-decoration"
              style="text-decoration: none"
            >
              <v-btn
              rounded
                size="large"
                color="#FFD427"
                class="my-4 mt-3"
                style="border: 1.5px solid #1e1e1e; color: black"
                variant="flat"
              >
                Explore
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
                size="large"
                color="#FFD427"
                class="my-4 mt-3"
                style="border: 1.5px solid #1e1e1e; color: black"
                variant="flat"
                >Register Now
              </v-btn>
            </NuxtLink>
          </template>
        </ClientOnly>
      </v-col>
      <v-col md="6" sm="6" cols="12">
        <v-img
          alt="logo"
          src="assets/img/hero-image.svg"
          lazy-src="assets/img/hero-image.svg"
        ></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useDisplay } from "vuetify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

const { width, mobile } = useDisplay();
const screenWidth = ref(width);
const { mainData } = useJSONData();

const isLoggedIn = ref(false);
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user; // Update isLoggedIn based on whether user is logged in
  });
});
</script>

<style scoped>
.responsive-h1 {
  font-size: 250%;
  line-height: 100%;
}

/* Media query for screens larger than 600px */
@media (min-width: 600px) {
  .responsive-h1 {
    font-size: 300%;
  }
}
</style>
