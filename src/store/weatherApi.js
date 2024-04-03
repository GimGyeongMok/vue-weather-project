import axios from 'axios'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')


export default {
  namespaced: true,
  
  state: {
    position: {
      // default값으로 서울 좌표
      lat: 37.5683,
      lon: 126.9778,
    },
    cityName: '서울',
    weatherApiKey: process.env.VUE_APP_WEATHER_KEY,
    currentWeather: {
      currentTemp: 0,
      currentHumidity: 0,
      currentWindSpeed: 0,
      CurrentFeelsLike: 0,
      currentSunrise: 0,
      currentSunset: 0,
      CurrentVisibility: 0
    },
    hourlyWeather: [],
    images: [],
    arrayTemps: [],
    currentTime: dayjs().format("YYYY. MM .DD. ddd"),
    currentTime2: dayjs().format('YYYYMMDD'),
    temporaryData: [
        {
          title: '습도',
          value: '',
        },
        {
          title: '풍속',
          value: '',
        },
        {
          title: '강수확률',
          value: '',
        },
      ],
  },
  // getters: 계산된 상태의 데이터를 만들어내는 속성이다. 
  // computed와 비슷한 기능을 한다.
  getters: {
    filteredTempData(state) {
      return state.arrayTemps.filter(temp => temp.category === 'TMP')
    },
    filteredPopData(state) {
      return state.arrayTemps.filter(temp => temp.category === 'POP')
    },
    filteredSkyData(state) {
      return state.arrayTemps.filter(temp => temp.category === 'SKY')
    }
  },
  // mutations, actions: methods와 유사한 기능을 가지고 있다. 
  // 1. mutations: 변이 메서드, 우리가 관리하는 데이터(state)를 변경시켜줄 수 있다. 
  // 즉, state 안의 데이터는 오로지 mutations만이 데이터를 변경시킬 수 있다.
  mutations: {
    // 좌표에 대한 뮤테이션
    SET_LATLON(state, payload){
      state.position.lat = payload.Ma;
      state.position.lon = payload.La;
    },
    SET_CITYNAME(state, payload) {
      state.cityName = payload;
    },
    SET_WEATHER_DATA(state, data) { // API로 받아온 날씨 데이터를 state에 저장
      state.arrayTemps = data.item
      state.currentTemp = data.item[0].fcstValue
      state.cityNamex = data.item[0].nx
      state.cityNamey = data.item[0].ny
      state.currentWeather.currentHumidity = data.item[10].fcstValue
      state.currentWeather.currentWindSpeed = data.item[4].fcstValue
      state.currentWeather.CurrentFeelsLike = data.item[7].fcstValue
      state.temporaryData[0].value = data.item[10].fcstValue + "%"; // 습도
      state.temporaryData[1].value = data.item[4].fcstValue + "m/s"; // 풍속
      state.temporaryData[2].value = data.item[7].fcstValue + "%"; // 강수확률
    },
    SET_IMAGEPATH(state, images) { // 날씨 아이콘 이미지 경로 배열을 state에 저장
      state.images = images;
    },
    SET_XY_COORDINATES(state, { x, y }) { // 새로운 뮤테이션 추가
      state.xCoordinate = x;
      state.yCoordinate = y;
    },
  },
  // 2. actions: 특정한 데이터를 직접적으로 수정하는 것이 허용되지 않는다. 
  // 위 사항이 가장 주의해야 할 사항, 또한 비동기적으로 동작한다 
  actions: {
    // actions 부분에선 mutations처럼 state를 바로 불러올 순 없고, 
    // context라는 객체데이터를 호촐하여 context를 참조하여 데이터를 불러온다. 
    // context 안에는 state, getters, mutation을 활용할 수 있는 내용이 들어있다. 
    // mutations를 호출하기 위해서 context.mutations가 아니라, context.commit('뮤테이션 이름', payload) 형식으로 호출해야 한다
    async FETCH_WEATHER_API({ commit, state }) {
      // const API_KEY = "z88i8CQvOc4cPOxb9AgiuMBMa88IGOoLuQxKOGepBct5wWxBT4qGTUQVjJjxIB8%2Bk4WL51ZOr0hb5vwQxHACXA%3D%3D"
      let currentHour = dayjs().format('HH')
      if (currentHour >= '02' && currentHour < '05') {
        currentHour = '0200'
      } else if (currentHour >= '05' && currentHour < '08') {
        currentHour = '0500'
      } else if (currentHour >= '08' && currentHour < '11') {
        currentHour = '0800'
      } else if (currentHour >= '11' && currentHour < '14') {
        currentHour = '1100'
      } else if (currentHour >= '14' && currentHour < '17') {
        currentHour = '1400'
      } else if (currentHour >= '17' && currentHour < '20') {
        currentHour = '1700'
      } else if (currentHour >= '20' && currentHour < '23') {
        currentHour = '2000'
      } else {
        currentHour = '2300'
      }

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

    const nx = state.position.lat
    const ny = state.position.lon
    var rs = dfs_xy_conv("toXY",nx,ny);
    const x = rs.x
    const y = rs.y
      

      try {
        const res = await axios.get(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${process.env.VUE_APP_WEATHER_KEY}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${state.currentTime2}&base_time=${currentHour}&nx=${x}&ny=${y}`)
        commit('SET_WEATHER_DATA', res.data.response.body.items)
        commit('SET_XY_COORDINATES', { x, y }); 
        // console.log(import.meta.env.VITE_SOME_KEY);

        console.log(res.data.response.body.items)
        // console.log(x)
        const images = state.arrayTemps.filter(temp => temp.category === 'SKY').reduce((acc, cur) => { // 함수를 사용하여 하늘 상태 데이터만 추출
          // reduce 함수를 사용하여 추출된 데이터를 순회하며 이미지 경로 배열을 생성
          const weatherIconValue = parseInt(cur.fcstValue); // 문자열을 정수형으로 변환
          // console.log(typeof weatherIconValue)
          const iconPath = (() => {
            switch (weatherIconValue) {
              case 1:
                return 'src/assets/images/sunny.png';
              case 2:
                return 'src/assets/images/02d.png';
              case 3:
                return 'src/assets/images/03d.png';
              case 4:
                return 'src/assets/images/04d.png';
              default:
                return 'src/assets/images/sunny.png';
            }
          })();
          acc.push(iconPath);
          return acc;
        }, []);
        // console.log(images)
        // console.log(this.weatherApiKey)
        
        commit('SET_IMAGEPATH', images);
      } catch (error) {
        console.log(error)
      }
    }
  }
}