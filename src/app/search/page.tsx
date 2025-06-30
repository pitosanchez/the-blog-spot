"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAnalytics, usePageTimeTracking } from '@/hooks/useAnalytics';
import { 
  type SearchResponse, 
  type SearchResult, 
  type SearchFilters,
  type SortOption 
} from '@/lib/search';

interface SearchPageState {
  results: SearchResult[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
  relatedQueries: string[];
  aggregations: any;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { trackSearch, trackEvent } = useAnalytics();
  
  usePageTimeTracking();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchState, setSearchState] = useState<SearchPageState>({
    results: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    error: null,
    suggestions: [],
    relatedQueries: [],
    aggregations: null,
  });

  const [filters, setFilters] = useState<SearchFilters>({
    contentType: searchParams.get('contentType')?.split(',') as any || [],
    accessType: searchParams.get('accessType')?.split(',') as any || [],
    specialties: searchParams.get('specialties')?.split(',') || [],
    tags: searchParams.get('tags')?.split(',') || [],
  });

  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'RELEVANCE');
  const [showFilters, setShowFilters] = useState(false);

  const performSearch = useCallback(async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return;

    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: page.toString(),
        limit: '20',
        sort,
      });

      // Add filters to params
      if (filters.contentType?.length) {
        params.set('contentType', filters.contentType.join(','));
      }
      if (filters.accessType?.length) {
        params.set('accessType', filters.accessType.join(','));
      }
      if (filters.specialties?.length) {
        params.set('specialties', filters.specialties.join(','));
      }
      if (filters.tags?.length) {
        params.set('tags', filters.tags.join(','));
      }

      const response = await fetch(`/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResponse = await response.json();
      
      setSearchState({
        results: data.results,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        isLoading: false,
        error: null,
        suggestions: data.suggestions,
        relatedQueries: data.relatedQueries,
        aggregations: data.aggregations,
      });

      // Track search
      trackSearch(searchQuery, data.totalCount);

      // Update URL
      const newParams = new URLSearchParams(searchParams);
      newParams.set('q', searchQuery);
      newParams.set('page', page.toString());
      if (sort !== 'RELEVANCE') newParams.set('sort', sort);
      
      router.push(`/search?${newParams.toString()}`, { scroll: false });

    } catch (error) {
      console.error('Search error:', error);
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Search failed. Please try again.',
      }));
    }
  }, [filters, sort, trackSearch, router, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    if (query) {
      performSearch(query);
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    if (query) {
      performSearch(query);
    }
  };

  const handlePageChange = (page: number) => {
    performSearch(query, page);
  };

  const handleResultClick = (result: SearchResult) => {
    trackEvent('search_result_click', {
      resultId: result.id,
      resultTitle: result.title,
      resultPosition: searchState.results.indexOf(result) + 1,
      query,
    });
  };

  // Initial search on page load
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery, parseInt(searchParams.get('page') || '1'));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medical content, conditions, treatments..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={searchState.isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchState.isLoading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Filters
            </button>
          </form>

          {/* Search Suggestions */}
          {searchState.suggestions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {searchState.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* Content Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Content Type</h4>
                {searchState.aggregations?.contentTypes?.map((type: any) => (
                  <label key={type.value} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={filters.contentType?.includes(type.value) || false}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...(filters.contentType || []), type.value]
                          : (filters.contentType || []).filter(t => t !== type.value);
                        handleFilterChange({ contentType: newTypes });
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{type.value} ({type.count})</span>
                  </label>
                ))}
              </div>

              {/* Access Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Access</h4>
                {searchState.aggregations?.accessTypes?.map((type: any) => (
                  <label key={type.value} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={filters.accessType?.includes(type.value) || false}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...(filters.accessType || []), type.value]
                          : (filters.accessType || []).filter(t => t !== type.value);
                        handleFilterChange({ accessType: newTypes });
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{type.value} ({type.count})</span>
                  </label>
                ))}
              </div>

              {/* Specialties Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Specialties</h4>
                <div className="max-h-40 overflow-y-auto">
                  {searchState.aggregations?.specialties?.slice(0, 10).map((specialty: any) => (
                    <label key={specialty.value} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={filters.specialties?.includes(specialty.value) || false}
                        onChange={(e) => {
                          const newSpecialties = e.target.checked
                            ? [...(filters.specialties || []), specialty.value]
                            : (filters.specialties || []).filter(s => s !== specialty.value);
                          handleFilterChange({ specialties: newSpecialties });
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{specialty.value} ({specialty.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({})}
                className="w-full py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            {searchState.totalCount > 0 && (
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-600">
                    {searchState.totalCount.toLocaleString()} results for "{query}"
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="RELEVANCE">Relevance</option>
                    <option value="DATE">Date</option>
                    <option value="POPULARITY">Popularity</option>
                    <option value="CME_CREDITS">CME Credits</option>
                  </select>
                </div>
              </div>
            )}

            {/* Error State */}
            {searchState.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{searchState.error}</p>
              </div>
            )}

            {/* Loading State */}
            {searchState.isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Searching...</p>
              </div>
            )}

            {/* Search Results */}
            {!searchState.isLoading && searchState.results.length > 0 && (
              <div className="space-y-6">
                {searchState.results.map((result) => (
                  <SearchResultCard 
                    key={result.id} 
                    result={result} 
                    onClick={() => handleResultClick(result)}
                  />
                ))}

                {/* Pagination */}
                {searchState.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(searchState.currentPage - 1)}
                        disabled={searchState.currentPage <= 1}
                        className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {Array.from({ length: Math.min(5, searchState.totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 border rounded ${
                              page === searchState.currentPage
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(searchState.currentPage + 1)}
                        disabled={searchState.currentPage >= searchState.totalPages}
                        className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {!searchState.isLoading && query && searchState.results.length === 0 && !searchState.error && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or removing some filters.
                </p>
                
                {/* Related Queries */}
                {searchState.relatedQueries.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Try these related searches:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {searchState.relatedQueries.map((relatedQuery, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(relatedQuery)}
                          className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded-full text-blue-700"
                        >
                          {relatedQuery}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!query && !searchState.isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Medical Content</h3>
                <p className="text-gray-600">
                  Find articles, case studies, CME courses, and more from medical professionals.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResultCard({ result, onClick }: { result: SearchResult; onClick: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            result.type === 'ARTICLE' ? 'bg-blue-100 text-blue-800' :
            result.type === 'VIDEO' ? 'bg-purple-100 text-purple-800' :
            result.type === 'CASE_STUDY' ? 'bg-green-100 text-green-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {result.type}
          </span>
          
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            result.accessType === 'FREE' ? 'bg-gray-100 text-gray-800' :
            result.accessType === 'PAID' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {result.accessType}
          </span>

          {result.cmeCredits && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
              {result.cmeCredits} CME
            </span>
          )}
        </div>

        {result.price && (
          <span className="text-lg font-bold text-green-600">
            ${result.price}
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
        <a href={`/article/${result.slug}`} onClick={onClick}>
          <span dangerouslySetInnerHTML={{ __html: result.highlighted.title || result.title }} />
        </a>
      </h3>

      <p className="text-gray-600 mb-3 line-clamp-3">
        <span dangerouslySetInnerHTML={{ __html: result.highlighted.content || result.excerpt }} />
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>By {result.author.name}</span>
          {result.author.credentials && (
            <span>• {result.author.credentials}</span>
          )}
          <span>• {new Date(result.publishedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-4">
          <span>{result.metrics.views.toLocaleString()} views</span>
          <span>Score: {result.metrics.engagementScore}</span>
        </div>
      </div>

      {/* Tags */}
      {result.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {result.tags.slice(0, 5).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              dangerouslySetInnerHTML={{ 
                __html: result.highlighted.tags?.[index] || tag 
              }}
            />
          ))}
          {result.tags.length > 5 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{result.tags.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}