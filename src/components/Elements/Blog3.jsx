import React from 'react';
import { NavLink } from 'react-router-dom';
import { SOLAR_BLOG_DUMMY } from '../../data/solarBlogDummy';

class Blog3 extends React.Component {
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
         const { apiData } = this.state;
         const blogItems = apiData && apiData.length > 0 ? apiData : SOLAR_BLOG_DUMMY;
        return (
            <>
                
                            {/* TITLE START */}
                            {/* TITLE END */}
                            {/* IMAGE CAROUSEL START */}
                            <div className="section-content">
                                <div className="row justify-content-center">
                                {blogItems.slice(0,3).map((item, index) => (
                                    <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
                                    <div className="blog-post blog-grid date-style-2">
                                            <div className="sx-post-media sx-img-effect img-reflection">
                                                <NavLink to={"/blog-single"} state={{ id: item.id}}><img src={item.banner} alt="" /></NavLink>
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
    }}><NavLink to={"/blog-single"} state={{ id: item.id}}>{item.title}</NavLink></h4>
                                                </div>
                                                <div className="sx-post-readmore">
                                                    <NavLink to={"/blog-single"} state={{ id: item.id}} title="READ MORE" rel="bookmark" className="site-button-link">View More</NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                               </div>
                            </div>
                     
            </>
        );
    }
};

export default Blog3;