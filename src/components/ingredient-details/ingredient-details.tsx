import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { getIngredientsSelector } from '@selectors';
import { Modal } from '../modal';
import { fetchIngredients } from '@slices';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { items, loading } = useSelector(getIngredientsSelector);

  let ingredientData = items.find((ingredient) => ingredient._id == id);

  useEffect(() => {
    if (!ingredientData && !loading) {
      dispatch(fetchIngredients());
    }
  }, []);

  useEffect(() => {
    ingredientData = items.find((ingredient) => ingredient._id == id);
  }, [items.length]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <Modal title='Детали ингредиента' onClose={() => navigate('/')}>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </Modal>
  );
};
