import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCocktailById } from '@/lib/cocktail';
import { CocktailCard } from '@/app/components/CocktailCard';

type DrinkPageProps = {
  params: Promise<{ id: string }> | { id: string };
  searchParams: Promise<{ type?: string }> | { type?: string };
};

export default async function DrinkPage({
  params,
  searchParams,
}: DrinkPageProps) {
  const { id } = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const type = resolvedSearchParams.type?.trim();

  const drink = await getCocktailById(id);

  if (!drink) {
    notFound();
  }

  const backHref = type
    ? `/search?type=${encodeURIComponent(type)}`
    : '/search';
  const backLabel = type ? 'Back to results' : 'Back to search';

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
