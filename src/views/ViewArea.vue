<template>
  <div v-if="ready" class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Stavanger</router-link></li>
        <li class="breadcrumb-item"><router-link :to="'/' + $route.params.bydel">{{$route.params.bydel}}</router-link></li>
        <li class="breadcrumb-item">{{$route.params.area}}</li>
      </ol>
    </nav>
    <div class="row">
      <router-link class="area-link" v-for="zone in zones" :key="zone.id" :to="`/${$route.params.bydel}/${zone.id} ${zone.name}`">{{zone.name}}</router-link>
    </div>
    <div class="row">
      <div class="col">
        <h1>{{bydel.name}} - {{areaName}}</h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-md-6">
        <area-svg :area="area"></area-svg>
      </div>
      <div class="col-xs-12 col-md-6">
        <higcharts :options="chartOptions"></higcharts>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import AreaSvg from "@/components/AreaSvg";
import ReportSelector from "@/components/ReportSelector";
import Axios from "axios";
import { Chart } from "highcharts-vue";
export default {
  components: { AreaSvg, ReportSelector, higcharts: Chart },
  data() {
    return {
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

        subtitle: {
          text: "Source: thesolarfoundation.com"
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
  methods: {
    getData() {
      Axios.get(this.$store.state.sources[5].url).then(response => {
        this.data = response.data;
        this.years = this.mapYearsFromData(this.data);
        this.chartOptions.title.text = this.data[0].Indikator || this.data[0].Indiaktor
        this.chartOptions.yAxis.title.text = this.data[0].parameter
        this.filterData();
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
        name: "Set",
        data: data
      });

      this.chartOptions.xAxis.categories = [...new Set(categories)]
      this.ready = true;
    },
    averageOthers (data) {
      let dataset = data.filter((item) => {
        return row.Navn !== this.area
      })
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
