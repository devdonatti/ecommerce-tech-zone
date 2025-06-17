// Store.jsx
import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./cartSlice"; // No es necesario especificar `.jsx`

// Configuración del store con el reducer
export const store = configureStore({
  reducer: {
    cart: cartReducer, // Usamos el reducer aquí
  },
});
