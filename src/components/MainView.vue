<template>
  <div class="leftContainer">
      <div id="cityNameBox">
          <div class="cityName">
              <p>{{ cityName }}</p>
              <p>{{ currentTime }}</p>
          </div>
      </div>
      <div id="contentsBox">
          <div class="buttonBox">
              <div class="buttonBackground">
                  <button class="forecast">Forecast</button>
                  <button class="airquality">Nowcast</button>
              </div>
          </div>
          <div class="weatherBox">
              <div class="weatherDegree">
                  <p>{{ Math.round(currentTemp) }}&deg;</p>
              </div>
              <div class="weatherIcon">
                  <img :src="images[0]" alt="MainLogo" />
              </div>
              <div class="weatherData">
                  <div v-for="temporary in temporaryData" :key="temporary.title" class="detailData">
                      <p>{{ temporary.title }}</p>
                      <p>{{ temporary.value }}</p>
                  </div>
              </div>
          </div>
      </div>
      <div id="todayWeather">
          <div class="textBox">
              <p>시간대별 날씨 정보</p>
              <p>이번주 날씨 보기</p>
          </div>
          <div class="timelyWeatherBox">
              <div class="timelyWeather" v-for="(temp, index) in filteredTempData" :key="index">
                  <div class="icon">
                    <img :src="images[index]" alt="hour" />
                  </div>
                  <div class="data">
                      <p class="time">
                        {{ temp.fcstTime.slice(0, 2) }}시
                      </p>
                      <p class="currentDegree">{{ temp.fcstValue }}&deg;</p>
                      <div>
                          <img src="src/assets/images/drop.png" alt="빗방울" />
                          <p class="fall">{{ getPopValue(temp.fcstTime) }}%</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <nav>
          <i class="fas fa-home"></i>
          <i class="fas fa-search-location"></i>
          <i class="fas fa-chart-line"></i>
          <i class="fas fa-cog"></i>
      </nav>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
  return {
  }
},
  computed: {
    ...mapState('weatherApi', [
      'arrayTemps',
      'currentTime',
      'currentTemp',
      'cityNamex',
      'cityNamey',
      'temporaryData',
      'cityName'
    ]),
    ...mapGetters('weatherApi', [
      'filteredTempData',
      'filteredPopData',
      'filteredSkyData',
    ]),

    images() {
      return this.$store.state.weatherApi.images;
    },
  },
  methods: {
    getPopValue(fcstTime) {
      const popData = this.filteredPopData.find(data => data.fcstTime === fcstTime)
      return popData ? popData.fcstValue : '-'
    },
    checkImages() {
      console.log(this.images); // images 배열 내용 출력
    },
  },
  created() {
    this.$store.dispatch('weatherApi/FETCH_WEATHER_API')
  }
}
</script>

<style lang="scss" scoped>
@import "~/scss/main.scss";
@import '~/scss/mainview.scss';
</style>