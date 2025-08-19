"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, Clock, ArrowLeft, 
  Eye, User, ExternalLink,  ChevronUp
} from "lucide-react";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/blogs/${slug}`);
        const data = await res.json();
        setBlog(data.item || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
      setShowScrollTop(scrollTop > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: Array.isArray(blog.body) ? blog.body.join(" ") : blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getHeaderGradient = () => {
    const gradients = {
      Technology: "from-blue-500 via-purple-500 to-indigo-500",
      Design: "from-pink-500 via-rose-500 to-red-500",
      Marketing: "from-green-500 via-emerald-500 to-teal-500",
      Business: "from-gray-600 via-gray-700 to-gray-800",
      Lifestyle: "from-purple-400 via-pink-400 to-red-400",
    };
    return gradients[blog?.category as keyof typeof gradients] || "from-orange-400 via-red-500 to-pink-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = blog.reading_time || blog.reading_time_minutes || 3;
  const date = blog.generated_at
    ? new Date(blog.generated_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  // Parse blog body JSON string into array if needed
  let bodyContent: string[] = [];
  try {
    bodyContent = typeof blog.body === "string" ? JSON.parse(blog.body) : blog.body;
  } catch (err) {
    console.error("Failed to parse blog body:", err);
    bodyContent = [blog.body]; // fallback
  }

  return (
    <>
      {/* Reading Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-150 ease-out" style={{ width: `${readingProgress}%` }} />
      </div>

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className={`bg-gradient-to-r ${getHeaderGradient()} relative`}>
          <div className="relative max-w-4xl mx-auto px-6 py-12 text-center text-white">
            <Link href="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-white/90 hover:text-white transition">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">{blog.title}</h1>
            {blog.excerpt && <p className="text-xl md:text-2xl opacity-90">{blog.excerpt}</p>}

            {/* Meta */}
            <div className="flex flex-wrap justify-center gap-6 mt-6 text-white/90 text-sm">
              <div className="flex items-center gap-2"><User className="w-4 h-4" /> {blog.author || 'Anonymous'}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {date}</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {readingTime} min read</div>
              {blog.views && <div className="flex items-center gap-2"><Eye className="w-4 h-4" /> {blog.views.toLocaleString()} views</div>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800 leading-relaxed text-lg space-y-8">
          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm cursor-pointer hover:bg-gray-800">#{tag}</span>
              ))}
            </div>
          )}

          {/* Article */}
          <article className="space-y-8">
            {bodyContent.map((paragraph, idx) => (
              <p key={idx} className="text-gray-700 text-lg leading-8">{paragraph}</p>
            ))}
          </article>

          {/* Sources */}
          {blog.source_urls?.length > 0 && (
            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5" /> Sources & References
              </h3>
              <ul className="space-y-2">
                {blog.source_urls.map((url: string, i: number) => (
                  <li key={url} className="flex items-start gap-2">
                    <span className="text-gray-400 text-sm mt-1 font-mono">[{i + 1}]</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm hover:underline break-all flex items-center gap-1">
                      {url} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Scroll Top */}
        {showScrollTop && (
          <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-110">
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
      </main>
    </>
  );
}
