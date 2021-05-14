import Vue from 'vue'
import store from '@/assets/js/store';
import router from '@/assets/js/router';
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
