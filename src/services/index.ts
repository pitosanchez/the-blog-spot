// Export all services from a single entry point
export { authService } from './auth.service';
export { apiClient, ApiError } from './api.client';
export { creatorService } from './creator.service';
export { contentService } from './content.service';
export { subscriptionService } from './subscription.service';
export { paymentService } from './payment.service';
export { userService } from './user.service';
export { searchService } from './search.service';
export { uploadService } from './upload.service';

// Export types
export type {
  LoginCredentials,
  SignupData,
  AuthResponse,
} from './auth.service';

export type {
  Creator,
  CreatorStats,
  Post,
  Subscriber,
  CreatorDashboard,
  CreatorsListParams,
  PaginatedResponse,
} from './creator.service';

export type {
  CreatePostData,
  UpdatePostData,
  PostsListParams,
  Category,
  Tag,
  Comment,
} from './content.service';

export type {
  Subscription,
  SubscriptionTier,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  SubscriptionInvoice,
} from './subscription.service';

export type {
  PaymentMethod,
  PaymentIntent,
  PaymentHistory,
  CreatePaymentMethodData,
  CreatePaymentIntentData,
  PayoutSettings,
} from './payment.service';

export type {
  UserProfile,
  UpdateProfileData,
  UserPreferences,
  ChangePasswordData,
  DeleteAccountData,
} from './user.service';

export type {
  SearchFilters,
  SearchResult,
  GlobalSearchResult,
} from './search.service';

export type {
  UploadResponse,
  UploadProgress,
  UploadType,
  ImageTransformOptions,
} from './upload.service';