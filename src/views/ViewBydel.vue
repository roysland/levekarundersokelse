<template>
  <div v-if="ready" class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Stavanger</router-link></li>
        <li class="breadcrumb-item active">{{$route.params.bydel}}</li>
      </ol>
    </nav>
    <div class="row">
      <router-link class="area-link" v-for="zone in zones" :key="zone.id" :to="`/${$route.params.bydel}/${zone.id} ${zone.name}`">{{zone.name}}</router-link>
    </div>
    <div class="row">
      <div class="col">
        <h1>{{$route.params.bydel}}</h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-md-6">
        <area-svg :area="area" bydel></area-svg>
      </div>
      <div class="col-xs-12 col-md-6">
        <!-- <higcharts :options="chartOptions"></higcharts> -->
      </div>
    </div>
  </div>
</template>
<script>
import AreaSvg from '@/components/AreaSvg'
export default {
  components: {
    AreaSvg
  },
  data () {
    return {
      ready: true,
      area: this.$route.params.area,
      areaId: this.$store.state.bydeler,
      zones: this.$store.getters.getZonesInBydel(this.$route.params.bydel)
    }
  }
}
</script>
