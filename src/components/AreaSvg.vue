<template>
  <svg width="375" height="375" ref="area" id="area">
    <path :d="svg" fill="#F0F8FF" stroke="#006600" stroke-width="1px"></path>
  </svg>
</template>
<script>
import * as d3 from 'd3'
export default {
  props: {
    area: {
      type: String,
      default: '3 Sentrum'
    },
    isBydel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      svg: null,
      windowSize: {
        width: 0,
        height: 0
      }
    }
  },
  methods: {
    getPolygon (name) {
      if (this.isBydel) {
        return this.$store.state.bydelskart.features.filter((zone) => {
          return zone.properties.Streng === name
        })[0]
      } else {
        return this.$store.state.zones.features.filter((zone) => {
          return zone.properties.Streng === name
        })[0]
      }
    },
    makesvg () {
      const polygon = this.getPolygon(this.area)
      const projection = d3.geoEquirectangular()
      projection.fitSize([this.windowSize.width, this.windowSize.height], polygon)
      const geoGenerator = d3.geoPath().projection(projection)
      const path = geoGenerator(polygon)
      return path
    }
  },
  mounted () {
    this.windowSize.width = this.$refs.area.getBoundingClientRect().width
    this.windowSize.height = this.$refs.area.getBoundingClientRect().height
    this.svg = this.makesvg()
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
