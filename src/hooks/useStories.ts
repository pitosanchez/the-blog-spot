import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import type {
  Story,
  StoryFilters,
  PaginatedResponse,
  ApiResponse,
} from "../services/api";

interface UseStoriesResult {
  stories: Story[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  totalPages: number;
  total: number;
  fetchStories: (filters?: StoryFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useStories = (
  initialFilters: StoryFilters = {}
): UseStoriesResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<StoryFilters>(initialFilters);

  const fetchStories = useCallback(
    async (newFilters?: StoryFilters) => {
      try {
        setLoading(true);
        setError(null);

        const currentFilters = newFilters || filters;
        const response: ApiResponse<PaginatedResponse<Story>> =
          await api.getStories({
            ...currentFilters,
            page: newFilters ? 1 : page,
          });

        if (response.error) {
          throw new Error(response.error);
        }

        const { items, total, totalPages, hasMore } = response.data;

        if (newFilters) {
          // New search, replace stories
          setStories(items);
          setPage(1);
          setFilters(currentFilters);
        } else {
          // Pagination, append stories
          setStories((prev) => [...prev, ...items]);
        }

        setTotal(total);
        setTotalPages(totalPages);
        setHasMore(hasMore);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch stories"
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, page]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setPage((prev) => prev + 1);
    await fetchStories({ ...filters, page: page + 1 });
  }, [hasMore, loading, filters, page, fetchStories]);

  const refresh = useCallback(async () => {
    setPage(1);
    setStories([]);
    await fetchStories({ ...filters, page: 1 });
  }, [filters, fetchStories]);

  useEffect(() => {
    fetchStories();
  }, []); // Only run on mount

  return {
    stories,
    loading,
    error,
    hasMore,
    page,
    totalPages,
    total,
    fetchStories,
    loadMore,
    refresh,
  };
};

// Hook for a single story
interface UseStoryResult {
  story: Story | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStory = (id: string): UseStoryResult => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.getStory(id);

      if (response.error) {
        throw new Error(response.error);
      }

      setStory(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch story");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  return {
    story,
    loading,
    error,
    refetch: fetchStory,
  };
};
