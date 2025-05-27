import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { getUserSelector } from '@selectors';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthChecked, isUserRequest, data } = useSelector(getUserSelector);

  if (!isAuthChecked || isUserRequest) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !data) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && data) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return <Outlet />;
};
