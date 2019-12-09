<template>
  <div>
    <select class="form-control form-control-sm" v-model="set" @change="loadDataSet">
      <option v-for="(source, index) in $store.state.sources" :key="index" :value="index">
        {{source.name}}
      </option>
    </select>
  </div>
</template>
<script>
export default {
  data () {
    return {
      set: 0,
      currentDataSet: {
        minMax: [],
        data: null,
        years: [],
        indicator: null,
        parameter: null
      }
    }
  },
  methods: {
    loadDataSet () {
      const set = this.$store.state.sources[this.set]
      /* Axios.get(set.url)
        .then((response) => {
          this.currentDataSet.data = response.data
          this.currentDataSet.years = this.mapYearsFromData(this.currentDataSet.data)
          this.currentDataSet.minMax = this.getHighLowValues(this.currentDataSet.data)
          this.$emit('dataLoaded', this.currentDataSet)
        }) */
      this.$emit('dataLoaded', set)
      return set
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
    }
  }
}
</script>
