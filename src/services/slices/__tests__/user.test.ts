import { combineReducers, configureStore } from '@reduxjs/toolkit';
import reducer, {
  getUserSelector,
  registerUser,
  loginUser,
  logoutUser,
  fetchUser,
  updateUser,
  initialState
} from '../user';

import { TUser } from '@utils-types';

const user: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('тестирование слайса пользователей', () => {
  const initialLoadedState = {
    isAuthChecked: true,
    isAuthenticated: true,
    data: user,
    isUserRequest: false,
    userRequestError: null
  };

  test('инициализация изначального состояния', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('тестирование синхронных редюсеров', () => {});

  describe('тестирование асинхронных редюсеров', () => {
    describe('получения пользователя по токенам', () => {
      test('инициализация запроса', () => {
        const state = reducer(initialState, { type: fetchUser.pending.type });
        expect(state.isAuthChecked).toBe(false);
      });

      test('завершение запроса', () => {
        const state = reducer(initialState, {
          type: fetchUser.fulfilled.type,
          payload: { user: user }
        });

        expect(state.isAuthChecked).toBe(true);
        expect(state.isAuthenticated).toBe(true);
        expect(state.data).toEqual(user);
      });

      test('ошибка запроса', () => {
        const state = reducer(initialState, { type: fetchUser.rejected.type });

        expect(state.isAuthChecked).toBe(true);
        expect(state.isAuthenticated).toBe(false);
      });
    });

    describe('выход', () => {
      test('инициализация запроса', () => {
        const state = reducer(initialLoadedState, {
          type: logoutUser.pending.type
        });
        expect(state.isUserRequest).toBe(true);
      });

      test('завершение запроса', () => {
        const state = reducer(
          { ...initialLoadedState, isUserRequest: true },
          {
            type: logoutUser.fulfilled.type
          }
        );

        expect(state.isUserRequest).toBe(false);
        expect(state.isAuthenticated).toBe(false);
        expect(state.data).toBeNull();
      });
    });

    describe('обновления данных пользователя', () => {
      test('инициализация запроса', () => {
        const state = reducer(initialState, {
          type: updateUser.pending.type
        });
        expect(state.isUserRequest).toBe(true);
      });

      test('завершение запроса', () => {
        const updatedUser = { name: 'Updated', email: 'new@example.com' };
        const state = reducer(initialState, {
          type: updateUser.fulfilled.type,
          payload: { user: updatedUser }
        });
        expect(state.isUserRequest).toBe(false);
        expect(state.data).toEqual(updatedUser);
      });

      test('ошибка запроса', () => {
        const state = reducer(initialState, {
          type: updateUser.rejected.type,
          error: { message: 'Update failed' }
        });
        expect(state.isUserRequest).toBe(false);
        expect(state.userRequestError).toBe('Update failed');
      });
    });

    describe('вход', () => {
      test('инициализация запроса', () => {
        const state = reducer(initialState, {
          type: loginUser.pending.type
        });

        expect(state.isUserRequest).toBe(true);
        expect(state.userRequestError).toBeNull();
      });

      test('завершение запроса', () => {
        const state = reducer(initialState, {
          type: loginUser.fulfilled.type,
          payload: user
        });

        expect(state.isAuthenticated).toBe(true);
        expect(state.isAuthChecked).toBe(true);
        expect(state.isUserRequest).toBe(false);
        expect(state.data).toEqual(user);
      });

      test('ошибка запроса', () => {
        const state = reducer(initialState, {
          type: loginUser.rejected.type,
          error: { message: 'Login error' }
        });

        expect(state.isUserRequest).toBe(false);
        expect(state.isAuthChecked).toBe(true);
        expect(state.userRequestError).toBe('Login error');
      });
    });

    describe('регистрация', () => {
      test('инициализация запроса', () => {
        const state = reducer(initialState, {
          type: registerUser.pending.type
        });

        expect(state.isUserRequest).toBe(true);
        expect(state.userRequestError).toBeNull();
      });

      test('завершение запроса', () => {
        const state = reducer(initialState, {
          type: registerUser.fulfilled.type,
          payload: user
        });

        expect(state.isAuthenticated).toBe(true);
        expect(state.isAuthChecked).toBe(true);
        expect(state.isUserRequest).toBe(false);
        expect(state.data).toEqual(user);
      });

      test('ошибка запроса', () => {
        const state = reducer(initialState, {
          type: registerUser.rejected.type,
          error: { message: 'Registration failed' }
        });

        expect(state.isUserRequest).toBe(false);
        expect(state.isAuthChecked).toBe(true);
        expect(state.userRequestError).toBe('Registration failed');
      });
    });
  });

  describe('тестирование селектора', () => {
    const store = configureStore({
      reducer: combineReducers({
        user: reducer
      }),
      preloadedState: {
        user: initialLoadedState
      }
    });

    test('селектор состояния', () => {
      const userState = getUserSelector(store.getState());
      expect(userState).toEqual(initialLoadedState);
    });
  });
});
