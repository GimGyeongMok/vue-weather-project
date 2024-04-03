<template>
    <div class="rightContainer">
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
              <div class="airCondition">
                  <p>{{ feeling }}</p>
              </div>
              <div class="detail">
                  <div class="title">
                      <p>현재 날씨 데이터</p>
                  </div>
                  <div class="data" v-for="(detailData, index) in subWeatherData" :key="index">
                      <div class="dataName">
                          <p></p>
                          <p>{{ detailData.name }}</p>
                      </div>
                      <div class="dataValue">
                          <p>{{ detailData.value }}<span></span></p>
                      </div>
                  </div>
              </div>
            </div>
        </div>
        <Map />
        <nav>
            <i class="fas fa-home"></i>
            <i class="fas fa-search-location"></i>
            <i class="fas fa-chart-line"></i>
            <i class="fas fa-cog"></i>
        </nav>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from "vue";
  import dayjs from "dayjs";
  import "dayjs/locale/ko";
  import Map from "~/components/Map.vue";
  import axios from "axios";
  dayjs.locale("ko");
  import { useStore } from 'vuex';

  
  export default {
      components: {
          Map,
      },
      // Vue3 composition api 사용
      setup() {
        const store = useStore(); // store 가져오기
        const xCoordinate = computed(() => store.state.weatherApi.position.lat); // xCoordinate 값 가져오기
        const yCoordinate = computed(() => store.state.weatherApi.position.lon); // yCoordinate 값 가져오기
        const cityName = computed(() => store.state.weatherApi.cityName); // 시티 네임 가져오기
        // const weatherApiKey = process.env.VUE_APP_WEATHER_KEY;

          // 화면에 보여질 데이터
          let currentTime = dayjs().format("YYYY. MM. DD. ddd"); //현재시간
          // let cityName = ref(""); //도시이름
          let feeling = ref(""); // 현재 온도 체감
          let currentTime2 = dayjs().format("YYYYMMDD");
          let currentHour = dayjs().subtract(1, 'hour').format("HH"); // 현재 시간에서 1시간 빼기
        //   let currentHour2 = dayjs().format("HH"); 
          let subWeatherData = ref([]);
  
          // 베이스 타임을 설정합니다.
      if (currentHour >= "02" && currentHour < "05") {
          currentHour = "0200";
      } else if (currentHour >= "05" && currentHour < "08") {
          currentHour = "0500";} 
      else if (currentHour >= "08" && currentHour < "11") {
          currentHour = "0800";} 
      else if (currentHour >= "11" && currentHour < "14") {
          currentHour = "1100";}
      else if (currentHour >= "14" && currentHour < "17") {
          currentHour = "1400";}
      else if (currentHour >= "17" && currentHour < "20") {
          currentHour = "1700";}
      else if (currentHour >= "20" && currentHour < "23") {
          currentHour = "2000";}
      else {
          currentHour = "2300";}
          
  
          const fetchWeatherapi = async () => {
            //   const API_KEY = "z88i8CQvOc4cPOxb9AgiuMBMa88IGOoLuQxKOGepBct5wWxBT4qGTUQVjJjxIB8%2Bk4WL51ZOr0hb5vwQxHACXA%3D%3D"

                // LCC DFS 좌표변환을 위한 기초 자료
    //
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)
    //
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
    //


    function dfs_xy_conv(code, v1, v2) {
        var DEGRAD = Math.PI / 180.0;
        var RADDEG = 180.0 / Math.PI;

        var re = RE / GRID;
        var slat1 = SLAT1 * DEGRAD;
        var slat2 = SLAT2 * DEGRAD;
        var olon = OLON * DEGRAD;
        var olat = OLAT * DEGRAD;

        var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
        var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
        var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
        ro = re * sf / Math.pow(ro, sn);
        var rs = {};
        if (code == "toXY") {
            rs['lat'] = v1;
            rs['lng'] = v2;
            var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
            ra = re * sf / Math.pow(ra, sn);
            var theta = v2 * DEGRAD - olon;
            if (theta > Math.PI) theta -= 2.0 * Math.PI;
            if (theta < -Math.PI) theta += 2.0 * Math.PI;
            theta *= sn;
            rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
            rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
        }
        else {
            rs['x'] = v1;
            rs['y'] = v2;
            var xn = v1 - XO;
            var yn = ro - v2 + YO;
            ra = Math.sqrt(xn * xn + yn * yn);
            if (sn < 0.0) - ra;
            var alat = Math.pow((re * sf / ra), (1.0 / sn));
            alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

            if (Math.abs(xn) <= 0.0) {
                theta = 0.0;
            }
            else {
                if (Math.abs(yn) <= 0.0) {
                    theta = Math.PI * 0.5;
                    if (xn < 0.0) - theta;
                }
                else theta = Math.atan2(xn, yn);
            }
            var alon = theta / sn + olon;
            rs['lat'] = alat * RADDEG;
            rs['lng'] = alon * RADDEG;
        }
        return rs;
    }

    const nx = xCoordinate.value
    const ny = yCoordinate.value
    var rs = dfs_xy_conv("toXY",nx,ny);
    const x = rs.x
    const y = rs.y
              
  
              try {
                  const res = await axios.get(
                      `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${process.env.VUE_APP_WEATHER_KEY}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${currentTime2}&base_time=${currentHour}&nx=${x}&ny=${y}`
                  );
                //   console.log(x);
                //   console.log(y);
                  console.log(res)
                //   console.log(import.meta.env.VITE_SOME_KEY);
                  let initialCurrentWeatherData = res.data.response.body.items;
                  let T1H = initialCurrentWeatherData.item.find(temp => temp.category === 'T1H').obsrValue // 기온 데이터
                  let RN1 = initialCurrentWeatherData.item.find(temp => temp.category === 'RN1').obsrValue
                  // let REH = initialCurrentWeatherData.item.find(temp => temp.category === 'REH').obsrValue
                  // let PTY = initialCurrentWeatherData.item.find(temp => temp.category === 'PTY').obsrValue
                  let WSD = initialCurrentWeatherData.item.find(temp => temp.category === 'WSD').obsrValue
  
                  const tempPoints = [0, 10, 15, 20, 25, 30];
                  const lavels =["매우 추움", "추움", "쌀쌀함", "선선함", "보통", "더움", "매우 더움"];
  
                  let index = 0; // 인덱스를 0으로 세팅
                  for (const point of tempPoints) { // for-of문법을 활용해서 반복된 요소 하나하나의 이름을 point라고 지정
                      if (T1H <= point) break; // 만약 현재 온도 데이터 값이 우리가 지정해준 point값보다 작으면 break를 걸고
                      index++; // index값을 증가
                  }
                  // 그 온도에 대한 알맞은 lavel값을 feeling이라는 데이터에 할당시켜준다
                  feeling.value = lavels[index] // feeling역시 ref라는 메서드를 참조해서 만든 데이터이기 때문에 value로 접근, 데이터 할당 후 lavel의 index값을 넣어준다
  
                  let isProcessesdData =[
                      { name: "기온", value: parseFloat(T1H).toFixed(1) + " °C" },
                      { name: "1시간 강수량", value: parseFloat(RN1).toFixed(1) + " mm" },
                      { name: "풍속", value: parseFloat(WSD).toFixed(1) + " m/s" }
                  ];
  
                  subWeatherData.value = isProcessesdData;
             
              } catch (error){console.log(error)}
          };

        //   watchEffect(async () => {
        //     await fetchWeatherapi();
        //   });
        fetchWeatherapi();
  
        //   fetchWeatherapi()
           // xCoordinate와 yCoordinate를 감시하여 값이 변경될 때마다 fetchWeatherapi를 호출
      watch([xCoordinate, yCoordinate], () => {
          fetchWeatherapi();
      });
  
          return {
              currentTime,
              subWeatherData,
              feeling,
              cityName,
          
          };
      },
  };
  </script>
  
  <style lang="scss" scoped>
  @import '~/scss/main.scss';
  @import '~/scss/subview.scss';
  </style>