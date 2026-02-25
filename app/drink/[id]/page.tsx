import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCocktailById } from '@/lib/cocktail';
import { CocktailCard } from '@/app/components/CocktailCard';

type DrinkPageProps = {
  params: Promise<{ id: string }> | { id: string };
  searchParams:
    | Promise<{ type?: string; category?: string; page?: string }>
    | { type?: string; category?: string; page?: string };
};

export default async function DrinkPage({
  params,
  searchParams,
}: DrinkPageProps) {
  const { id } = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const type = resolvedSearchParams.type?.trim();
  const category = resolvedSearchParams.category?.trim();
  const page = resolvedSearchParams.page?.trim();

  const drink = await getCocktailById(id);

  if (!drink) {
    notFound();
  }

  const searchParamsBack = new URLSearchParams();

  if (type) {
    searchParamsBack.set('type', type);
  }

  if (category) {
    searchParamsBack.set('category', category);
  }

  if (page && page !== '1') {
    searchParamsBack.set('page', page);
  }

  const backHref = searchParamsBack.toString()
    ? `/search?${searchParamsBack.toString()}`
    : '/search';
  const backLabel = type || category ? 'Back to results' : 'Back to search';

  return (
    <main className='min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center'>
      <div className='mb-6 w-full max-w-2xl'>
        <Link
          href={backHref}
          className='inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900'
        >
          <span aria-hidden>←</span>
          {backLabel}
        </Link>
      </div>
      <CocktailCard drink={drink} />
    </main>
  );
}
