import { memo, useState } from "react";
import { Button } from "../ui/Button";
import { StoryRating } from "./StoryRating";

interface UserStory {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedDate: Date;
  readCount: number;
  likeCount: number;
  commentCount: number;
  averageRating: number;
  totalRatings: number;
}

interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedDate: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface UserStats {
  storiesPublished: number;
  totalReads: number;
  totalLikes: number;
  totalComments: number;
  averageRating: number;
  followersCount: number;
  followingCount: number;
  memberSince: Date;
}

interface UserProfileProps {
  userId: string;
  user: {
    name: string;
    bio?: string;
    avatar?: string;
    membershipTier: "free" | "storyteller" | "creator";
    isVerified?: boolean;
    location?: string;
    website?: string;
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
  stats: UserStats;
  stories?: UserStory[];
  achievements?: UserAchievement[];
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => Promise<void>;
  onMessage?: () => void;
}

const SAMPLE_STORIES: UserStory[] = [
  {
    id: "1",
    title: "Finding Home in Unexpected Places",
    excerpt:
      "A story about discovering belonging in the most unlikely circumstances...",
    category: "Family & Community",
    publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    readCount: 234,
    likeCount: 45,
    commentCount: 12,
    averageRating: 4.6,
    totalRatings: 23,
  },
  {
    id: "2",
    title: "The Corner Store Wisdom",
    excerpt:
      "Lessons learned from the neighborhood elder who ran our local store...",
    category: "Cornerstore Confessions",
    publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    readCount: 189,
    likeCount: 38,
    commentCount: 8,
    averageRating: 4.3,
    totalRatings: 19,
  },
];

const SAMPLE_ACHIEVEMENTS: UserAchievement[] = [
  {
    id: "1",
    title: "First Story",
    description: "Published your first story",
    icon: "📝",
    unlockedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    rarity: "common",
  },
  {
    id: "2",
    title: "Community Favorite",
    description: "Received 50+ likes on a single story",
    icon: "❤️",
    unlockedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    rarity: "rare",
  },
  {
    id: "3",
    title: "Rising Star",
    description: "Achieved 4.5+ average rating across all stories",
    icon: "⭐",
    unlockedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    rarity: "epic",
  },
];

export const UserProfile = memo<UserProfileProps>(
  ({
    userId: _userId,
    user,
    stats,
    stories = SAMPLE_STORIES,
    achievements = SAMPLE_ACHIEVEMENTS,
    isOwnProfile = false,
    isFollowing = false,
    onFollow,
    onMessage,
  }) => {
    const [activeTab, setActiveTab] = useState<
      "stories" | "achievements" | "activity"
    >("stories");
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    const getMembershipBadge = () => {
      switch (user.membershipTier) {
        case "creator":
          return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-bodega-brick text-white">
              <span className="mr-1">👑</span>
              Creator
            </span>
          );
        case "storyteller":
          return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-community-teal text-white">
              <span className="mr-1">✍️</span>
              Storyteller
            </span>
          );
        default:
          return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
              <span className="mr-1">👤</span>
              Community Member
            </span>
          );
      }
    };

    const getAchievementRarity = (rarity: string) => {
      switch (rarity) {
        case "legendary":
          return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
        case "epic":
          return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
        case "rare":
          return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const formatMemberSince = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    };

    const handleFollow = async () => {
      if (!onFollow) return;

      setIsFollowLoading(true);
      try {
        await onFollow();
      } catch (error) {
        console.error("Failed to follow user:", error);
      } finally {
        setIsFollowLoading(false);
      }
    };

    const renderStoryCard = (story: UserStory) => (
      <div
        key={story.id}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs bg-community-teal/10 text-community-teal px-2 py-1 rounded-full">
            {story.category}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(story.publishedDate)}
          </span>
        </div>

        <h3 className="font-bold text-lg text-vintage-ink mb-2 hover:text-bodega-brick cursor-pointer">
          {story.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{story.excerpt}</p>

        <div className="mb-3">
          <StoryRating
            storyId={story.id}
            averageRating={story.averageRating}
            totalRatings={story.totalRatings}
            size="sm"
            readonly
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="mr-1">👁️</span>
              {story.readCount}
            </span>
            <span className="flex items-center">
              <span className="mr-1">❤️</span>
              {story.likeCount}
            </span>
            <span className="flex items-center">
              <span className="mr-1">💬</span>
              {story.commentCount}
            </span>
          </div>
          <Button variant="ghost" size="sm">
            Read Story
          </Button>
        </div>
      </div>
    );

    const renderAchievement = (achievement: UserAchievement) => (
      <div
        key={achievement.id}
        className={`rounded-lg p-4 ${getAchievementRarity(achievement.rarity)}`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{achievement.icon}</span>
          <div className="flex-1">
            <h4 className="font-bold">{achievement.title}</h4>
            <p className="text-sm opacity-90">{achievement.description}</p>
            <p className="text-xs opacity-75 mt-1">
              Unlocked {formatDate(achievement.unlockedDate)}
            </p>
          </div>
        </div>
      </div>
    );

    return (
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-community-teal to-bodega-brick rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-vintage-ink">
                  {user.name}
                </h1>
                {user.isVerified && (
                  <span
                    className="text-blue-500 text-xl"
                    title="Verified member"
                  >
                    ✓
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3 mb-3">
                {getMembershipBadge()}
                <span className="text-gray-500">
                  Member since {formatMemberSince(stats.memberSince)}
                </span>
              </div>

              {user.bio && (
                <p className="text-gray-700 mb-3 max-w-2xl">{user.bio}</p>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {user.location && (
                  <span className="flex items-center">
                    <span className="mr-1">📍</span>
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-community-teal transition-colors"
                  >
                    <span className="mr-1">🔗</span>
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwnProfile && (
              <div className="flex space-x-3">
                <Button
                  variant={isFollowing ? "outline" : "primary"}
                  onClick={handleFollow}
                  loading={isFollowLoading}
                  disabled={isFollowLoading}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                {user.membershipTier !== "free" && (
                  <Button variant="ghost" onClick={onMessage}>
                    Message
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-bodega-brick">
              {stats.storiesPublished}
            </div>
            <div className="text-sm text-gray-600">Stories</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-community-teal">
              {stats.totalReads.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Reads</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-500">
              {stats.totalLikes}
            </div>
            <div className="text-sm text-gray-600">Likes</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-500">
              {stats.totalComments}
            </div>
            <div className="text-sm text-gray-600">Comments</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-purple-500">
              {stats.followersCount}
            </div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-500">
              {stats.followingCount}
            </div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: "stories", label: "Stories", count: stories.length },
                {
                  key: "achievements",
                  label: "Achievements",
                  count: achievements.length,
                },
                { key: "activity", label: "Activity", count: null },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-community-teal text-community-teal"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Stories Tab */}
            {activeTab === "stories" && (
              <div className="grid md:grid-cols-2 gap-6">
                {stories.map(renderStoryCard)}
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map(renderAchievement)}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-4">
                <div className="text-center py-12">
                  <p className="text-gray-600">Activity feed coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

UserProfile.displayName = "UserProfile";
