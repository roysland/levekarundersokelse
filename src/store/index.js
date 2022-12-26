import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import bydelsoner from '@/assets/data/zoneBydel.json'
import bydelskart from '@/assets/data/bydeler.json'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    zones: null,
    areas: null,
    sources: [
      {
        name: 'Utflyttinger',
        url: '/utflyttinger.json'
      },
      {
        name: 'Median inntekt',
        url: '/median_inntekt.json'
      },
      {
        name: 'Høy Utdanning',
        url: '/hoy_utdanning.json'
      },
      {
        name: 'Lav Utdanning',
        url: '/lav_utdanning.json'
      },
      {
        name: 'Barneutflyttinger',
        url: '/barneutflyttinger.json'
      },
      {
        name: 'Innvandrerbakgrunn',
        url: '/innvandrerbakgrunn.json'
      },
      {
        name: 'Overgangsstønad',
        url: '/overgangsstonad.json'
      },
      {
        name: 'Registrert arbeidsledighet',
        url: '/registrert-arbeidsledighet.json'
      },
      {
        name: 'Unge uførepensjonister',
        url: '/unge-uforepensjonister.json'
      },
      {
        name: 'Aldersstandardiserte dødsrater - Kvinner',
        url: '/levekar_dodsrate_kvinner.json'
      },
      {
        name: 'Alderstandardiserte dødsrater - Menn',
        url: '/levekaar_doedsrate_menn.json'
      },
      {
        name: 'Levekår Stavanger: Barn med barnevernstiltak',
        url: '/barn_med_barnevernstiltak.json'
      }
    ],
    bydeler: bydelsoner,
    bydelskart: bydelskart,
    tree: null
  },
  mutations: {
    'SET_ZONES' (state, payload) {
      state.zones = payload
      state.areas = payload.features.filter((zone) => {
        return zone.properties.Objektype === 'AdministrativtOmråde'
      }).map((z) => {
        return {
          id: parseInt(z.properties.AKrets1.match(/^(\d+)/g)),
          name: z.properties['AKrets1'].replace(/^[\s\d]+/g, ''),
          areal: z.properties.Areal
        }
      })
    },
    'SET_BYDELS_TREE' (state, payload) {
      state.tree = payload
    }
  },
  actions: {
    async getZones ({ commit }) {
      let response
      response = await Axios.get('/levekarssoner.json')
        .then((response) => {
          console.log(response)
          commit('SET_ZONES', response.data)
        })
      return response
    },
    utflyttinger () {
      return Axios.get('https://opencom.no/dataset/b1b2f47d-6418-4029-b721-9fecdd0fe1e4/resource/d1e89be2-fac5-4760-b0f2-fbb276d0e1c1/download/utflyttinger.json')
    }
  },
  getters: {
    zoneHeaders: state => {
      return Object.keys(state.areas[0])
    },
    getPolygons: state => {
      return state.zones.features.filter((feature) => {
        return feature.geometry.type === 'Polygon'
      })
    },
    geometryTypes: state => {
      let types = state.zones.features.map((zone) => {
        return zone.geometry.type
      })
      return [...new Set(types)]
    },
    getBydelFromZone: state => (id) => {
      let bydels = state.bydeler.filter((bydel) => {
        return bydel.areas.includes(id)
      })
      return bydels[0]
    },
    getBydelFromZoneId: state => (id) => {
      return state.bydeler.filter((bydel) => {
        return bydel.areas.indexOf(id) > -1
      })
    },
    getZonesInBydel: state => (name) => {
      let area = state.bydeler.filter((bydel) => {
        return bydel.name === name
      })
      /* let zones = state.areas.filter((zone) => {
        return area[0].zones.indexOf(zone.id)
      }) */
      return area[0].zones
    }
  },
  modules: {
  }
})
