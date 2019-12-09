<template>
<section class="container">
  <div class="row">
    <div class="col-xs-12"><h6>Stavanger</h6></div>
  </div>
  <div class="row" style="max-height: 500px; overflow-y: scroll;">
    <ul class="menu" v-for="(bydel, index) in tree" :key="index">
      <template >
        <li class="menu-item"><router-link :to="'/' + bydel.name">{{bydel.name}}</router-link>
        <ul class="menu">
            <li class="menu-item" v-for="(zone, idx) in bydel.zones" :key="idx">
              <router-link :to="`/${bydel.name}/${zone.id} ${zone.name}`">{{zone.name}}</router-link>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</section>
</template>
<script>
export default {
  data () {
    return {
      tree: this.$store.state.bydeler
    }
  },
  watch: {
    '$store.state.bydeler': {
      immediate: true,
      handler: 'buildTree'
    }
  },
  methods: {
    buildTree () {
      let tree = []
      this.$store.state.bydeler.forEach((bydel) => {
        let zones = this.$store.state.areas.filter((zone) => {
          return bydel.areas.indexOf(zone.id) > -1
        })
        bydel.zones = zones
        tree.push(bydel)
      })
      this.$store.commit('SET_BYDELS_TREE', tree)
      return tree
    }
  }
}
</script>
