import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SEO from '../Common/SEO';
import Banner from '../Elements/Banner';
import { SOLAR_IMAGES } from '../../data/solarImages';

const bannerImg = require('./../../images/banner/6.jpg');

const registerToggleEyeBtnStyle = {
  position: 'absolute',
  right: 8,
  top: '50%',
  transform: 'translateY(-50%)',
  width: 36,
  height: 36,
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: '#666',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6,
};

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(() => (location.state?.role === 'partner' ? 'partner' : 'normal'));
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    timeline: '15 Days',
    joinAs: 'Freelancer',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailVerifiedModal, setShowEmailVerifiedModal] = useState(false);

  const goToLoginAfterVerify = useCallback(() => {
    setShowEmailVerifiedModal(false);
    navigate('/login', {
      state: { redirect: role === 'normal' ? '/user-account' : '/partner-account' },
    });
  }, [navigate, role]);

  useEffect(() => {
    if (!showEmailVerifiedModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showEmailVerifiedModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for the request
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('phone', formState.phone);
      formData.append('email', formState.email);
      formData.append('city', formState.city);
      formData.append('password', formState.password);
      formData.append('user_type', role === 'normal' ? 'customer' : 'partner');
      
      // Add service type based on role
      if (role === 'normal') {
        // Map timeline to service type (15 Days = 15, 1 Month = 30, 2 Months = 60)
        const serviceTypeMap = {
          '15 Days': '15',
          '1 Month': '30',
          '2 Months': '60'
        };
        formData.append('our_service_type', serviceTypeMap[formState.timeline] || '15');
      } else {
        // For partner, use join_us field
        formData.append('join_us', formState.joinAs);
      }

      // Make API call
      const response = await fetch('https://www.admin.infrioindia.com/api/v2/auth/register', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Store registration data temporarily
        setRegisteredEmail(formState.email);
        setShowVerification(true);
        setIsSubmitting(false);
      } else {
        // Handle errors
        if (result.message && typeof result.message === 'object') {
          // Email already exists error
          if (result.message.email && Array.isArray(result.message.email)) {
            setError(result.message.email[0]);
          } else {
            setError('Registration failed. Please check your details.');
          }
        } else {
          setError(result.message || 'Registration failed. Please try again.');
        }
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('email', registeredEmail);
      formData.append('code', verificationCode);

      const response = await fetch('https://www.admin.infrioindia.com/api/v2/auth/verify-email', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Store user info
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInfo', JSON.stringify({
            id: result.data.id,
            name: result.data.name,
            email: result.data.email,
            phone: formState.phone,
            city: formState.city,
            user_type: result.data.user_type || (role === 'normal' ? 'customer' : 'partner'),
            email_verified_at: result.data.email_verified_at
          }));

          if (role === 'partner') {
            localStorage.setItem('partnerInfo', JSON.stringify({
              id: result.data.id,
              name: result.data.name,
              email: result.data.email,
              phone: formState.phone,
              city: formState.city,
              joinAs: formState.joinAs
            }));
          }
        }

        setShowEmailVerifiedModal(true);
        setIsSubmitting(false);
      } else {
        setError(result.message || 'Verification failed. Please check the code.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const normalFields = (
    <>
      <div className="form-group">
        <label>How soon do you want our service?</label>
        <select
          name="timeline"
          className="form-control"
          value={formState.timeline}
          onChange={handleChange}
        >
          {['15 Days', '1 Month', '2 Months'].map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  const partnerFields = (
    <>
      <div className="form-group">
        <label>Join us as</label>
        <select name="joinAs" className="form-control" value={formState.joinAs} onChange={handleChange}>
          {['Freelancer', 'Architect', 'Interior Designer', 'Vendor', 'Others'].map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <>
      <SEO
        titleExact
        title="Register with Infrio India – Start Your Design Journey"
        description="Create your Infrio India account to explore architecture, interior design and design-build services. Register to get personalised design support, sustainable project solutions and expert guidance for residential and commercial spaces."
        keywords="infrio register, infrio india sign up, architecture services registration, interior design consultation signup, design and build services account, sustainable architecture solutions registration, create infrio account, join infrio design platform, architecture firm registration india"
        canonicalPath="/register"
        noindex
      />
      <Header2 />
      <div className="page-content">
        <Banner
          title="Create Account"
          pagename="Register"
          description="Join the Infrio community and get started with design services or collaborate as a partner."
          bgimage={SOLAR_IMAGES.bannerSellers}
        />
        <div className="section-full p-t80 p-b80">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
                <div className="bg-white p-a40 shadow rounded">
                  <div className="text-center m-b30">
                    <h3>Create Your Account</h3>
                    <p className="text-muted">Choose the account type that best describes you.</p>
                    <div className="btn-group m-t15 solar-register-role-toggle" role="group">
                      <button
                        type="button"
                        className={`btn ${role === 'normal' ? 'solar-role-btn solar-role-btn--active' : 'solar-role-btn solar-role-btn--inactive'}`}
                        onClick={() => setRole('normal')}
                      >
                        Normal User
                      </button>
                      <button
                        type="button"
                        className={`btn ${role === 'partner' ? 'solar-role-btn solar-role-btn--active' : 'solar-role-btn solar-role-btn--inactive'}`}
                        onClick={() => setRole('partner')}
                      >
                        Seller
                      </button>
                    </div>
                  </div>

                  {!showVerification ? (
                    <form onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Name</label>
                          <input
                            type="text"
                            name="name"
                            className={`form-control ${error && error.includes('name') ? 'is-invalid' : ''}`}
                            value={formState.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Phone</label>
                          <input
                            type="text"
                            name="phone"
                            className={`form-control ${error && error.includes('phone') ? 'is-invalid' : ''}`}
                            value={formState.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            className={`form-control ${error && error.includes('email') ? 'is-invalid' : ''}`}
                            value={formState.email}
                            onChange={handleChange}
                            required
                          />
                          {error && error.includes('email') && (
                            <div className="invalid-feedback d-block">{error}</div>
                          )}
                        </div>
                        <div className="form-group col-md-6">
                          <label>City</label>
                          <input
                            type="text"
                            name="city"
                            className={`form-control ${error && error.includes('city') ? 'is-invalid' : ''}`}
                            value={formState.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {role === 'normal' ? normalFields : partnerFields}

                      <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className={`form-control ${error && error.includes('password') ? 'is-invalid' : ''}`}
                            value={formState.password}
                            onChange={handleChange}
                            required
                            style={{ paddingRight: 44 }}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            style={registerToggleEyeBtnStyle}
                          >
                            <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden />
                          </button>
                        </div>
                      </div>

                      {error && !error.includes('email') && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <button type="submit" className="site-button btn-block" disabled={isSubmitting}>
                        <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                      </button>
                    </form>
                  ) : (
                    <div>
                      <div className="alert alert-success m-b20">
                        <i className="fa fa-check-circle m-r10"></i>
                        Registration successful! Please verify your email.
                      </div>
                      <form onSubmit={handleVerificationSubmit}>
                        <div className="form-group">
                          <label>Verification Code</label>
                          <p className="text-muted small m-b10">
                            We've sent a verification code to <strong>{registeredEmail}</strong>. Please enter it below.
                          </p>
                          <input
                            type="text"
                            className="form-control text-center"
                            style={{ fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold' }}
                            value={verificationCode}
                            onChange={(e) => {
                              setVerificationCode(e.target.value);
                              if (error) setError(null);
                            }}
                            placeholder="Enter 5-digit code"
                            maxLength="5"
                            required
                          />
                        </div>

                        {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        )}

                        <button type="submit" className="site-button btn-block" disabled={isSubmitting}>
                          <span>{isSubmitting ? 'Verifying...' : 'Verify Email'}</span>
                        </button>

                        <div className="text-center m-t20">
                          <button
                            type="button"
                            className="btn btn-link"
                            onClick={() => {
                              setShowVerification(false);
                              setVerificationCode('');
                              setError(null);
                            }}
                          >
                            Back to Registration
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer2 />

      {showEmailVerifiedModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-verified-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.55)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(12px, 4vw, 24px)',
          }}
        >
          <div
            className="modal-content bg-white"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderRadius: 12,
              width: 'min(95vw, 440px)',
              maxWidth: '100%',
              padding: 'clamp(20px, 5vw, 32px)',
              position: 'relative',
              boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
            }}
          >
            <div className="text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle m-b20"
                style={{
                  width: 64,
                  height: 64,
                  background: 'rgba(25, 135, 84, 0.12)',
                }}
                aria-hidden
              >
                <i className="fa fa-check text-success" style={{ fontSize: 28 }} />
              </div>
              <h4 id="email-verified-title" className="m-b10" style={{ fontWeight: 700, color: '#1a1a1a' }}>
                Email verified successfully
              </h4>
              <p className="m-b0 m-t10" style={{ color: '#444', fontSize: 'clamp(14px, 3.5vw, 16px)', lineHeight: 1.5 }}>
                Your account is ready. Continue to sign in and access your dashboard.
              </p>
              <button
                type="button"
                className="site-button btn-block m-t25"
                style={{ minHeight: 48 }}
                onClick={goToLoginAfterVerify}
              >
                Continue to login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;


