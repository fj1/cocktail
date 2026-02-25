import { getNewRandomCocktail } from './actions';
import { getRandomCocktail } from '@/lib/cocktail';
import { FormWithPendingCard } from './FormWithPendingCard';
import { CocktailCard } from './components/CocktailCard';

export default async function Home() {
  const drink = await getRandomCocktail();

  return (
    <main className='min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center'>
      <form action={getNewRandomCocktail} className='w-full max-w-2xl'>
        <FormWithPendingCard>
          <CocktailCard drink={drink} />
        </FormWithPendingCard>
      </form>
    </main>
  );
}
