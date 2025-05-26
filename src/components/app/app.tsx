import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

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
import { fetchUser } from '@slices';

import styles from './app.module.css';
import '../../index.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed'>
          <Route index element={<Feed />} />
          <Route path=':number' element={<OrderInfo />} />
        </Route>
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
          <Route path='orders'>
            <Route index element={<ProfileOrders />} />
            <Route path=':number' element={<OrderInfo />} />
          </Route>
        </Route>
        <Route path='/ingredients'>
          <Route path=':id' element={<IngredientDetails />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
