import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { creatorService } from '../services';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const benefits = [
  {
    title: '90% Revenue Share',
    description: 'Keep 90% of everything you earn. No hidden fees, no surprises.',
    icon: DollarIcon,
  },
  {
    title: 'Your Content, Your Rules',
    description: 'Set your own prices, create your own schedule, build your own brand.',
    icon: ShieldIcon,
  },
  {
    title: 'Built-in Audience',
    description: 'Access our growing community of readers hungry for quality content.',
    icon: UsersIcon,
  },
  {
    title: 'Professional Tools',
    description: 'Analytics, scheduling, and content management tools at your fingertips.',
    icon: ToolsIcon,
  },
];

export default function BecomeCreator() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bio: '',
    niche: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      youtube: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await creatorService.createCreatorProfile(formData);
      
      // Update user role in context
      if (state.user) {
        dispatch({
          type: 'SET_USER',
          payload: { ...state.user, role: 'contributor' },
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create creator profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-black">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Become a Creator
            </h1>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              Join thousands of creators earning a living doing what they love. 
              Share your expertise, build your audience, and keep 90% of everything you earn.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="#apply"
                className="rounded-md bg-electric-sage px-3.5 py-2.5 text-sm font-semibold text-ink-black shadow-sm hover:bg-electric-sage/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-sage"
              >
                Start Creating
              </a>
              <a href="/creators" className="text-sm font-semibold leading-6 text-electric-sage">
                Browse creators <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-electric-sage">Benefits</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to succeed
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <benefit.icon className="h-5 w-5 flex-none text-electric-sage" aria-hidden="true" />
                  {benefit.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-warm-gray">
                  <p className="flex-auto">{benefit.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Application Form */}
      <div id="apply" className="mx-auto max-w-2xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to start your journey?
          </h2>
          <p className="mt-4 text-lg text-warm-gray">
            Tell us about yourself and what you plan to create
          </p>
        </div>

        {error && (
          <div className="mt-6 bg-red-900/20 border border-red-900/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-warm-gray">
              Tell us about yourself
            </label>
            <textarea
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              className="mt-1 block w-full rounded-md bg-charcoal border-warm-gray/20 text-white shadow-sm focus:border-electric-sage focus:ring-electric-sage sm:text-sm"
              placeholder="Share your background, expertise, and what makes you unique..."
            />
          </div>

          <div>
            <label htmlFor="niche" className="block text-sm font-medium text-warm-gray">
              Your content niche
            </label>
            <select
              id="niche"
              value={formData.niche}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              required
              className="mt-1 block w-full rounded-md bg-charcoal border-warm-gray/20 text-white shadow-sm focus:border-electric-sage focus:ring-electric-sage sm:text-sm"
            >
              <option value="">Select a niche</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="health">Health & Wellness</option>
              <option value="education">Education</option>
              <option value="entertainment">Entertainment</option>
              <option value="food">Food & Cooking</option>
              <option value="travel">Travel</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-warm-gray">Social links (optional)</p>
            
            <div>
              <label htmlFor="twitter" className="block text-sm text-warm-gray">
                Twitter/X
              </label>
              <input
                type="url"
                id="twitter"
                value={formData.socialLinks.twitter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                  })
                }
                className="mt-1 block w-full rounded-md bg-charcoal border-warm-gray/20 text-white shadow-sm focus:border-electric-sage focus:ring-electric-sage sm:text-sm"
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm text-warm-gray">
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                  })
                }
                className="mt-1 block w-full rounded-md bg-charcoal border-warm-gray/20 text-white shadow-sm focus:border-electric-sage focus:ring-electric-sage sm:text-sm"
                placeholder="https://instagram.com/yourhandle"
              />
            </div>

            <div>
              <label htmlFor="youtube" className="block text-sm text-warm-gray">
                YouTube
              </label>
              <input
                type="url"
                id="youtube"
                value={formData.socialLinks.youtube}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                  })
                }
                className="mt-1 block w-full rounded-md bg-charcoal border-warm-gray/20 text-white shadow-sm focus:border-electric-sage focus:ring-electric-sage sm:text-sm"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? <LoadingSpinner /> : 'Become a Creator'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Icon components
function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ToolsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}