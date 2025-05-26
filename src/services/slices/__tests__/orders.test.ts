import { combineReducers, configureStore } from '@reduxjs/toolkit';
import reducer, {
  getOrdersSelector,
  getFeedOrdersSelector,
  getProfileOrdersSelector,
  fetchProfileOrders,
  fetchFeedOrders
} from '../orders';

import { TOrder } from '@utils-types';

const order_1: TOrder = {
  _id: 'order123',
  status: 'done',
  name: 'Mega Burger',
  createdAt: '2025-05-01T12:00:00.000Z',
  updatedAt: '2025-05-01T12:01:00.000Z',
  number: 42,
  ingredients: ['bun123', 'ingredient123']
};

const order_2: TOrder = {
  _id: 'orderA001',
  status: 'pending',
  name: 'Green Garden Burger',
  createdAt: '2025-05-01T14:22:10.000Z',
  updatedAt: '2025-05-01T14:22:11.000Z',
  number: 1001,
  ingredients: [
    'bun-vegan-001',
    'sauce-vegan-002',
    'main-vegan-003',
    'main-vegan-004'
  ]
};

const order_3: TOrder = {
  _id: 'orderB002',
  status: 'done',
  name: 'Double Beef & Cheese',
  createdAt: '2025-05-01T15:47:35.000Z',
  updatedAt: '2025-05-01T15:49:10.000Z',
  number: 1002,
  ingredients: [
    'bun-regular-010',
    'main-meat-020',
    'main-meat-021',
    'main-cheese-015',
    'sauce-classic-030'
  ]
};

const someProfileOrders = [order_2, order_3];
const someFeedOrders = [order_1, order_2];

describe('тестирование слайса заказов', () => {
  const initialState = {
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

  const initialLoadedState = {
    profile: {
      items: someProfileOrders,
      loading: false,
      error: null
    },
    feed: {
      items: someFeedOrders,
      total: null,
      totalToday: null,
      loading: false,
      error: null
    }
  };

  test('инициализация изначального состояния', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('тестирование синхронных редюсеров', () => {});

  describe('тестирование асинхронных редюсеров', () => {
    describe('тестирование получения заказов в профиле', () => {
      test('инициализация запроса', () => {
        const state = reducer(initialState, {
          type: fetchProfileOrders.pending.type
        });

        expect(state.profile.loading).toBe(true);
        expect(state.profile.error).toBeNull();
      });

      test('завершение запроса', () => {
        const state = reducer(initialState, {
          type: fetchProfileOrders.fulfilled.type,
          payload: someProfileOrders
        });

        expect(state.profile.loading).toBe(false);
        expect(state.profile.items).toEqual(someProfileOrders);
      });

      test('ошибка запроса', () => {
        const state = reducer(initialState, {
          type: fetchProfileOrders.rejected.type,
          error: { message: 'Something went wrong' }
        });

        expect(state.profile.loading).toBe(false);
        expect(state.profile.error).toBe('Something went wrong');
      });
    });

    describe('тестирование получения заказов в ленте', () => {
      test('инициализация запроса', () => {
        const state = reducer(initialState, {
          type: fetchFeedOrders.pending.type
        });

        expect(state.feed.loading).toBe(true);
        expect(state.feed.error).toBeNull();
      });

      test('завершение запроса', () => {
        const state = reducer(initialState, {
          type: fetchFeedOrders.fulfilled.type,
          payload: {
            orders: someFeedOrders,
            total: someFeedOrders.length,
            totalToday: 1
          }
        });

        expect(state.feed.loading).toBe(false);
        expect(state.feed.items).toEqual(someFeedOrders);
      });

      test('ошибка запроса', () => {
        const state = reducer(initialState, {
          type: fetchFeedOrders.rejected.type,
          error: { message: 'Something went wrong' }
        });

        expect(state.feed.loading).toBe(false);
        expect(state.feed.error).toBe('Something went wrong');
      });
    });
  });

  describe('тестирование селекторов', () => {
    const store = configureStore({
      reducer: combineReducers({
        orders: reducer
      }),
      preloadedState: {
        orders: initialLoadedState
      }
    });

    test('селектор состояния заказов', () => {
      const ordersState = getOrdersSelector(store.getState());

      expect(ordersState).toEqual(initialLoadedState);
    });

    test('селектор состояния заказов ленты', () => {
      const ordersState = getFeedOrdersSelector(store.getState());

      expect(ordersState).toEqual(initialLoadedState.feed);
    });

    test('селектор состояния заказов профиля', () => {
      const ordersState = getProfileOrdersSelector(store.getState());

      expect(ordersState).toEqual(initialLoadedState.profile);
    });
  });
});
