<template>
<section class="container">
  <div class="row">
    <div class="col-xs-12"><h1>Stavanger</h1></div>
  </div>
  <div class="row">
    <dl class="col-xs-12 col-sm-6" v-for="(bydel, index) in tree" :key="index">
      <template >
        <dt><router-link :to="'/' + bydel.name">{{bydel.name}}</router-link></dt>
        <dd>
          <ul class="list-group">
            <li class="list-group-item" v-for="(zone, idx) in bydel.zones" :key="idx">
              <router-link :to="`/${bydel.name}/${zone.id} ${zone.name}`">{{zone.name}}</router-link>
            </li>
          </ul>
        </dd>
      </template>
    </dl>
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
      return tree
    }
  },
  mounted () {
    this.tree = this.buildTree()
  }
}
</script>
