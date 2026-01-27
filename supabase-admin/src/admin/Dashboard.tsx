import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Post, BlogStats } from '@/shared/types';
import { 
  FileText, 
  Eye, 
  FolderOpen, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Loader2,
  Calendar
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<BlogStats>({ totalPosts: 0, totalViews: 0, totalCategories: 0 });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch stats
      const [postsRes, categoriesRes] = await Promise.all([
        supabase.from('posts').select('views'),
        supabase.from('categories').select('id', { count: 'exact' })
      ]);

      const totalViews = postsRes.data?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

      setStats({
        totalPosts: postsRes.data?.length || 0,
        totalViews,
        totalCategories: categoriesRes.count || 0
      });

      // Fetch recent posts
      const { data: posts } = await supabase
        .from('posts')
        .select('*, categories(name, slug)')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentPosts(posts || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statCards = [
    { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'bg-green-500' },
    { label: 'Categories', value: stats.totalCategories, icon: FolderOpen, color: 'bg-purple-500' },
    { label: 'Avg. Views/Post', value: stats.totalPosts > 0 ? Math.round(stats.totalViews / stats.totalPosts) : 0, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your blog admin panel</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1A1A2E]">Recent Posts</h2>
          <Link
            to="/admin/posts"
            className="text-sm text-[#FF6B35] hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentPosts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No posts yet</p>
              <Link
                to="/admin/posts/new"
                className="inline-flex items-center gap-2 mt-4 text-[#FF6B35] hover:underline"
              >
                <Plus className="w-4 h-4" />
                Create your first post
              </Link>
            </div>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/admin/posts/edit/${post.id}`}
                    className="font-medium text-[#1A1A2E] hover:text-[#FF6B35] transition-colors line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {post.status}
                    </span>
                    {post.categories && (
                      <span className="text-gray-400">{post.categories.name}</span>
                    )}
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Eye className="w-4 h-4" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 mt-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.created_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <Link
          to="/admin/posts/new"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#FF6B35] hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#FF6B35] transition-colors">
            <Plus className="w-6 h-6 text-[#FF6B35] group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-semibold text-[#1A1A2E]">Create New Post</h3>
          <p className="text-gray-500 text-sm mt-1">Write and publish a new blog post</p>
        </Link>
        <Link
          to="/admin/media"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#FF6B35] hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
            <FileText className="w-6 h-6 text-purple-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-semibold text-[#1A1A2E]">Media Library</h3>
          <p className="text-gray-500 text-sm mt-1">Upload and manage images</p>
        </Link>
        <Link
          to="/admin/categories"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#FF6B35] hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
            <FolderOpen className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-semibold text-[#1A1A2E]">Categories</h3>
          <p className="text-gray-500 text-sm mt-1">Organize your content</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
