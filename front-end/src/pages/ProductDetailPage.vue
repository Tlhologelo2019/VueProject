<template>
  <div v-if="product">
    <div class="img-wrap">
      <img :src="product.imageUrl" />
    </div>
    <div class="product-details">
      <h1>{{ product.name }}</h1>
      <h3 class="price">{{ product.price }}</h3>
      <button 
        v-if="isLoggedIn"
        @click="addToCart" 
        class="add-to-cart"
        :disabled="isInCart"
        :class="{'grey-button': isInCart}">
        {{ isInCart ? 'Item already added' : 'Add to cart' }}
      </button>
      <button 
        v-else
        class="sign-in" 
        @click="SignIn">
        Sign in to add to cart
      </button>
    </div>
  </div>
  <div v-if="!product">
    <NotFoundPage />
  </div>
</template>

<script>
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import axios from 'axios';
import NotFoundPage from './NotFoundPage.vue';

export default {
  name: "ProductDetailPage",
  props: ['user'],
  data() {
    return {
      product: {},
      cart: [],
      isLoggedIn: false,
    }
  },
  computed: {
    isInCart() {
      return this.cart.some(item => item.id === this.$route.params.productId);
    }
  },
  watch: {
    async user(newUserValue) {
      if (newUserValue) {
        this.isLoggedIn = true;
        const cartResponse = await axios.get('/api/users/${newUserValue.uid}/cart');
        this.cart = cartResponse.data;
      } else {
        this.isLoggedIn = false;
        this.cart = [];
      }
    }
  },
  methods: {
    async addToCart() {
      if (!this.isInCart) {
      await axios.post(`/api/users/${this.user.uid}/cart`, { id: this.$route.params.productId});
      this.cart.push({ id: this.$route.params. productId });
      alert('Successfully added item to cart');
    }
  },
  async SignIn() {
    const email = prompt('Please enter your email to sign in:');
    if (email) {
    const auth = getAuth();
    const actionCodeSettings = {
      url: `http://localhost:8080/products/${this.$route.params.productId}`,
      handleCodeInApp: true,
    }
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    alert('Login link was sent to the email you provided');
    window.localStorage.setItem('emailForSignIn', email);
  }
  }
  },
  components: {
    NotFoundPage
  },
  async created() {
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email) {
      await signInWithEmailLink(auth, email, window.location.href);
      alert('Successfully signed in!');
      window.localStorage.removeItem('emailForSignIn');
      this.isLoggedIn = true;
    }
  }

    const response = await axios.get(`/api/products/${this.$route.params.productId}`);
    const product = response.data;
    this.product = product;

    if (this.user) {
      const cartResponse = await axios.get('/api/users/${this.user.uid}/cart');
      this.cart = cartResponse.data;
      this.isLoggedIn = true;
    }
  }
}
</script>