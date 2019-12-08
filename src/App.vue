<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view v-if="$store.state.zones" :key="$route.fullPath" />
    <div v-else>Loading data</div>
  </div>
</template>
<script>
export default {
  mounted () {
    this.$store.dispatch('getZones')
  }
}
</script>
