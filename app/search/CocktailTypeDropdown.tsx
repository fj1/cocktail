'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const PREFIX_ALCOHOL = 'a:';
const PREFIX_CATEGORY = 'c:';

type CocktailTypeDropdownProps = {
  alcoholTypes: string[];
  categories: string[];
};

export function CocktailTypeDropdown({
  alcoholTypes,
  categories,
}: CocktailTypeDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') ?? '';
  const category = searchParams.get('category') ?? '';

  const currentValue = type ? `${PREFIX_ALCOHOL}${type}` : category ? `${PREFIX_CATEGORY}${category}` : '';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.delete('type');
    params.delete('category');
    params.delete('page');

    if (value.startsWith(PREFIX_ALCOHOL)) {
      params.set('type', value.slice(PREFIX_ALCOHOL.length));
    } else if (value.startsWith(PREFIX_CATEGORY)) {
      params.set('category', value.slice(PREFIX_CATEGORY.length));
    }

    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className='flex items-center gap-2'>
      <label
        htmlFor='cocktail-filter'
        className='text-sm font-medium text-gray-700'
      >
        Cocktail type
      </label>
      <select
        id='cocktail-filter'
        value={currentValue}
        onChange={handleChange}
        className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400'
      >
        <option value=''>Select…</option>
        <optgroup label='By type'>
          {alcoholTypes.map((opt) => (
            <option key={`a-${opt}`} value={`${PREFIX_ALCOHOL}${opt}`}>
              {opt}
            </option>
          ))}
        </optgroup>
        <optgroup label='By category'>
          {categories.map((opt) => (
            <option key={`c-${opt}`} value={`${PREFIX_CATEGORY}${opt}`}>
              {opt}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
