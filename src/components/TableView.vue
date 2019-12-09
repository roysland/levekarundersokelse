<template>
<div style="max-width: 100%; overflow-x: scroll;">
  <table class="table">
    <caption>{{measurement}}</caption>
    <thead>
      <tr>
        <th>Område</th>
        <th v-for="year in dyears" :key="year">{{year}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(set, index) in dseries" :key="index">
        <td>{{set.name}}</td>
        <td v-for="(value, idx) in set.data" :key="idx">{{value}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>
<script>
export default {
  props: {
    years: {
      type: Array,
      default: function () { return [] }
    },
    series: {
      type: Array,
      default: function () { return [] }
    },
    measurement: {
      type: String,
      default: '% av befolkningen'
    }
  },
  data () {
    return {
      dyears: this.years,
      dseries: this.series
    }
  },
  watch: {
    years () {
      this.dyears = this.years
    },
    series () {
      this.dseries = this.series
    }
  }
}
</script>
