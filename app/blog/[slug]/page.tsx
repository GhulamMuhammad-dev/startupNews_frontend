"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface BlogPost {
  cover_image?: string;
  title: string;
  category?: string;
  reading_time_minutes?: number;
  reading_time?: number;
  excerpt?: string;
  body: string;
  tags?: string[];
  source_urls?: string[];
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs/${slug}`;
      console.log("Fetching blog from:", url);

      try {
        const res = await fetch(url);
        console.log("Response status:", res.status);
        console.log("Response content-type:", res.headers.get("content-type"));

        const rawText = await res.text();
        console.log("Raw API response:", rawText.slice(0, 200));

        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }

        if (!res.headers.get("content-type")?.includes("application/json")) {
          throw new Error(
            "API did not return JSON. Response starts with: " + rawText.slice(0, 50)
          );
        }

        const data = JSON.parse(rawText);
        if (data?.item) {
          setPost(data.item as BlogPost);
        } else {
          throw new Error("Parsed JSON missing 'item' field.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Failed to load blog:", err);
          setError(err.message);
        } else {
          setError("Failed to load blog post.");
        }
      }
    };

    fetchBlog();
  }, [slug]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-red-600">
        <h2>Error loading blog</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!post) {
    return <div className="max-w-3xl mx-auto py-12 text-center">Loading blog...</div>;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 relative w-full h-64">
        <Image
          src={post.cover_image || "https://source.unsplash.com/1600x900/?startup,technology"}
          alt={post.title}
          fill
          className="object-cover rounded-2xl shadow-md"
          priority
        />
      </div>

      <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
      <p className="text-gray-500 mb-6">
        {post.category} • {post.reading_time_minutes || post.reading_time} min read
      </p>
      {post.excerpt && (
        <p className="text-lg italic text-gray-600 mb-8">{post.excerpt}</p>
      )}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      {(post.tags?.length ?? 0) > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags!.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {(post.source_urls?.length ?? 0) > 0 && (
        <div className="mt-12 border-t pt-6">
          <h3 className="font-semibold mb-2">Sources</h3>
          <ul className="list-disc list-inside text-blue-600">
            {post.source_urls!.map((url) => (
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
