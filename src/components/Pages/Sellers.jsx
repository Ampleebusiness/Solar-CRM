import React from 'react';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SEO from '../Common/SEO';
import Banner from '../Elements/Banner';
import Team3 from '../Elements/Team3';
import { SOLAR_IMAGES } from '../../data/solarImages';

class Sellers extends React.Component {
  render() {
    return (
      <>
        <SEO
          titleExact
          title="Sellers – Trusted Solar Partners"
          description="Browse our full list of vetted solar sellers and installers. Filter by rating and location to find the best match for your project."
          canonicalPath="/sellers"
          keywords="solar sellers, solar installers, trusted solar partners, solar ratings, solar locations"
        />
        <Header2 />
        <div className="page-content">
          <Banner
            title="Sellers"
            pagename="Sellers"
            description="Compare vetted solar installers and equipment partners."
            bgimage={SOLAR_IMAGES.bannerSellers}
          />
          <Team3 mode="page" showFilters />
        </div>
        <Footer2 />
      </>
    );
  }
}

export default Sellers;

