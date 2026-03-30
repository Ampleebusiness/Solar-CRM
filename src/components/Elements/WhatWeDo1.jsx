import React from 'react';
import { NavLink } from 'react-router-dom';
import { SOLUTIONS } from '../../data/solarData';
import { SOLAR_IMAGES } from '../../data/solarImages';
import { useAuth } from '../../context/AuthContext';

var bgimg1 = require('./../../images/background/bg-5.png');
var bgimg2 = require('./../../images/background/bg-2.jpg');
var bgimg3 = require('./../../images/background/cross-line2.png');

const HOME_PREVIEW_COUNT = 6;

/** Reusable solution cards — same markup for Home, Solutions page, About */
export function SolutionsGrid({ items, showReadMore, cardClassName, detailMode }) {
  const cn = cardClassName || 'number-block-one animate-in-to-top solar-solution-card';
  return (
    <div className="row number-block-one-outer justify-content-center">
      {items.map((sol) => (
        <div className="col-lg-4 col-md-6 col-sm-6 m-b30" key={sol.id} id={sol.id}>
          <div className={cn}>
            <div className="solar-solution-card__img-wrap">
              <img src={sol.image} alt={sol.title} loading="lazy" decoding="async" />
            </div>
            <div className="figcaption bg-white text-center p-a20">
              <h4 className="m-a0">{sol.title}</h4>
              <p className="m-t10 m-b0 font-14 text-left solar-solution-excerpt">{detailMode ? sol.description : sol.short}</p>
             
            </div>
            {/* <div className="figcaption-number text-center sx-text-primary animate-in-to-top-content">
              <span>{sol.num}</span>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * @param {object} props
 * @param {number} [props.itemLimit] — max items (omit for all)
 * @param {boolean} [props.showFooterCta] — large CTA strip below grid
 * @param {boolean} [props.showReadMore] — per-card Read more → /solutions#id
 * @param {boolean} [props.showViewAllButton] — primary button to /solutions
 * @param {string} [props.sectionClass] — extra section classes
 * @param {boolean} [props.hideSectionTitle] — omit separator heading (e.g. on /solutions where Banner already says “Solutions”)
 */
export function SolutionsSection({
  itemLimit = HOME_PREVIEW_COUNT,
  showFooterCta = true,
  showReadMore = true,
  showViewAllButton = true,
  sectionClass = '',
  title = 'Solutions',
  intro = null,
  detailMode = false,
  anchorId = 'solutions',
  hideSectionTitle = false,
}) {
  const items = itemLimit ? SOLUTIONS.slice(0, itemLimit) : SOLUTIONS;
  const { isSeller, openSellerRegistration } = useAuth();

  return (
    <div
      id={anchorId}
      className={`section-full mobile-page-padding bg-white p-t20 p-b30 bg-repeat overflow-hide scroll-spy-section ${sectionClass}`}
      style={{ backgroundImage: 'url(' + bgimg1 + ')' }}
    >
      <div className="container right-half-bg-image-outer">
        <div className="right-half-bg-image bg-parallax bg-fixed bg-top-right" data-stellar-background-ratio={0} style={{ backgroundImage: 'url(' + bgimg1 + ')' }} />
        {!hideSectionTitle && (
          <div className="section-head">
            <div className="sx-separator-outer separator-left">
              <div className="sx-separator bg-white bg-moving bg-repeat-x" style={{ backgroundImage: 'url(' + bgimg3 + ')' }}>
                <h3 className="sep-line-one">{title}</h3>
              </div>
            </div>
          </div>
        )}
        {intro && <p className="m-b30 max-w900 solar-section-intro">{intro}</p>}
        <div className="section-content">
          <SolutionsGrid items={items} showReadMore={showReadMore} detailMode={detailMode} />
          {showViewAllButton && itemLimit && itemLimit < SOLUTIONS.length && (
            <div className="text-center m-t20 m-b40">
              <NavLink to="/solutions" className="site-button btn-half">
                <span>View all solutions</span>
              </NavLink>
            </div>
          )}
          {showFooterCta && (
            <div className="large-title-block full-content bg-gray solar-solutions-footer-cta">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="large-title">
                    <h3 className="m-tb0">Smart solar systems tailored to your roof, rate plan, and savings goals.</h3>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="large-title-info">
                    <p>From efficient residential arrays to commercial-scale power and proactive O&amp;M, we connect you with solutions that maximize production, incentives, and long-term reliability.</p>
                    <div className="text-left">
                        {isSeller ? (
                          <NavLink to="/seller-dashboard" className="site-button">
                            <span>Seller Dashboard</span>
                          </NavLink>
                        ) : (
                          <button type="button" className="site-button" onClick={openSellerRegistration}>
                            <span>Become a Seller</span>
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Home: first 6 solutions + view all + footer CTA */
class WhatWeDo1 extends React.Component {
  render() {
    return (
      <SolutionsSection
        itemLimit={HOME_PREVIEW_COUNT}
        showFooterCta
        showReadMore
        showViewAllButton
      />
    );
  }
}

export default WhatWeDo1;
