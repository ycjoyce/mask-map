import Vue from 'vue'
import store from '@/assets/js/store';
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
