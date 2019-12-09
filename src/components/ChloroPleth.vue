<template>
  <div class="container">
    <div class="row" style="padding-top: 1rem;">
      <div class="col"><report-selector @dataLoaded="loadSource($event)" /></div>
      <div class="col">
        <div>
          <select class="form-control form-control-sm" v-model="selectedYear" @change="selectYear()">
            <option v-for="year in years" :key="year">{{year}}</option>
        </select>
        </div>
      </div>
    </div>
    <div class="map-container" style="margin-top: 3rem;">
    <mapbox
      v-if="drawMap"
      :access-token="token"
      :map-options="mapOptions"
      :geolocate-control="{
        show: true,
        position: 'top-left',
      }"
      @map-init="mapInit"
      @map-load="loaded"
      @geolocate-error="geolocateError"
      @geolocate-geolocate="geolocate"
    />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Mapbox from 'mapbox-gl-vue'
import Axios from 'axios'
import ReportSelector from '@/components/ReportSelector'
export default {
  components: { Mapbox, ReportSelector },
  data () {
    return {
      token: 'pk.eyJ1Ijoib2xlam9yIiwiYSI6ImNqcXh6N3U5MjAzZzI0Mm1qbXNtN2N2ZDAifQ.6bbUsWNXftwfUjmm8asUgA',
      map: null,
      mapOptions: {
        style: 'mapbox://styles/mapbox/light-v10',
        center: [5.7000000000000, 59.00000000000000],
        zoom: 10
      },
      dataset: 0,
      selectedArea: null,
      selectedBydel: null,
      selectedYear: null,
      clickedArea: null,
      mapOverlay: {
        points: { x: 0, y: 0 }
      },
      years: [],
      drawMap: false,
      reportSource: null
    }
  },
  computed: {
    bydel () {
      if (this.clickedArea) {
        let id = parseInt(this.clickedArea.match(/(\d+)/g)[0])
        if (id !== 99) {
          return this.$store.state.bydeler.filter((bydel) => {
            return bydel.areas.indexOf(id) > -1
          })[0]
        } else {
          return null
        }
      } else {
        return null
      }
    }
  },
  methods: {
    loadSource (event) {
      Axios.get(event.url)
        .then((response) => {
          this.dataset = response.data
          this.years = this.mapYearsFromData(this.dataset)
        })
    },
    selectYear () {
      // filter dataset
      let dataset = this.dataset.filter((rows) => {
        return rows['År'] === parseInt(this.selectedYear)
      })
      let newGeo = []
      let geojson = Object.assign({}, this.$store.state.zones) // Make a copy
      geojson.features.forEach((feature) => {
        if (feature.geometry.type === 'Polygon') {
          const id = this.getIdFromName(feature.properties.Streng)
          let data = dataset.filter((row) => {
            return row.Ident === id
          })
          feature.data = parseFloat(data[0].Variabel)
          newGeo.push(feature)
        }
      })
      // console.log(newGeo)
      this.reportSource = newGeo
      this.drawMap = true
      // merge data into geojson
    },
    getIdFromName (name) {
      return parseInt(name.match(/^(\d+)/g)[0])
    },
    removeNumbersFromName (name) {
      return name.replace(/^[\s\d]+/g, '')
    },
    addSource (map, data) {
      map.addSource('report-geo', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: data
        },
        generateId: true
      })
      return map
    },
    mapInit (map) {
      console.log('Map initialized')
      this.map = map
    },
    addCurrentLayer (map) {
      map.addLayer({
        id: 'current-layer',
        source: 'areas',
        type: 'fill',
        filter: ['==', '$type', 'Polygon']
      })
    },
    mapYearsFromData (data) {
      const years = data.map((d) => {
        return d['År']
      })
      return [...new Set(years)]
    },
    getHighLowValues (data) {
      const values = data.map((d) => { return parseFloat(d['Variabel']) })
      const set = [...new Set(values)]
      return set
    },
    clicked (map, e) {
      // const title = e.features[0].properties.Streng
      this.clickedArea = e.features[0].properties.Streng
      this.mapOverlay.points = e.point
      console.log(e)
    },
    geolocateError (control, positionError) {
      console.log(positionError)
    },
    geolocate (control, position) {
      console.log(
        `User position: ${position.coords.latitude}, ${position.coords.longitude}`
      )
    },

    loaded (map) {
      map.addSource('areas', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.reportSource
        },
        generateId: true
      })

      map.addLayer({
        id: 'area',
        type: 'fill',
        source: 'areas',
        layout: {},
        'paint': {
          'fill-color': {
            'property': 'data',
            'stops': [
              [1, 'white'],
              [25, 'orange'],
              [1000, 'firebrick']
            ]
          },
          'fill-outline-color': 'white',
          'fill-opacity': 0.9
        },
        filter: ['==', '$type', 'Polygon']
      })
      map.addLayer({
        'id': 'grenser',
        'type': 'line',
        'source': 'areas',
        layout: {},
        'paint': {
          'line-color': '#627bc1',
          'line-width': 2
        }
      })
      map.addLayer({
        id: 'cloro',
        type: 'heatmap',
        source: 'areas',
        paint: {
          'fill-color':
            ["let", "density", ["/", ["get", "population"], ["get", "sq-km"]],
            [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            [
            "interpolate",
            ["linear"],
            ["var", "density"],
            274,
            ["to-color", "#edf8e9"],
            1551,
            ["to-color", "#006d2c"]
            ],
            10,
            [
            "interpolate",
            ["linear"],
            ["var", "density"],
            274,
            ["to-color", "#eff3ff"],
            1551,
            ["to-color", "#08519c"]
            ]
            ]
            ],
            'fill-opacity': .7
        },
        filter: ['==', '$type', 'Polygon']
      })
    }
  }
}
</script>
<style>
#map {
  width: 100%;
  height: calc(100vh - 120px);
}
#map-overlay {
  position: absolute;
  top: 25%;
  left: 25%;
}
.map-container {
  position: relative;
}
</style>
