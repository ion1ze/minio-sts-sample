import Vue from 'vue';
import App from './App.vue';
import UUID from 'vue-uuid';

Vue.config.productionTip = false
Vue.use(UUID);

new Vue({
  render: h => h(App),
}).$mount('#app')
