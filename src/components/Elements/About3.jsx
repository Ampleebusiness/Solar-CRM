import React from 'react';
import { NavLink } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { SOLAR_IMAGES } from '../../data/solarImages';

class About3 extends React.Component {
    render() {
        return (
            <>
                <div className={`${this.props.bgcolor} section-full mobile-page-padding p-t80 p-b50`}>
                    <div className="container">
                        <div className="section-content">
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-12">
                                    <div className="about-home-3 m-b30 bg-white">
                                        <h3 className="m-t0 m-b20 sx-tilte">Our services include:</h3>
                                        <p>What sets us apart is our client-first approach. We combine technical expertise with creative design to ensure that every project — whether it’s a home, an office, or a large-scale commercial building — reflects both functionality and aesthetics.</p>
                                        <ul className="list-angle-right anchor-line">
                                            <li><NavLink  to={"/architecture-design"} state={{ id: 5}}>Architectural Design & Planning.</NavLink></li>
                                            <li><NavLink to={"/interior-design"} state={{ id: 6}}>Interior Design & Execution.</NavLink></li>
                                            <li><NavLink to={"/turnkey-construction"} state={{ id: 8}}>Turnkey Construction Projects.</NavLink></li>
                                           
                                        </ul>
                                        <p>At InfraArch, we don’t just build structures; we build trust, value, and lasting relationships. With innovation, quality, and transparency as our foundation, we are shaping spaces that inspire and endure.</p>
                                        {/* <div className="text-left">
                                            <NavLink  className="site-button btn-half"><span>Read More</span></NavLink>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12">
                                    <div className="video-section-full-v2">
                                        <div className="video-section-full bg-no-repeat bg-cover bg-center overlay-wraper m-b30" style={{ backgroundImage: 'url(' + SOLAR_IMAGES.hero2 + ')' }}>
                                            <div className="overlay-main bg-black opacity-04" />
                                            <div className="video-section-inner">
                                                <div className="video-section-content">
                                                    <NavLink to={"#"} className="play-now" data-toggle="modal" data-target="#myModal">
                                                        <i className="icon fa fa-play" />
                                                        <span className="ripple" />
                                                    </NavLink>

                                                    <div className="video-section-bottom">
                                                        <h3 className="sx-title text-white">25 Years<br />Experience</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="myModal" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <ReactPlayer url='https://vimeo.com/34741214' />
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default About3;