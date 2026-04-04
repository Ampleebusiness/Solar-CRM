import React from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

class Navigation extends React.Component {
    static contextType = AuthContext;


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

        loadScript('./assets/js/mobilenav.js');
    };

    render() {
        const { isLoggedIn, userRole } = this.props;
        const accountPath =
            userRole === 'normal' ? '/user-account' : userRole === 'seller' ? '/seller-dashboard' : '/partner-account';
        const accountLabel = userRole === 'seller' ? 'Seller Dashboard' : 'My Account';

        const { openSellerRegistration } = this.context || {};
        return (
            <>
                <ul className="nav navbar-nav">
                    {/* Mobile drawer items - Mail, Call, Login, Register */}
                    
                    <li className="active">
                        <NavLink to={"/"}>Home</NavLink>
                        {/* <ul className="sub-menu">
                            <li><NavLink to={"/"}>Home-1</NavLink></li>
                            <li><NavLink to={"/home-2"}>Home-2</NavLink></li>
                            <li><NavLink to={"/home-3"}>Home-3</NavLink></li>
                            <li><NavLink to={"/home-4"}>Home-4</NavLink></li>
                            <li><NavLink to={"/home-5"}>Home-5</NavLink></li>
                            <li><NavLink to={"/home-6"}>Home-6</NavLink></li>
                        </ul> */}
                    </li>
                    <li><NavLink to={"/about-us"}>About us</NavLink>
                        {/* <ul className="sub-menu">
                            <li><NavLink to={"/about-1"}>About 1</NavLink></li>
                            <li><NavLink to={"/about-2"}>About 2</NavLink></li>
                        </ul> */}
                    </li>
                    <li><NavLink to={"/sellers"}>Sellers</NavLink></li>
                    <li><NavLink to={"/solutions"}>Solutions</NavLink></li>
                    <li><NavLink to={"/solar-crm"}>Solar CRM</NavLink></li>
                    <li>
                        <NavLink to={"/blog"}>Blog</NavLink>
                        {/* <ul className="sub-menu">
                            <li><NavLink to={"/blog-grid"}>Blog Grid</NavLink></li>
                            <li><NavLink to={"/blog-listing"}>Blog Listing</NavLink></li>
                            <li><NavLink to={"/blog-masonry"}>Blog Masonry</NavLink></li>
                            <li><NavLink to={"/blog-single"}>Blog Single</NavLink></li>
                            <li><NavLink to={"/post-right-sidebar"}>Post Right Sidebar</NavLink></li>
                        </ul> */}
                    </li>
                    {/* <li>
                        <NavLink to={""}>Shop</NavLink>
                        <ul className="sub-menu">
                            <li><NavLink to={"/shop-grid"}>Shop Grid</NavLink></li>
                            <li><NavLink to={"/shop-list"}>Shop List</NavLink></li>
                            <li><NavLink to={"/shop-detail"}>Shop Detail</NavLink></li>
                            <li><NavLink to={"/shop-account"}>My Account</NavLink></li>
                            <li><NavLink to={"/shop-cart"}>Cart</NavLink></li>
                            <li><NavLink to={"/shop-checkout"}>Checkout</NavLink></li>
                        </ul>
                    </li> */}
                    <li><NavLink to={"/contact-us"}>Contact us</NavLink></li>
                    
                    {!isLoggedIn && (
                        <>
                            <li className="mobile-drawer-top-items">
                                <NavLink to="/login">Login</NavLink>
                            </li>
                            <li className="mobile-drawer-top-items">
                                <NavLink to="/register">Register</NavLink>
                            </li>
                            <li className="mobile-drawer-top-items">
                                <button
                                    type="button"
                                    className="mobile-nav-seller-btn"
                                    onClick={openSellerRegistration}
                                >
                                    Become a Seller
                                </button>
                            </li>
                        </>
                    )}
                    {isLoggedIn && (
                        <li className="mobile-drawer-top-items">
                            <NavLink to={accountPath}>{accountLabel}</NavLink>
                        </li>
                    )}
                    <li className="mobile-drawer-top-items">
                        
                        <a href="mailto:info@infrioindia.com">Mail Us : info@infrioindia.com</a>
                    </li>
                    <li className="mobile-drawer-top-items">
                        <a href="tel:+919001457000">Call Us : +91 90014 57000</a>
                    </li>
                </ul>
            </>
        );
    };
};

export default Navigation;