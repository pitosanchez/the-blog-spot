import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentService, uploadService } from '../../services';
import type { Post, CreatePostData, UpdatePostData, Category, Tag } from '../../services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    category: '',
    isPremium: false,
  });

  const [_post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load categories and tags
        const [categoriesData, tagsData] = await Promise.all([
          contentService.getCategories(),
          contentService.getTags(),
        ]);
        
        setCategories(categoriesData);
        setAvailableTags(tagsData);

        // Load post if editing
        if (isEditing && id) {
          const postData = await contentService.getPostById(id);
          setPost(postData);
          setFormData({
            title: postData.title,
            content: postData.content || '',
            excerpt: postData.excerpt || '',
            coverImage: postData.coverImage,
            tags: postData.tags,
            category: postData.category || '',
            isPremium: postData.isPremium,
          });
          setSelectedTags(postData.tags);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, isEditing]);


  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'draft') => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const data = {
        ...formData,
        tags: selectedTags,
      };

      if (isEditing && id) {
        const updateData: UpdatePostData = {
          ...data,
          status,
        };
        await contentService.updatePost(id, updateData);
      } else {
        await contentService.createPost(data);
      }

      navigate('/dashboard/posts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const optimizedFile = await uploadService.optimizeImage(file);
      const response = await uploadService.uploadImage(optimizedFile, {
        folder: 'posts',
      });
      
      setFormData((prev) => ({
        ...prev,
        coverImage: response.url,
      }));
    } catch (_err) {
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="mt-2 text-sm text-warm-gray">
            {isEditing ? 'Update your post content' : 'Write something amazing'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-900/20 border border-red-900/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, 'draft')} className="mt-8 space-y-8">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-warm-gray">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="mt-1 block w-full rounded-md bg-charcoal border-warm-gray/20 text-white shadow-sm focus:border-electric-sage focus:ring-electric-sage sm:text-sm"
            placeholder="Enter your post title"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-warm-gray">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="mt-1 block w-full rounded-md bg-charcoal border-warm-gray/20 text-white shadow-sm focus:border-electric-sage focus:ring-electric-sage sm:text-sm"
            placeholder="Brief description of your post"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-warm-gray">Cover Image</label>
          {formData.coverImage && (
            <div className="mt-2 relative">
              <img
                src={formData.coverImage}
                alt="Cover"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, coverImage: undefined })}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="mt-2">
            <label className="relative cursor-pointer rounded-md bg-charcoal px-4 py-2 text-sm text-electric-sage hover:bg-charcoal/80 inline-flex items-center">
              <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </label>
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-warm-gray">
            Content
          </label>
          <textarea
            id="content"
            rows={20}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            className="mt-1 block w-full rounded-md bg-charcoal border-warm-gray/20 text-white shadow-sm focus:border-electric-sage focus:ring-electric-sage sm:text-sm font-mono"
            placeholder="Write your post content here..."
          />
          <p className="mt-2 text-sm text-warm-gray">
            Supports Markdown formatting
          </p>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-warm-gray">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md bg-charcoal border-warm-gray/20 text-white shadow-sm focus:border-electric-sage focus:ring-electric-sage sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-warm-gray">Tags</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.name)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag.name)
                    ? 'bg-electric-sage text-ink-black'
                    : 'bg-charcoal text-warm-gray hover:text-white'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Premium Content */}
        <div className="flex items-center">
          <input
            id="isPremium"
            type="checkbox"
            checked={formData.isPremium}
            onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
            className="h-4 w-4 rounded border-warm-gray/20 bg-charcoal text-electric-sage focus:ring-electric-sage"
          />
          <label htmlFor="isPremium" className="ml-2 block text-sm text-warm-gray">
            Mark as premium content (subscribers only)
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard/posts')}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="secondary"
            disabled={isSaving}
          >
            {isSaving ? <LoadingSpinner /> : 'Save Draft'}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={(e) => handleSubmit(e as React.FormEvent, 'published')}
            disabled={isSaving}
          >
            {isSaving ? <LoadingSpinner /> : isEditing ? 'Update & Publish' : 'Publish'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}