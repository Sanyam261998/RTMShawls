import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item.ID === product.ID);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.ID !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.ID === id);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
