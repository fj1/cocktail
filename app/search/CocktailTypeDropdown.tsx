'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type CocktailTypeDropdownProps = {
  options: string[];
};

export function CocktailTypeDropdown({ options }: CocktailTypeDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('type') ?? '';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set('type', value);
    } else {
      params.delete('type');
    }

    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className='flex items-center gap-2'>
      <label
        htmlFor='cocktail-type'
        className='text-sm font-medium text-gray-700'
      >
        Cocktail type
      </label>
      <select
        id='cocktail-type'
        value={current}
        onChange={handleChange}
        className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400'
      >
        <option value=''>Select…</option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
