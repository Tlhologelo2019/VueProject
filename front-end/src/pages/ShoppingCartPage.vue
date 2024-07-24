<template>
  <h1> My Cart</h1>
  <div v-if="cartItems.length > 0">
    <ShoppingCartList @remove-from-cart="removeFromCart($event)" :products="cartItems"/>
    <button class="checkout-button">Proceed to Checkout</button>
  </div>
  <div v-if="cartItems.length === 0">
    Currently you have no items in your cart
  </div>

</template>

<script>
import axios from 'axios';
import ShoppingCartList from '../components/ShoppingCartList.vue';

export default {
  name: "ShoppingCartPage",
  props: ['user'],
  components: {
    ShoppingCartList,
  },
  data() {
    return {
      cartItems: [],
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
    async removeFromCart(producId) {
      const response = await axios.delete(`/api/users/${this.user.uid}/cart/${producId}`);
      const updatedCart = response.data;
      this.cartItems = updatedCart;
    }
  },
  async created() {
    if (this.user) {
      const response = await axios.get(`/api/users/${this.user.uid}/cart`);
      const cartItems = response.data;
      this.cartItems = cartItems
    }
  }
}
</script>