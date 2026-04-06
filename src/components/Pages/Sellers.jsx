import React from 'react';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SEO from '../Common/SEO';
import Banner from '../Elements/Banner';
import SolarSellersBrowse from '../Elements/SolarSellersBrowse';
import { SOLAR_IMAGES } from '../../data/solarImages';

class Sellers extends React.Component {
  render() {
    return (
      <>
        <SEO
          titleExact
          title="Sellers – Trusted Solar Partners"
          description="Browse vetted solar sellers and installers. Filter by state and city. List loads from Infrio solar partners API."
          canonicalPath="/sellers"
          keywords="solar sellers, solar installers, trusted solar partners, solar by state, solar by city"
        />
        <Header2 />
        <div className="page-content">
          <Banner
            title="Sellers"
            pagename="Sellers"
            description="Compare vetted solar installers and equipment partners."
            bgimage={SOLAR_IMAGES.bannerSellers}
          />
          <SolarSellersBrowse />
        </div>
        <Footer2 />
      </>
    );
  }
}

export default Sellers;

