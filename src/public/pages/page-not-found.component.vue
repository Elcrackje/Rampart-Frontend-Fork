<script>

export default {
  name: "page-not-found",
  computed: {
    notFoundPath() {
      return this.$route.path;
    }
  }
}
</script>

<template>
  <div class="centered">
    <h1>404 {{ $t('page-not-found') }}</h1>
    <p>{{$t('route-not-found')}} {{ notFoundPath }}</p>
    <router-link to="home">
      <pv-button label="Ir a Home" severity="danger"></pv-button>
    </router-link>
  </div>
</template>

<style scoped>
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}
</style>