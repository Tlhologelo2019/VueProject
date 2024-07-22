<template>
  <div v-if="product">
    <div class="img-wrap">
      <img :src="product.imageUrl" />
    </div>
    <div class="product-details">
      <h1>{{ product.name }}</h1>
      <h3 class="price">{{ product.price }}</h3>
      <button 
        @click="addToCart" 
        class="add-to-cart"
        :disabled="isInCart"
        :class="{'grey-button': isInCart}">
        {{ isInCart ? 'Item already added' : 'Add to cart' }}
      </button>
      <button 
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
    }
  },
  computed: {
    isInCart() {
      return this.cart.some(item => item.id === this.$route.params.productId);
    }
  },
  methods: {
    async addToCart() {
      if (!this.isInCart) {
      await axios.post('/api/users/12345/cart', { id: this.$route.params.productId});
      this.cart.push({ id: this.$route.params. productId });
      alert('Successfully added item to cart');
    }
  },
  async SignIn() {
    const email = prompt('Please enter your email to sign in:');
    const auth = getAuth();
    const actionCodeSettings = {
      url: `http://localhost:8080/products/${this.$route.params.productId}`,
      handleCodeInApp: true,
    }
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    alert('Login link was sent to the email you provided');
    window.localStorage.setItem('emailForSignIn', email);
  }
  },
  components: {
    NotFoundPage
  },
  async created() {
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      await signInWithEmailLink(auth, email, window.location.href);
      alert('Successfully signed in!');
      window.localStorage.removeItem('emailForSignIn');
    }

    const response = await axios.get(`/api/products/${this.$route.params.productId}`);
    const product = response.data;
    this.product = product;

    const cartResponse = await axios.get('/api/users/12345/cart');
    this.cart = cartResponse.data;
  }
}
</script>