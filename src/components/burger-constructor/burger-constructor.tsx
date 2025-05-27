import { FC, useMemo, useCallback } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { getBurgerConstructorSelector, getUserSelector } from '@selectors';
import { useDispatch, useSelector } from '../../services/store';
import { submitOrder, clearConstructor } from '@slices';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients, orderRequest, orderData } = useSelector(
    getBurgerConstructorSelector
  );
  const { isAuthenticated } = useSelector(getUserSelector);

  const handleOrderSubmission = useCallback(() => {
    if (!bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login', {
        replace: true,
        state: { from: location }
      });
      return;
    }

    dispatch(submitOrder());
  }, [bun, orderRequest, isAuthenticated, navigate, location, dispatch]);

  const calculateTotalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total: number, item: TConstructorIngredient) => total + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      constructorItems={{
        bun,
        ingredients
      }}
      price={calculateTotalPrice}
      orderRequest={orderRequest}
      orderModalData={orderData}
      onOrderClick={handleOrderSubmission}
      closeOrderModal={() => {
        dispatch(clearConstructor());
      }}
    />
  );
};
