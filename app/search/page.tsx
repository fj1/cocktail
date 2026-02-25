import { Suspense } from 'react';
import Link from 'next/link';
import type { CocktailDrink } from '@/lib/cocktail';
import {
  getAlcoholTypes,
  getCocktailsByAlcohol,
} from '@/lib/cocktail';
import { CocktailTypeDropdown } from './CocktailTypeDropdown';

const SEARCH_RESULTS_LIMIT = 10;

type SearchPageProps = {
  searchParams: Promise<{ type?: string }> | { type?: string };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await Promise.resolve(searchParams);
  const selectedType = params.type?.trim();

  const [alcoholTypes, drinks] = await Promise.all([
    getAlcoholTypes(),
    selectedType
      ? getCocktailsByAlcohol(selectedType, SEARCH_RESULTS_LIMIT)
      : Promise.resolve([]),
  ]);

  return (
    <main className='min-h-screen bg-gray-50 p-6 md:p-10'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='text-2xl font-bold text-gray-900'>Search</h1>

        <nav
          className='mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm'
          aria-label='Search filters'
        >
          <Suspense fallback={<div className='text-sm text-gray-500'>Loading…</div>}>
            <CocktailTypeDropdown options={alcoholTypes} />
          </Suspense>
        </nav>

        {selectedType && (
          <section className='mt-6' aria-live='polite'>
            <h2 className='text-lg font-semibold text-gray-900'>
              First {SEARCH_RESULTS_LIMIT} results for “{selectedType}”
            </h2>
            {drinks.length === 0 ? (
              <p className='mt-2 text-gray-600'>No cocktails found.</p>
            ) : (
              <ul className='mt-3 grid gap-3 sm:grid-cols-2'>
                {drinks.map((drink) => (
                  <SearchResultCard
                    key={drink.idDrink ?? drink.strDrink}
                    drink={drink}
                    searchType={selectedType}
                  />
                ))}
              </ul>
            )}
          </section>
        )}

        {!selectedType && (
          <p className='mt-4 text-gray-600'>
            Choose a cocktail type above to see results.
          </p>
        )}
      </div>
    </main>
  );
}

function SearchResultCard({
  drink,
  searchType,
}: {
  drink: CocktailDrink;
  searchType: string;
}) {
  const name = drink.strDrink ?? 'Unnamed cocktail';
  const href = drink.idDrink
    ? `/drink/${drink.idDrink}${searchType ? `?type=${encodeURIComponent(searchType)}` : ''}`
    : '#';
  return (
    <li>
      <Link
        href={href}
        className='flex gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:bg-gray-50'
      >
        {drink.strDrinkThumb ? (
          <img
            src={drink.strDrinkThumb}
            alt=''
            className='h-16 w-16 shrink-0 rounded object-cover'
          />
        ) : (
          <div className='h-16 w-16 shrink-0 rounded bg-gray-200' aria-hidden />
        )}
        <span className='font-medium text-gray-900'>{name}</span>
      </Link>
    </li>
  );
}
