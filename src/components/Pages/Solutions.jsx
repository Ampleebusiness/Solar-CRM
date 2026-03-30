import React from 'react';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SEO from '../Common/SEO';
import Banner from '../Elements/Banner';
import { SolutionsSection } from '../Elements/WhatWeDo1';
import { SOLAR_IMAGES } from '../../data/solarImages';

class Solutions extends React.Component {
  render() {
    return (
      <>
        <SEO
          titleExact
          title="Solutions – Solar Systems & Services"
          description="Explore our complete set of solar solutions. From design and installation to monitoring and maintenance, find the right option for your home or business."
          canonicalPath="/solutions"
          keywords="solar solutions, solar systems, solar maintenance, solar monitoring, solar design"
        />
        <Header2 />
        <div className="page-content">
          <Banner
            title="Solutions"
            pagename="Solutions"
            description="Explore the complete set of solar solutions we offer."
            bgimage={SOLAR_IMAGES.bannerSolutions}
          />
          <SolutionsSection
            itemLimit={null}
            showFooterCta={false}
            showReadMore={false}
            showViewAllButton={false}
            detailMode
            hideSectionTitle
            intro="Browse all solutions below. Each one is designed to improve production, reduce lifetime cost, and keep your system performing reliably."
            anchorId="solutions"
          />
        </div>
        <Footer2 />
      </>
    );
  }
}

export default Solutions;

