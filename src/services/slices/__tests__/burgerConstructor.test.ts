import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { v4 as uuid_v4 } from 'uuid';

import reducer, {
  setBun,
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearConstructor,
  getBurgerConstructorSelector
} from '../burgerConstructor';
import { submitOrder } from '../burgerConstructor';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'unique-id')
}));

const bun: TIngredient = {
  _id: 'bun123',
  name: 'Bun',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 2,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg'
};

const ingredient: TIngredient = {
  _id: 'ingredient123',
  name: 'Patty',
  type: 'main',
  proteins: 20,
  fat: 15,
  carbohydrates: 5,
  calories: 250,
  price: 5,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg'
};

const order: TOrder = {
  _id: 'order123',
  status: 'done',
  name: 'Mega Burger',
  createdAt: '2025-05-01T12:00:00.000Z',
  updatedAt: '2025-05-01T12:01:00.000Z',
  number: 42,
  ingredients: ['bun123', 'ingredient123']
};

describe('тестирование слайса конструктора бургера', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderData: null,
    orderRequest: false,
    orderError: null
  };

  const initialLoadedState = {
    bun: bun,
    ingredients: [{ ...ingredient, _id: uuid_v4() } as TConstructorIngredient],
    orderData: null,
    orderRequest: false,
    orderError: null
  };

  test('инициализация изначального состояния', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('тестирование синхронных редюсеров', () => {
    test('установка булочки бургера', () => {
      const nextState = reducer(initialState, setBun(bun));

      expect(nextState.bun).toEqual(bun);
    });

    test('добавление ингредиента', () => {
      const nextState = reducer(initialState, addIngredient(ingredient));

      expect(nextState.ingredients.length).toBe(1);
      expect(nextState.ingredients[0]).toMatchObject({
        ...ingredient,
        id: 'unique-id'
      });
    });

    test('перемещение ингредиента', () => {
      const state = {
        ...initialState,
        ingredients: [
          { ...ingredient, id: '1' },
          { ...ingredient, id: '2' },
          { ...ingredient, id: '3' }
        ]
      };
      const nextState = reducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(nextState.ingredients.map((i) => i.id)).toEqual(['2', '3', '1']);
    });

    test('удаление ингредиента ', () => {
      const state = {
        ...initialState,
        ingredients: [
          { ...ingredient, id: '1' },
          { ...ingredient, id: '2' }
        ]
      };
      const nextState = reducer(state, removeIngredient(0));

      expect(nextState.ingredients.length).toBe(1);
      expect(nextState.ingredients[0].id).toBe('2');
    });

    test('очистка конструктора', () => {
      const state = {
        bun,
        ingredients: [{ ...ingredient, id: '1' }],
        orderData: order,
        orderRequest: false,
        orderError: null
      };
      const nextState = reducer(state, clearConstructor());

      expect(nextState).toEqual(initialState);
    });
  });

  describe('тестирование асинхронных редюсеров', () => {
    test('инициализация создания заказа', () => {
      const state = reducer(initialState, { type: submitOrder.pending.type });

      expect(state.orderRequest).toBe(true);
      expect(state.orderError).toBeNull();
    });

    test('завершение создания заказа', () => {
      const state = reducer(initialState, {
        type: submitOrder.fulfilled.type,
        payload: order
      });

      expect(state.orderRequest).toBe(false);
      expect(state.orderData).toEqual(order);
    });

    test('ошибка завершения заказа', () => {
      const state = reducer(initialState, {
        type: submitOrder.rejected.type,
        error: { message: 'Something went wrong' }
      });

      expect(state.orderRequest).toBe(false);
      expect(state.orderError).toBe('Something went wrong');
    });
  });

  describe('тестирование селекторов', () => {
    const store = configureStore({
      reducer: combineReducers({
        burgerConstructor: reducer
      }),
      preloadedState: {
        burgerConstructor: initialLoadedState
      }
    });

    test('селектор состояния', () => {
      const burgerConstructorState = getBurgerConstructorSelector(
        store.getState()
      );

      expect(burgerConstructorState).toEqual(initialLoadedState);
    });
  });
});
