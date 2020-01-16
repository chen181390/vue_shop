import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/global.css';
import './plugins/element';
import axios from 'axios';
import './assets/fonts/iconfont.css';
import TreeTable from 'vue-table-with-tree-grid';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.component('tree-table', TreeTable);
Vue.use(VueQuillEditor);

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = dt.getMonth().toString().padStart(2, '0');
  const d = dt.getDay().toString().padStart(2, '0');
  const hh = dt.getHours().toString().padStart(2, '0');
  const mm = dt.getMinutes().toString().padStart(2, '0');
  const ss = dt.getSeconds().toString().padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
