import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SOLAR_BLOG_DUMMY } from '../../data/solarBlogDummy';
import { fetchSolarBlogList, parseSolarBlogListResponse } from '../../api/solarBlog';
import { fetchAuthBlogList, parseAuthBlogListResponse } from '../../api/authBlog';
import { useAuth } from '../../context/AuthContext';

const bgimg1 = require('./../../images/background/cross-line2.png');
const BLOG_FALLBACK_IMAGE = require('./../../images/blog/default/thum1.jpg');
const HOME_BLOG_COUNT = 3;
const PER_PAGE = 20;

export default function Blog1() {
  const { auth } = useAuth();
  const isSeller = auth?.role === 'seller';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (isSeller) {
          const raw = await fetchSolarBlogList({ page: 1, perPage: PER_PAGE });
          const { ok, items } = parseSolarBlogListResponse(raw, 1, PER_PAGE);
          const list = Array.isArray(items) ? items : [];
          if (!cancelled) setPosts(ok || list.length ? list : []);
        } else {
          const raw = await fetchAuthBlogList();
          const { ok, items } = parseAuthBlogListResponse(raw);
          const list = Array.isArray(items) ? items : [];
          if (!cancelled) setPosts(ok || list.length ? list : []);
        }
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isSeller]);

  const display =
    posts.length > 0
      ? posts.slice(0, HOME_BLOG_COUNT)
      : !loading
        ? SOLAR_BLOG_DUMMY.slice(0, HOME_BLOG_COUNT)
        : [];

  return (
    <>
      <div className="section-full mobile-page-padding bg-white p-t30 p-b50 mobile-page-padding">
        <div className="container">
          <div className="section-head">
            <div className="sx-separator-outer separator-center">
              <div
                className="sx-separator bg-white bg-moving bg-repeat-x"
                style={{ backgroundImage: `url(${bgimg1})` }}
              >
                <h3 className="sep-line-one">Blog</h3>
              </div>
            </div>
          </div>
          <div className="section-content">
            {loading && (
              <div className="row justify-content-center">
                <div className="col-12 text-center p-t20 p-b20">
                  <p className="text-muted">Loading posts…</p>
                </div>
              </div>
            )}
            <div className="row justify-content-center">
              {!loading &&
                display.map((item, index) => (
                  <div className="col-lg-4 col-md-6 col-sm-12" key={item?.id ?? index}>
                    <div className="blog-post blog-grid date-style-2">
                      <div className="sx-post-media sx-img-effect img-reflection">
                        <NavLink
                          to={item?.id != null ? `/blog-detail/${item.id}` : '/blog-detail'}
                          state={{ id: item?.id }}
                        >
                          <img
                            src={item?.banner || BLOG_FALLBACK_IMAGE}
                            alt={item?.title || ''}
                            onError={(e) => {
                              e.currentTarget.src = BLOG_FALLBACK_IMAGE;
                            }}
                          />
                        </NavLink>
                      </div>
                      <div className="sx-post-info p-t30">
                        <div className="sx-post-title ">
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
                            <NavLink
                              to={item?.id != null ? `/blog-detail/${item.id}` : '/blog-detail'}
                              state={{ id: item?.id }}
                            >
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
          </div>
        </div>
        <div className="hilite-title text-left text-uppercase">
          <strong>Blog</strong>
        </div>
      </div>
    </>
  );
}