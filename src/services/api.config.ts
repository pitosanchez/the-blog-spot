export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh',
  },

  // User endpoints
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    AVATAR: '/users/avatar',
    DELETE_ACCOUNT: '/users/delete',
  },

  // Creator endpoints
  CREATORS: {
    LIST: '/creators',
    DETAIL: (id: string) => `/creators/${id}`,
    POSTS: (id: string) => `/creators/${id}/posts`,
    SUBSCRIBE: (id: string) => `/creators/${id}/subscribe`,
    UNSUBSCRIBE: (id: string) => `/creators/${id}/unsubscribe`,
    DASHBOARD: '/creators/dashboard',
    ANALYTICS: '/creators/analytics',
    EARNINGS: '/creators/earnings',
    PAYOUTS: '/creators/payouts',
  },

  // Content endpoints
  CONTENT: {
    POSTS: '/posts',
    POST_DETAIL: (id: string) => `/posts/${id}`,
    CREATE_POST: '/posts',
    UPDATE_POST: (id: string) => `/posts/${id}`,
    DELETE_POST: (id: string) => `/posts/${id}`,
    PUBLISH_POST: (id: string) => `/posts/${id}/publish`,
    UNPUBLISH_POST: (id: string) => `/posts/${id}/unpublish`,
    CATEGORIES: '/posts/categories',
    TAGS: '/posts/tags',
  },

  // Workshop endpoints
  WORKSHOPS: {
    LIST: '/workshops',
    DETAIL: (id: string) => `/workshops/${id}`,
    CREATE: '/workshops',
    UPDATE: (id: string) => `/workshops/${id}`,
    DELETE: (id: string) => `/workshops/${id}`,
    ENROLL: (id: string) => `/workshops/${id}/enroll`,
    PARTICIPANTS: (id: string) => `/workshops/${id}/participants`,
  },

  // Subscription endpoints
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
    ACTIVE: '/subscriptions/active',
    CREATE: '/subscriptions',
    CANCEL: (id: string) => `/subscriptions/${id}/cancel`,
    UPDATE: (id: string) => `/subscriptions/${id}`,
    HISTORY: '/subscriptions/history',
  },

  // Payment endpoints
  PAYMENTS: {
    METHODS: '/payments/methods',
    ADD_METHOD: '/payments/methods',
    REMOVE_METHOD: (id: string) => `/payments/methods/${id}`,
    SET_DEFAULT: (id: string) => `/payments/methods/${id}/default`,
    HISTORY: '/payments/history',
    CREATE_INTENT: '/payments/create-intent',
    CONFIRM_PAYMENT: '/payments/confirm',
  },

  // Comment endpoints
  COMMENTS: {
    LIST: (postId: string) => `/posts/${postId}/comments`,
    CREATE: (postId: string) => `/posts/${postId}/comments`,
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
    LIKE: (id: string) => `/comments/${id}/like`,
    UNLIKE: (id: string) => `/comments/${id}/unlike`,
    REPORT: (id: string) => `/comments/${id}/report`,
  },

  // Search endpoints
  SEARCH: {
    POSTS: '/search/posts',
    CREATORS: '/search/creators',
    WORKSHOPS: '/search/workshops',
    GLOBAL: '/search',
  },

  // Analytics endpoints
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    POSTS: '/analytics/posts',
    SUBSCRIBERS: '/analytics/subscribers',
    REVENUE: '/analytics/revenue',
    ENGAGEMENT: '/analytics/engagement',
  },

  // Upload endpoints
  UPLOAD: {
    IMAGE: '/upload/image',
    VIDEO: '/upload/video',
    DOCUMENT: '/upload/document',
    AVATAR: '/upload/avatar',
  },
};