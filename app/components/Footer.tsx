const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 mt-auto bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">
          All data made available by the{' '}
          <a 
            href="https://pokemontcg.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            Pokémon TCG API
          </a>
        </p>
        <p>
          This website is not produced, endorsed, supported, or affiliated with Nintendo or The Pokémon Company.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
