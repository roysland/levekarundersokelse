<template>
  <div>
    <table class="table table-sm" v-if="$store.state.areas">
      <thead>
        <tr>
          <th v-for="(value, idx) in $store.getters.zoneHeaders" :key="idx">{{value}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in $store.state.areas" :key="index">
          <td v-for="header in $store.getters.zoneHeaders" :key="header + '_' + index">
            <a @click="$emit('input', row.id + ' ' + row.name)">{{row[header]}}</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      areas: null,
      utflyttinger: null,
      data: {
        zones: []
      }
    }
  },
  mounted () {
    this.$store.dispatch('getZones')
  }
}
</script>
