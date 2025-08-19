"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/${slug}`)
        .then((res) => res.json())
        .then((data) => setPost(data.item));
    }
  }, [slug]);

  if (!post) {
    return <div className="max-w-3xl mx-auto py-12 text-center">Loading blog...</div>;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero Image */}
      <div className="mb-8">
        <img
          src={post.cover_image || "https://source.unsplash.com/1600x900/?startup,technology"}
          alt={post.title}
          className="w-full h-64 object-cover rounded-2xl shadow-md"
        />
      </div>

      {/* Title + Meta */}
      <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
      <p className="text-gray-500 mb-6">
        {post.category} • {post.reading_time} min read
      </p>

      {/* Excerpt */}
      <p className="text-lg italic text-gray-600 mb-8">{post.excerpt}</p>

      {/* Body (LLM generated) */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Sources */}
      {post.source_urls?.length > 0 && (
        <div className="mt-12 border-t pt-6">
          <h3 className="font-semibold mb-2">Sources</h3>
          <ul className="list-disc list-inside text-blue-600">
            {post.source_urls.map((url: string) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
