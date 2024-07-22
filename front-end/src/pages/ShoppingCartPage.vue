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
  components: {
    ShoppingCartList,
  },
  data() {
    return {
      cartItems: [],
    }
  },
  methods: {
    async removeFromCart(producId) {
      const response = await axios.delete(`/api/users/12345/cart/${producId}`);
      const updatedCart = response.data;
      this.cartItems = updatedCart;
    }
  },
  async created() {
    const response = await axios.get('/api/users/12345/cart');
    const cartItems = response.data;
    this.cartItems = cartItems
  }
}
</script>