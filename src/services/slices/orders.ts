import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type OrdersState = {
  profile: {
    items: TOrder[];
    loading: boolean;
    error?: string | null;
  };
  feed: {
    items: TOrder[];
    total: number | null;
    totalToday: number | null;
    loading: boolean;
    error?: string | null;
  };
};

export const initialState: OrdersState = {
  profile: {
    items: [],
    loading: false,
    error: null
  },
  feed: {
    items: [],
    total: null,
    totalToday: null,
    loading: false,
    error: null
  }
};

export const fetchProfileOrders = createAsyncThunk(
  'orders/profile/fetch',
  async () => getOrdersApi()
);

export const fetchFeedOrders = createAsyncThunk('orders/feed/fetch', async () =>
  getFeedsApi()
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    getOrdersSelector: (state) => state,
    getFeedOrdersSelector: (state) => state.feed,
    getProfileOrdersSelector: (state) => state.profile
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedOrders.pending, (state) => {
        state.feed.loading = true;
        state.feed.error = null;
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.feed.loading = false;
        state.feed.error = action.error.message;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.feed.loading = false;
        state.feed.items = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.profile.loading = true;
        state.profile.error = null;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.profile.loading = false;
        state.profile.error = action.error.message;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.items = action.payload;
      });
  }
});

export default ordersSlice.reducer;
export const {
  getOrdersSelector,
  getFeedOrdersSelector,
  getProfileOrdersSelector
} = ordersSlice.selectors;
