<template>
  <div id="app" v-if="ready">
    <div id="menuToggle">
      <div class="nav-item nav-btn" id="header-btn" @click="expandmenu">
          <span></span>
          <span></span>
          <span></span>
      </div>
    </div>
    <router-view v-if="$store.state.zones" :key="$route.fullPath" />
    <div v-else>Loading data</div>
    <div id="bydelsmenu" :class="{'open': expandedMenu}"><bydels-tree></bydels-tree></div>
  </div>
</template>
<script>
import BydelsTree from '@/components/BydelsTree'
export default {
  components: { BydelsTree },
  data () {
    return {
      ready: false,
      expandedMenu: false
    }
  },
  watch: {
    '$route' () {
      this.expandedMenu = false
    }
  },
  methods: {
    expandmenu () {
      this.expandedMenu = !this.expandedMenu
    }
  },
  mounted () {
    this.$store.dispatch('getZones')
      .then(() => {
        this.ready = true
      })
  }
}
</script>
<style>
html, body {
  margin: 0;
}
#app {
  position: relative;
  top: 0;
}
#menuToggle {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
#bydelsmenu {
  position: fixed;
  width: 300px;
  top: 0;
  height: calc(100vh - 1%);
  right: -300px;
  background: #fff;
  z-index: 999;
  transition: right 200ms linear;
  box-shadow: 0 0 4px rgba(0,0,0,0.25);
  overflow: hidden;
}
#bydelsmenu.open {
  right: 0;
}
</style>
