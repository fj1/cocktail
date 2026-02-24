/**
 * Shape of a single drink from TheCocktailDB API.
 * All fields are optional because the API can omit or null them.
 * Ingredient/measure slots are strIngredient1..N and strMeasure1..N (N can grow if the API changes).
 */
export interface CocktailDrink {
  idDrink?: string;
  strDrink?: string;
  strDrinkAlternate?: string | null;
  strDrinkThumb?: string | null;
  strCategory?: string | null;
  strAlcoholic?: string | null;
  strGlass?: string | null;
  strInstructions?: string | null;
  [key: string]: string | null | undefined;
}

export interface CocktailApiResponse {
  drinks: CocktailDrink[] | null;
}

// strIngredient1, strIngredient2, …
const INGREDIENT_KEY_REGEX = /^strIngredient(\d+)$/;

/** Match leading step numbering: "1)", "1.", "Step 1:", etc. */
const LEADING_NUMBER_PATTERN = /^\s*(?:Step\s+)?\d+[.)]\s*/i;

/**
 * Normalizes strInstructions into an array of steps for display as a numbered list.
 * Splits on double newlines or numbered lines; strips leading "1)", "2.", "Step 1:" style prefixes.
 */
export function normalizeInstructionSteps(
  instructions: string | null | undefined,
): string[] {
  if (instructions == null || instructions.trim() === '') {
    return [];
  }

  const s = instructions.trim();

  // Split on double newline or single newline so "1) ...\n\n2) ..." becomes steps
  const raw = s
    .split(/\n\s*\n|\n/)
    .map(block => block.trim())
    .filter(Boolean);

  const steps = raw
    .map(block => block.replace(LEADING_NUMBER_PATTERN, '').trim())
    .filter(Boolean);

  return steps.length > 0 ? steps : [s];
}

/**
 * Collects ingredients and measures from a drink by discovering strIngredientN
 * keys at runtime. Pairs each with strMeasureN and returns in the same order as the API.
 *
 * This adds resiliency in case the API adds more `strIngredientN` keys
 */
export function normalizeIngredientsList(
  drink: CocktailDrink,
): { measure: string; ingredient: string }[] {
  const drinkObj = drink as Record<string, unknown>;
  const entries: { num: number; measure: string; ingredient: string }[] = [];

  // Find all strIngredient1, strIngredient2, … keys (any N)
  for (const key of Object.keys(drinkObj)) {
    const match = key.match(INGREDIENT_KEY_REGEX);

    // we're not currently on a strIngredientN
    if (!match) {
      continue;
    }

    // get the ingredient string
    const ingredient = drinkObj[key];
    if (ingredient == null || String(ingredient).trim() === '') {
      continue;
    }

    // get the ingredient's number, ie strIngredient1
    // this aligns with the ingrement's measure amount, ie strMeasure1
    const num = parseInt(match[1], 10);
    const measureVal = drinkObj[`strMeasure${num}`];

    entries.push({
      num,
      measure: measureVal != null ? String(measureVal).trim() : '',
      ingredient: String(ingredient).trim(),
    });
  }

  // Preserve API order (1, 2, … 10, 11, …)
  entries.sort((a, b) => a.num - b.num);

  return entries.map(({ measure, ingredient }) => ({ measure, ingredient }));
}

const RANDOM_COCKTAIL_URL =
  'https://www.thecocktaildb.com/api/json/v1/1/random.php';

/**
 * Fetches a random cocktail from TheCocktailDB API.
 * Intended for server-side use (e.g. in a Server Component).
 *
 * @throws if the request fails or the API returns no drink
 *
 * example response:
 * {
 *    idDrink: '17824',
 *    strDrink: 'The Laverstoke',
 *    strDrinkAlternate: null,
 *    strTags: null,
 *    strVideo: 'https://www.youtube.com/watch?v=WKZOLJoDNZA',
 *    strCategory: 'Cocktail',
 *    strIBA: null,
 *    strAlcoholic: 'Alcoholic',
 *    strGlass: 'Balloon Glass',
 *    strInstructions: '1) Squeeze two lime wedges into a balloon glass then add the cordial, Bombay Sapphire and MARTINI Rosso Vermouth, swirl to mix.\n' +
 *      '\n' +
 *      '2) Fully fill the glass with cubed ice and stir to chill.\n' +
 *      '\n' +
 *      '3) Top with Fever-Tree Ginger Ale and gently stir again to combine.\n' +
 *      '\n' +
 *      '4) Garnish with a snapped ginger slice and an awoken mint sprig.',
 *    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/6xfj5t1517748412.jpg',
 *    strIngredient1: 'Gin',
 *    strIngredient2: 'Elderflower cordial',
 *    strIngredient3: 'Rosso Vermouth',
 *    strIngredient4: 'Tonic Water',
 *    strIngredient5: 'Lime',
 *    strIngredient6: 'Ginger',
 *    strIngredient7: 'Mint',
 *    strIngredient8: null,
 *    strIngredient9: null,
 *    strIngredient10: null,
 *    strIngredient11: null,
 *    strIngredient12: null,
 *    strIngredient13: null,
 *    strIngredient14: null,
 *    strIngredient15: null,
 *    strMeasure1: '50 ml',
 *    strMeasure2: '15 ml',
 *    strMeasure3: '15 ml',
 *    strMeasure4: '75 ml',
 *    strMeasure5: '2 Wedges',
 *    strMeasure6: '1 Slice',
 *    strMeasure7: '1 Large Sprig',
 *    strMeasure8: null,
 *    strMeasure9: null,
 *    strMeasure10: null,
 *    strMeasure11: null,
 *    strMeasure12: null,
 *    strMeasure13: null,
 *    strMeasure14: null,
 *    strMeasure15: null,
 *    strImageSource: null,
 *    strImageAttribution: null,
 *    dateModified: '2018-02-04 12:46:52'
 * }
 */
export async function getRandomCocktail(): Promise<CocktailDrink> {
  const res = await fetch(RANDOM_COCKTAIL_URL);

  if (!res.ok) {
    throw new Error(`Cocktail API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as CocktailApiResponse;

  const drink = data.drinks?.[0];

  if (!drink) {
    throw new Error('Cocktail API returned no drink');
  }

  return drink;
}
