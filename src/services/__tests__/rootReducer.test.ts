import rootReducer from '../rootReducer';
import { initialState as ingredientsInitialState } from '../slices/ingredients';
import { initialState as burgerConstructorInitialState } from '../slices/burgerConstructor';
import { initialState as userInitialState } from '../slices/user';
import { initialState as ordersInitialState } from '../slices/orders';

describe('тестирование корневого редюсера', () => {
  test('инициализация изначального состояния', () => {
    const state = rootReducer(undefined, { type: '' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: burgerConstructorInitialState,
      user: userInitialState,
      orders: ordersInitialState
    });
  });
});
