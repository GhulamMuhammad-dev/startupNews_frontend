"use client";
import React from "react";
import Link from "next/link";
import { Clock, TrendingUp, Star, Eye, MessageCircle, Zap } from "lucide-react";

interface Blog {
  id?: string | number;
  title: string;
  excerpt?: string;
  slug: string;
  tags?: string[];
  generated_at?: string;
  reading_time?: number;
  reading_time_minutes?: number;
  author?: string;
  featured_image?: string;
  category?: string;
  views?: number;
  likes?: number;
  comments?: number;
}

interface MagazineBlogCardProps {
  blog: Blog;
  priority?: boolean; // For featured articles
}

export default function MagazineBlogCard({ blog, priority = false }: MagazineBlogCardProps) {
  const readingTime = blog.reading_time || blog.reading_time_minutes || 3;
  
  const date = blog.generated_at
    ? new Date(blog.generated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  // Generate different header colors based on category or priority
  const getHeaderGradient = () => {
    if (priority) return "from-red-500 via-orange-500 to-yellow-500";
    
    const gradients = {
      Technology: "from-blue-500 via-purple-500 to-indigo-500",
      Design: "from-pink-500 via-rose-500 to-red-500",
      Marketing: "from-green-500 via-emerald-500 to-teal-500",
      Business: "from-gray-600 via-gray-700 to-gray-800",
      Lifestyle: "from-purple-400 via-pink-400 to-red-400",
    };
    
    return gradients[blog.category as keyof typeof gradients] || "from-orange-400 via-red-500 to-pink-500";
  };

  // const getImageFallback = () => {
  //   const colors = ['from-blue-400 to-blue-600', 'from-green-400 to-green-600', 'from-purple-400 to-purple-600', 'from-red-400 to-red-600'];
  //   const colorIndex = (blog.title?.length || 0) % colors.length;
  //   return colors[colorIndex];
  // };

  return (
    <div className="group perspective-1000">
      <article className="relative transform transition-all duration-500 hover:rotate-y-12 hover:-translate-y-4 hover:scale-105">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
          {/* Magazine Header */}
          <div className={`bg-gradient-to-r ${getHeaderGradient()} p-4 text-white relative overflow-hidden`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)',
              }}></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                {priority ? (
                  <>
                    <Zap className="w-5 h-5 animate-pulse" />
                    <span className="font-black text-sm tracking-wider">FEATURED</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold text-sm tracking-wider">
                      {blog.category?.toUpperCase() || "ARTICLE"}
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs opacity-90 font-mono">
                {date}
              </span>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 leading-tight mb-3 transform group-hover:scale-105 transition-transform duration-300">
                  {blog.title}
                </h3>
                
                {blog.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                )}
                
                {/* Stats Bar */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  {blog.views && (
                    <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                      <Eye className="w-3 h-3" />
                      {blog.views.toLocaleString()} views
                    </span>
                  )}
                  {blog.likes && (
                    <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {blog.likes} likes
                    </span>
                  )}
                  {blog.comments && (
                    <span className="flex items-center gap-1 hover:text-green-600 transition-colors">
                      <MessageCircle className="w-3 h-3" />
                      {blog.comments} comments
                    </span>
                  )}
                  <span className="flex items-center gap-1 ml-auto">
                    <Clock className="w-3 h-3" />
                    {readingTime} min read
                  </span>
                </div>
                
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-black text-white text-xs font-bold rounded transform hover:scale-110 hover:bg-gray-800 transition-all cursor-pointer"
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Side Image */}
              {/* <div className="w-24 h-32 rounded-lg overflow-hidden transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                {blog.featured_image ? (
                  <img 
                    src={blog.featured_image} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getImageFallback()} flex items-center justify-center text-white text-2xl font-bold`}>
                    {blog.title?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
              </div> */}
            </div>
            
            {/* Bottom Action Bar */}
            <div className="mt-6 pt-4 border-t-2 border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                  {blog.author ? blog.author.split(' ').map(n => n[0]).join('').slice(0, 2) : 'A'}
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {blog.author || 'Startup Blog'}
                </span>
              </div>
              
              <Link href={`/posts/${blog.slug}`}>
                <button className="bg-black text-white px-4 py-2 rounded-full text-xs font-black hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                  READ NOW →
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Layered Shadow Elements */}
        <div className="absolute inset-0 -z-10 transform translate-x-2 translate-y-2 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl opacity-50 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500"></div>
        <div className="absolute inset-0 -z-20 transform translate-x-4 translate-y-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl opacity-30 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
      </article>
    </div>
  );
}