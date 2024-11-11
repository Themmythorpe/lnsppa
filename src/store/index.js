import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules;
}, {});

// New cart module to manage cart count
const cart = {
  state: {
    cartCount: 0,
  },
  mutations: {
    setCartCount(state, count) {
      state.cartCount = count;
    },
  },
  actions: {
    updateCartCount({ commit }, count) {
      commit('setCartCount', count);
    },
  },
};

const store = new Vuex.Store({
  modules: {
    ...modules, // Include existing modules
    cart, // Include new cart module
  },
  getters,
});

export default store;




// import Vue from 'vue'
// import Vuex from 'vuex'
// import getters from './getters'

// Vue.use(Vuex)

// // https://webpack.js.org/guides/dependency-management/#requirecontext
// const modulesFiles = require.context('./modules', true, /\.js$/)

// // you do not need `import app from './modules/app'`
// // it will auto require all vuex module from modules file
// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   // set './app.js' => 'app'
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})

// const store = new Vuex.Store({
//   modules,
//   getters
// })

// export default store
