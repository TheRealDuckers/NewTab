import { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mb-6 sm:mb-8">
      <div className="relative group">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 z-10" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Google or type a URL"
          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-full bg-white/40 backdrop-blur-md border border-white/50 
                   focus:outline-none focus:ring-2 focus:ring-white/60 focus:bg-white/50 
                   transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm sm:text-base
                   shadow-lg hover:shadow-xl"
        />
      </div>
    </form>
  );
}