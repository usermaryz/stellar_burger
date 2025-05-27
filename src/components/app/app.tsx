import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import {
  AppHeader,
  OrderInfo,
  IngredientDetails,
  Modal,
  ProtectedRoute
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { useDispatch } from '@store';
import { fetchUser, fetchIngredients } from '@slices';

import styles from './app.module.css';
import '../../index.css';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchIngredients());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/login' element={<Login />} />
        </Route>
        <Route path='/register' element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/register' element={<Register />} />
        </Route>
        <Route path='/forgot-password' element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Route>
        <Route path='/reset-password' element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route path='/profile' element={<ProtectedRoute />}>
          <Route index element={<Profile />} />
          <Route path='orders' element={<ProfileOrders />} />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/profile/orders/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
