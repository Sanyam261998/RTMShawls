import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to place an order through the proxy server
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ user, placedBy, items, note, totalOriginal, totalDiscounted }, thunkAPI) => {
    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          placedBy,
          items,
          note,
          totalOriginal,
          totalDiscounted,
          date: new Date().toISOString(), // send consistent timestamp
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Order failed");
      }

      return {
        user,
        placedBy,
        items,
        note,
        totalOriginal,
        totalDiscounted,
        date: new Date().toISOString(),
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: JSON.parse(localStorage.getItem("orders")) || [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      localStorage.removeItem("orders");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders.push(action.payload);
        localStorage.setItem("orders", JSON.stringify(state.orders));
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
