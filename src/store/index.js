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
        url: 'https://opencom.no/dataset/b1b2f47d-6418-4029-b721-9fecdd0fe1e4/resource/d1e89be2-fac5-4760-b0f2-fbb276d0e1c1/download/utflyttinger.json'
      },
      {
        name: 'Median inntekt',
        url: 'https://opencom.no/dataset/9cb5d4e8-4e15-4e00-8587-a2faf47d6116/resource/07438caf-fae6-434b-94f2-8d1a944b6812/download/median_inntekt.json'
      },
      {
        name: 'Høy Utdanning',
        url: 'https://opencom.no/dataset/1684dfc3-fff7-4b76-8bdc-a0a19a9ede00/resource/91f3c50d-0854-451f-bfba-f081ec9407f7/download/hoy_utdanning.json'
      },
      {
        name: 'Lav Utdanning',
        url: 'https://opencom.no/dataset/f1175bf3-0fe9-457d-a741-c479fb57d12d/resource/bb6f3714-819e-4ec1-a566-2dcdab2a3c62/download/lav_utdanning.json'
      },
      {
        name: 'Barneutflyttinger',
        url: 'https://opencom.no/dataset/b25b9af6-b193-4683-8ef3-3becab6626de/resource/2bf1c43e-0bd3-4370-b177-de00554ca490/download/barneutflyttinger.json'
      },
      {
        name: 'Innvandrerbakgrunn',
        url: 'https://opencom.no/dataset/4ca7d405-2a81-4bf4-bceb-8818cb337bcc/resource/a8daa07d-f82c-427b-b7c9-869c108378a4/download/innvandrerbakgrunn.json'
      },
      {
        name: 'Overgangsstønad',
        url: 'https://opencom.no/dataset/ed9fd038-d608-46ee-971e-2e28e17c1801/resource/13ad9016-cdb9-46a0-8aab-2f2644b86fd9/download/overgangsstonad.json'
      },
      {
        name: 'Registrert arbeidsledighet',
        url: 'https://opencom.no/dataset/0bbdaecf-563a-4a5c-9f94-dcba32abaf52/resource/4628705c-da46-4474-a282-4129e0daeccd/download/registrert-arbeidsledighet.json'
      },
      {
        name: 'Unge uførepensjonister',
        url: 'https://opencom.no/dataset/3a525b19-abd0-4f63-9f99-e5187a41a0ed/resource/97802653-47fa-4d3c-b169-6c4cb32963f0/download/unge-uforepensjonister.json'
      },
      {
        name: 'Aldersstandardiserte dødsrater - Kvinner',
        url: 'https://opencom.no/dataset/66766314-b8eb-41fc-8ed8-260d247dd51e/resource/7cbc469c-cb8e-4242-938b-fa2c4712169b/download/levekar_dodsrate_kvinner.json'
      },
      {
        name: 'Alderstandardiserte dødsrater - Menn',
        url: 'https://opencom.no/dataset/24fea7bc-ce38-4581-985e-1e6ca522e37b/resource/baee2c3a-2fee-4a8e-9571-7f29863429cb/download/levekaar_doedsrate_menn.json'
      },
      {
        name: 'Levekår Stavanger: Barn med barnevernstiltak',
        url: 'https://opencom.no/dataset/2236ceef-1f1d-4432-8e20-aa1fecc3c365/resource/4e020f82-8c4e-4090-aa0c-d8a9fd477838/download/barn_med_barnevernstiltak.json'
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
          id: parseInt(z.properties.Streng.match(/^(\d+)/g)[0]),
          name: z.properties.Streng.replace(/^[\s\d]+/g, ''),
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
      try {
        response = await Axios.get('https://opencom.no/dataset/b2d56845-f78e-4c45-ac33-3f0cebda3e63/resource/b0ed941f-d928-40f3-8f1b-a30c11040dae/download/levekarssoner.json')
          .then((response) => {
            commit('SET_ZONES', response.data)
          })
      } catch (error) {
        console.log(error.msg)
        return
      }
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
