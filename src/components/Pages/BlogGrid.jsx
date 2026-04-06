import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header2 from './../Common/Header2';
import SEO from './../Common/SEO';
import Banner from './../Elements/Banner';
import Footer2 from '../Common/Footer2';
import { SOLAR_BLOG_DUMMY } from '../../data/solarBlogDummy';
import { fetchSolarBlogList, parseSolarBlogListResponse } from '../../api/solarBlog';
import { fetchAuthBlogList, parseAuthBlogListResponse } from '../../api/authBlog';
import { useAuth } from '../../context/AuthContext';

const bnrimg = require('./../../images/solar/3.jpg');
const BLOG_FALLBACK_IMAGE = require('./../../images/blog/default/thum1.jpg');
const PER_PAGE = 20;

function BlogGrid() {
  const { auth } = useAuth();
  const isSeller = auth?.role === 'seller';

  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: PER_PAGE,
  });
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);
  const loadLockRef = useRef(false);

  const blogItems = posts.length > 0 ? posts : !loading && error ? SOLAR_BLOG_DUMMY : posts;

  const resetAndLoadFirst = useCallback(async () => {
    if (loadLockRef.current) return;
    loadLockRef.current = true;
    setLoading(true);
    setError(null);
    setPosts([]);
    try {
      if (isSeller) {
        const raw = await fetchSolarBlogList({ page: 1, perPage: PER_PAGE });
        const { ok, items, meta: m, hasMore: more } = parseSolarBlogListResponse(raw, 1, PER_PAGE);
        if (!ok && items.length === 0 && !Array.isArray(raw?.data)) {
          throw new Error(typeof raw?.message === 'string' ? raw.message : 'Blog list unavailable.');
        }
        setPosts(items);
        setMeta(m);
        setHasMore(more);
      } else {
        const raw = await fetchAuthBlogList();
        const { ok, items } = parseAuthBlogListResponse(raw);
        if (!ok && items.length === 0 && !Array.isArray(raw?.data)) {
          throw new Error(typeof raw?.message === 'string' ? raw.message : 'Blog list unavailable.');
        }
        setPosts(items);
        setMeta({
          total: items.length,
          current_page: 1,
          last_page: 1,
          per_page: items.length > 0 ? items.length : PER_PAGE,
        });
        setHasMore(false);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load blogs.');
      setPosts([]);
      setMeta({ total: 0, current_page: 1, last_page: 1, per_page: PER_PAGE });
      setHasMore(false);
    } finally {
      setLoading(false);
      loadLockRef.current = false;
    }
  }, [isSeller]);

  useEffect(() => {
    resetAndLoadFirst();
  }, [resetAndLoadFirst]);

  const loadMore = useCallback(async () => {
    if (!isSeller || !hasMore || loading || loadingMore || loadLockRef.current) return;
    const nextPage = meta.current_page + 1;
    if (nextPage > meta.last_page) return;

    loadLockRef.current = true;
    setLoadingMore(true);
    setError(null);
    try {
      const raw = await fetchSolarBlogList({ page: nextPage, perPage: meta.per_page || PER_PAGE });
      const { items, meta: m, hasMore: more } = parseSolarBlogListResponse(
        raw,
        nextPage,
        meta.per_page || PER_PAGE,
      );
      setPosts((prev) => [...prev, ...items]);
      setMeta(m);
      setHasMore(more);
    } catch (err) {
      setError(err?.message || 'Could not load more posts.');
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      loadLockRef.current = false;
    }
  }, [isSeller, hasMore, loading, loadingMore, meta.current_page, meta.last_page, meta.per_page]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading || posts.length === 0) return undefined;

    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) loadMore();
      },
      { root: null, rootMargin: '200px', threshold: 0 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [hasMore, loading, loadMore, posts.length]);

  const showDummy = !loading && error && posts.length === 0;
  const displayItems = showDummy ? SOLAR_BLOG_DUMMY : blogItems;

  return (
    <>
      <SEO
        titleExact
        title="Architecture and Interior Design Blog – Infrio India"
        description="Read the Infrio India blog for practical insights on architecture, interior design, sustainable construction and modern design trends. Learn from expert tips, project stories and smart planning ideas to create better residential and commercial spaces."
        keywords="architecture blog india, interior design blog, sustainable architecture blog india, modern home design tips, commercial interior planning ideas, green building design blog, architectural trends india, interior styling tips for homes, design and build blog india, sustainable construction ideas for projects"
        canonicalPath="/blog"
      />
      <Header2 />
      <div className="page-content">
        <Banner
          title="Blogs"
          pagename="Blogs"
          description="Our Love for Architecture
We are A Passionate Team Dedicated To Creating Stunning Architecture."
          bgimage={bnrimg}
        />

        <div className="section-full p-tb80 bg-white inner-page-padding">
          <div className="container">
            {!loading && !showDummy && posts.length > 0 && (
              <p className="text-muted small m-b20" aria-live="polite">
                {isSeller ? (
                  <>
                    Showing {posts.length} of {meta.total} post{meta.total === 1 ? '' : 's'} · Page {meta.current_page}{' '}
                    of {meta.last_page} ({meta.per_page} per page)
                  </>
                ) : (
                  <>
                    {posts.length} post{posts.length === 1 ? '' : 's'}
                  </>
                )}
              </p>
            )}

            <div className="row clearfix">
              {loading && (
                <div className="col-12 text-center p-t40 p-b40">
                  <p className="text-muted">Loading posts...</p>
                </div>
              )}

              {!loading && error && (
                <div className="col-12 text-center p-t40 p-b40">
                  <p className="text-warning">{error} Showing demo solar posts for preview.</p>
                </div>
              )}

              {!loading &&
                displayItems.map((item, index) => (
                  <div className="col-lg-4 col-md-6 col-sm-12 m-b30" key={item?.id ?? index}>
                    <div className="blog-post blog-grid date-style-2 h-100">
                      <div className="sx-post-media sx-img-effect img-reflection">
                        <NavLink to={item?.id != null ? `/blog-detail/${item.id}` : '/blog-detail'} state={{ id: item?.id }}>
                          <img
                            src={item?.banner || BLOG_FALLBACK_IMAGE}
                            alt={item?.title || 'Blog'}
                            onError={(e) => {
                              e.currentTarget.src = BLOG_FALLBACK_IMAGE;
                            }}
                          />
                        </NavLink>
                      </div>
                      <div className="sx-post-info p-t30">
                        <div className="sx-post-title">
                          <h4
                            className="post-title"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            <NavLink to={item?.id != null ? `/blog-detail/${item.id}` : '/blog-detail'} state={{ id: item?.id }}>
                              {item?.title}
                            </NavLink>
                          </h4>
                        </div>
                        <div className="sx-post-readmore">
                          <NavLink
                            to={item?.id != null ? `/blog-detail/${item.id}` : '/blog-detail'}
                            state={{ id: item?.id }}
                            title="READ MORE"
                            rel="bookmark"
                            className="site-button-link"
                          >
                            View More
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {!showDummy && hasMore && posts.length > 0 && (
              <>
                {loadingMore && (
                  <p className="text-center text-muted m-t15" aria-live="polite">
                    Loading more…
                  </p>
                )}
                <div ref={sentinelRef} style={{ height: 1 }} aria-hidden />
              </>
            )}
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
}

export default BlogGrid;
