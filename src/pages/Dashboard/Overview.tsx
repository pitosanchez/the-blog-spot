import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { creatorService } from '../../services';
import type { CreatorDashboard } from '../../services';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function DashboardOverview() {
  const [dashboard, setDashboard] = useState<CreatorDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await creatorService.getCreatorDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const stats = [
    {
      name: 'Total Earnings',
      value: `$${dashboard.stats.totalEarnings.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
    },
    {
      name: 'Monthly Earnings',
      value: `$${dashboard.stats.monthlyEarnings.toLocaleString()}`,
      change: '+8.2%',
      changeType: 'positive',
    },
    {
      name: 'Subscribers',
      value: dashboard.stats.subscribers.toLocaleString(),
      change: '+15.3%',
      changeType: 'positive',
    },
    {
      name: 'Published Posts',
      value: dashboard.stats.posts.toLocaleString(),
      change: '+4 this week',
      changeType: 'neutral',
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Dashboard Overview</h1>
          <p className="mt-2 text-sm text-warm-gray">
            Welcome back! Here's what's happening with your content.
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

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-charcoal px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <p className="text-sm font-medium text-warm-gray">{stat.name}</p>
            </dt>
            <dd className="flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'positive'
                    ? 'text-electric-sage'
                    : stat.changeType === 'negative'
                    ? 'text-hot-coral'
                    : 'text-warm-gray'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Earnings Overview */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg bg-charcoal shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-white">Earnings</h3>
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-warm-gray">Available for payout</p>
                  <p className="text-2xl font-semibold text-electric-sage">
                    ${dashboard.earnings.available.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-warm-gray">Pending clearance</p>
                  <p className="text-2xl font-semibold text-warm-gray">
                    ${dashboard.earnings.pending.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 border-t border-warm-gray/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-gray">Next payout</span>
                  <span className="text-white">
                    {new Date(dashboard.earnings.nextPayoutDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-charcoal shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-white">Recent Subscribers</h3>
            <div className="mt-5 flow-root">
              <ul className="-my-5 divide-y divide-warm-gray/10">
                {dashboard.recentSubscribers.slice(0, 5).map((subscriber) => (
                  <li key={subscriber.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {subscriber.avatar ? (
                          <img
                            className="h-8 w-8 rounded-full"
                            src={subscriber.avatar}
                            alt={subscriber.name}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-electric-sage/20 flex items-center justify-center">
                            <span className="text-electric-sage text-sm font-bold">
                              {subscriber.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {subscriber.name}
                        </p>
                        <p className="truncate text-sm text-warm-gray">
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full bg-electric-sage/10 px-2.5 py-0.5 text-xs font-medium text-electric-sage">
                          {subscriber.tier}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/dashboard/subscribers"
                className="text-sm font-medium text-electric-sage hover:text-electric-sage/80 transition-colors"
              >
                View all subscribers →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mt-8">
        <div className="rounded-lg bg-charcoal shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-white">Recent Posts</h3>
            <div className="mt-5">
              <div className="overflow-hidden rounded-md bg-ink-black/50">
                <ul className="divide-y divide-warm-gray/10">
                  {dashboard.recentPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        to={`/dashboard/posts/${post.id}/edit`}
                        className="block hover:bg-ink-black/30 px-4 py-4 sm:px-6 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {post.title}
                            </p>
                            <p className="text-sm text-warm-gray">
                              {post.views.toLocaleString()} views • {post.likes} likes • {post.comments} comments
                            </p>
                          </div>
                          <div className="ml-4 flex items-center space-x-4">
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
                              <span className="inline-flex items-center rounded-full bg-hot-coral/10 px-2.5 py-0.5 text-xs font-medium text-hot-coral">
                                Premium
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  to="/dashboard/posts"
                  className="text-sm font-medium text-electric-sage hover:text-electric-sage/80 transition-colors"
                >
                  View all posts →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}