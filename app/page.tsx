import {
  getRandomCocktail,
  normalizeIngredientsList,
  normalizeInstructionSteps,
} from '@/lib/cocktail';

export default async function Home() {
  const drink = await getRandomCocktail();
  const ingredients = normalizeIngredientsList(drink);
  const instructionSteps = normalizeInstructionSteps(drink.strInstructions);

  return (
    <main className='min-h-screen p-6 md:p-10'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
          {drink.strDrink ?? 'Unnamed cocktail'}
        </h1>

        {(drink.strCategory ?? drink.strAlcoholic ?? drink.strGlass) && (
          <p className='mt-2 text-gray-600'>
            {[drink.strCategory, drink.strAlcoholic, drink.strGlass]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}

        {drink.strDrinkThumb && (
          <img
            src={drink.strDrinkThumb}
            alt={drink.strDrink ?? 'Cocktail'}
            className='mt-6 aspect-square w-full rounded-lg object-cover shadow-md'
          />
        )}

        {instructionSteps.length > 0 && (
          <section className='mt-8'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Instructions
            </h2>
            <ol className='mt-2 list-inside list-decimal space-y-2 text-gray-700'>
              {instructionSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        {ingredients.length > 0 && (
          <section className='mt-8'>
            <h2 className='text-lg font-semibold text-gray-900'>Ingredients</h2>
            <ul className='mt-2 list-inside list-disc space-y-1 text-gray-700'>
              {ingredients.map(({ measure, ingredient }, i) => (
                <li key={`${i}-${ingredient}`}>
                  {measure ? `${measure} ${ingredient}` : ingredient}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
