import Vue from 'vue'
import Vuex from 'vuex'
import { login } from '@/api/login'
import { getToken, setToken } from '../utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: getToken()
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const successFlag = response.meta.status === 200
          if (successFlag) {
            const data = response.data
            setToken(data.token)
            commit('SET_TOKEN', data.token)
          }
          resolve(successFlag)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  modules: {
  }
})
