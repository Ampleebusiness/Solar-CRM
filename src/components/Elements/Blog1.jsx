import React from 'react';
import { NavLink } from 'react-router-dom';

const blogs = [
    {
        image: require('./../../images/blog/blog-grid/pic4.jpg'),
        title: 'We’ll nail your next project, because nobody wants...',
        author: 'John',
        date: '5',
        month: 'SEP',
        comments: '5 Comment'
    },
    {
        image: require('./../../images/blog/blog-grid/pic2.jpg'),
        title: 'Flooring Pro\'s Secrets That Can Raise Your Home Value...',
        author: 'John',
        date: '25',
        month: 'SEP',
        comments: '5 Comment'
    },
    {
        image: require('./../../images/blog/blog-grid/pic3.jpg'),
        title: 'Best Laminate & Hardwood Flooring Trends For 2019...',
        author: 'John',
        date: '5',
        month: 'SEP',
        comments: '5 Comment'
    }
]

var bgimg1 = require('./../../images/background/cross-line2.png');

class Blog1 extends React.Component {
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

        fetch("https://www.admin.infrioindia.com/api/v2/auth/blog-list", requestOptions)
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
        return (
            <>
                <div className="section-full mobile-page-padding bg-white p-t30 p-b50 mobile-page-padding">
                        <div className="container">
                            {/* TITLE START */}
                            <div className="section-head">
                                <div className="sx-separator-outer separator-center">
                                    <div className="sx-separator bg-white bg-moving bg-repeat-x" style={{ backgroundImage: 'url(' + bgimg1 + ')' }}>
                                        <h3 className="sep-line-one">Blog</h3>
                                    </div>
                                </div>
                            </div>
                            {/* TITLE END */}
                            {/* IMAGE CAROUSEL START */}
                            <div className="section-content">
                                <div className="row justify-content-center">
                                {apiData.slice(0,3).map((item, index) => (
                                    <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
                                    <div className="blog-post blog-grid date-style-2">
                                            <div className="sx-post-media sx-img-effect img-reflection">
                                                <NavLink to={"/blog-detail"} state={{ id: item.id}}><img src={item.banner} alt="" /></NavLink>
                                            </div>
                                            <div className="sx-post-info p-t30">
                                                {/* <div className="sx-post-meta ">
                                                    <ul>
                                                        <li className="post-date"><strong>{item.date}</strong> <span>{item.month}</span> </li>
                                                        <li className="post-author"><NavLink to={"/blog-single"}>By <span>{item.author}</span></NavLink> </li>
                                                        <li className="post-comment"> <NavLink to={"/blog-single"}>{item.comments}</NavLink> </li>
                                                    </ul>
                                                </div> */}
                                                <div className="sx-post-title ">
                                                    <h4 className="post-title" style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }}><NavLink to={"/blog-detail"} state={{ id: item.id}} >{item.title}</NavLink></h4>
                                                </div>
                                                <div className="sx-post-readmore">
                                                    <NavLink to={"/blog-detail"} state={{ id: item.id}} title="READ MORE" rel="bookmark" className="site-button-link">View More</NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                               </div>
                            </div>
                        </div>
                        <div className="hilite-title text-left text-uppercase">
                            <strong>Blog</strong>
                        </div>
                    </div>
            </>
        );
    }
};

export default Blog1;