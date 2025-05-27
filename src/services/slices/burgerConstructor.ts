import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TIngredient, TOrder, TConstructorIngredient } from '@utils-types';
import { v4 as uuid_v4 } from 'uuid';
import { RootState } from '../store';
import { fetchFeedOrders, fetchProfileOrders } from './orders';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderData: TOrder | null;
  orderRequest: boolean;
  orderError?: string | null;
};

export const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderData: null,
  orderRequest: false,
  orderError: null
};

export const submitOrder = createAsyncThunk<TOrder, void, { state: RootState }>(
  'constructor/order',
  async (_, { getState, dispatch }) => {
    const { bun, ingredients } = getState().burgerConstructor;
    const ids: string[] = [];

    if (bun) ids.push(bun._id, bun._id);
    ingredients.forEach((ingredient: TConstructorIngredient) => {
      ids.push(ingredient._id);
    });

    const response = await orderBurgerApi(ids);
    const profileOrdersState = getState().orders.profile;
    const feedOrdersState = getState().orders.feed;
    if (profileOrdersState.items.length && !profileOrdersState.loading) {
      dispatch(fetchProfileOrders());
    }
    if (feedOrdersState.items.length && !feedOrdersState.loading) {
      dispatch(fetchFeedOrders());
    }
    dispatch(clearConstructor());

    return response.order;
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    getBurgerConstructorSelector: (state) => state
  },
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredient: {
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: uuid_v4()
          }
        };
      },
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.ingredients.push(action.payload);
      }
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const [item] = state.ingredients.splice(action.payload.fromIndex, 1);
      state.ingredients.splice(action.payload.toIndex, 0, item);
    },
    removeIngredient(state, action: PayloadAction<number>) {
      state.ingredients.splice(action.payload, 1);
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload;
      });
  }
});

export const {
  setBun,
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
export const { getBurgerConstructorSelector } =
  burgerConstructorSlice.selectors;
