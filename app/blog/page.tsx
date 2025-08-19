"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs`)
      .then((res) => res.json())
      .then((data) => setPosts(data.items));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Latest Blogs</h1>
      <div className="grid gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div className="p-6 rounded-xl border shadow hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600">{post.excerpt}</p>
              <div className="text-sm text-gray-500 mt-2">
                {post.category} • {post.reading_time} min read
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
