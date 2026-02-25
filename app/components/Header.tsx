import Link from 'next/link';

export function Header() {
  return (
    <header className='border-b border-gray-200 bg-white'>
      <div className='mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-6'>
        <Link
          href='/'
          className='text-xl font-semibold tracking-tight text-gray-900'
        >
          Drink DB
        </Link>
        <nav className='flex items-center gap-6' aria-label='Main'>
          <Link
            href='/'
            className='text-sm font-medium text-gray-600 hover:text-gray-900'
          >
            Random cocktail
          </Link>
          <Link
            href='/search'
            className='text-sm font-medium text-gray-600 hover:text-gray-900'
          >
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}
