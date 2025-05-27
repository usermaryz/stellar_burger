import { FC, useEffect, useMemo, useCallback } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { getIngredientsSelector, getOrdersSelector } from '@selectors';
import { fetchIngredients, fetchFeedOrders, fetchProfileOrders } from '@slices';
import { Modal } from '../modal';

type TOrderWithDetails = TOrder & {
  ingredientsInfo: Record<string, TIngredient & { count: number }>;
  date: Date;
  total: number;
};

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { number } = useParams<{ number: string }>();

  const { items: ingredients, loading: ingredientsLoading } = useSelector(
    getIngredientsSelector
  );
  const { feed, profile } = useSelector(getOrdersSelector);

  const orderNumber = useMemo(() => (number ? +number : null), [number]);
  if (!orderNumber) return null;

  const findOrder = useCallback(
    (orders: TOrder[]) => orders.find((order) => order.number === orderNumber),
    [orderNumber]
  );

  const orderData = useMemo(
    () => findOrder(feed.items) || findOrder(profile.items),
    [findOrder, feed.items, profile.items]
  );

  const loadData = useCallback(async () => {
    const loadPromises: Promise<any>[] = [];

    if (!orderData) {
      if (!feed.items.length && !feed.loading) {
        loadPromises.push(dispatch(fetchFeedOrders()));
      }
      if (!profile.items.length && !profile.loading) {
        loadPromises.push(dispatch(fetchProfileOrders()));
      }
    }

    await Promise.all(loadPromises);
  }, [
    dispatch,
    ingredients.length,
    ingredientsLoading,
    orderData,
    feed,
    profile
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const processOrderData = useMemo((): TOrderWithDetails | null => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);
    const ingredientsMap = new Map<string, TIngredient & { count: number }>();

    orderData.ingredients.forEach((item) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (ingredient) {
        const current = ingredientsMap.get(item);
        ingredientsMap.set(item, {
          ...ingredient,
          count: (current?.count || 0) + 1
        });
      }
    });

    const total = Array.from(ingredientsMap.values()).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo: Object.fromEntries(ingredientsMap),
      date,
      total
    };
  }, [orderData, ingredients]);

  const handleModalClose = useCallback(() => {
    if (location.state) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!processOrderData) {
    return <Preloader />;
  }

  return (
    <Modal title={`#${processOrderData.number}`} onClose={handleModalClose}>
      <OrderInfoUI orderInfo={processOrderData} />
    </Modal>
  );
};
