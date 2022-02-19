import Vue from 'vue'
import Vuex from 'vuex'
import state from "./state"

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations: {
        addEmail(state, options) {
            state.email = options.email
            sessionStorage.setItem("email", options.email)

        },
        getPersonalData(state, options) {

            state.personalData = options

            console.log("state.personalData ===>", state.personalData);
        }
    },
    actions: {},
    modules: {}
})