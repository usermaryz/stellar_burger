import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

type IngredientState = {
  items: TIngredient[];
  loading: boolean;
  error?: string | null;
};

export const initialState: IngredientState = {
  items: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk('ingredients/get', async () =>
  getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  }
});

export default ingredientsSlice.reducer;
export const { getIngredientsSelector } = ingredientsSlice.selectors;
