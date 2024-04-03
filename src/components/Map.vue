<template>
  <div id="mapContainer">
    <div id="map"></div>
  </div>
</template>

<script>
import MapPositions from "~/assets/map-positions.json";


export default {
  data(){
    return {};
  },
  mounted() {

    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement('script');
      // const API_KEY = process.env.VUE_APP_KAKAO_KEY
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_KAKAO_KEY}`;
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const mapContainer = document.getElementById('map'); // 지도를 표시할 div
      const mapOption = {
        center: new kakao.maps.LatLng(37.73035, 127.967487), // 지도의 중심좌표
        level: 13, // 지도의 확대 레벨
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);
      const positions = MapPositions.map((pos) => ({
        latlng: new kakao.maps.LatLng(...pos.latlng),
        cityName: pos.cityName,
      }))
      // 마커를 생성합니다.
      positions.forEach((pos) => {
        const marker = new kakao.maps.Marker({
          position: pos.latlng, // 마커의 위치
        });
        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);

        kakao.maps.event.addListener(marker, "click", () => {
          this.$store.commit('weatherApi/SET_CITYNAME', pos.cityName);
          this.$store.commit('weatherApi/SET_LATLON', marker.getPosition());
          this.$store.dispatch("weatherApi/FETCH_WEATHER_API");
          // console.log(marker.getPosition());
        })
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~/scss/main.scss";

#mapContainer{
    @include center;
    width: 100%;
    height: 35%;
    // background-color: whitesmoke;

    #map{
        width: 80%;
        height: 90%;
        border-radius: 10px;
    }

}

</style>