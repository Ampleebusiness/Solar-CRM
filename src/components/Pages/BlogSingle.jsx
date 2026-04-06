import React from 'react';
import { NavLink } from 'react-router-dom';
import Header2 from './../Common/Header2';
import Banner from './../Elements/Banner';
import Team1 from '../Elements/Team1';
import Footer2 from '../Common/Footer2';
import { withRouter } from '../with';
import { fetchSolarBlogDetail, parseSolarBlogDetailResponse } from '../../api/solarBlog';
import { fetchAuthBlogDetail } from '../../api/authBlog';
import { isSellerSession } from '../../utils/authRole';

const bnrimg = require('./../../images/banner/10.jpg');
const BLOG_FALLBACK_IMAGE = require('./../../images/blog/default/thum1.jpg');

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', (e) => reject(e));
    document.body.appendChild(script);
    document.body.removeChild(script);
  });
}

function resolveBlogId(router) {
  const paramsId = router?.params?.blogId;
  const stateId = router?.location?.state?.id;
  const queryId = new URLSearchParams(router?.location?.search || '').get('id');
  const raw = paramsId ?? stateId ?? queryId;
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? String(n) : String(raw);
}

class BlogSingle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    loadScriptOnce('./assets/js/custom.js').catch(() => {});
    this.loadDetail();
  }

  componentDidUpdate(prevProps) {
    const prev = resolveBlogId(prevProps.router);
    const next = resolveBlogId(this.props.router);
    if (prev !== next) {
      this.loadDetail();
    }
  }

  loadDetail = () => {
    const blogId = resolveBlogId(this.props.router);
    if (!blogId) {
      this.setState({
        loading: false,
        error: 'No blog selected. Open a post from the blog page or use a link with the post ID.',
        data: {},
      });
      return;
    }

    this.setState({ loading: true, error: null });

    const useSolar = isSellerSession();
    const req = useSolar ? fetchSolarBlogDetail(blogId) : fetchAuthBlogDetail(blogId);

    req
      .then((raw) => {
        const { ok, detail, message } = parseSolarBlogDetailResponse(raw);
        if (!ok || !detail) {
          throw new Error(message || 'Could not load this post.');
        }
        this.setState({ data: detail, loading: false, error: null });
      })
      .catch((err) => {
        this.setState({
          error: err?.message || 'Failed to load blog.',
          loading: false,
          data: {},
        });
      });
  };

  render() {
    const { data, loading, error } = this.state;
    const bannerSrc = data?.banner || BLOG_FALLBACK_IMAGE;

    return (
      <>
        <Header2 />
        <div className="page-content ">
          <Banner
            title="Blog Detail"
            pagename="Blog Single"
            description="Our Love for Architecture
We are A Passionate Team Dedicated To Creating Stunning Architecture."
            bgimage={bnrimg}
          />
          <div className="section-full p-t80 p-b50 inner-page-padding">
            <div className="container">
              {loading && (
                <div className="text-center p-t40 p-b40">
                  <p className="text-muted">Loading post…</p>
                </div>
              )}

              {!loading && error && (
                <div className="text-center p-t40 p-b40">
                  <p className="text-warning m-b20">{error}</p>
                  <NavLink to="/blog" className="site-button">
                    Back to blog
                  </NavLink>
                </div>
              )}

              {!loading && !error && (
                <div className="blog-post blog-detail text-black">
                  <div className="row">
                    <div className="col-lg-6 col-md-12">
                      <div className="sx-post-media">
                        <div className="portfolio-item">
                          <img
                            style={{
                              width: '100%',
                              height: 'clamp(300px, 50vw, 500px)',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                            src={bannerSrc}
                            alt={data?.title || 'Blog'}
                            onError={(e) => {
                              e.currentTarget.src = BLOG_FALLBACK_IMAGE;
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <div className="sx-post-title" style={{ paddingLeft: 'clamp(0px, 2vw, 30px)' }}>
                        <h3
                          className="post-title"
                          style={{
                            fontSize: '2rem',
                            marginBottom: 'clamp(15px, 2vw, 25px)',
                            textAlign: 'justify',
                          }}
                        >
                          {data?.title}
                        </h3>
                        {data?.short_description ? (
                          <p
                            style={{
                              fontSize: '1rem',
                              lineHeight: '1.6',
                              color: '#333',
                              marginBottom: '15px',
                              textAlign: 'justify',
                            }}
                          >
                            {data.short_description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="sx-post-meta m-t20" />

                  <div className="sx-post-text" style={{ marginTop: 'clamp(30px, 4vw, 50px)' }}>
                    <div className="row">
                      <div className="col-12">
                        <div
                          style={{
                            fontSize: 'clamp(1rem, 2.2vw, 1.1rem)',
                            lineHeight: '1.7',
                            color: '#333',
                            textAlign: 'justify',
                          }}
                          dangerouslySetInnerHTML={{ __html: data?.description || '' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-t30">
                    <NavLink to="/blog" className="site-button-link">
                      ← Back to all posts
                    </NavLink>
                  </div>
                </div>
              )}

              <Team1 />
            </div>
          </div>
        </div>

        <Footer2 />
      </>
    );
  }
}

export default withRouter(BlogSingle);
