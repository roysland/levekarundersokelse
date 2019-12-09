import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMapbox from 'vue-mapbox'
import Mapbox from 'mapbox-gl'
import '@/assets/css/app.css'
import '@/assets/css/extra.scss'
/* import '@/assets/sass/app.scss' */
Vue.config.productionTip = false

Vue.use(VueMapbox, { mapboxgl: Mapbox })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
