// BlogPost.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostBySlug, getRelatedPosts } from './blogData';

const NAV_H = 108;

// Professional Image Component
function BlogImage({ src, alt, caption }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <figure className="my-8 md:my-12">
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-md">
        {/* Loading skeleton */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 min-h-[200px] animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
               style={{ animation: 'shimmer 2s infinite' }} />
        )}

        {/* Actual image */}
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`
              block w-full h-auto
              transition-opacity duration-700 ease-out
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />
        ) : (
          <div className="flex items-center justify-center h-64 md:h-96 bg-slate-100">
            <div className="text-center px-4">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs md:text-sm text-slate-600 font-medium">Image not available</p>
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className="mt-3 md:mt-4 px-2 md:px-4 text-center">
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic">
            {caption}
          </p>
        </figcaption>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </figure>
  );
}

function updateMetaTag(attribute, key, content) {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (element) {
    element.setAttribute('content', content);
  } else {
    const meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [prevSlug, setPrevSlug] = useState(slug);
  const [post, setPost] = useState(() => getPostBySlug(slug));
  const [relatedPosts, setRelatedPosts] = useState(() => getRelatedPosts(slug));
  const [shareTooltip, setShareTooltip] = useState('');

  // Derived from `slug`: adjusted directly during render (React's documented
  // pattern for "reset state when a prop changes") rather than in the effect
  // below, so post/relatedPosts are already correct for this render instead
  // of lagging one commit behind.
  if (slug !== prevSlug) {
    setPrevSlug(slug);
    setPost(getPostBySlug(slug));
    setRelatedPosts(getRelatedPosts(slug));
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    const currentPost = getPostBySlug(slug);

    if (!currentPost) {
      navigate('/blog');
      return;
    }

    // SEO Meta tags
    document.title = `${currentPost.title} | OncoTrace-AI Blog`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', currentPost.metaDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = currentPost.metaDescription;
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', currentPost.metaKeywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = currentPost.metaKeywords;
      document.head.appendChild(meta);
    }

    // Open Graph tags for social sharing
    updateMetaTag('property', 'og:title', currentPost.title);
    updateMetaTag('property', 'og:description', currentPost.metaDescription);
    updateMetaTag('property', 'og:type', 'article');
    updateMetaTag('property', 'og:url', window.location.href);
    
    // Add first image as OG image if available
    if (currentPost.images && currentPost.images.length > 0) {
      updateMetaTag('property', 'og:image', window.location.origin + currentPost.images[0].src);
    }
    
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', currentPost.title);
    updateMetaTag('name', 'twitter:description', currentPost.metaDescription);
    
    if (currentPost.images && currentPost.images.length > 0) {
      updateMetaTag('name', 'twitter:image', window.location.origin + currentPost.images[0].src);
    }

  }, [slug, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = post.title;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setShareTooltip('Copied!');
        setTimeout(() => setShareTooltip(''), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  // Helper function to get images by position
  const getImagesByPosition = (position) => {
    if (!post?.images) return [];
    return post.images.filter(img => img.position === position);
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: NAV_H }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto mb-3 md:mb-4"></div>
          <p className="text-sm md:text-base text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-white"
      style={{ paddingTop: NAV_H, fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-6 md:pt-8">
        <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-slate-600 mb-6 md:mb-8">
          <button
            onClick={() => navigate('/')}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('/blog')}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Blog
          </button>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-[150px] md:max-w-none">{post.title.substring(0, 30)}...</span>
        </nav>
      </div>

      {/* Article Header */}
      <article className="max-w-[1400px] mx-auto px-4 md:px-6 pb-16 md:pb-20">
        <header className="mb-10 md:mb-12 pb-6 md:pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <span className="px-2.5 py-0.5 md:px-3 md:py-1 text-[0.65rem] md:text-xs font-semibold tracking-wide uppercase bg-blue-100 text-blue-600 rounded-lg">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center gap-1 md:gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[0.65rem] md:text-xs font-bold rounded-full">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-base md:text-xl text-slate-600 leading-relaxed mb-6 md:mb-8">
            {post.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4 text-xs md:text-sm text-slate-600">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs md:text-sm">
                  OT
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-xs md:text-sm">{post.author}</div>
                  <div className="text-[0.65rem] md:text-xs text-slate-500">{formatDate(post.date)}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs md:text-sm">{post.readTime} min read</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="text-[0.65rem] md:text-xs font-semibold uppercase tracking-wide text-slate-400 mr-1 hidden sm:inline">Share:</span>
              
              <button
                onClick={() => handleShare('twitter')}
                className="p-1.5 md:p-2 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                aria-label="Share on Twitter"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="p-1.5 md:p-2 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="p-1.5 md:p-2 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                aria-label="Share on Facebook"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              <div className="relative">
                <button
                  onClick={() => handleShare('copy')}
                  className="p-1.5 md:p-2 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                  aria-label="Copy link"
                >
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                {shareTooltip && (
                  <span className="absolute -top-7 md:-top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[0.65rem] md:text-xs rounded whitespace-nowrap">
                    {shareTooltip}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 md:gap-2 mt-4 md:mt-6">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 md:px-3 md:py-1 text-[0.65rem] md:text-xs font-medium bg-slate-100 text-slate-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-sm md:prose-lg max-w-none">
          {/* Introduction */}
          <div className="mb-10 md:mb-12">
            {post.content.intro.map((paragraph, i) => (
              <p key={i} className="mb-4 md:mb-6 text-slate-700 text-sm md:text-base leading-relaxed text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Images after intro */}
          {getImagesByPosition('after-intro').map((img, i) => (
            <BlogImage key={i} src={img.src} alt={img.alt} caption={img.caption} />
          ))}

          {/* Sections */}
          {post.content.sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <section className="mb-12 md:mb-16 pb-10 md:pb-12 border-b border-slate-200 last:border-0">
                {section.eyebrow && (
                  <p className="text-[0.65rem] md:text-xs font-bold tracking-widest uppercase text-slate-400 mb-2 md:mb-3">
                    {section.eyebrow}
                  </p>
                )}
                
                <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-3 md:mb-4 leading-tight">
                  {section.title}
                </h2>
                
                {section.description && (
                  <p className="text-sm md:text-lg text-slate-600 mb-6 md:mb-8 text-justify">
                    {section.description}
                  </p>
                )}

                {/* Comparison Grid */}
                {section.comparison && (
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6 my-8 md:my-10">
                    {section.comparison.map((item, i) => (
                      <div
                        key={i}
                        className="p-4 md:p-6 border border-slate-200 rounded-lg md:rounded-xl bg-white hover:shadow-lg transition-shadow duration-300"
                      >
                        <h3 className="text-base md:text-xl font-bold text-slate-900 mb-1 md:mb-2">{item.title}</h3>
                        <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4 text-justify">{item.subtitle}</p>
                        <ul className="space-y-1.5 md:space-y-2">
                          {item.points.map((point, j) => (
                            <li key={j} className="flex items-start gap-1.5 md:gap-2 text-xs md:text-sm text-slate-700">
                              <span className="text-blue-500 mt-0.5 md:mt-1">•</span>
                              <span className="text-justify">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats */}
                {section.stats && (
                  <div className="grid md:grid-cols-3 gap-4 md:gap-6 my-8 md:my-10">
                    {section.stats.map((stat, i) => (
                      <div
                        key={i}
                        className="p-4 md:p-6 border border-slate-200 rounded-lg md:rounded-xl bg-slate-50 text-center"
                      >
                        <div className="text-xl md:text-2xl font-black text-slate-900 mb-1 md:mb-2">{stat.value}</div>
                        <div className="text-xs md:text-sm text-slate-600 text-justify">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reasons */}
                {section.reasons && (
                  <ol className="space-y-8 md:space-y-10 my-8 md:my-10">
                    {section.reasons.map((reason, i) => (
                      <li key={i} className="relative pl-10 md:pl-12">
                        <span className="absolute left-0 top-0 text-3xl md:text-4xl font-black text-blue-100">
                          {reason.number}
                        </span>
                        <h3 className="text-base md:text-xl font-bold text-slate-900 mb-3 md:mb-4">{reason.title}</h3>
                        
                        {reason.content.map((para, j) => (
                          <p key={j} className="mb-3 md:mb-4 text-slate-700 text-sm md:text-base leading-relaxed text-justify">
                            {para}
                          </p>
                        ))}

                        {reason.quote && (
                          <blockquote className="my-4 md:my-6 pl-3 md:pl-4 border-l-3 md:border-l-4 border-blue-500 bg-blue-50 p-3 md:p-4 rounded-r-lg">
                            <p className="text-slate-800 italic text-xs md:text-base text-justify">{reason.quote}</p>
                          </blockquote>
                        )}

                        {reason.citations && (
                          <p className="text-[0.65rem] md:text-xs text-slate-500 mt-3 md:mt-4">
                            {reason.citations.join(' · ')}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                )}

                {/* Content Paragraphs */}
                {section.content && (
                  <div className="my-6 md:my-8">
                    {section.content.map((para, i) => (
                      <p key={i} className="mb-4 md:mb-6 text-slate-700 text-sm md:text-base leading-relaxed text-justify">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {/* Pillars */}
                {section.pillars && (
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6 my-8 md:my-10">
                    {section.pillars.map((pillar, i) => (
                      <div
                        key={i}
                        className="p-4 md:p-6 border border-slate-200 rounded-lg md:rounded-xl bg-white hover:shadow-lg transition-shadow duration-300"
                      >
                        <h4 className="text-sm md:text-lg font-bold text-slate-900 mb-1 md:mb-2">{pillar.title}</h4>
                        <p className="text-xs md:text-sm text-slate-600 text-justify">{pillar.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Images after this section (if any) */}
              {getImagesByPosition(`after-section-${sectionIndex}`).map((img, i) => (
                <BlogImage key={i} src={img.src} alt={img.alt} caption={img.caption} />
              ))}

              {/* Special position: after comparison (first section) */}
              {sectionIndex === 0 && getImagesByPosition('after-comparison').map((img, i) => (
                <BlogImage key={i} src={img.src} alt={img.alt} caption={img.caption} />
              ))}
            </div>
          ))}

          {/* References */}
          {post.content.references && (
            <section className="mb-12 md:mb-16">
              <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8">Scientific References</h2>
              <ol className="space-y-4 md:space-y-6">
                {post.content.references.map((ref) => (
                  <li key={ref.id} className="pb-4 md:pb-6 border-b border-slate-100 last:border-0">
                    <div className="font-bold text-slate-900 text-xs md:text-base mb-1">{ref.title}</div>
                    <div className="text-[0.65rem] md:text-sm text-slate-600 mb-1 md:mb-2">
                      {ref.authors} · {ref.journal} · {ref.year}
                    </div>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.65rem] md:text-sm text-blue-600 hover:text-blue-700 underline break-all"
                    >
                      {ref.url}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* Author Info */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl md:rounded-2xl border border-blue-100">
          <p className="text-[0.65rem] md:text-xs font-bold tracking-widest uppercase text-slate-400 mb-2 md:mb-3">Author</p>
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base md:text-xl flex-shrink-0">
              OT
            </div>
            <div>
              <h3 className="text-base md:text-xl font-bold text-slate-900 mb-1 md:mb-2">{post.author}</h3>
              <p className="text-xs md:text-base text-slate-600 leading-relaxed text-justify">
                Pioneering the future of precision oncology through AI-powered molecular surveillance and liquid biopsy technologies.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 py-12 md:py-16">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {relatedPosts.map((related) => (
                <article
                  key={related.id}
                  onClick={() => navigate(`/blog/${related.slug}`)}
                  className="group bg-white rounded-lg md:rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-4 md:p-6">
                    <span className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 text-[0.65rem] md:text-xs font-semibold uppercase bg-blue-50 text-blue-600 rounded-lg mb-2 md:mb-3">
                      {related.category}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {related.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4 line-clamp-2 text-justify">
                      {related.subtitle}
                    </p>
                    <div className="flex items-center gap-1.5 md:gap-2 text-[0.65rem] md:text-xs text-slate-500">
                      <span>{formatDate(related.date)}</span>
                      <span>•</span>
                      <span>{related.readTime} min read</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-12">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm md:text-base font-semibold rounded-lg md:rounded-xl transition-colors duration-200"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to All Articles
        </button>
      </div>
    </main>
  );
}