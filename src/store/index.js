// Vuex설치 : npm install vuex@next
import { createStore } from "vuex";
import weatherApi from "./weatherApi";

export default createStore({
    modules: {
        weatherApi,
    },
});