import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice.js";
import authReducer from "../features/auth/authSlice.js";
import orderReducer from "../features/order/orderSlice.js";
import searchReducer from "../features/search/searchSlice.js"

export default configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    search: searchReducer
  },
});