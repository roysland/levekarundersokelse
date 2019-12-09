<template>
  <div v-if="ready" class="container">
    <nav aria-label="breadcrumb">
      <div class="breadcrumbs">
        <div class="breadcrumbs-item"><router-link to="/">Stavanger</router-link></div>
        <div class="breadcrumbs-item"><router-link :to="'/' + $route.params.bydel">{{$route.params.bydel}}</router-link></div>
        <div class="breadcrumbs-item">{{$route.params.area}}</div>
      </div>
    </nav>
<!--     <div class="row">
      <router-link class="area-link" v-for="zone in zones" :key="zone.id" :to="`/${$route.params.bydel}/${zone.id} ${zone.name}`">{{zone.name}}</router-link>
    </div> -->
    <div class="row">
      <div class="col">
        <h5 class="font-alt font-light uppercase">{{bydel.name}} - {{areaName}}</h5>
      </div>
    </div>
    <report-selector @dataLoaded="loadDataset($event)"></report-selector>
    <div class="tab-container tabs-classic tabs-fill tabs-center">
      <ul>
          <li :class="{'selected': activeTab === 'table'}"><a @click="activeTab = 'table'">Tabell</a></li>
          <li :class="{'selected': activeTab === 'chart'}"><a @click="activeTab = 'chart'">Diagram</a></li>
      </ul>
    </div>
    <bydels-selector v-model="compareData"></bydels-selector>
    <higcharts v-show="activeTab === 'chart'" :options="chartOptions" :key="selectedDataSet.url"></higcharts>
    <table-view v-show="activeTab === 'table'" :years="years" :series="chartOptions.series"></table-view>
  </div>
</template>
<script>
/* eslint-disable */
import AreaSvg from "@/components/AreaSvg";
import ReportSelector from "@/components/ReportSelector"
import BydelsSelector from '@/components/BydelsSelector'
import TableView from '@/components/TableView'
import Axios from "axios";
import { Chart } from "highcharts-vue";
export default {
  components: { AreaSvg, ReportSelector, higcharts: Chart, BydelsSelector, TableView },
  data() {
    return {
      activeTab: 'chart',
      compareData: null,
      selectedDataSet: this.$store.state.sources[0],
      averageData: null,
      zones: this.$store.getters.getZonesInBydel(this.$route.params.bydel),
      msg: "",
      area: this.$route.params.area,
      areaName: this.$route.params.area.replace(/^[\s\d]+/g, ''),
      data: null,
      years: [],
      filtered: null,
      ready: false,
      localData: null,
      areaId: parseInt(this.$route.params.area.match(/^(\d+)/g)[0]),
      bydel: this.$store.getters.getBydelFromZone(parseInt(this.$route.params.area.match(/^(\d+)/g)[0])),
      chartOptions: {
        title: {
          text: "Utflyttinger"
        },

        yAxis: {
          title: {
            text: "% av befolkningen"
          }
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle"
        },

        series: [],
        xAxis: {
          categories: []
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom"
                }
              }
            }
          ]
        }
      }
    };
  },
  watch: {
    selectedDataSet () {
      console.log('changed Dataset')
    },
    compareData () {
      if (this.compareData.bydel) {
        this.addCompareData()
      } else {
        return
      }
    }
  },
  methods: {
    addCompareData () {
      // If no area is set, calculate whole bydel
      if (!this.compareData.area) {
        let soner = this.$store.state.bydeler[this.compareData.bydel].areas
        let data = this.data.filter((rows) => {
          return soner.includes(rows.Ident)
        })
        let averages = this.averageAll(data)
        this.addSeries(this.$store.state.bydeler[this.compareData.bydel].name, averages)
      } else {
        let id = this.compareData.area.match(/^(\d+)/g)[0]
        let data = this.data.filter((rows) => {
          return rows['Ident'] === parseInt(id)
        })
        let output = []
        data.forEach((item) => {
          output.push(parseFloat(item.Variabel))
        })
        this.addSeries(this.compareData.area, output)
      }
    },
    addSeries (name, data) {
      this.chartOptions.series.push({
        name: name,
        data: data
      })
    },
    loadDataset (ev) {
      this.selectedDataSet = ev
      this.getData()
      this.chartOptions.title.text = this.selectedDataSet.name
    },
    getData () {
      console.log('Fetching resource')
      Axios.get(this.selectedDataSet.url).then(response => {
        console.log('Resource fetched')
        this.chartOptions.series = []
        this.data = response.data;
        this.years = this.mapYearsFromData(this.data);
        this.chartOptions.title.text = this.data[0].Indikator || this.data[0].Indiaktor
        this.chartOptions.yAxis.title.text = this.data[0].parameter
        this.filterData();
        let avgData = this.averageAll(this.data)
        this.chartOptions.series.push({
          name: 'Hele Stavanger', 
          data: avgData
      })

      });
    },
    filterData() {
      let area = this.data.filter(row => {
        return row.Ident === parseInt(this.area.match(/^(\d+)/g)[0])
      });
      this.localData = area;
      let data = [];
      let categories = []
      area.forEach(a => {
        data.push(parseFloat(a.Variabel));
        categories.push(a['År'])
      });
      this.chartOptions.series.push({
        name: this.$route.params.area,
        data: data
      });

      this.chartOptions.xAxis.categories = [...new Set(categories)]
      this.ready = true;
    },
    averageAll (data) {
      const years = this.years
      let summed = []
      // Average function
      const average = list => list.reduce((prev, cur) => prev + cur) / list.length
      years.forEach((year) => {
        let array = []
        let d = data.forEach((row) => {
          if (row['År'] === year) {
            array.push(parseFloat(row['Variabel']))
          }
        })
        summed.push(array)
      })
      let reduced = []
      summed.forEach((sum) => {
        reduced.push(Math.round(average(sum)))
      })
      return reduced
    },
    mapYearsFromData(data) {
      const years = data.map(d => {
        return d["År"];
      });
      return [...new Set(years)];
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
