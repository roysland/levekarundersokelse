<template>
  <div class="container">
    <div class="map-container" style="margin-top: 3rem;">
    <mapbox
      :access-token="token"
      :map-options="mapOptions"
      :geolocate-control="{
        show: true,
        position: 'top-left',
      }"
      @map-init="mapInit"
      @map-load="loaded"
      @map-click:area="clicked"
      @geolocate-error="geolocateError"
      @geolocate-geolocate="geolocate"
    />
<!--     <mapbox
      :access-token="token"
      :map-options="mapOptions"
      :geolocate-control="{
        show: true,
        position: 'top-left',
      }"
      @map-load="loaded"
      @map-zoomend="zoomend"
      @map-click:area="clicked"
      @map-mousemove:area="mouseMove"
      @map-mouseleave:area="mouseLeave"
      @map-touchstart:area="mouseMove"
      @map-touchend:area="mouseLeave"
      @geolocate-error="geolocateError"
      @geolocate-geolocate="geolocate"
    /> -->
    <div class="map-overlay" id="map-overlay" ref="mapOverlay" v-if="bydel && clickedArea">
      <div class="card">
        <div class="card-header">
          {{bydel.name}}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="clickedArea = null">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="card-body">
          <h5 class="card-title">{{clickedArea}}</h5>
          <p>Sammenlign {{clickedArea}} med {{bydel.name}} og resten av Stavanger</p>
          <router-link :to="`/${bydel.name}/${clickedArea}`" class="btn btn-primary">Se detaljer</router-link>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'
import Axios from 'axios'
import bydeler from '@/assets/data/bydeler.json'
export default {
  components: { Mapbox },
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
      clickedArea: null,
      mapOverlay: {
        points: { x: 0, y: 0 }
      }
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
    mapInit (map) {
      console.log(map)
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
    loadDataSet () {
      const set = this.$store.state.sources[this.dataset]
      Axios.get(set.url)
        .then((response) => {
          this.currentDataSet.data = response.data
          this.currentDataSet.years = this.mapYearsFromData(this.currentDataSet.data)
          this.currentDataSet.minMax = this.getHighLowValues(this.currentDataSet.data)
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
    mouseMove (map, e) {
      if (e.features.length > 0) {
        if (this.selectedArea) {
          map.setFeatureState({
            source: 'areas',
            id: this.selectedArea
          }, {
            hover: false
          })
        }
        this.selectedArea = e.features[0].id
        map.setFeatureState({
          source: 'areas',
          id: this.selectedArea
        }, {
          hover: true
        })
      }
    },
    mouseLeave (map, e) {
      if (this.selectedArea) {
        map.setFeatureState({
          source: 'areas',
          id: this.selectedArea
        }, {
          hover: false
        })
      }
      this.selectedArea = null
    },
    loaded (map) {
      map.addSource('areas', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.$store.state.zones.features
        },
        generateId: true
      })
      // Bydeler
      map.addSource('bydeler', {
        type: 'geojson',
        data: bydeler
      })
      map.addLayer({
        id: 'bydelLayer',
        type: 'fill',
        source: 'bydeler',
        layout: {},
        paint: {
          'fill-color': {
            property: 'bydelNr',
            stops: [[0, '#fff'], [1, 'green'], [2, 'blue'], [3, 'red'], [4, 'orange'], [5, 'lime'], [6, 'magenta'], [7, 'pink']]
          },
          'fill-opacity': 0.5
        },
        filter: ['==', '$type', 'Polygon']
      })

      map.addLayer({
        id: 'area',
        type: 'fill',
        source: 'areas',
        layout: {},
        paint: {
          'fill-color': '#627bc1',
          'fill-opacity': ['case',
            ['boolean', ['feature-state', 'hover'], false],
            0.5,
            0.05
          ]
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
      /*      map.addLayer({
        id: 'område-highlight',
        type: 'fill',
        source: 'areas',
        'source-layer': 'original',
        paint: {
          'fill-outline-color': '#484896',
          'fill-color': '#6e599f',
          'fill-opacity': .75
        },
        filter: ['in', 'properties']
      }) */
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
