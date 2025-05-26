import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  loginUserApi,
  logoutApi,
  TLoginData,
  getUserApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type UserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  isUserRequest: boolean;
  userRequestError?: string | null;
};

export const initialState: UserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  isUserRequest: false,
  userRequestError: null
};

export const registerUser = createAsyncThunk(
  'user/registration',
  async (registrationData: TRegisterData, { rejectWithValue }) => {
    const data = await registerUserApi(registrationData);
    if (!data.success) {
      return rejectWithValue(data);
    }

    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    const data = await loginUserApi(loginData);
    if (!data.success) {
      return rejectWithValue(data);
    }

    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data.user;
  }
);

export const fetchUser = createAsyncThunk('user/fetch', async (_) =>
  getUserApi()
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>) => updateUserApi(userData)
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();

  localStorage.clear();
  deleteCookie('accessToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUserSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.data = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isUserRequest = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isUserRequest = false;
        state.isAuthenticated = false;
        state.data = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isUserRequest = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUserRequest = false;
        state.userRequestError = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUserRequest = false;
        state.data = action.payload.user;
      })
      .addMatcher(isAnyOf(loginUser.pending, registerUser.pending), (state) => {
        state.isUserRequest = true;
        state.userRequestError = null;
      })
      .addMatcher(
        isAnyOf(loginUser.rejected, registerUser.rejected),
        (state, action) => {
          state.isAuthChecked = true;
          state.isUserRequest = false;
          state.userRequestError = action.error.message;
        }
      )
      .addMatcher(
        isAnyOf(loginUser.fulfilled, registerUser.fulfilled),
        (state, action) => {
          state.isAuthChecked = true;
          state.isAuthenticated = true;
          state.isUserRequest = false;
          state.data = action.payload;
        }
      );
  }
});

export default userSlice.reducer;
export const { getUserSelector } = userSlice.selectors;
