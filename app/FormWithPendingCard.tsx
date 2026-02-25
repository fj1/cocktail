'use client';

import { useFormStatus } from 'react-dom';
import { RandomCocktailButton } from './RandomCocktailButton';

export function FormWithPendingCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <div className='mb-6 w-full max-w-2xl'>
        <RandomCocktailButton />
      </div>
      {!pending && children}
    </>
  );
}
