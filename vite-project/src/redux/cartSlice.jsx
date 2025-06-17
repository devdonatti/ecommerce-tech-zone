import { createSlice } from "@reduxjs/toolkit";

// Lee el carrito desde localStorage al inicializar el estado
const initialState = JSON.parse(localStorage.getItem("cart")) || [];

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      // Si el producto ya está en el carrito, solo actualiza la cantidad
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity; // Se puede pasar la cantidad directamente
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
        item.quantity++; // Aumentamos la cantidad
      }
    },
    decrementQuantity(state, action) {
      const item = state.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity--; // Disminuimos la cantidad solo si es mayor que 1
      }
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.find((item) => item.id === id);
      if (item && !isNaN(quantity) && quantity > 0) {
        item.quantity = quantity; // Establecemos la nueva cantidad
      }
    },
  },
});

// Exporta las acciones
export const {
  addToCart,
  deleteFromCart,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
} = cartSlice.actions;

// Reducer exportado para usar en el store
export default cartSlice.reducer;
