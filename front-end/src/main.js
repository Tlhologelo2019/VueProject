import { createApp } from 'vue'
import App from './App.vue'
import './main.css'
import * as VueRouter from 'vue-router'
import ShoppingCartPage from './pages/ShoppingCartPage.vue'
import ProductDetailPage from './pages/ProductDetailPage.vue'
import ProductsPage from './pages/ProductsPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDUCwIm3pv7ZqsSucmVzpHKZ9yaskIJAQs",
  authDomain: "vue-project-ce11e.firebaseapp.com",
  projectId: "vue-project-ce11e",
  storageBucket: "vue-project-ce11e.appspot.com",
  messagingSenderId: "699973989074",
  appId: "1:699973989074:web:673019fff3cbffd36f730b"
};

initializeApp(firebaseConfig);

createApp(App)
.use(VueRouter.createRouter({
  history: VueRouter.createWebHistory(process.env.Base_URL),
  routes: [{
    path: '/cart',
    component: ShoppingCartPage,
  }, {
    path: '/products/:productId',
    component: ProductDetailPage
  },{
    path: '/products',
    component: ProductsPage
  },{
    path: '/:pathMatch(.*)*',
    component: NotFoundPage,
  }]
}))
.mount('#app')
