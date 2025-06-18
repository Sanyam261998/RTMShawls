// features/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // each item will now have { ID, Name, Price, quantity, discountedPrice }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((item) => item.ID === action.payload.ID);
      if (!existing) {
        state.items.push({ ...action.payload, quantity: 1, discountedPrice: action.payload.Price });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.ID !== action.payload);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((item) => item.ID === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    updateDiscount: (state, action) => {
      const item = state.items.find((item) => item.ID === action.payload.id);
      if (item) {
        item.discountedPrice = action.payload.discountedPrice;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateDiscount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
