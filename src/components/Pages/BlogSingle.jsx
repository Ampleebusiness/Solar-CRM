import React from 'react';
import { NavLink } from 'react-router-dom';
import Header2 from './../Common/Header2';
import Footer from './../Common/Footer';
import Banner from './../Elements/Banner';
import { withRouter } from '../with';
import Blog3 from '../Elements/Blog3';
import Team1 from '../Elements/Team1';
import Footer2 from '../Common/Footer2';
var bnrimg = require('./../../images/banner/10.jpg');
var bgimg1 = require('./../../images/background/cross-line2.png');

class BlogSingle extends React.Component {
    componentDidMount() {
        function loadScript(src) {

            return new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = src;
                script.addEventListener('load', function () {
                    resolve();
                });
                script.addEventListener('error', function (e) {
                    reject(e);
                });
                document.body.appendChild(script);
                document.body.removeChild(script);
            })
        };

        loadScript('./assets/js/custom.js');

    };
    constructor(props) {
      super(props);
        this.state = {
            data:{},
            apiData: [],   // API ka data save karne ke liye
            loading: true, // loading state
            error: null    // error handle karne ke liye
        };
    }

    componentDidMount() {
          const { location } = this.props.router;
    const idFromState = location.state?.id;
        console.log("lalala",idFromState)
       
        const requestOptions = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
             body: JSON.stringify({ id: idFromState }),
             
        };
        console.log("API data data:", requestOptions);

        fetch("https://www.admin.infrioindia.com/api/v2/auth/blog-details", requestOptions)
            .then((response) => response.json()) // response ko JSON me convert
            .then((result) => {
                console.log("API Result:", result.data);
                this.setState({ data : result.data, loading: false });
            })
            .catch((error) => {
                console.error("API Error: details", error);
                this.setState({ error: error, loading: false });
            });
    }

    render() {
            const { data, apiData, loading, error } = this.state;
        return (
            <>
                <Header2 />
                <div className="page-content ">
                    <Banner title="Blog Detail" pagename="Blog Single" description="Our Love for Architecture
We are A Passionate Team Dedicated To Creating Stunning Architecture." bgimage={bnrimg}/>
                    {/* SECTION CONTENT START */}
                    <div className="section-full p-t80 p-b50 inner-page-padding">
                        <div className="container">
                            {/* <div className="blog-single-space max-w900 ml-auto mr-auto"> */}
                                {/* BLOG START */}
                                <div className="blog-post blog-detail text-black">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-12">
                                            <div className="sx-post-media">
                                                <div className="portfolio-item">
                                                    <img 
                                                        style={{
                                                            width: "100%", 
                                                            height: "clamp(300px, 50vw, 500px)", 
                                                            objectFit: 'cover',
                                                            borderRadius: '8px'
                                                        }}  
                                                        src={data.banner} 
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-12">
                                            <div className="sx-post-title" style={{ paddingLeft: 'clamp(0px, 2vw, 30px)',  }}>
                                                <h3 className="post-title" style={{ fontSize: '2rem', marginBottom: 'clamp(15px, 2vw, 25px)',textAlign:"justify"  }}>
                                                    {data.title}
                                                </h3>
                                                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333', marginBottom: '15px',textAlign:"justify" }}>
                                                    {data.short_description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sx-post-meta  m-t20">
                                        {/* <ul>
                                            <li className="post-date"><strong>20 </strong> <span>Septembar 2022</span> </li>
                                            <li className="post-author"><NavLink to={"#"}>By <span>Admin</span></NavLink> </li>
                                            <li className="post-category"><NavLink to={"#"}><span>Architecture</span></NavLink> </li>
                                        </ul> */}
                                    </div>
                                   
                                    <div className="sx-post-text" style={{ marginTop: 'clamp(30px, 4vw, 50px)' }}>
                                        <div className="row">
                                            <div className="col-12">
                                                <div 
                                                    style={{ 
                                                        fontSize: 'clamp(1rem, 2.2vw, 1.1rem)', 
                                                        lineHeight: '1.7', 
                                                        color: '#333',
                                                        textAlign: 'justify'
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: data.description }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="autor-post-tag-share p-a30 bg-gray">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="widget_tag_cloud m-b15">
                                                    <h5 className="tagcloud">Tags</h5>
                                                    <div className="tagcloud">
                                                        <NavLink to={"/blog-masonry"}>Kitchen</NavLink>
                                                        <NavLink to={"/blog-masonry"}>Food</NavLink>
                                                        <NavLink to={"/blog-masonry"}>Planining</NavLink>
                                                        <NavLink to={"/blog-masonry"}>Between </NavLink>
                                                        <NavLink to={"/blog-masonry"}>Chairs</NavLink>
                                                        <NavLink to={"/blog-masonry"}>Lawn</NavLink>
                                                        <NavLink to={"/blog-masonry"}>Table</NavLink>
                                                        <NavLink to={"/blog-masonry"}>Mantinance</NavLink>
                                                        <NavLink to={"/blog-masonry"}>Room</NavLink>
                                                        <NavLink to={"/blog-masonry"}>Landscape </NavLink>
                                                        <NavLink to={"/blog-masonry"}>Bedroom </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="clearfix single-post-share">
                                                    <h5>Share this Post:</h5>
                                                    <div className="widget_social_inks">
                                                        <ul className="social-icons social-md social-square social-dark m-b0">
                                                            <li><a href="https://www.facebook.com" target="_blank" className="fa fa-facebook" /></li>
                                                            <li><a href="https://www.twitter.com" target="_blank" className="fa fa-twitter" /></li>
                                                            <li><a href="https://rss.com" target="_blank" className="fa fa-rss" /></li>
                                                            <li><a href="https://www.youtube.com" target="_blank" className="fa fa-youtube" /></li>
                                                            <li><a href="https://www.instagram.com" target="_blank" className="fa fa-instagram" /></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="post-controls p-t30">
                                        <div className="d-flex justify-content-between">
                                            <div className="prev-post"><NavLink to={"#"}>Prev Article</NavLink></div>
                                            <div className="next-post"><NavLink to={"#"}>Next Article</NavLink></div>
                                        </div>
                                    </div> */}
                                </div>
                                {/* OUR BLOG START */}
                                {/* TITLE START */}
                                
                                {/* <div className="section-head">
                                    <div className="sx-separator-outer separator-left">
                                        <div className="sx-separator bg-white bg-moving bg-repeat-x" style={{ backgroundImage: 'url(' + bgimg1 + ')' }}>
                                            <h3 className="sep-line-one">Blog</h3>
                                        </div>
                                    </div>
                                </div> */}
                                  {/* <Blog3/> */}
                                  {/* <Team1 /> */}
                                {/* TITLE END */}
                                {/* IMAGE CAROUSEL START */}
                              
                              
                                {/* OUR BLOG END */}
                               
                            {/* </div> */}
                            <Team1/>
                        </div>
                    </div>
                    {/* SECTION CONTENT END */}
                </div>

                <Footer2 />
            </>
        );
    };
};

export default withRouter(BlogSingle);