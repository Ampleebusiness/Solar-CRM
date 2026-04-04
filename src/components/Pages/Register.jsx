import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SEO from '../Common/SEO';
import Banner from '../Elements/Banner';
import { SOLAR_IMAGES } from '../../data/solarImages';
import { AUTH_ENDPOINTS, SOLAR_ENDPOINTS } from '../../config/api';
import { fetchSolarStates, fetchSolarCities } from '../../api/solarLocations';

const bannerImg = require('./../../images/banner/6.jpg');

function phoneDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function isValidIndiaMobile10(digits) {
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

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
    password: '',
    address: '',
    sellerStateId: '',
    sellerCityId: '',
  });
  const [solarStatesList, setSolarStatesList] = useState([]);
  const [solarCitiesList, setSolarCitiesList] = useState([]);
  const [solarLocationsLoading, setSolarLocationsLoading] = useState(false);
  const [solarCitiesLoading, setSolarCitiesLoading] = useState(false);
  const [solarLocationsError, setSolarLocationsError] = useState(null);
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

  useEffect(() => {
    if (role !== 'partner') return undefined;
    let cancelled = false;
    (async () => {
      try {
        setSolarLocationsLoading(true);
        setSolarLocationsError(null);
        const list = await fetchSolarStates();
        if (!cancelled) setSolarStatesList(list);
      } catch {
        if (!cancelled) {
          setSolarStatesList([]);
          setSolarLocationsError('Could not load states. Please try again.');
        }
      } finally {
        if (!cancelled) setSolarLocationsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [role]);

  useEffect(() => {
    if (role !== 'partner' || !formState.sellerStateId) {
      setSolarCitiesList([]);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        setSolarCitiesLoading(true);
        const list = await fetchSolarCities(formState.sellerStateId);
        if (!cancelled) setSolarCitiesList(list);
      } catch {
        if (!cancelled) setSolarCitiesList([]);
      } finally {
        if (!cancelled) setSolarCitiesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [role, formState.sellerStateId]);

  useEffect(() => {
    const pending = location.state?.pendingVerifyEmail;
    if (!pending || typeof pending !== 'string') return undefined;
    setRole('partner');
    setRegisteredEmail(pending.trim());
    setShowVerification(true);
    setVerificationCode('');
    navigate(location.pathname, { replace: true, state: { role: 'partner' } });
    return undefined;
  }, [location.state, location.pathname, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sellerStateId') {
      setFormState((prev) => ({ ...prev, sellerStateId: value, sellerCityId: '' }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
    if (error) setError(null);
  };

  const setRoleAndReset = (next) => {
    setRole(next);
    setFormState((prev) => ({
      ...prev,
      city: '',
      sellerStateId: '',
      sellerCityId: '',
      address: '',
    }));
    setSolarCitiesList([]);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const mobile = phoneDigits(formState.phone);
    if (!isValidIndiaMobile10(mobile)) {
      setError('Phone: Enter a valid 10-digit Indian mobile number (starts with 6–9).');
      setIsSubmitting(false);
      return;
    }

    if (role === 'partner') {
      const addr = String(formState.address || '').trim();
      const stateId = String(formState.sellerStateId || '').trim();
      const cityId = String(formState.sellerCityId || '').trim();
      if (!addr) {
        setError('Address is required for Solar Seller registration.');
        setIsSubmitting(false);
        return;
      }
      if (!stateId) {
        setError('State is required.');
        setIsSubmitting(false);
        return;
      }
      if (!cityId || !solarCitiesList.some((c) => String(c.id) === cityId)) {
        setError('Please select a valid city for the chosen state.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (role === 'partner') {
        const addr = String(formState.address || '').trim();
        const stateId = String(formState.sellerStateId || '').trim();
        const cityId = String(formState.sellerCityId || '').trim();
        const solarForm = new FormData();
        solarForm.append('full_name', String(formState.name || '').trim());
        solarForm.append('phone_number', mobile);
        solarForm.append('email', String(formState.email || '').trim());
        solarForm.append('password', formState.password);
        solarForm.append('address', addr);
        solarForm.append('state_id', stateId);
        solarForm.append('city_id', cityId);

        const { data: result } = await axios.post(SOLAR_ENDPOINTS.STORE, solarForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (result.success) {
          setRegisteredEmail(String(formState.email || '').trim());
          setVerificationCode('');
          setShowVerification(true);
          setIsSubmitting(false);
          return;
        }

        if (result.message && typeof result.message === 'object') {
          const first = Object.values(result.message).flat().find((m) => typeof m === 'string');
          setError(first || 'Registration failed. Please check your details.');
        } else {
          setError(result.message || 'Registration failed. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('phone', mobile);
      formData.append('email', formState.email);
      formData.append('city', formState.city);
      formData.append('password', formState.password);
      formData.append('user_type', 'customer');

      const serviceTypeMap = {
        '15 Days': '15',
        '1 Month': '30',
        '2 Months': '60',
      };
      formData.append('our_service_type', serviceTypeMap[formState.timeline] || '15');

      const { data: result } = await axios.post(AUTH_ENDPOINTS.REGISTER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (result.success && result.data) {
        setRegisteredEmail(formState.email);
        setShowVerification(true);
        setIsSubmitting(false);
      } else {
        if (result.message && typeof result.message === 'object') {
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
      const apiMsg = err.response?.data?.message;
      if (apiMsg && typeof apiMsg === 'object') {
        const first = Object.values(apiMsg).flat().find((m) => typeof m === 'string');
        setError(first || 'Registration failed. Please check your details.');
      } else if (typeof apiMsg === 'string') {
        setError(apiMsg);
      } else {
        setError('Something went wrong. Please try again.');
      }
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

      const response = await axios.post(AUTH_ENDPOINTS.VERIFY_EMAIL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const result = response.data;

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
            const stateName =
              solarStatesList.find((s) => String(s.id) === String(formState.sellerStateId))?.name || '';
            const cityName =
              solarCitiesList.find((c) => String(c.id) === String(formState.sellerCityId))?.name || '';
            localStorage.setItem('partnerInfo', JSON.stringify({
              id: result.data.id,
              name: result.data.name,
              email: result.data.email,
              phone: formState.phone,
              city: cityName,
              address: formState.address,
              state: stateName,
              joinAs: 'Solar Seller'
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
      const apiMsg = err.response?.data?.message;
      if (typeof apiMsg === 'string') setError(apiMsg);
      else setError('Something went wrong. Please try again.');
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

  const partnerSellerFields = (
    <>
      {solarLocationsError && (
        <div className="alert alert-warning" role="alert">
          {solarLocationsError}
        </div>
      )}
      <div className="form-row">
        <div className="form-group col-md-6">
          <label>State *</label>
          <select
            name="sellerStateId"
            className="form-control"
            value={formState.sellerStateId}
            onChange={handleChange}
            required={role === 'partner'}
            disabled={solarLocationsLoading || solarStatesList.length === 0}
          >
            <option value="">{solarLocationsLoading ? 'Loading states…' : 'Select state'}</option>
            {solarStatesList.map((s) => (
              <option value={String(s.id)} key={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group col-md-6">
          <label>City *</label>
          <select
            name="sellerCityId"
            className="form-control"
            value={formState.sellerCityId}
            onChange={handleChange}
            disabled={!formState.sellerStateId || solarCitiesLoading}
            required={role === 'partner'}
          >
            <option value="">
              {!formState.sellerStateId
                ? 'Select state first'
                : solarCitiesLoading
                  ? 'Loading cities…'
                  : 'Select city'}
            </option>
            {solarCitiesList.map((c) => (
              <option value={String(c.id)} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
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
                <div className="bg-white p-a40 shadow rounded solar-register-page">
                  <div className="text-center m-b30">
                    <h3>Create Your Account</h3>
                    <p className="text-muted">
                      {role === 'partner'
                        ? 'Solar seller details match our Become a Seller signup. Password stays below.'
                        : 'Choose the account type that best describes you.'}
                    </p>
                    <div className="m-t15 solar-register-role-toggle" role="group" aria-label="Account type">
                      <button
                        type="button"
                        className={`btn ${role === 'normal' ? 'solar-role-btn solar-role-btn--active' : 'solar-role-btn solar-role-btn--inactive'}`}
                        onClick={() => setRoleAndReset('normal')}
                      >
                        Normal User
                      </button>
                      <button
                        type="button"
                        className={`btn ${role === 'partner' ? 'solar-role-btn solar-role-btn--active' : 'solar-role-btn solar-role-btn--inactive'}`}
                        onClick={() => setRoleAndReset('partner')}
                      >
                        Solar Seller
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
                            className={`form-control ${error && /phone/i.test(error) ? 'is-invalid' : ''}`}
                            value={formState.phone}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setFormState((prev) => ({ ...prev, phone: v }));
                              if (error) setError(null);
                            }}
                            inputMode="numeric"
                            maxLength={10}
                            autoComplete="tel"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className={`form-group ${role === 'normal' ? 'col-md-6' : 'col-md-6'}`}>
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
                        {role === 'normal' ? (
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
                        ) : (
                        
                          <div className="form-group col-md-6">
                            <label>Address *</label>
                            <input
                              type="text"
                              name="address"
                              className="form-control"
                              value={formState.address}
                              onChange={handleChange}
                              required={role === 'partner'}
                              autoComplete="street-address"
                            />
                          </div>
                        )
                        }
                      </div>

                      {role === 'normal' ? normalFields : partnerSellerFields}

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
                        {role === 'partner'
                          ? 'OTP sent to your email. Enter the code below to verify.'
                          : 'Registration successful! Please verify your email.'}
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


