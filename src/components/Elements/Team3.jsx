import React from 'react';
import { NavLink } from 'react-router-dom';
import { SELLERS, SELLER_LOCATIONS } from '../../data/solarData';

var bgimg1 = require('./../../images/background/cross-line2.png');

function SellerCard({ item }) {
  return (
    <div className="our-team-2 solar-seller-card">
      <div className="profile-image">
        <img src={item.image} alt={item.membername} loading="lazy" decoding="async" />
        <div className="icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fa fa-facebook" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fa fa-twitter" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fa fa-instagram" />
          </a>
          <a href="https://in.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fa fa-linkedin" />
          </a>
        </div>
      </div>
      <div className="figcaption text-black">
        <h4 className="m-t0">
          <NavLink to="/contact-us">{item.membername}</NavLink>
        </h4>
        <span className="m-b0 sx-text-primary">{item.position}</span>
        <div className="m-t10 m-b10" aria-label={`${item.rating} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((s) => (
            <i
              key={s}
              className={'fa fa-star' + (s <= item.rating ? '' : '-o')}
              style={{ color: s <= item.rating ? '#f59e0b' : '#ccc', marginRight: 2 }}
            />
          ))}
        </div>
        <p className="solar-seller-meta m-b5">
          <i className="fa fa-map-marker sx-text-primary m-r5" />
          {item.location}
        </p>
        <p className="font-14 m-b0" style={{ lineHeight: 1.55 }}>
          {item.description}
        </p>
      </div>
    </div>
  );
}

class Team3 extends React.Component {
  static defaultProps = {
    mode: 'home',
    showFilters: false,
  };

  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.state = {
      ratingFilter: 'all',
      locationFilter: 'All',
    };
  }

  getFilteredMembers() {
    let list = [...SELLERS];
    if (this.state.ratingFilter === '5') {
      list = list.filter((s) => s.rating === 5);
    } else if (this.state.ratingFilter === '4') {
      list = list.filter((s) => s.rating >= 4);
    }
    if (this.state.locationFilter && this.state.locationFilter !== 'All') {
      list = list.filter((s) => s.location === this.state.locationFilter);
    }
    return list;
  }

  scrollByDir = (dir) => {
    const el = this.scrollRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 340);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  render() {
    const { mode, showFilters } = this.props;
    const isHome = mode === 'home';
    const isPage = mode === 'page';
    const members = isHome ? SELLERS : this.getFilteredMembers();

    return (
      <div id="sellers" className={`section-full p-b50 mobile-page-padding bg-gray scroll-spy-section solar-sellers-section ${isPage ? 'p-t20' : ''}`}>
        <div className="container">
          {!isPage && (
            <div className="section-head">
              <div className="sx-separator-outer separator-left">
                <div className="sx-separator bg-white bg-moving bg-repeat-x" style={{ backgroundImage: 'url(' + bgimg1 + ')' }}>
                  <h3 className="sep-line-one">Trusted Sellers</h3>
                </div>
              </div>
            </div>
          )}
          <div className="section-content">
            <p className="m-b30 max-w900 solar-section-intro">
              Compare vetted solar installers and equipment partners. Every seller below is reviewed for workmanship, warranty support, and customer satisfaction.
            </p>

            {showFilters && (
              <div className="row m-b30 align-items-end solar-seller-filters">
                <div className="col-md-4 col-sm-6 m-b15">
                  <label className="d-block font-12 text-uppercase m-b8 solar-filter-label">Rating</label>
                  <select
                    className="form-control solar-filter-select"
                    value={this.state.ratingFilter}
                    onChange={(e) => this.setState({ ratingFilter: e.target.value })}
                  >
                    <option value="all">All ratings</option>
                    <option value="5">5 stars only</option>
                    <option value="4">4+ stars</option>
                  </select>
                </div>
                <div className="col-md-4 col-sm-6 m-b15">
                  <label className="d-block font-12 text-uppercase m-b8 solar-filter-label">Location</label>
                  <select
                    className="form-control solar-filter-select"
                    value={this.state.locationFilter}
                    onChange={(e) => this.setState({ locationFilter: e.target.value })}
                  >
                    {SELLER_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 col-sm-12 m-b15 text-md-right">
                  <button
                    type="button"
                    className="site-button-link m-t30 inline-block btn-unstyled"
                    onClick={() => this.setState({ ratingFilter: 'all', locationFilter: 'All' })}
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            )}

            {isHome ? (
              <div className="position-relative solar-sellers-carousel-wrap">
                <button
                  type="button"
                  className="solar-carousel-nav solar-carousel-nav--prev"
                  onClick={() => this.scrollByDir(-1)}
                  aria-label="Previous sellers"
                >
                  <i className="fa fa-angle-left" />
                </button>
                <button
                  type="button"
                  className="solar-carousel-nav solar-carousel-nav--next"
                  onClick={() => this.scrollByDir(1)}
                  aria-label="Next sellers"
                >
                  <i className="fa fa-angle-right" />
                </button>
                <div className="sellers-scroll-track" ref={this.scrollRef}>
                  {members.map((item) => (
                    <div className="sellers-scroll-item" key={item.id}>
                      <SellerCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="row team-item-four solar-sellers-grid-page">
                {members.length === 0 ? (
                  <div className="col-12">
                    <p className="text-center p-a30 bg-white radius-md">No sellers match these filters. Try adjusting rating or location.</p>
                  </div>
                ) : (
                  members.map((item) => (
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 m-b30" key={item.id}>
                      <SellerCard item={item} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Team3;
export { SellerCard };
