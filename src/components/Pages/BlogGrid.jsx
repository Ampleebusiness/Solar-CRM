import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header2 from './../Common/Header2';
import SEO from './../Common/SEO';
import Banner from './../Elements/Banner';
import Footer2 from '../Common/Footer2';
import { SOLAR_BLOG_DUMMY } from '../../data/solarBlogDummy';
const bnrimg = require('./../../images/solar/3.jpg');
const BLOG_LIST_URL = 'https://www.admin.infrioindia.com/api/v2/auth/blog-list';

function BlogGrid() {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const blogItems = apiData.length > 0 ? apiData : SOLAR_BLOG_DUMMY;

  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(BLOG_LIST_URL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Blog list failed (${response.status})`);
        }

        const result = await response.json();
        const list = Array.isArray(result?.data) ? result.data : [];

        if (!cancelled) {
          setApiData(list);
        }
      } catch (err) {
        if (!cancelled) {
          setApiData([]);
          setError(err?.message || 'Failed to load blogs.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBlogs();
    return () => {
      cancelled = true;
    };
  }, []);

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
                blogItems.map((item, index) => (
                  <div className="col-lg-4 col-md-6 col-sm-12 m-b30" key={item?.id ?? index}>
                    <div className="blog-post blog-grid date-style-2 h-100">
                      <div className="sx-post-media sx-img-effect img-reflection">
                        <NavLink to="/blog-detail" state={{ id: item?.id }}>
                          <img src={item?.banner} alt={item?.title || 'Blog'} />
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
                            <NavLink to="/blog-detail" state={{ id: item?.id }}>
                              {item?.title}
                            </NavLink>
                          </h4>
                        </div>
                        <div className="sx-post-readmore">
                          <NavLink
                            to="/blog-detail"
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

            <ul className="pagination m-t30 m-b0">
              <li>
                <NavLink to={"#"}>«</NavLink>
              </li>
              <li className="active">
                <NavLink to={"#"}>1</NavLink>
              </li>
              <li>
                <NavLink to={"#"}>2</NavLink>
              </li>
              <li>
                <NavLink to={"#"}>3</NavLink>
              </li>
              <li>
                <NavLink to={"#"}>4</NavLink>
              </li>
              <li>
                <NavLink to={"#"}>5</NavLink>
              </li>
              <li>
                <NavLink to={"#"}>»</NavLink>
              </li>
            </ul>
          </div>
        </div>
        
      </div>
      <Footer2 />
    </>
  );
}

export default BlogGrid;