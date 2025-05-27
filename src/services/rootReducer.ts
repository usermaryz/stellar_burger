import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './slices/ingredients';
import burgerConstructorReducer from './slices/burgerConstructor';
import userReducer from './slices/user';
import ordersReducer from './slices/orders';

export default combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer,
  orders: ordersReducer
});
