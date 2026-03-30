import React from 'react';
import Navigation from './Navigation';
import { NavLink } from 'react-router-dom';
import { safeJsonParse } from '../../utils/safeJsonParse';
import { AuthContext } from '../../context/AuthContext';

class Header2 extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = { 
            logo: require('./../../images/logo-light.png'),
            isLoggedIn: false,
            userRole: null
        };
    }

    state = { isSearchActive: false };

    handleSearchToggle = () => {
        this.setState({ isSearchActive: !this.state.isSearchActive });
    };

    componentDidMount() {

        const handleScroll = () => {
            const offset = window.scrollY;

            const stickyheader = document.querySelector('.sticky-header ');

            if (offset >= 100) {
                stickyheader.classList.add('is-fixed');
                stickyheader.classList.add('color-fill');

            } else {
                stickyheader.classList.remove('is-fixed');
                stickyheader.classList.remove('color-fill');
            }
        }

        window.addEventListener('scroll', handleScroll);

        window.updateTopMostParent = (logopath) => {
            this.setState({ logo: logopath });
        };
        
        // Check auth status for account link
        this.checkAuthStatus();
    }
    
    checkAuthStatus = () => {
        const authData = localStorage.getItem('infrioAuth');
        const auth = safeJsonParse(authData, null);
        if (auth && typeof auth === 'object') {
            this.setState({ isLoggedIn: true, userRole: auth.role });
        } else {
            this.setState({ isLoggedIn: false, userRole: null });
        }
    }

    render() {

        const isSearchActive = this.state.isSearchActive;
        const { openSellerRegistration } = this.context || {};
        const isTransparent = this.props.transparent !== false;
        /** When true, adds template class `sticky-no` so `.main-bar` is position:static (fixes overlap when using nav-transparent). */
        const stickyNo = this.props.stickyNo === true;

        const accountPath =
            this.state.userRole === 'normal'
                ? '/user-account'
                : this.state.userRole === 'seller'
                  ? '/seller-dashboard'
                  : '/partner-account';

        const accountLabel = this.state.userRole === 'seller' ? 'Seller Dashboard' : 'My Account';

        return (
            <>
                <style>{`
                    .top-auth-links {
                        display: flex !important;
                        align-items: center;
                        flex-wrap: nowrap;
                        gap: 24px;
                        font-size: 15px;
                        margin: 0;
                        padding: 0;
                        list-style: none;
                    }
                    .top-auth-links > li {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .top-auth-links > li + li::before {
                        content: '|';
                        color: rgba(255, 255, 255, 0.6);
                        margin-right: 14px;
                    }
                    .top-auth-link {
                        display: inline-block;
                        padding: 6px 2px;
                        color: #fff;
                        text-decoration: none;
                        font-weight: 500;
                        font-size: 15px;
                        transition: color 0.2s ease;
                    }
                    .top-auth-link:hover,
                    .top-auth-link:focus,
                    .top-auth-link.active {
                        color: #f59e0b;
                    }
                    @media (max-width: 768px) {
                        .top-bar {
                            display: none !important;
                        }
                        .mobile-drawer-top-items {
                            display: block !important;
                        }
                    }
                    @media (min-width: 769px) {
                        .mobile-drawer-top-items {
                            display: none !important;
                        }
                    }
                `}</style>
                <header className={`site-header nav-wide ${isTransparent ? 'nav-transparent' : ''} mobile-sider-drawer-menu`}>
                    <div className="top-bar sx-bg-secondry">
                        <div className="container">
                            <div className="d-flex justify-content-between ">
                                <ul className="list-unstyled e-p-bx text-white" style={{ fontSize: '15px', marginBottom: 0 }}>
                                    <li style={{ fontSize: '15px' }}>Mail Us : info@infrioindia.com</li>
                                    <li style={{ fontSize: '15px' }}>Call Us : +91 90014 57000</li>
                                </ul>
                            
                                <ul className="list-unstyled e-p-bx text-white d-flex align-items-center m-b0 top-auth-links">
                                    {this.state.isLoggedIn ? (
                                        <li>
                                            <NavLink 
                                                to={accountPath}
                                                className="top-auth-link"
                                            >
                                                {accountLabel}
                                            </NavLink>
                                        </li>
                                    ) : (
                                        <>
                                            <li>
                                                <NavLink to="/login" className="top-auth-link">
                                                    Login
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/register" className="top-auth-link">
                                                    Register
                                                </NavLink>
                                            </li>
                                            <li>
                                                <button type="button" className="top-auth-link" onClick={openSellerRegistration}>
                                                    Become a Seller
                                                </button>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={`sticky-header main-bar-wraper navbar-expand-lg${stickyNo ? ' sticky-no' : ''}`}>
                        <div className="main-bar">
                            <div className="container clearfix">
                                <div className="logo-header-check">
                                    <div className="logo-header-inner logo-header-one">
                                        <NavLink to={"/"}>
                                            <img src={this.state.logo} alt="Inteshape" />
                                        </NavLink>
                                    </div>
                                </div>
                                {/* NAV Toggle Button */}
                                <button id="mobile-side-drawer" data-target=".header-nav" data-toggle="collapse" type="button" className="navbar-toggler collapsed">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar icon-bar-first" />
                                    <span className="icon-bar icon-bar-two" />
                                    <span className="icon-bar icon-bar-three" />                      </button>
                                {/* EXTRA NAV */}
                                {/* <div className="extra-nav">
                                    <div className="extra-cell">
                                        <NavLink to={"#"} onClick={this.handleSearchToggle}>
                                            <i className="fa fa-search" />
                                        </NavLink>
                                    </div>
                                </div> */}
                                {/* EXTRA Nav */}
                                {/* MAIN NAVIGATION */}
                                <div className="header-nav nav-dark navbar-collapse collapse justify-content-center collapse">
                                    <Navigation isLoggedIn={this.state.isLoggedIn} userRole={this.state.userRole} />
                                </div>
                                {/* SITE SEARCH */}
                                <div id="search" className={isSearchActive ? "open" : null}>
                                    <span className="close" onClick={this.handleSearchToggle} />
                                    <form role="search" id="searchform" action="/search" method="get" className="radius-xl">
                                        <div className="input-group">
                                            <input defaultValue="" name="q" type="search" placeholder="Type to search" />
                                            <span className="input-group-btn"><button type="button" className="search-btn"><i className="fa fa-search arrow-animation" /></button></span>                                  </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

            </>
        );
    };
};

export default Header2;

