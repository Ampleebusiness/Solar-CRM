import React from 'react';
import { NavLink, useParams, Navigate } from 'react-router-dom';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SEO from '../Common/SEO';
import Banner from '../Elements/Banner';
import { getSellerById } from '../../data/solarData';
import { SOLAR_IMAGES } from '../../data/solarImages';

function SellerDetail() {
  const { sellerId } = useParams();
  const seller = getSellerById(sellerId);

  if (!seller) {
    return <Navigate to="/error-404" replace />;
  }

  const title = `${seller.membername} – Solar Partner`;
  const canonicalPath = `/sellers/${seller.id}`;
  const expertise = seller.expertise || [];
  const services = seller.services || [];

  return (
    <>
      <SEO
        titleExact
        title={title}
        description={`${seller.membername}: ${seller.description} Based in ${seller.location}. Vetted Infrio solar partner.`}
        canonicalPath={canonicalPath}
        keywords={`${seller.membername}, solar installer ${seller.location}, solar partner, Infrio sellers`}
      />
      <Header2 />
      <div className="page-content">
        <Banner
          title={seller.membername}
          pagename="Sellers"
          description={seller.position}
          bgimage={SOLAR_IMAGES.bannerSellers}
        />

        <div className="section-full p-t50 p-b80 bg-white mobile-page-padding solar-seller-detail">
          <div className="container">
            <nav className="solar-seller-detail__breadcrumb m-b30" aria-label="Breadcrumb">
              <NavLink to="/">Home</NavLink>
              <span className="solar-seller-detail__crumb-sep"> / </span>
              <NavLink to="/sellers">Sellers</NavLink>
              <span className="solar-seller-detail__crumb-sep"> / </span>
              <span className="text-muted">{seller.membername}</span>
            </nav>

            <div className="row">
              <div className="col-lg-5 col-md-12 m-b40">
                <div className="solar-seller-detail__media-wrap bg-white shadow rounded overflow-hidden">
                  <div className="solar-seller-detail__image">
                    <img src={seller.image} alt={seller.membername} />
                  </div>
                  <div className="p-a30 sx-bg-secondry text-white">
                    <p className="m-b0 font-weight-600">
                      <i className="fa fa-map-marker m-r8" aria-hidden />
                      {seller.location}
                    </p>
                    <p className="m-t10 m-b0 font-14" style={{ opacity: 0.92 }}>
                      {seller.position}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-7 col-md-12">
                <div className="solar-seller-detail__body">
                  <h2 className="m-t0 m-b15" style={{ fontWeight: 700, color: '#0f172a' }}>
                    About {seller.membername}
                  </h2>
                  <p className="font-16 m-b20" style={{ lineHeight: 1.65, color: '#334155' }}>
                    {seller.description}
                  </p>
                  {seller.detailAbout && (
                    <p className="font-16 m-b30" style={{ lineHeight: 1.65, color: '#334155' }}>
                      {seller.detailAbout}
                    </p>
                  )}

                  {expertise.length > 0 && (
                    <>
                      <h4 className="m-b15 sx-text-primary" style={{ fontWeight: 700 }}>
                        Focus areas
                      </h4>
                      <ul className="solar-seller-detail__expertise list-unstyled m-b0">
                        {expertise.map((line) => (
                          <li key={line} className="m-b10">
                            <i className="fa fa-check-circle sx-text-primary m-r10" aria-hidden />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>

            {services.length > 0 && (
              <div className="row m-t40">
                <div className="col-12">
                  <div className="section-head m-b25">
                    <h3 className="m-t0 m-b10" style={{ fontWeight: 700, color: '#0f172a' }}>
                      Services offered
                    </h3>
                    <p className="m-b0 text-muted font-15">
                      Infrio solution areas this partner supports.{' '}
                      <NavLink to="/solutions" className="sx-text-primary font-weight-600">
                        View all solutions
                      </NavLink>
                    </p>
                  </div>
                  <div className="row">
                    {services.map((sol) => (
                      <div className="col-xl-4 col-md-6 m-b30" key={sol.id}>
                        <article className="solar-seller-detail__service-card bg-white shadow rounded overflow-hidden h-100">
                          <div className="solar-seller-detail__service-img">
                            <img src={sol.image} alt={sol.title} />
                          </div>
                          <div className="p-a25 text-left">
                            {sol.vendorName && (
                              <p className="m-t0 m-b12 font-13">
                                <span className="text-muted text-uppercase d-block m-b4" style={{ letterSpacing: '0.04em', fontSize: '11px' }}>
                                  Vendor
                                </span>
                                <span className="sx-text-primary font-weight-600">{sol.vendorName}</span>
                              </p>
                            )}
                            <span className="solar-seller-detail__service-num sx-text-primary font-weight-700">{sol.num}</span>
                            <h4 className="m-t10 m-b10" style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>
                              {sol.title}
                            </h4>
                            <p className="m-b0 font-14" style={{ lineHeight: 1.55, color: '#64748b' }}>
                              {sol.short}
                            </p>
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
}

export default SellerDetail;
