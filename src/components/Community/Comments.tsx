import { memo, useState, useCallback } from "react";
import { Button } from "../ui/Button";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
    membershipTier?: "free" | "storyteller" | "creator";
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
  isReported?: boolean;
  isModerated?: boolean;
}

interface CommentsProps {
  storyId: string;
  comments?: Comment[];
  currentUser?: {
    name: string;
    avatar?: string;
    membershipTier?: "free" | "storyteller" | "creator";
  };
  onAddComment?: (content: string, parentId?: string) => Promise<void>;
  onLikeComment?: (commentId: string) => Promise<void>;
  onReportComment?: (commentId: string, reason: string) => Promise<void>;
  allowComments?: boolean;
  moderationEnabled?: boolean;
}

const SAMPLE_COMMENTS: Comment[] = [
  {
    id: "1",
    author: {
      name: "Maya Rodriguez",
      avatar: "/avatars/maya.jpg",
      isVerified: true,
      membershipTier: "creator",
    },
    content:
      "This story really resonated with me. Thank you for sharing such a personal and powerful experience. Your courage in telling this story will help so many others.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: "1-1",
        author: {
          name: "Alex Chen",
          membershipTier: "storyteller",
        },
        content:
          "I completely agree. Stories like this are why I love this community.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        likes: 3,
        isLiked: true,
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Jordan Thompson",
      membershipTier: "free",
    },
    content:
      "Beautiful writing! The way you described the emotions really brought me into the moment.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 8,
    isLiked: false,
  },
  {
    id: "3",
    author: {
      name: "Sam Williams",
      isVerified: true,
      membershipTier: "storyteller",
    },
    content:
      "This reminds me of my own experience. Thank you for creating a space where we can share these important stories.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 15,
    isLiked: true,
  },
];

export const Comments = memo<CommentsProps>(
  ({
    storyId: _storyId,
    comments = SAMPLE_COMMENTS,
    currentUser,
    onAddComment,
    onLikeComment,
    onReportComment,
    allowComments = true,
    moderationEnabled = true,
  }) => {
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reportingComment, setReportingComment] = useState<string | null>(
      null
    );

    const formatTimeAgo = (date: Date) => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else {
        return `${diffDays}d ago`;
      }
    };

    const getMembershipBadge = (tier?: string) => {
      switch (tier) {
        case "creator":
          return (
            <span className="text-xs bg-bodega-brick text-white px-2 py-1 rounded-full">
              Creator
            </span>
          );
        case "storyteller":
          return (
            <span className="text-xs bg-community-teal text-white px-2 py-1 rounded-full">
              Storyteller
            </span>
          );
        default:
          return null;
      }
    };

    const handleSubmitComment = useCallback(async () => {
      if (!newComment.trim() || !currentUser) return;

      setIsSubmitting(true);
      try {
        if (onAddComment) {
          await onAddComment(newComment);
        }
        setNewComment("");
      } catch (error) {
        console.error("Failed to add comment:", error);
      } finally {
        setIsSubmitting(false);
      }
    }, [newComment, currentUser, onAddComment]);

    const handleSubmitReply = useCallback(
      async (parentId: string) => {
        if (!replyContent.trim() || !currentUser) return;

        setIsSubmitting(true);
        try {
          if (onAddComment) {
            await onAddComment(replyContent, parentId);
          }
          setReplyContent("");
          setReplyingTo(null);
        } catch (error) {
          console.error("Failed to add reply:", error);
        } finally {
          setIsSubmitting(false);
        }
      },
      [replyContent, currentUser, onAddComment]
    );

    const handleLike = useCallback(
      async (commentId: string) => {
        if (onLikeComment) {
          await onLikeComment(commentId);
        }
      },
      [onLikeComment]
    );

    const handleReport = useCallback(
      async (commentId: string, reason: string) => {
        if (onReportComment) {
          await onReportComment(commentId, reason);
        }
        setReportingComment(null);
      },
      [onReportComment]
    );

    const renderComment = (comment: Comment, isReply = false) => (
      <div key={comment.id} className={`${isReply ? "ml-8" : ""} mb-6`}>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-community-teal to-bodega-brick rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {comment.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-vintage-ink">
                    {comment.author.name}
                  </span>
                  {comment.author.isVerified && (
                    <span className="text-blue-500" title="Verified member">
                      ✓
                    </span>
                  )}
                  {getMembershipBadge(comment.author.membershipTier)}
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(comment.timestamp)}
                </span>
              </div>
            </div>

            {/* Comment Actions */}
            <div className="flex items-center space-x-2">
              {moderationEnabled && (
                <button
                  onClick={() => setReportingComment(comment.id)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                  title="Report comment"
                >
                  ⚠️
                </button>
              )}
            </div>
          </div>

          {/* Comment Content */}
          <p className="text-gray-700 mb-3 leading-relaxed">
            {comment.content}
          </p>

          {/* Comment Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLike(comment.id)}
                className={`flex items-center space-x-1 text-sm transition-colors ${
                  comment.isLiked
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-500"
                }`}
              >
                <span>{comment.isLiked ? "❤️" : "🤍"}</span>
                <span>{comment.likes}</span>
              </button>

              {!isReply && (
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                  className="text-sm text-gray-500 hover:text-community-teal transition-colors"
                >
                  Reply
                </button>
              )}
            </div>
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && currentUser && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-community-teal to-bodega-brick rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a thoughtful reply..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-community-teal focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim() || isSubmitting}
                      loading={isSubmitting}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}

        {/* Report Modal */}
        {reportingComment === comment.id && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-vintage-ink mb-4">
                Report Comment
              </h3>
              <p className="text-gray-600 mb-4">
                Why are you reporting this comment?
              </p>
              <div className="space-y-2 mb-6">
                {[
                  "Inappropriate content",
                  "Harassment",
                  "Spam",
                  "Misinformation",
                  "Other",
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleReport(comment.id, reason)}
                    className="block w-full text-left p-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setReportingComment(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    if (!allowComments) {
      return (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">Comments are disabled for this story.</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        {/* Comments Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-vintage-ink mb-2">
            Community Discussion
          </h3>
          <p className="text-gray-600">
            Share your thoughts and connect with fellow storytellers.
            {comments.length > 0 &&
              ` ${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Add Comment Form */}
        {currentUser && (
          <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-community-teal to-bodega-brick rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this story..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-community-teal focus:border-transparent"
                  rows={4}
                />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500">
                    Be respectful and constructive in your comments.
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                    loading={isSubmitting}
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => renderComment(comment))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Be the first to share your thoughts on this story!
              </p>
              {!currentUser && (
                <Button variant="primary" href="/membership">
                  Join the Community
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Comments.displayName = "Comments";
