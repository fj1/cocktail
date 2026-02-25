import { Suspense } from 'react';
import Link from 'next/link';
import type { CocktailDrink } from '@/lib/cocktail';
import { getAlcoholTypes, getCocktailsByAlcohol } from '@/lib/cocktail';
import { CocktailTypeDropdown } from './CocktailTypeDropdown';

const SEARCH_RESULTS_LIMIT = 10;
const SEARCH_FETCH_MAX = 100;

type SearchPageProps = {
  searchParams:
    | Promise<{ type?: string; page?: string }>
    | { type?: string; page?: string };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await Promise.resolve(searchParams);
  const selectedType = params.type?.trim();
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const [alcoholTypes, allDrinks] = await Promise.all([
    getAlcoholTypes(),
    selectedType
      ? getCocktailsByAlcohol(selectedType, SEARCH_FETCH_MAX)
      : Promise.resolve([]),
  ]);

  const total = allDrinks.length;
  const totalPages = Math.max(1, Math.ceil(total / SEARCH_RESULTS_LIMIT));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * SEARCH_RESULTS_LIMIT;
  const drinks = allDrinks.slice(start, start + SEARCH_RESULTS_LIMIT);

  return (
    <main className='min-h-screen bg-gray-50 p-6 md:p-10'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='text-2xl font-bold text-gray-900'>Search</h1>

        <nav
          className='mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm'
          aria-label='Search filters'
        >
          <Suspense
            fallback={<div className='text-sm text-gray-500'>Loading…</div>}
          >
            <CocktailTypeDropdown options={alcoholTypes} />
          </Suspense>
        </nav>

        {selectedType && (
          <section className='mt-6' aria-live='polite'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>
                {total === 0
                  ? `No results for “${selectedType}”`
                  : total <= SEARCH_RESULTS_LIMIT
                    ? `Results for “${selectedType}” (${total})`
                    : `Results ${start + 1}–${start + drinks.length} of ${total} for “${selectedType}”`}
              </h2>
              {total > SEARCH_RESULTS_LIMIT && (
                <div className='flex items-center gap-2'>
                  <SearchPageLink
                    type={selectedType}
                    page={currentPage - 1}
                    disabled={currentPage <= 1}
                    label='Previous 10'
                  />
                  <SearchPageLink
                    type={selectedType}
                    page={currentPage + 1}
                    disabled={currentPage >= totalPages}
                    label='Next 10'
                  />
                </div>
              )}
            </div>
            {drinks.length === 0 ? (
              <p className='mt-2 text-gray-600'>No cocktails found.</p>
            ) : (
              <ul className='mt-3 grid gap-3 sm:grid-cols-2'>
                {drinks.map(drink => (
                  <SearchResultCard
                    key={drink.idDrink ?? drink.strDrink}
                    drink={drink}
                    searchType={selectedType}
                    searchPage={currentPage}
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

function SearchPageLink({
  type,
  page,
  disabled,
  label,
}: {
  type: string;
  page: number;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className='cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm font-medium text-gray-400'>
        {label}
      </span>
    );
  }

  const href = `/search?type=${encodeURIComponent(type)}&page=${page}`;

  return (
    <Link
      href={href}
      className='rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50'
    >
      {label}
    </Link>
  );
}

function SearchResultCard({
  drink,
  searchType,
  searchPage,
}: {
  drink: CocktailDrink;
  searchType: string;
  searchPage: number;
}) {
  const name = drink.strDrink ?? 'Unnamed cocktail';
  const query = new URLSearchParams({ type: searchType });

  if (searchPage > 1) {
    query.set('page', String(searchPage));
  }

  const href = drink.idDrink
    ? `/drink/${drink.idDrink}?${query.toString()}`
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
