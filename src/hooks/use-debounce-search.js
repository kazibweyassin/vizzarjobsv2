import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for debounced search functionality
 * @param {Function} searchFunction - Function to call when search is triggered
 * @param {number} delay - Delay in milliseconds before triggering search
 */
const useDebounceSearch = (searchFunction, delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // Debounced search effect
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchFunction(searchTerm);
        setResults(searchResults || []);
      } catch (err) {
        console.error('Search error:', err);
        setError(err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, delay, searchFunction]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setError(null);
    setIsSearching(false);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    results,
    error,
    clearSearch,
    hasResults: results.length > 0
  };
};

export default useDebounceSearch;
