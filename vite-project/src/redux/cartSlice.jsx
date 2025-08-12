import { createSlice } from "@reduxjs/toolkit";

// Lee el carrito desde localStorage al inicializar el estado
const initialState = JSON.parse(localStorage.getItem("cart")) || [];

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += Number(action.payload.quantity || 1);
      } else {
        state.push(action.payload);
      }
    },

    deleteFromCart(state, action) {
      return state.filter((item) => item.id !== action.payload.id);
    },
    incrementQuantity(state, action) {
      const item = state.find((item) => item.id === action.payload);
      if (item) {
        item.quantity++;
      }
    },
    decrementQuantity(state, action) {
      const item = state.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.find((item) => item.id === id);
      if (item && !isNaN(quantity) && quantity > 0) {
        item.quantity = quantity;
      }
    },
  },
});

export const {
  addToCart,
  deleteFromCart,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
