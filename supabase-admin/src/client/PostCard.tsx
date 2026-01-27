import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '@/shared/types';
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (featured) {
    return (
      <Link
        to={`/post/${post.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={post.featured_image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {post.categories && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-[#FF6B35] text-white text-xs font-medium rounded-full">
              {post.categories.name}
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.read_time} min read
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/post/${post.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.featured_image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {post.categories && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#FF6B35] text-white text-xs font-medium rounded-full">
            {post.categories.name}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.read_time} min
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.views}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center text-[#FF6B35] text-sm font-medium group-hover:gap-2 transition-all">
          Read More
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
