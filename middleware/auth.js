export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();

  if (!nuxtApp.$auth) {
    console.error("Auth plugin is not initialized");
    return navigateTo("/auth/login");
  }

  return new Promise((resolve) => {
    nuxtApp.$auth.onAuthStateChanged((user) => {
      if (!user) {
        resolve(navigateTo("/auth/login"));
      } else {
        resolve();
      }
    });
  });
});
