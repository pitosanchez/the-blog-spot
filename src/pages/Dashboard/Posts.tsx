import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '../../services';
import type { Post, PaginatedResponse } from '../../services';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function DashboardPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const response: PaginatedResponse<Post> = await contentService.getPosts({
          page,
          limit: 10,
          status: filter === 'all' ? undefined : filter,
          search: searchQuery || undefined,
        });
        setPosts(response.data);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [page, filter, searchQuery]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await contentService.deletePost(postId);
      // Re-fetch posts after deletion
      setPage(1);
    } catch (_err) {
      alert('Failed to delete post');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Posts</h1>
          <p className="mt-2 text-sm text-warm-gray">
            Manage your blog posts and content
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/dashboard/posts/new"
            className="inline-flex items-center justify-center rounded-md bg-electric-sage px-4 py-2 text-sm font-semibold text-ink-black shadow-sm hover:bg-electric-sage/90 transition-colors"
          >
            Create New Post
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="flex-1 rounded-md bg-charcoal border border-warm-gray/20 px-3 py-2 text-white placeholder-warm-gray focus:border-electric-sage focus:outline-none focus:ring-1 focus:ring-electric-sage"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-electric-sage text-ink-black rounded-md hover:bg-electric-sage/90 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft', 'scheduled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-electric-sage text-ink-black'
                  : 'bg-charcoal text-warm-gray hover:text-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-warm-gray">No posts found</p>
                <Link
                  to="/dashboard/posts/new"
                  className="mt-4 inline-flex items-center text-electric-sage hover:text-electric-sage/80"
                >
                  Create your first post →
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-warm-gray/10 rounded-lg">
                <table className="min-w-full divide-y divide-warm-gray/10">
                  <thead className="bg-charcoal">
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Title
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Status
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Stats
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Published
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-gray/10 bg-ink-black/50">
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td className="whitespace-nowrap px-3 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {post.title}
                            </div>
                            <div className="text-sm text-warm-gray">
                              {post.excerpt?.substring(0, 60)}...
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              post.status === 'published'
                                ? 'bg-green-900/20 text-green-400'
                                : post.status === 'draft'
                                ? 'bg-yellow-900/20 text-yellow-400'
                                : 'bg-blue-900/20 text-blue-400'
                            }`}
                          >
                            {post.status}
                          </span>
                          {post.isPremium && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-hot-coral/10 px-2.5 py-0.5 text-xs font-medium text-hot-coral">
                              Premium
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-warm-gray">
                          <div className="flex items-center space-x-4">
                            <span>{post.views.toLocaleString()} views</span>
                            <span>{post.likes} likes</span>
                            <span>{post.comments} comments</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-warm-gray">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : 'Not published'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <Link
                            to={`/dashboard/posts/${post.id}/edit`}
                            className="text-electric-sage hover:text-electric-sage/80 mr-4"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-hot-coral hover:text-hot-coral/80"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-charcoal text-white rounded-md hover:bg-charcoal/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-warm-gray">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-charcoal text-white rounded-md hover:bg-charcoal/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}