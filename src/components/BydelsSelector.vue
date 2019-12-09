<template>
  <div class="row" style="align-items: center;">
    <div class="col level-item">
      <select v-model="bydel" class="form-control form-control-sm" @change="setBydel">
        <option v-for="(bydel, index) in $store.state.bydeler" :value="index" :key="index">{{bydel.name}}</option>
      </select>
    </div>
    <div class="col level-item">
      <select v-model="area" class="form-control form-control-sm" v-if="selectedBydel">
        <option :value="null">Alle soner</option>
        <option v-for="(area, idx) in selectedBydel.zones" :key="idx" :value="area.id + ' ' + area.name">
          {{area.name}}
        </option>
      </select>
    </div>
    <div class="col-4 level-item">
      <button class="btn btn-tiny btn-primary" style="margin-bottom: 0;" @click="addCompare">Sammenligne</button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      bydel: null,
      area: null,
      selectedBydel: null
    }
  },
  methods: {
    setBydel () {
      this.selectedBydel = this.$store.state.bydeler[this.bydel]
    },
    addCompare () {
      this.$emit('input', {
        bydel: this.bydel,
        area: this.area
      })
    }
  }
}
</script>
