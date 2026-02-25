'use client';

import { useFormStatus } from 'react-dom';

function Spinner() {
  return (
    <svg
      className='h-5 w-5 animate-spin text-gray-500'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      aria-hidden
    >
      <circle
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinecap='round'
        strokeDasharray='32'
        strokeDashoffset='12'
        fill='none'
      />
    </svg>
  );
}

export function RandomCocktailButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className='flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-70'
    >
      {pending ? (
        <>
          <Spinner />
          <span>Loading…</span>
        </>
      ) : (
        'Get random cocktail'
      )}
    </button>
  );
}
