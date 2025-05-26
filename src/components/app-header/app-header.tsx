import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { getUserSelector } from '@selectors';

export const AppHeader: FC = () => {
  const { data } = useSelector(getUserSelector);

  return <AppHeaderUI userName={data?.name} />;
};
