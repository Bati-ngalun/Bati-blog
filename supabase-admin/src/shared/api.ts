import { supabase } from '@/lib/supabase';
import { Post, Category, Image, BlogStats } from './types';
import { ADMIN_TOKEN } from './constants';

const FUNCTION_NAME = 'blog-api';

// Public API calls (no auth required)
export const publicApi = {
  async getPosts(params?: { 
    limit?: number; 
    offset?: number; 
    category?: string;
    featured?: boolean;
  }): Promise<{ data: Post[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.featured) searchParams.set('featured', 'true');

    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      method: 'GET',
      body: null,
      headers: {}
    });

    // For GET requests, we need to use the query params differently
    const response = await fetch(
      `${supabase.supabaseUrl}/functions/v1/${FUNCTION_NAME}?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return { data: result.data || [], total: result.total || 0 };
  },

  async getPost(slug: string): Promise<Post> {
    const response = await fetch(
      `${supabase.supabaseUrl}/functions/v1/${FUNCTION_NAME}?slug=${slug}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }
};

// Admin API calls (auth required)
export const adminApi = {
  async getAllPosts(): Promise<Post[]> {
    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'get-all-posts' },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data || [];
  },

  async createPost(post: Partial<Post>): Promise<Post> {
    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'create-post', ...post },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'update-post', id, ...post },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async deletePost(id: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'delete-post', id },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'get-categories' },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data || [];
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'create-category', ...category },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'delete-category', id },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
  },

  async getImages(): Promise<Image[]> {
    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'get-images' },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data || [];
  },

  async uploadImage(file: File): Promise<Image> {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    const imageRecord = {
      name: file.name,
      url: urlData.publicUrl,
      alt_text: file.name.replace(/\.[^/.]+$/, ''),
      size: file.size,
      mime_type: file.type,
      folder: 'general'
    };

    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'upload-image-record', ...imageRecord },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async deleteImage(id: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'delete-image', id },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
  },

  async getStats(): Promise<BlogStats> {
    const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
      body: { action: 'get-stats' },
      headers: { 'x-admin-token': ADMIN_TOKEN }
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);
    return data.data;
  }
};
