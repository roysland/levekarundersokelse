<template>
  <div class="about">
    <div class="row">
      <div class="col">
        <svg width="375" height="375" ref="area" id="area">
          <path :d="svg" fill="#F0F8FF" stroke="#006600" stroke-width="1px"></path>
        </svg>
      </div>
      <div class="col">
        <h1>{{area}}</h1>
      </div>
    </div>
<!--     <svg width="375" height="375" fill="#F0F8FF" ref="areas">
      <g class="map-layer"><path :d="fullmap" stroke="#006600" stroke-width="0.5px"></path></g>
    </svg> -->
    <div style="height: 400px; overflow-y: scroll">
    <data-tables v-model="area" @input="setArea"></data-tables>
    </div>
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
      area: '19 Kvalaberg',
      fullmap: null,
      windowSize: {
        width: 0,
        height: 0
      },
      transform: {
        y: 0,
        x: 0,
        z: 0
      }
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
      projection.fitSize([this.windowSize.width, this.windowSize.height], polygon)
      const geoGenerator = d3.geoPath().projection(projection)
      const path = geoGenerator(polygon)
      return path
    },
    createFullMap () {
      const projection = d3.geoEquirectangular()
      projection.fitSize([this.windowSize.width, this.windowSize.height], this.$store.state.zones)
      const geoGenerator = d3.geoPath().projection(projection)
      return geoGenerator(this.$store.state.zones)
    },
    setArea (value) {
      this.area = value
      this.svg = this.makesvg()
    }
  },
  mounted () {
    this.windowSize.width = this.$refs.area.getBoundingClientRect().width
    this.windowSize.height = this.$refs.area.getBoundingClientRect().height
    this.svg = this.makesvg()
    this.fullmap = this.createFullMap()
  }
}
</script>
<style scoped>
svg {
  display: block;
  width: 100%;
}
.background {
  fill: #eee;
  pointer-events: all;
}
#area path {
  stroke-dasharray: 5000;
  stroke-dashoffset: 5000;
  fill: transparent;
  animation: dash 5s linear forwards;
}
.map-layer {
  fill: #fff;
  stroke: #aaa;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
    fill: #F0F8FF;
  }
}
</style>
