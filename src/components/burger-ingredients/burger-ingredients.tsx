import { useState, useRef, useEffect, FC, useMemo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { getIngredientsSelector } from '@selectors';

type TIngredientsByType = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
};

export const BurgerIngredients: FC = () => {
  const { items } = useSelector(getIngredientsSelector);

  const ingredientsByType = useMemo<TIngredientsByType>(
    () => ({
      buns: items.filter((value) => value.type === 'bun'),
      mains: items.filter((value) => value.type === 'main'),
      sauces: items.filter((value) => value.type === 'sauce')
    }),
    [items]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleRefs = {
    bun: useRef<HTMLHeadingElement>(null),
    main: useRef<HTMLHeadingElement>(null),
    sauce: useRef<HTMLHeadingElement>(null)
  };

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const handleTabClick = useCallback(
    (tab: string) => {
      const tabType = tab as TTabMode;
      setCurrentTab(tabType);

      const targetRef = titleRefs[tabType].current;
      if (targetRef) {
        targetRef.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [titleRefs]
  );

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={ingredientsByType.buns}
      mains={ingredientsByType.mains}
      sauces={ingredientsByType.sauces}
      titleBunRef={titleRefs.bun}
      titleMainRef={titleRefs.main}
      titleSaucesRef={titleRefs.sauce}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={handleTabClick}
    />
  );
};
