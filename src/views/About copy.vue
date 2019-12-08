<template>
  <div class="about">
    <h1>DataTables</h1>
    <svg width="375" height="375">
      <path :d="svg" fill="#F0F8FF" stroke="#006600" stroke-width="1px"></path>
    </svg>
    <data-tables v-model="area" @input="setArea"></data-tables>
  </div>
</template>
<script>
import DataTables from '@/components/DataTables'
import * as d3 from 'd3'
export default {
  components: { DataTables },
  data () {
    return {
      svg: null,
      area: '19 Kvalaberg'
    }
  },
  methods: {
    getPolygon (name) {
      return this.$store.state.zones.features.filter((zone) => {
        return zone.properties.Streng === name
      })[0]
    },
    makesvg () {
      const polygon = this.getPolygon(this.area)
      const projection = d3.geoEquirectangular()
      projection.fitSize([375, 375], polygon)
      const geoGenerator = d3.geoPath().projection(projection)
      const path = geoGenerator(polygon)
      return path
    },
    setArea (value) {
      this.area = value
      this.svg = this.makesvg()
    }
  },
  mounted () {
    this.svg = this.makesvg()
  }
}
</script>
<style scoped>
svg {
  fill: #ccc;
  height: auto;
  width: auto;
}
</style>
