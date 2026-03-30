import React from 'react';
import { NavLink } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const teamMembers = [
    {
        image: require('./../../images/our-team5/1.jpg'),
        membername: 'Johnny Jackman',
        position: 'Architect'
    },
    {
        image: require('./../../images/our-team5/2.jpg'),
        membername: 'Daniel Rickman',
        position: 'Architect'
    },
    {
        image: require('./../../images/our-team5/3.jpg'),
        membername: 'Mark Norwich',
        position: 'Finances'
    },
    {
        image: require('./../../images/our-team5/1.jpg'),
        membername: 'Nich Jonas',
        position: 'Finances'
    }
]

var bgimg1 = require('./../../images/background/cross-line2.png');

class Team1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiData: [],   // API ka data save karne ke liye
            loading: true, // loading state
            error: null    // error handle karne ke liye
        };
    }

    componentDidMount() {
        const requestOptions = {
            //  mode: 'no-cors',
            method: "GET",
            headers: {
      "Content-Type": "application/json",
    },
        };

        fetch("https://www.admin.infrioindia.com/api/v2/auth/our-teams-list", requestOptions)
            .then((response) => response.json()) // response ko JSON me convert
            .then((result) => {
                console.log("API Result:", result);
                this.setState({ apiData: result.data, loading: false });
            })
            .catch((error) => {
                console.error("API Error: Lakshay", error);
                this.setState({ error: error, loading: false });
            });
    }


    render() {
         const { apiData, loading, error } = this.state;

          const options = {
            loop: true,
            margin: 30,
            nav: true,
            dots: false,
            autoplay: false,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            responsive: {
                0: { items: 1 },
                576: { items: 2 },
                992: { items: 3 },
                1200: { items: 4 }
            }
        };

        return (
            <>
                <div className="section-full p-t30 mobile-page-padding">
                    <div className="container">
                        {/* TITLE START */}
                         <div className="section-head">
                                                   <div className="sx-separator-outer separator-center">
                                                       <div className="sx-separator bg-white bg-moving bg-repeat-x" style={{ backgroundImage: 'url(' + bgimg1 + ')' }}>
                                                           <h3 className="sep-line-one">Our Team</h3>
                                                       </div>
                                                   </div>
                                               </div>
                        {/* TITLE END */}
                        {/* IMAGE CAROUSEL START */}
                        <div className="section-content">
                            <div className="row team-item-four">
                                
                                {apiData.slice(0,4).map((item, index) => (
                                    <div className="col-lg-3 col-md-6 col-sm-6 m-b30" key={index}>
                                        <div className="our-team-2 ">
                                            <div className="profile-image" style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
                                                <img 
                                                    src={item.icon} 
                                                    alt={item.name} 
                                                    style={{ 
                                                        width: '100%', 
                                                        height: '100%', 
                                                        objectFit: 'cover',
                                                        objectPosition: 'center'
                                                    }} 
                                                />
                                                {/* <div className="icons">
                                                    <a href="https://www.facebook.com" target="_blank"><i className="fa fa-facebook" /></a>
                                                    <a href="https://www.twitter.com" target="_blank"> <i className="fa fa-twitter" /></a>
                                                    <a href="https://www.instagram.com" target="_blank"> <i className="fa fa-instagram" /></a>
                                                    <a href="https://in.linkedin.com" target="_blank"> <i className="fa fa-linkedin" /></a>
                                                </div> */}
                                            </div>
                                            <div className="figcaption text-black">
                                                <h4 className="m-t0">{item.name}</h4>
                                                <span className="m-b0">{item.designation}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default Team1;