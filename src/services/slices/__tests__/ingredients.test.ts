import { combineReducers, configureStore } from '@reduxjs/toolkit';
import reducer, {
  fetchIngredients,
  getIngredientsSelector,
  initialState
} from '../ingredients';

import { TIngredient } from '@utils-types';

const ingredient_1: TIngredient = {
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

const ingredient_2: TIngredient = {
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

const someIngredients = [ingredient_1, ingredient_2];

describe('тестирование слайса ингредиентов', () => {
  const initialLoadedState = {
    items: [ingredient_1, ingredient_2],
    loading: false,
    error: null
  };

  test('инициализация изначального состояния', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('тестирование синхронных редюсеров', () => {});

  describe('тестирование асинхронных редюсеров', () => {
    describe('тестирование получения ингредиентов', () => {
      test('инициализация запроса', () => {
        const state = reducer(initialState, {
          type: fetchIngredients.pending.type
        });

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      test('завершение запроса', () => {
        const state = reducer(initialState, {
          type: fetchIngredients.fulfilled.type,
          payload: someIngredients
        });

        expect(state.loading).toBe(false);
        expect(state.items).toEqual(someIngredients);
      });

      test('ошибка запроса', () => {
        const state = reducer(initialState, {
          type: fetchIngredients.rejected.type,
          error: { message: 'Something went wrong' }
        });

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Something went wrong');
      });
    });
  });

  describe('тестирование селекторов', () => {
    const store = configureStore({
      reducer: combineReducers({
        ingredients: reducer
      }),
      preloadedState: {
        ingredients: initialLoadedState
      }
    });

    test('селектор состояния', () => {
      const ingredientsState = getIngredientsSelector(store.getState());

      expect(ingredientsState).toEqual(initialLoadedState);
    });
  });
});
