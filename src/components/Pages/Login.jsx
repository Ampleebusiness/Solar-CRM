import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SEO from '../Common/SEO';
import Banner from '../Elements/Banner';
import { SOLAR_IMAGES } from '../../data/solarImages';
import { AUTH_ENDPOINTS, SOLAR_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const bannerImg = require('./../../images/banner/10.jpg');
const loginIllustration = require('./../../images/solar/8.jpg');

const loginToggleEyeBtnStyle = {
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

/** Solar login failed — backend often asks to verify email first */
function solarLoginNeedsEmailVerification(message) {
  if (!message || typeof message !== 'string') return false;
  const m = message.toLowerCase();
  return (
    m.includes('not activated') ||
    m.includes('not verified') ||
    m.includes('unverified') ||
    m.includes('verify your email') ||
    m.includes('email verification') ||
    m.includes('verify email') ||
    m.includes('please verify') ||
    (m.includes('email') && (m.includes('verify') || m.includes('otp')))
  );
}

function solarLoginMessageString(solarResult) {
  const { message } = solarResult || {};
  if (typeof message === 'string') return message;
  if (message && typeof message === 'object') {
    const flat = Object.values(message).flat();
    const first = flat.find((x) => typeof x === 'string');
    if (first) return first;
  }
  return '';
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsSeller } = useAuth();
  /** `normal` = auth login; `partner` = solar seller login → seller dashboard */
  const [role, setRole] = useState('normal');
  const [formState, setFormState] = useState({ identifier: '', password: '' });
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  /** `auth` = normal user verify-email; `solar` = solar seller verify-otp */
  const [verificationKind, setVerificationKind] = useState('auth');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  /** When solar verify opened after phone login — user enters registered email */
  const [solarVerifyEmailInput, setSolarVerifyEmailInput] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const setLoginRole = (next) => {
    setRole(next);
    setError(null);
    setFeedback(null);
    setShowVerification(false);
    setVerificationKind('auth');
    setVerificationCode('');
    setPendingEmail('');
    setSolarVerifyEmailInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      if (role === 'partner') {
        const id = String(formState.identifier || '').trim();
        const solarFd = new FormData();
        solarFd.append('password', formState.password);
        if (id.includes('@')) {
          solarFd.append('email', id);
        } else {
          solarFd.append('phone_number', id.replace(/\D/g, ''));
        }

        const solarRes = await fetch(SOLAR_ENDPOINTS.LOGIN, {
          method: 'POST',
          body: solarFd,
        });
        const solarResult = await solarRes.json();

        if (solarResult.success && solarResult.data) {
          const d = solarResult.data;
          loginAsSeller({
            id: d.solar_user_id ?? d.id ?? d.user_id,
            fullName: d.full_name ?? d.name ?? '',
            phone: d.phone_number ?? d.phone ?? id.replace(/\D/g, ''),
            email: d.email ?? (id.includes('@') ? id : ''),
            address: d.address ?? '',
            state: d.state_name ?? d.state ?? '',
            city: d.city ?? '',
            accessToken: d.access_token ?? d.token ?? '',
            refreshToken: d.refresh_token ?? '',
          });
          setIsSubmitting(false);
        } else {
          const msgStr = solarLoginMessageString(solarResult);
          if (solarLoginNeedsEmailVerification(msgStr)) {
            setVerificationKind('solar');
            if (id.includes('@')) {
              setPendingEmail(id.trim().toLowerCase());
              setSolarVerifyEmailInput('');
            } else {
              setPendingEmail('');
              setSolarVerifyEmailInput('');
            }
            setVerificationCode('');
            setShowVerification(true);
            setIsSubmitting(false);
            return;
          }
          setError(msgStr || 'Login failed. Please check your credentials.');
        }
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('login', formState.identifier);
      formData.append('password', formState.password);

      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Determine user role from user_type
        const userRole = result.data.user_type === 'customer' ? 'normal' : 
                        result.data.user_type === 'partner' ? 'partner' : 'normal';
        
        // Store auth data
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'infrioAuth',
            JSON.stringify({
              role: userRole,
              identifier: formState.identifier,
              userId: result.data.id,
              accessToken: result.data.access_token,
              refreshToken: result.data.refresh_token
            })
          );

          // Store user info
          if (userRole === 'normal') {
            localStorage.setItem('userInfo', JSON.stringify({
              id: result.data.id,
              name: result.data.name,
              email: result.data.email,
              user_type: result.data.user_type
            }));
          } else {
            localStorage.setItem('partnerInfo', JSON.stringify({
              id: result.data.id,
              name: result.data.name,
              email: result.data.email,
              user_type: result.data.user_type
            }));
          }
        }

        setFeedback('Login successful! Redirecting…');
        setTimeout(() => {
          const redirectPath = location.state?.redirect || (userRole === 'normal' ? '/user-account' : '/partner-account');
          navigate(redirectPath);
        }, 800);
      } else {
        // Check if account is not activated
        if (result.message && result.message.includes('not activated')) {
          setVerificationKind('auth');
          setPendingEmail(formState.identifier);
          setShowVerification(true);
          setIsSubmitting(false);
        } else {
          setError(result.message || 'Login failed. Please check your credentials.');
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (verificationKind === 'solar') {
        const emailForSolar = (pendingEmail || solarVerifyEmailInput).trim().toLowerCase();
        if (!emailForSolar || !emailForSolar.includes('@')) {
          setError('Enter your registered email to verify.');
          setIsSubmitting(false);
          return;
        }
        const otp = String(verificationCode || '').replace(/\D/g, '').slice(0, 5);
        if (otp.length < 5) {
          setError('Enter the 5-digit OTP from your email.');
          setIsSubmitting(false);
          return;
        }
        const solarFd = new FormData();
        solarFd.append('email', emailForSolar);
        solarFd.append('otp', otp);
        const solarRes = await fetch(SOLAR_ENDPOINTS.VERIFY_OTP, {
          method: 'POST',
          body: solarFd,
        });
        const solarResult = await solarRes.json();

        if (solarResult.success && solarResult.data) {
          const d = solarResult.data;
          loginAsSeller({
            id: d.solar_user_id ?? d.id ?? d.user_id,
            fullName: d.full_name ?? d.name ?? '',
            phone: d.phone_number ?? d.phone ?? '',
            email: d.email ?? emailForSolar,
            address: d.address ?? '',
            state: d.state_name ?? d.state ?? '',
            city: d.city ?? '',
            accessToken: d.access_token ?? d.token ?? '',
            refreshToken: d.refresh_token ?? '',
          });
          setIsSubmitting(false);
          return;
        }
        setError(solarLoginMessageString(solarResult) || 'Verification failed. Check the OTP.');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('email', pendingEmail);
      formData.append('code', verificationCode);

      const response = await fetch(AUTH_ENDPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        // After verification, try login again
        const loginFormData = new FormData();
        loginFormData.append('login', pendingEmail);
        loginFormData.append('password', formState.password);

        const loginResponse = await fetch(AUTH_ENDPOINTS.LOGIN, {
          method: 'POST',
          body: loginFormData,
        });

        const loginResult = await loginResponse.json();

        if (loginResult.success && loginResult.data) {
          const userRole = loginResult.data.user_type === 'customer' ? 'normal' : 
                          loginResult.data.user_type === 'partner' ? 'partner' : 'normal';
          
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'infrioAuth',
              JSON.stringify({
                role: userRole,
                identifier: pendingEmail,
                userId: loginResult.data.id,
                accessToken: loginResult.data.access_token,
                refreshToken: loginResult.data.refresh_token
              })
            );

            if (userRole === 'normal') {
              localStorage.setItem('userInfo', JSON.stringify({
                id: loginResult.data.id,
                name: loginResult.data.name,
                email: loginResult.data.email,
                user_type: loginResult.data.user_type
              }));
            } else {
              localStorage.setItem('partnerInfo', JSON.stringify({
                id: loginResult.data.id,
                name: loginResult.data.name,
                email: loginResult.data.email,
                user_type: loginResult.data.user_type
              }));
            }
          }

          setFeedback('Email verified and login successful! Redirecting…');
          setTimeout(() => {
            const redirectPath = location.state?.redirect || (userRole === 'normal' ? '/user-account' : '/partner-account');
            navigate(redirectPath);
          }, 800);
        } else {
          setError('Verification successful. Please try logging in again.');
          setShowVerification(false);
          setIsSubmitting(false);
        }
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

  const handleSolarResendOtp = async () => {
    const emailForSolar = (pendingEmail || solarVerifyEmailInput).trim().toLowerCase();
    if (!emailForSolar || !emailForSolar.includes('@')) {
      setError('Enter your registered email first.');
      return;
    }
    setResendLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('email', emailForSolar);
      const res = await fetch(SOLAR_ENDPOINTS.RESEND_OTP, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setFeedback(typeof data.message === 'string' ? data.message : 'OTP sent. Check your email.');
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setError(solarLoginMessageString(data) || 'Could not resend OTP.');
      }
    } catch {
      setError('Could not resend OTP. Try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <SEO
        titleExact
        title="Login to Infrio India – Access Your Design Dashboard"
        description="Login to your Infrio India account to manage projects, explore architecture and interior design services, track design solutions and connect with our expert team for sustainable and modern design and build services."
        keywords="Infrio login, infrio india login, architecture service login, interior design platform login, design and build dashboard, manage architecture projects online, sustainable design service portal, infrio client account login, architecture firm customer login"
        canonicalPath="/login"
        noindex
      />
      <Header2 />
      <div className="page-content">
        <Banner
          title="Login to Infrio Solar Account"
          pagename="Login"
          description="Login to access your dashboard and manage your services better."
          bgimage={SOLAR_IMAGES.bannerSellers}
        />
        <div className="section-full p-t80 p-b80 bg-light">
          <div className="container">
            <div className="row align-items-stretch">
              <div className="col-lg-6 col-md-12 m-b30 d-flex flex-column">
                <div className="login-page-illustration-wrap">
                  <img
                    src={loginIllustration}
                    alt="Solar panels"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="p-a40 bg-dark text-white rounded shadow">
                  <h3 className="m-b10">Welcome Back!</h3>
                  <p className="text-muted text-white">Login to your account</p>

                  <div className="m-t15 m-b20 solar-register-role-toggle" role="group" aria-label="Login as">
                    <button
                      type="button"
                      className={`btn ${role === 'normal' ? 'solar-role-btn solar-role-btn--active' : 'solar-role-btn solar-role-btn--inactive'}`}
                      onClick={() => setLoginRole('normal')}
                    >
                      Normal User
                    </button>
                    <button
                      type="button"
                      className={`btn ${role === 'partner' ? 'solar-role-btn solar-role-btn--active' : 'solar-role-btn solar-role-btn--inactive'}`}
                      onClick={() => setLoginRole('partner')}
                    >
                      Solar Seller
                    </button>
                  </div>

                  {!showVerification ? (
                    <>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group m-b20">
                          <label>{role === 'partner' ? 'Email or mobile' : 'Phone / Email'}</label>
                          <input
                            type="text"
                            name="identifier"
                            className="form-control"
                            placeholder="example@email.com"
                            value={formState.identifier}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="form-group m-b20">
                          <label>Password</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              className="form-control"
                              placeholder="Enter password"
                              value={formState.password}
                              onChange={handleChange}
                              required
                              style={{ paddingRight: 44 }}
                              autoComplete="current-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              style={loginToggleEyeBtnStyle}
                            >
                              <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden />
                            </button>
                          </div>
                          <div className="text-right m-t8">
                            <NavLink to="/forgot-password" className="text-primary" style={{ fontSize: '0.9rem' }}>
                              Forgot password?
                            </NavLink>
                          </div>
                        </div>

                        <button type="submit" className="site-button btn-block" disabled={isSubmitting}>
                          <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
                        </button>
                      </form>
                      {error && <p className="text-danger text-center m-t15">{error}</p>}
                      {feedback && <p className="text-success text-center m-t15">{feedback}</p>}
                    </>
                  ) : (
                    <div>
                      <div className="alert alert-warning m-b20">
                        <i className="fa fa-exclamation-triangle m-r10"></i>
                        {verificationKind === 'solar'
                          ? 'Your solar seller email is not verified yet. Enter the OTP sent to your email, then you can access the dashboard.'
                          : 'Your account is not activated yet. Please verify your email to continue.'}
                      </div>
                      <form onSubmit={handleVerificationSubmit}>
                        {verificationKind === 'solar' && !pendingEmail && (
                          <div className="form-group m-b20">
                            <label>Registered email</label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="you@example.com"
                              value={solarVerifyEmailInput}
                              onChange={(e) => {
                                setSolarVerifyEmailInput(e.target.value);
                                if (error) setError(null);
                              }}
                              autoComplete="email"
                              required
                            />
                          </div>
                        )}
                        {verificationKind === 'solar' && pendingEmail && (
                          <p className="text-muted small m-b15">
                            OTP will be sent / verified for <strong>{pendingEmail}</strong>
                          </p>
                        )}
                        <div className="form-group m-b20">
                          <label>{verificationKind === 'solar' ? 'OTP' : 'Verification Code'}</label>
                          {verificationKind === 'auth' && (
                            <p className="text-muted small m-b10">
                              We&apos;ve sent a verification code to <strong>{pendingEmail}</strong>. Please enter it
                              below.
                            </p>
                          )}
                          <input
                            type="text"
                            className="form-control text-center"
                            style={{ fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold' }}
                            value={verificationCode}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 5);
                              setVerificationCode(v);
                              if (error) setError(null);
                            }}
                            placeholder="Enter 5-digit code"
                            maxLength={5}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            required
                          />
                        </div>

                        {error && <p className="text-danger text-center m-t15">{error}</p>}
                        {feedback && <p className="text-success text-center m-t15">{feedback}</p>}

                        <button type="submit" className="site-button btn-block" disabled={isSubmitting}>
                          <span>{isSubmitting ? 'Verifying...' : verificationKind === 'solar' ? 'Verify OTP' : 'Verify Email'}</span>
                        </button>

                        {verificationKind === 'solar' && (
                          <div className="text-center m-t15">
                            <button
                              type="button"
                              className="btn btn-link text-white"
                              disabled={resendLoading}
                              onClick={handleSolarResendOtp}
                            >
                              {resendLoading ? 'Sending…' : 'Resend OTP'}
                            </button>
                          </div>
                        )}

                        <div className="text-center m-t20">
                          <button
                            type="button"
                            className="btn btn-link text-white"
                            onClick={() => {
                              setShowVerification(false);
                              setVerificationKind('auth');
                              setVerificationCode('');
                              setError(null);
                              setPendingEmail('');
                              setSolarVerifyEmailInput('');
                            }}
                          >
                            Back to Login
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="text-center m-t20">
                    <p className="m-b0">
                      New to Infrio?{' '}
                     
                      <NavLink
                        to="/register"
                        className="text-primary"
                        state={{ role: role === 'partner' ? 'partner' : undefined }}
                      >
                        <span>Create an account</span>
                      </NavLink>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default Login;


