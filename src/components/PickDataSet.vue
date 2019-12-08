<template>
  <div class="row">
    <div class="col">
      <select class="form-control" v-model="dataset">
        <option v-for="(source, index) in $store.state.sources" :key="index" :value="index">
          {{source.name}}
        </option>
      </select>
    </div>
    <div class="col">
      <div v-if="currentDataSet.years.length > 0">
      <label>Kilder</label>
      <select class="form-control">
        <option v-for="year in currentDataSet.years" :key="year">
          {{year}}
        </option>
      </select>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
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
      const set = this.$store.state.sources[this.dataset]
      Axios.get(set.url)
        .then((response) => {
          this.currentDataSet.data = response.data
          this.currentDataSet.years = this.mapYearsFromData(this.currentDataSet.data)
          this.currentDataSet.minMax = this.getHighLowValues(this.currentDataSet.data)
        })
    }
  }
}
</script>