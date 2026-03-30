import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home2 from './Pages/Home2';
import Home3 from './Pages/Home3';
import Home4 from './Pages/Home4';
import Home5 from './Pages/Home5';
import Home6 from './Pages/Home6';

import About1 from './Pages/About1';
import About2 from './Pages/About2';

import Services1 from './Pages/Services1';
import Services2 from './Pages/Services2';
import ServiceDetail from './Pages/ServiceDetail';
import ServiceDetailInte from './Pages/ServiceDetailInte';
import ServiceDetailT from './Pages/ServiceDetailT';
import ArchitectureLayoutLibrary from './Pages/ArchitectureLayoutLibrary';
import TurnkeyConstructionPlans from './Pages/TurnkeyConstructionPlans';

import Team1 from './Pages/Team1';
import Team2 from './Pages/Team2';
import TeamDetail from './Pages/TeamDetail';

import OurHistory from './Pages/OurHistory';
import FontIcons from './Pages/FontIcons';
import Error from './Pages/Error';

import ProjectGrid3 from './Pages/ProjectGrid3';
import ProjectGridNoGap3 from './Pages/ProjectGridNoGap3';
import ProjectGrid4 from './Pages/ProjectGrid4';
import ProjectGridNoGap4 from './Pages/ProjectGridNoGap4';
import ProjectGrid5 from './Pages/ProjectGrid5';
import ProjectGridNoGap5 from './Pages/ProjectGridNoGap5';

import ProjectMasonary3 from './Pages/ProjectMasonary3';
import ProjectMasonaryNoGap3 from './Pages/ProjectMasonaryNoGap3';
import ProjectMasonary4 from './Pages/ProjectMasonary4';
import ProjectMasonaryNoGap4 from './Pages/ProjectMasonaryNoGap4';
import ProjectMasonary5 from './Pages/ProjectMasonary5';
import ProjectMasonaryNoGap5 from './Pages/ProjectMasonaryNoGap5';

import ProjectCorousel from './Pages/ProjectCorousel';
import ProjectDetail1 from './Pages/ProjectDetail1';
import ProjectDetail2 from './Pages/ProjectDetail2';
import ShowcaseLanding from './Pages/ShowcaseLanding';
import InfrioChoice from './Pages/InfrioChoice';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';

import BlogGrid from './Pages/BlogGrid';
import BlogListing from './Pages/BlogListing';
import BlogMasonary from './Pages/BlogMasonary';
import BlogSingle from './Pages/BlogSingle';
import PostRightSidebar from './Pages/PostRightSidebar';

import Shop from './Pages/Shop';
import ShopGrid from './Pages/ShopGrid';
import ShopList from './Pages/ShopList';
import ShopDetail from './Pages/ShopDetail';
import ShopAccount from './Pages/ShopAccount';
import ShopCart from './Pages/ShopCart';
import ShopCheckout from './Pages/ShopCheckout';

import Faq from './Pages/Faq';
import ContactUs from './Pages/ContactUs';
import ScrollToTop from './Common/ScrollToTop';
import ProtectedRoute from './Common/ProtectedRoute';
import UserAccount from './Pages/UserAccount';
import PartnerAccount from './Pages/PartnerAccount';
import Sellers from './Pages/Sellers';
import Solutions from './Pages/Solutions';
import { AuthProvider } from '../context/AuthContext';
import SellerRegistrationModal from './Elements/SellerRegistrationModal';
import SellerProtectedRoute from './Common/SellerProtectedRoute';
import SellerDashboard from './Pages/SellerDashboard';
import SellerLeads from './Pages/SellerLeads';
import SellerEnquiries from './Pages/SellerEnquiries';
import SellerProfile from './Pages/SellerProfile';
import SellerStaff from './Pages/SellerStaff';
import SellerServices from './Pages/SellerServices';
import SellerServiceForm from './Pages/SellerServiceForm';
import SellerServiceView from './Pages/SellerServiceView';
import SellerCustomers from './Pages/SellerCustomers';
import SellerCustomerView from './Pages/SellerCustomerView';


