import { getFeedOrdersSelector, getIngredientsSelector } from '@selectors';
import { fetchFeedOrders, fetchIngredients } from '@slices';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useCallback, useMemo } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { items: orders, loading: isFeedLoading } = useSelector(
    getFeedOrdersSelector
  );
  const { items: ingredients, loading: isIngredientsLoading } = useSelector(
    getIngredientsSelector
  );

  const isLoading = useMemo(
    () => isFeedLoading || isIngredientsLoading,
    [isFeedLoading, isIngredientsLoading]
  );

  const loadData = useCallback(async () => {
    const loadPromises: Promise<any>[] = [];

    if (!ingredients.length && !isIngredientsLoading) {
      loadPromises.push(dispatch(fetchIngredients()));
    }
    if (!orders.length && !isFeedLoading) {
      loadPromises.push(dispatch(fetchFeedOrders()));
    }

    await Promise.all(loadPromises);
  }, [
    dispatch,
    ingredients.length,
    orders.length,
    isIngredientsLoading,
    isFeedLoading
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(async () => {
    await dispatch(fetchFeedOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleRefresh} />;
};
