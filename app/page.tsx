"use client";
import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import { 
  Zap, 
  RefreshCw, 
  TrendingUp, 
  Activity,
  Sparkles,
  ChevronRight,
  Globe,
  Clock
} from "lucide-react";

export default function Home() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [progress, setProgress] = useState<string[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/blogs`);
      const data = await res.json();
      setBlogs(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // Set initial time on client-side only
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const startScraping = () => {
    setProgress([]);
    setIsScraping(true);
    const es = new EventSource(`${API_BASE}/api/v1/scrape/stream`);

    es.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.step) setProgress((p) => [...p, d.step]);

        if (d.step && d.step.toLowerCase().includes("done")) {
          es.close();
          setIsScraping(false);
          fetchBlogs();
        }
      } catch (_) {
        setProgress((p) => [...p, e.data]);
      }
    };

    es.onerror = () => {
      es.close();
      setIsScraping(false);
    };
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,.1) 20px, rgba(255,255,255,.1) 40px)',
            }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <div className="text-center text-white mb-12">
              <div className="flex justify-center items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-orange-400 font-bold text-sm tracking-wider uppercase">
                  AI-Powered Intelligence
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                🚀 Startup <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Insights</span>
              </h1>
              
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-3xl mx-auto font-light mb-8">
                Curated news, deep dives & tips for founders — generated daily by AI.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={startScraping}
                  disabled={isScraping}
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-bold hover:from-orange-600 hover:to-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  {isScraping ? (
                    <>
                      <Activity className="w-5 h-5 animate-pulse" />
                      <span>Scraping...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>Generate 10 Posts</span>
                    </>
                  )}
                </button>

                <button
                  onClick={fetchBlogs}
                  className="group flex items-center gap-3 px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/40"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-black text-orange-400 mb-2">{blogs.length}</div>
                <div className="text-white/80 font-medium">Articles Generated</div>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-black text-orange-400 mb-2">24/7</div>
                <div className="text-white/80 font-medium">AI Monitoring</div>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-black text-orange-400 mb-2">100+</div>
                <div className="text-white/80 font-medium">Sources Tracked</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Progress Section */}
        {progress.length > 0 && (
          <section className="mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h4 className="text-xl font-bold">Pipeline Progress</h4>
                </div>
                <p className="text-white/90 text-sm">Real-time updates from our content generation system</p>
              </div>
              
              <div className="p-6">
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {progress.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-700 text-sm font-medium">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Latest Insights</h2>
            <p className="text-gray-600">Fresh perspectives and actionable advice for startup founders</p>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Updated {currentTime || "recently"}</span>
          </div>
        </div>

        {/* Blog Cards Grid */}
        {blogs.length > 0 ? (
          <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: any, index: number) => (
              <div
                key={blog.slug}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
                className="animate-fade-in-up"
              >
                <BlogCard blog={blog} />
              </div>
            ))}
          </section>
        ) : !isScraping ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center">
              <Globe className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Articles Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Generate your first batch of AI-powered startup insights and stay ahead of the curve!
            </p>
            <button
              onClick={startScraping}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full font-bold hover:from-orange-600 hover:to-red-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Get Started
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center">
              <Activity className="w-12 h-12 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Generating Content...</h3>
            <p className="text-gray-600">Our AI is working hard to curate the latest startup insights for you.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}