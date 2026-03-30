import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { safeJsonParse } from '../../utils/safeJsonParse';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SEO from '../Common/SEO';
import Banner from '../Elements/Banner';
import ProductDetailModal from '../Elements/ProductDetailModal';

const bannerImg = require('./../../images/banner/10.jpg');
const bgimg2 = require('./../../images/background/cross-line2.png');

const QUOTATION_LIST_API = 'https://www.admin.infrioindia.com/api/v2/auth/product-inquery-get';
const THEME_PRIMARY = '#d7b39a';

function mapInquiryItemToProduct(item) {
  if (!item) return null;
  const photos = Array.isArray(item.product_photos) && item.product_photos.length > 0
    ? item.product_photos
    : item.product_thumbnail_img
      ? [item.product_thumbnail_img]
      : [];
  return {
    id: item.product_id || item.id,
    title: item.name,
    price: item.price != null ? parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0 : null,
    images: photos,
    brand_name: item.brand_name || '',
    short_description: item.product_short_description || item.product_description || '',
    full_description: item.product_description || item.product_short_description || '',
    specifications: item.product_specification || []
  };
}

const UserAccount = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [customLayouts, setCustomLayouts] = useState([]);
  const [customLayoutsLoading, setCustomLayoutsLoading] = useState(false);
  const [customLayoutsError, setCustomLayoutsError] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [quotationsLoading, setQuotationsLoading] = useState(false);
  const [quotationsError, setQuotationsError] = useState(null);
  const [expandedQuotationId, setExpandedQuotationId] = useState(null);
  const [selectedQuotationProduct, setSelectedQuotationProduct] = useState(null);
  const [feedbackData, setFeedbackData] = useState({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const authData = localStorage.getItem('infrioAuth');
    if (!authData) {
      navigate('/login');
      return;
    }

    const auth = safeJsonParse(authData, null);
    if (!auth || typeof auth !== 'object') {
      localStorage.removeItem('infrioAuth');
      navigate('/login');
      return;
    }
    if (auth.role !== 'normal') {
      if (auth.role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/partner-account');
      }
      return;
    }

    // Fetch user details from API
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setCustomLayoutsError(null);
        
        // Get user_id from auth or userInfo
        let userId = auth.userId || auth.id;
        if (!userId) {
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) {
            const user = safeJsonParse(userInfo, null);
            if (user && typeof user === 'object') userId = user.id;
          }
        }

        if (!userId) {
          // If no userId available, use localStorage data
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) {
            const parsed = safeJsonParse(userInfo, null);
            if (parsed && typeof parsed === 'object') setUserData(parsed);
          }
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('user_id', userId);
        console.log(userId)

        const response = await fetch('https://www.admin.infrioindia.com/api/v2/auth/get-user-details', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success && result.data) {
          // Update user data with API response
          setUserData({
            id: result.data.id,
            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone,
            city: result.data.city,
            user_type: result.data.user_type,
            email_verified_at: result.data.email_verified_at,
            address: result.data.address,
            state: result.data.state,
            country: result.data.country,
            postal_code: result.data.postal_code,
            our_service_type: result.data.our_service_type,
            created_at: result.data.created_at,
            updated_at: result.data.updated_at
          });

          // Also update localStorage
          localStorage.setItem('userInfo', JSON.stringify({
            id: result.data.id,
            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone,
            city: result.data.city,
            user_type: result.data.user_type
          }));

          // Fetch user custom layouts from API
          fetchCustomLayouts(result.data.id);
        } else {
          // Fallback to localStorage if API fails
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) {
            const parsed = safeJsonParse(userInfo, null);
            if (parsed && typeof parsed === 'object') setUserData(parsed);
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Fallback to localStorage if API fails
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const parsed = safeJsonParse(userInfo, null);
          if (parsed && typeof parsed === 'object') setUserData(parsed);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Fetch custom layouts API
  const fetchCustomLayouts = async (userId) => {
    try {
      setCustomLayoutsLoading(true);
      setCustomLayoutsError(null);
      const formData = new FormData();
      formData.append('user_id', userId);
// console.log(userId)
      const response = await fetch('https://www.admin.infrioindia.com/api/v2/auth/architecture-form-list', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.status && Array.isArray(result.data)) {
        setCustomLayouts(result.data);
        localStorage.setItem('userCustomLayouts', JSON.stringify(result.data));
      } else {
        setCustomLayoutsError(result.message || 'Failed to load custom layouts');
        // fallback to local storage
        const saved = localStorage.getItem('userCustomLayouts');
        const parsedSaved = safeJsonParse(saved, []);
        if (Array.isArray(parsedSaved)) setCustomLayouts(parsedSaved);
      }
    } catch (err) {
      console.error('Error fetching custom layouts:', err);
      setCustomLayoutsError('Something went wrong while loading custom layouts.');
      const saved = localStorage.getItem('userCustomLayouts');
      const parsedSaved = safeJsonParse(saved, []);
      if (Array.isArray(parsedSaved)) setCustomLayouts(parsedSaved);
    } finally {
      setCustomLayoutsLoading(false);
    }
  };

  // Fetch product quotations (inquiries) for the user
  const fetchQuotations = async (userId) => {
    if (!userId) return;
    try {
      setQuotationsLoading(true);
      setQuotationsError(null);
      const url = `${QUOTATION_LIST_API}?user_id=${encodeURIComponent(userId)}`;
      const response = await fetch(url, { method: 'POST', headers: { Accept: 'application/json' } });
      const result = await response.json();
      if (result.status && Array.isArray(result.data)) {
        setQuotations(result.data);
      } else {
        setQuotationsError(result.message || 'Failed to load quotations');
        setQuotations([]);
      }
    } catch (err) {
      console.error('Error fetching quotations:', err);
      setQuotationsError('Something went wrong while loading your quotations.');
      setQuotations([]);
    } finally {
      setQuotationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'quotations' && userData?.id) {
      fetchQuotations(userData.id);
    }
  }, [activeTab, userData?.id]);

  const handleLogout = () => {
    localStorage.removeItem('infrioAuth');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handleFeedbackChange = (layoutId, feedback) => {
    setFeedbackData(prev => ({ ...prev, [layoutId]: feedback }));
  };

  const handleSubmitFeedback = (layout) => {
    if (layout.correctionsUsed >= 1) {
      alert('You have already used your one correction. Please contact support for further changes.');
      return;
    }

    const feedback = feedbackData[layout.id];
    if (!feedback || feedback.trim() === '') {
      alert('Please enter your feedback');
      return;
    }

    // Update layout with feedback
    const updatedLayouts = customLayouts.map(l => 
      l.id === layout.id 
        ? { ...l, feedbackGiven: true, correctionsUsed: l.correctionsUsed + 1, feedback }
        : l
    );
    setCustomLayouts(updatedLayouts);
    localStorage.setItem('userCustomLayouts', JSON.stringify(updatedLayouts));
    
    // Here you would send feedback to API
    console.log('Feedback submitted:', { layoutId: layout.id, feedback });
    
    alert('Feedback submitted successfully! The partner will review and make corrections.');
    setShowFeedbackModal(false);
    setFeedbackData(prev => {
      const newData = { ...prev };
      delete newData[layout.id];
      return newData;
    });
  };

  const openFeedbackModal = (layout) => {
    setSelectedLayout(layout);
    setShowFeedbackModal(true);
  };

  /** High-contrast status chips: Completed / Pending / Task Under Working */
  const renderCustomLayoutStatusBadge = (layout) => {
    const base = {
      display: 'inline-block',
      padding: '6px 14px',
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '0.02em',
      border: '1px solid rgba(0,0,0,0.12)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    };
    if (layout.approved_document) {
      return (
        <span style={{ ...base, backgroundColor: '#198754', color: '#ffffff' }}>Completed</span>
      );
    }
    if (layout.status === 1 || layout.status === 0) {
      return (
        <span style={{ ...base, backgroundColor: '#0b5ed7', color: '#ffffff' }}>Pending</span>
      );
    }
    return (
      <span style={{ ...base, backgroundColor: '#6f42c1', color: '#ffffff' }}>Task Under Working</span>
    );
  };

  const customLayoutPrimaryBtnStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'none',
    color: '#ffffff',
    backgroundColor: '#1a1a1a',
    border: `2px solid ${THEME_PRIMARY}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
  };

  if (loading || !userData) {
    return (
      <div className="section-full p-t80 p-b80 bg-gray" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="m-t20">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="User Account" noindex />
      <Header2 />
      <div className="page-content">
        <Banner
          title="My Account"
          pagename="User Dashboard"
          description="Manage your custom layout requests and view approved designs."
          bgimage={bannerImg}
        />
        
        <div className="section-full p-t80 p-b80 bg-gray">
          <div className="container">
            {/* User Info Card */}
            <div className="row m-b30">
              <div className="col-lg-12">
                <div className="bg-white shadow-sm p-a30 border-radius-10">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h3 className="m-b10">Welcome, {userData.name || 'User'}</h3>
                      <p className="text-muted m-b0">
                        <i className="fa fa-envelope m-r10"></i>{userData.email || 'N/A'}
                      </p>
                      <p className="text-muted m-b0">
                        <i className="fa fa-phone m-r10"></i>{userData.phone || 'N/A'}
                      </p>
                      <p className="text-muted m-b0">
                        <i className="fa fa-map-marker m-r10"></i>{userData.city || 'N/A'}
                      </p>
                    </div>
                    <button className="site-button-secondry" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="row">
              <div className="col-lg-12">
                <div className="bg-white shadow-sm border-radius-10 overflow-hidden">
                  <ul className="nav nav-tabs p-a20 m-b0" style={{ borderBottom: '2px solid #f0f0f0' }}>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requests')}
                        style={{ border: 'none', background: 'transparent', padding: '10px 20px', cursor: 'pointer' }}
                      >
                        My Custom Layouts
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'quotations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('quotations')}
                        style={{ border: 'none', background: 'transparent', padding: '10px 20px', cursor: 'pointer' }}
                      >
                        My Quotations
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                        style={{ border: 'none', background: 'transparent', padding: '10px 20px', cursor: 'pointer' }}
                      >
                        Profile
                      </button>
                    </li>
                  </ul>

                  <div className="p-a30">
                    {activeTab === 'requests' && (
                      <div>
                        <h4 className="m-b20">Custom Layout Requests</h4>
                        {customLayoutsLoading ? (
                          <div className="text-center p-a40">
                            <div className="spinner-border text-primary" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                            <p className="m-t20 text-muted">Loading your custom layout requests...</p>
                          </div>
                        ) : customLayoutsError ? (
                          <div className="alert alert-danger">
                            <i className="fa fa-exclamation-triangle m-r10"></i>
                            {customLayoutsError}
                            <button className="btn btn-sm btn-outline-danger m-l10" onClick={() => fetchCustomLayouts(userData.id)}>
                              Retry
                            </button>
                          </div>
                        ) : customLayouts.length === 0 ? (
                          <div className="text-center p-a40">
                            <p className="text-muted">No custom layout requests yet.</p>
                            <NavLink to="/architecture-layout-library" className="site-button btn-half m-t20">
                              Request Custom Layout
                            </NavLink>
                          </div>
                        ) : (
                          <div className="row" key="custom-layouts-list">
                            {customLayouts.map((layout) => (
                              <div key={layout.id} className="col-lg-6 col-md-12 m-b30">
                                <div className="bg-gray-light p-a20 border-radius-10 h-100" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                                  <div className="d-flex justify-content-between align-items-start m-b15">
                                    <div>
                                      <h5 className="m-b10" style={{ color: '#1a1a1a', fontWeight: 700 }}>
                                        Plot Size: {layout.plot_size || 'N/A'}
                                      </h5>
                                      {renderCustomLayoutStatusBadge(layout)}
                                    </div>
                                  </div>
                                  {(() => {
                                    const detailItems = [
                                      { label: 'Property Type', value: layout.property_type },
                                      { label: 'Plot Type', value: layout.plot_type },
                                      { label: 'Plot Direction', value: layout.plot_direction },
                                      { label: 'Construction Type', value: layout.construction_type },
                                      { label: 'Construction Stage', value: layout.construction_stage },
                                      { label: 'Floors', value: layout.floors },
                                      { label: 'Bedrooms/Rooms', value: layout.bedrooms_count },
                                      { label: 'Drawing/Living', value: layout.drawing_living },
                                      { label: 'Dining', value: layout.dining },
                                      { label: 'Kitchen', value: layout.kitchen },
                                      { label: 'Kitchen Store', value: layout.kitchen_store },
                                      { label: 'Toilets Count', value: layout.toilets_count },
                                      { label: 'Wash Area', value: layout.wash_area },
                                      { label: 'Temple', value: layout.temple },
                                      { label: 'Stairs', value: layout.stairs },
                                      { label: 'Two-wheeler Parking', value: layout.two_wheeler_parking },
                                      { label: 'Four-wheeler Parking', value: layout.four_wheeler_parking },
                                      { label: 'Completion Time', value: layout.completion_time },
                                      { label: 'Interior/Furniture', value: layout.interior_furniture },
                                      { label: 'Commercial Type', value: layout.commercial_type },
                                      { label: 'Requirements', value: layout.requirements },
                                      { label: 'Created', value: layout.created_at },
                                    ].filter(item => item.value !== null && item.value !== undefined && item.value !== '');

                                    if (!detailItems.length) return null;

                                    return (
                                      <ul className="list-unstyled small m-b15" style={{ color: '#333333', lineHeight: 1.55 }}>
                                        {detailItems.map((item, idx) => (
                                          <li key={idx} className="m-b5">
                                            <strong style={{ color: '#1a1a1a' }}>{item.label}:</strong>{' '}
                                            <span style={{ color: '#424242' }}>{item.value}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    );
                                  })()}
                                  {/* Show approved document if available */}
                                  {layout.approved_document && layout.approved_document.document && (
                                    <div className="m-b15">
                                      <a
                                        href={layout.approved_document.document}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={customLayoutPrimaryBtnStyle}
                                      >
                                        View Approved Document
                                      </a>
                                    </div>
                                  )}
                                  {layout.status === 1 && layout.plan_url && (
                                    <div className="m-b15">
                                      <a
                                        href={layout.plan_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={customLayoutPrimaryBtnStyle}
                                      >
                                        View Layout
                                      </a>
                                    </div>
                                  )}
                                  {layout.status === 1 && (
                                    <>
                                      {layout.correctionsUsed < 1 && (
                                        <button
                                          type="button"
                                          className="btn-sm m-t5"
                                          style={{
                                            padding: '8px 16px',
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            color: '#1a1a1a',
                                            backgroundColor: '#fff',
                                            border: `2px solid ${THEME_PRIMARY}`,
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => openFeedbackModal(layout)}
                                        >
                                          Give Feedback / Request Correction
                                        </button>
                                      )}
                                      {layout.feedbackGiven && (
                                        <p className="m-t10 m-b0" style={{ color: '#0f5132', fontWeight: 600, fontSize: 14 }}>
                                          ✓ Feedback submitted. Awaiting corrections.
                                        </p>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'quotations' && (
                      <div>
                        <h4 className="m-b20" style={{ color: '#1a1a1a', fontWeight: 700 }}>My Quotations</h4>
                        {quotationsLoading ? (
                          <div className="text-center p-a40">
                            <div className="spinner-border text-primary" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                            <p className="m-t20 text-muted">Loading your quotations...</p>
                          </div>
                        ) : quotationsError ? (
                          <div className="alert alert-danger d-flex align-items-center justify-content-between flex-wrap">
                            <span><i className="fa fa-exclamation-triangle m-r10"></i>{quotationsError}</span>
                            <button className="btn btn-sm btn-outline-danger m-t10 m-t0" onClick={() => fetchQuotations(userData.id)}>Retry</button>
                          </div>
                        ) : quotations.length === 0 ? (
                          <div className="text-center p-a40">
                            <p className="text-muted">No quotations yet.</p>
                            <NavLink to="/shop" className="site-button btn-half m-t20" style={{ background: THEME_PRIMARY, borderColor: THEME_PRIMARY }}>
                              Request New Quotation
                            </NavLink>
                          </div>
                        ) : (
                          <div className="row">
                            <div className="col-lg-12 quotation-list-wrap">
                              {quotations.map((q) => (
                                <div key={q.id} className="quotation-list-card">
                                  <div
                                    className="d-flex justify-content-between align-items-center flex-wrap"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setExpandedQuotationId(expandedQuotationId === q.id ? null : q.id)}
                                  >
                                    <div className="d-flex align-items-center flex-wrap" style={{ gap: 12 }}>
                                      <span className="quotation-list-id">Quotation #{q.id}</span>
                                      <span className="quotation-list-date">Requested: {q.created_at || 'N/A'}</span>
                                      <span className="quotation-list-total">Total: ₹{Number(q.total_price ?? 0).toLocaleString()}</span>
                                    </div>
                                    <span className="quotation-list-view">
                                      {expandedQuotationId === q.id ? '▼ Hide details' : '▶ View details'}
                                    </span>
                                  </div>
                                  {expandedQuotationId === q.id && Array.isArray(q.items) && q.items.length > 0 && (
                                    <div className="m-t20 p-t20 border-top">
                                      <h6 className="m-b15" style={{ color: '#333', fontWeight: 600 }}>Products in this quotation</h6>
                                      <div className="table-responsive">
                                        <table className="table table-bordered table-sm">
                                          <thead>
                                            <tr style={{ background: '#f5f2ef' }}>
                                              <th style={{ color: '#1a1a1a' }}>Product</th>
                                              <th style={{ color: '#1a1a1a' }}>Brand</th>
                                              <th style={{ color: '#1a1a1a' }}>Category</th>
                                              <th className="text-end" style={{ color: '#1a1a1a' }}>Price</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {q.items.map((item) => (
                                              <tr key={item.id || item.product_id}>
                                                <td>
                                                  <div className="d-flex align-items-center" style={{ gap: 12 }}>
                                                    {(item.product_thumbnail_img || item.product_photos?.[0]) && (
                                                      <img
                                                        src={item.product_thumbnail_img || item.product_photos[0]}
                                                        alt=""
                                                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                                                      />
                                                    )}
                                                    <button
                                                      type="button"
                                                      className="btn btn-link p-0 align-baseline text-start"
                                                      style={{ fontWeight: 500 }}
                                                      onClick={() => setSelectedQuotationProduct(mapInquiryItemToProduct(item))}
                                                    >
                                                      {item.name || '—'}
                                                    </button>
                                                  </div>
                                                </td>
                                                <td>{item.brand_name || '—'}</td>
                                                <td>{item.category_name || '—'}</td>
                                                <td className="text-end">₹{Number(item.price ?? 0).toLocaleString()}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="col-12 text-center m-t20">
                              <NavLink to="/shop" className="site-button btn-sm" style={{ background: THEME_PRIMARY, borderColor: THEME_PRIMARY }}>
                                Request New Quotation
                              </NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'profile' && (
                      <div>
                        <h4 className="m-b20">Profile Information</h4>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" value={userData.name || ''} readOnly />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <div className="d-flex align-items-center">
                              <input type="email" className="form-control" value={userData.email || ''} readOnly />
                              {userData.email_verified_at && (
                                <span className="badge bg-success m-l10" title="Email Verified">
                                  <i className="fa fa-check-circle"></i> Verified
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Phone</label>
                            <input type="text" className="form-control" value={userData.phone || ''} readOnly />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">City</label>
                            <input type="text" className="form-control" value={userData.city || ''} readOnly />
                          </div>
                          {userData.state && (
                            <div className="col-md-6 mb-3">
                              <label className="form-label">State</label>
                              <input type="text" className="form-control" value={userData.state} readOnly />
                            </div>
                          )}
                          {userData.country && (
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Country</label>
                              <input type="text" className="form-control" value={userData.country} readOnly />
                            </div>
                          )}
                          {userData.postal_code && (
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Postal Code</label>
                              <input type="text" className="form-control" value={userData.postal_code} readOnly />
                            </div>
                          )}
                          {userData.address && (
                            <div className="col-md-12 mb-3">
                              <label className="form-label">Address</label>
                              <textarea className="form-control" rows="3" value={userData.address} readOnly />
                            </div>
                          )}
                          {userData.our_service_type && (
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Service Type</label>
                              <input type="text" className="form-control" value={userData.our_service_type} readOnly />
                            </div>
                          )}
                          {userData.email_verified_at && (
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Email Verified At</label>
                              <input type="text" className="form-control" value={new Date(userData.email_verified_at).toLocaleString()} readOnly />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer2 />

      {/* Feedback Modal */}
      {showFeedbackModal && selectedLayout && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-content bg-white" style={{ borderRadius: '10px', width: 'min(95vw, 600px)', padding: '30px', position: 'relative' }}>
            <button onClick={() => setShowFeedbackModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✖</button>
            <h3 className="m-b20">Provide Feedback / Request Correction</h3>
            <p className="text-muted m-b20">You can request one correction. Please provide detailed feedback.</p>
            <textarea
              className="form-control m-b20"
              rows="6"
              placeholder="Enter your feedback or correction requirements..."
              value={feedbackData[selectedLayout.id] || ''}
              onChange={(e) => handleFeedbackChange(selectedLayout.id, e.target.value)}
            />
            <div className="text-right">
              <button className="site-button-secondry btn-half m-r10" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
              <button className="site-button btn-half" onClick={() => handleSubmitFeedback(selectedLayout)}>Submit Feedback</button>
            </div>
          </div>
        </div>
      )}

      {selectedQuotationProduct && (
        <ProductDetailModal
          product={selectedQuotationProduct}
          onClose={() => setSelectedQuotationProduct(null)}
        />
      )}
    </>
  );
};

export default UserAccount;

