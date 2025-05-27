import { getIngredientsSelector, getProfileOrdersSelector } from '@selectors';
import { fetchIngredients, fetchProfileOrders } from '@slices';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useCallback, useMemo } from 'react';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { items: orders, loading: isOrdersLoading } = useSelector(
    getProfileOrdersSelector
  );
  const { items: ingredients, loading: isIngredientsLoading } = useSelector(
    getIngredientsSelector
  );

  const isLoading = useMemo(
    () => isOrdersLoading || isIngredientsLoading,
    [isOrdersLoading, isIngredientsLoading]
  );

  const loadData = useCallback(async () => {
    const loadPromises: Promise<any>[] = [];

    if (!orders.length && !isOrdersLoading) {
      loadPromises.push(dispatch(fetchProfileOrders()));
    }

    await Promise.all(loadPromises);
  }, [
    dispatch,
    ingredients.length,
    orders.length,
    isIngredientsLoading,
    isOrdersLoading
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