class Components extends React.Component {
    render() {
        return (
            <BrowserRouter basename="/">
                <ScrollToTop />
                <AuthProvider>
                    <div className="page-wraper">
                        <Routes>
                            <Route path='/' element={<Home2/>} />
                            <Route path='/home-2' element={<Home2/>} />
                            <Route path='/home-3' element={<Home3/>} />
                            <Route path='/home-4' element={<Home4/>} />
                            <Route path='/home-5' element={<Home5/>} />
                            <Route path='/home-6' element={<Home6/>} />

                            <Route path='/about-us' element={<About1/>} />
                            <Route path='/about-2' element={<About2/>} />

                            <Route path='/services' element={<Services1/>} />
                            <Route path='/services-2' element={<Services2/>} />
                            <Route path='/architecture-design' element={<ServiceDetail/>} />
                            <Route path='/architecture-layout-library' element={<ArchitectureLayoutLibrary/>} />
                            <Route path='/interior-design' element={<ServiceDetailInte/>} />
                            <Route path='/turnkey-construction' element={<ServiceDetailT/>} />
                            <Route path='/turnkey-construction-plans' element={<TurnkeyConstructionPlans/>} />

                            <Route path='/team-1' element={<Team1/>} />
                            <Route path='/team-2' element={<Team2/>} />
                            <Route path='/team-single' element={<TeamDetail/>} />

                            <Route path='/our-history' element={<OurHistory/>} />
                            <Route path='/icon-font' element={<FontIcons/>} />
                            <Route path='/error-404' element={<Error/>} />

                            <Route path='/project-grid-3-columns' element={<ProjectGrid3/>} />
                            <Route path='/project-grid-3-columns-no-gap' element={<ProjectGridNoGap3/>} />
                            <Route path='/social-media' element={<ProjectGrid4/>} />
                            <Route path='/project-grid-4-columns-no-gap' element={<ProjectGridNoGap4/>} />
                            <Route path='/showcase' element={<ShowcaseLanding/>} />
                            <Route path='/project-grid-5-columns' element={<ProjectGrid5/>} />
                            <Route path='/infrio-choice' element={<InfrioChoice/>} />
                            <Route path='/project-grid-5-columns-no-gap' element={<ProjectGridNoGap5/>} />

                            <Route path='/project-masonry-3-columns' element={<ProjectMasonary3/>} />
                            <Route path='/project-masonry-3-columns-no-gap' element={<ProjectMasonaryNoGap3/>} />
                            <Route path='/project-masonry-4-columns' element={<ProjectMasonary4/>} />
                            <Route path='/project-masonry-4-columns-no-gap' element={<ProjectMasonaryNoGap4/>} />
                            <Route path='/project-masonry-5-columns' element={<ProjectMasonary5/>} />
                            <Route path='/project-masonry-5-columns-no-gap' element={<ProjectMasonaryNoGap5/>} />

                            <Route path='/project-carousel' element={<ProjectCorousel/>} />
                            <Route path='/project-detail1' element={<ProjectDetail1/>} />
                            <Route path='/project-detail2' element={<ProjectDetail2/>} />
                            <Route path='/login' element={<Login/>} />
                            <Route path='/register' element={<Register/>} />
                            <Route path='/forgot-password' element={<ForgotPassword/>} />

                            <Route path='/blog' element={<BlogGrid/>} />
                            <Route path='/blog-listing' element={<BlogListing/>} />
                            <Route path='/blog-masonry' element={<BlogMasonary/>} />
                            <Route path='/blog-detail' element={<BlogSingle/>} />
                            <Route path='/post-right-sidebar' element={<PostRightSidebar/>} />

                            <Route path='/sellers' element={<Sellers/>} />
                            <Route path='/solutions' element={<Solutions/>} />

                            <Route
                              path='/seller-dashboard'
                              element={
                                <SellerProtectedRoute>
                                  <SellerDashboard />
                                </SellerProtectedRoute>
                              }
                            />
                            <Route
                              path='/seller-leads'
                              element={
                                <SellerProtectedRoute>
                                  <SellerLeads />
                                </SellerProtectedRoute>
                              }
                            />
                            <Route
                              path='/seller-enquiries'
                              element={
                                <SellerProtectedRoute>
                                  <SellerEnquiries />
                                </SellerProtectedRoute>
                              }
                            />
                            <Route
                              path='/seller-profile'
                              element={
                                <SellerProtectedRoute>
                                  <SellerProfile />
                                </SellerProtectedRoute>
                              }
                            />
                            <Route
                              path='/seller-staff'
                              element={
                                <SellerProtectedRoute>
                                  <SellerStaff />
                                </SellerProtectedRoute>
                              }
                            />
                            <Route
                              path='/seller-services'
                              element={
                                <SellerProtectedRoute>
                                  <SellerServices />
                                </SellerProtectedRoute>
                              }
                            />
                            <Route
                              path='/seller-services/new'
                              element={
                                <SellerProtectedRoute>
                                  <SellerServiceForm />
                                </SellerProtectedRoute>
                              }
                            />
                            <Route
                              path='/seller-services/:id/edit'
                              element={
                                <SellerProtectedRoute>
                                  <SellerServiceForm />
                                </SellerProtectedRoute>
                              }
                            />
                            <Route
                              path='/seller-services/:id'
                              element={
                                <SellerProtectedRoute>
                                  <SellerServiceView />
                                </SellerProtectedRoute>
                              }
                            />
                            <Route
                              path='/seller-customers'
                              element={
                                <SellerProtectedRoute>
                                  <SellerCustomers />
                                </SellerProtectedRoute>
                              }
                            />
                            <Route
                              path='/seller-customers/:id'
                              element={
                                <SellerProtectedRoute>
                                  <SellerCustomerView />
                                </SellerProtectedRoute>
                              }
                            />

                            <Route path='/shop' element={<ProtectedRoute><Shop/></ProtectedRoute>} />
                            <Route path='/shop-grid' element={<ShopGrid/>} />
                            <Route path='/shop-list' element={<ShopList/>} />
                            <Route path='/shop-detail' element={<ShopDetail/>} />
                            <Route path='/shop-account' element={<ShopAccount/>} />
                            <Route path='/shop-cart' element={<ShopCart/>} />
                            <Route path='/shop-checkout' element={<ShopCheckout/>} />

                            <Route path='/faq' element={<Faq/>} />
                            <Route path='/contact-us' element={<ContactUs/>} />
                            
                            <Route path='/user-account' element={<UserAccount/>} />
                            <Route path='/partner-account' element={<PartnerAccount/>} />
                            
                            <Route path='*' element={<Error/>} />
                        </Routes>
                        <SellerRegistrationModal />
                    </div>
                </AuthProvider>
            </BrowserRouter>
        );
    };
};

export default Components;