// Blog.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogPosts } from './blogData';

const NAV_H = 108;

export default function Blog() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // SEO Meta tags
    document.title = 'Research Blog | OncoTrace-AI - Precision Oncology Insights';
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Explore cutting-edge research in AI-powered cancer detection, liquid biopsy, ctDNA analysis, and precision oncology from OncoTrace-AI.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Explore cutting-edge research in AI-powered cancer detection, liquid biopsy, ctDNA analysis, and precision oncology from OncoTrace-AI.';
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'oncology research, cancer AI, liquid biopsy, ctDNA, precision medicine, cancer detection');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'oncology research, cancer AI, liquid biopsy, ctDNA, precision medicine, cancer detection';
      document.head.appendChild(meta);
    }
  }, []);

  const handlePostClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white"
      style={{ paddingTop: NAV_H, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Hero Header */}
      <section className="relative py-12 md:py-16 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-60" />
        
        <div className="relative max-w-[1400px] mx-auto text-center">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 md:mb-6 leading-tight tracking-tight px-2"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            OncoTrace-AI Blog
          </h1>
          
          <p className="text-sm md:text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed px-4">
            Exploring the intersection of artificial intelligence, molecular biology, and precision oncology.
            Evidence-based insights into the future of cancer care.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 pb-16 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
          {blogPosts.map((post, index) => (
            <article
              key={post.id}
              onClick={() => handlePostClick(post.slug)}
              className="group relative bg-white rounded-xl md:rounded-2xl border border-slate-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-1"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Featured Badge */}
              {post.featured && (
                <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
                  <span className="inline-flex items-center gap-1 md:gap-1.5 px-2 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[0.65rem] md:text-xs font-bold rounded-full shadow-lg">
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
                </div>
              )}

              {/* Category Tag */}
              <div className="p-4 md:p-6 pb-3 md:pb-4">
                <span className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 text-[0.65rem] md:text-xs font-semibold tracking-wide uppercase bg-blue-50 text-blue-600 rounded-lg">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="px-4 md:px-6 pb-4 md:pb-6">
                <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-2 md:mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                  {post.title}
                </h2>
                
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-3">
                  {post.subtitle}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-[0.65rem] md:text-xs text-slate-500 mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden sm:inline">{formatDate(post.date)}</span>
                      <span className="sm:hidden">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.readTime} min
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                  {post.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 md:px-2 md:py-0.5 text-[0.65rem] md:text-xs font-medium bg-slate-100 text-slate-600 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Read More */}
                <button className="inline-flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-semibold text-blue-600 group-hover:gap-2 md:group-hover:gap-3 transition-all duration-300">
                  Read Full Article
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-blue-400 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </article>
          ))}
        </div>

        {/* Empty State */}
        {blogPosts.length === 0 && (
          <div className="text-center py-16 md:py-20">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6">📝</div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-3">No posts yet</h3>
            <p className="text-sm md:text-base text-slate-600">Check back soon for new research insights!</p>
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}