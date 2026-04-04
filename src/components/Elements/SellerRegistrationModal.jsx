import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { SOLAR_ENDPOINTS } from '../../config/api';
import { fetchSolarStates, fetchSolarCities } from '../../api/solarLocations';

const modalToggleEyeBtnStyle = {
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

const PHONE_DIGITS_ONLY = /^\d+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

function validateForm(values, cityOptions) {
  const errors = {};

  const fullName = String(values.fullName || '').trim();
  if (!fullName) errors.fullName = 'Full Name is required.';

  const phoneDigits = digitsOnly(values.phone);
  if (!phoneDigits) errors.phone = 'Phone Number is required.';
  else if (!PHONE_DIGITS_ONLY.test(phoneDigits)) errors.phone = 'Phone must contain digits only.';
  else if (phoneDigits.length !== 10) errors.phone = 'Phone must be exactly 10 digits.';
  else if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    errors.phone = 'Enter a valid Indian mobile number (starts with 6–9).';
  }

  const email = String(values.email || '').trim();
  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

  const address = String(values.address || '').trim();
  if (!address) errors.address = 'Address is required.';

  const stateId = String(values.stateId || '').trim();
  if (!stateId) errors.stateId = 'State is required.';

  const cityId = String(values.cityId || '').trim();
  if (!cityId) errors.cityId = 'City is required.';
  else if (!cityOptions.some((c) => String(c.id) === cityId)) {
    errors.cityId = 'Please select a city from the dropdown.';
  }

  const password = String(values.password || '');
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';

  return errors;
}

export default function SellerRegistrationModal() {
  const navigate = useNavigate();
  const { sellerRegistrationOpen, closeSellerRegistration, auth } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    stateId: '',
    cityId: '',
    password: '',
  });

  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [locationsError, setLocationsError] = useState(null);

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!sellerRegistrationOpen) return undefined;
    let cancelled = false;
    (async () => {
      try {
        setStatesLoading(true);
        setLocationsError(null);
        const list = await fetchSolarStates();
        if (!cancelled) setStatesList(list);
      } catch {
        if (!cancelled) {
          setStatesList([]);
          setLocationsError('Could not load states. Please try again.');
        }
      } finally {
        if (!cancelled) setStatesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sellerRegistrationOpen]);

  useEffect(() => {
    if (!sellerRegistrationOpen || !form.stateId) {
      setCitiesList([]);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        setCitiesLoading(true);
        const list = await fetchSolarCities(form.stateId);
        if (!cancelled) setCitiesList(list);
      } catch {
        if (!cancelled) setCitiesList([]);
      } finally {
        if (!cancelled) setCitiesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sellerRegistrationOpen, form.stateId]);

  const errors = useMemo(() => validateForm(form, citiesList), [form, citiesList]);
  const isValid = Object.keys(errors).length === 0;

  const shouldShow = (key) => touched[key] || submitError || false;

  if (!sellerRegistrationOpen) return null;

  if (auth?.role === 'seller') {
    closeSellerRegistration();
    return null;
  }

  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      if (key === 'stateId') return { ...prev, stateId: value, cityId: '' };
      return { ...prev, [key]: value };
    });
    setTouched((prev) => ({ ...prev, [key]: true }));
    setSubmitError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    setTouched({
      fullName: true,
      phone: true,
      email: true,
      address: true,
      stateId: true,
      cityId: true,
      password: true,
    });

    if (!isValid) return;

    const stateId = String(form.stateId || '').trim();
    const cityId = String(form.cityId || '').trim();
    if (!stateId || !cityId) {
      setSubmitError('Please select state and city.');
      return;
    }

    try {
      setSubmitting(true);
      const body = new FormData();
      body.append('full_name', form.fullName.trim());
      body.append('phone_number', digitsOnly(form.phone));
      body.append('email', form.email.trim().toLowerCase());
      body.append('password', form.password);
      body.append('address', form.address.trim());
      body.append('state_id', stateId);
      body.append('city_id', cityId);

      const { data: result } = await axios.post(SOLAR_ENDPOINTS.STORE, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (result.success) {
        closeSellerRegistration();
        navigate('/register', {
          state: {
            role: 'partner',
            pendingVerifyEmail: form.email.trim().toLowerCase(),
          },
        });
        setSubmitting(false);
        return;
      }

      if (result.message && typeof result.message === 'object') {
        const first = Object.values(result.message).flat().find((m) => typeof m === 'string');
        setSubmitError(first || 'Registration failed. Please check your details.');
      } else {
        setSubmitError(result.message || 'Registration failed. Please try again.');
      }
      setSubmitting(false);
    } catch (err) {
      const apiMsg = err.response?.data?.message;
      if (apiMsg && typeof apiMsg === 'object') {
        const first = Object.values(apiMsg).flat().find((m) => typeof m === 'string');
        setSubmitError(first || 'Registration failed. Please try again.');
      } else if (typeof apiMsg === 'string') {
        setSubmitError(apiMsg);
      } else {
        setSubmitError(err?.message || 'Registration failed. Please try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <div
      className="seller-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Seller Registration"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeSellerRegistration();
      }}
    >
      <div className="seller-modal-card">
        <div className="seller-modal-header">
          <div>
            <h3 className="seller-modal-title">Become a Seller</h3>
            <p className="seller-modal-subtitle">Register as a solar partner to access your dashboard.</p>
          </div>
          <button type="button" className="seller-modal-close" onClick={closeSellerRegistration} aria-label="Close">
            &times;
          </button>
        </div>

        <form className="seller-modal-form" onSubmit={onSubmit}>
          {locationsError && <div className="seller-form-error seller-form-error--global">{locationsError}</div>}
          <div className="seller-form-grid">
            <div className="seller-form-field">
              <label>Full Name *</label>
              <input type="text" className="form-control" value={form.fullName} onChange={setField('fullName')} />
              {errors.fullName && shouldShow('fullName') && <div className="seller-form-error">{errors.fullName}</div>}
            </div>

            <div className="seller-form-field">
              <label>Phone Number *</label>
              <input
                type="text"
                className="form-control"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setForm((prev) => ({ ...prev, phone: value }));
                  setTouched((prev) => ({ ...prev, phone: true }));
                  setSubmitError(null);
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
              />
              {errors.phone && shouldShow('phone') && <div className="seller-form-error">{errors.phone}</div>}
            </div>

            <div className="seller-form-field">
              <label>Email *</label>
              <input type="email" className="form-control" value={form.email} onChange={setField('email')} />
              {errors.email && shouldShow('email') && <div className="seller-form-error">{errors.email}</div>}
            </div>

            <div className="seller-form-field">
              <label>Address *</label>
              <input type="text" className="form-control" value={form.address} onChange={setField('address')} />
              {errors.address && shouldShow('address') && <div className="seller-form-error">{errors.address}</div>}
            </div>

            <div className="seller-form-field">
              <label>State *</label>
              <select
                className="form-control"
                value={form.stateId}
                onChange={setField('stateId')}
                disabled={statesLoading || statesList.length === 0}
              >
                <option value="">{statesLoading ? 'Loading states…' : 'Select state'}</option>
                {statesList.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.stateId && shouldShow('stateId') && <div className="seller-form-error">{errors.stateId}</div>}
            </div>

            <div className="seller-form-field">
              <label>City *</label>
              <select
                className="form-control"
                value={form.cityId}
                onChange={setField('cityId')}
                disabled={!form.stateId || citiesLoading}
              >
                <option value="">
                  {!form.stateId ? 'Select state first' : citiesLoading ? 'Loading cities…' : 'Select city'}
                </option>
                {citiesList.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.cityId && shouldShow('cityId') && <div className="seller-form-error">{errors.cityId}</div>}
            </div>

            <div className="seller-form-field seller-form-field--full">
              <label>Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={form.password}
                  onChange={setField('password')}
                  autoComplete="new-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={modalToggleEyeBtnStyle}
                >
                  <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden />
                </button>
              </div>
              {errors.password && shouldShow('password') && (
                <div className="seller-form-error">{errors.password}</div>
              )}
            </div>
          </div>

          {submitError && <div className="seller-form-error seller-form-error--global">{submitError}</div>}

          <div className="seller-modal-actions">
            <button
              type="submit"
              className="site-button"
              disabled={!isValid || submitting || statesLoading}
              aria-disabled={!isValid || submitting || statesLoading}
            >
              <span>{submitting ? 'Submitting...' : 'Register'}</span>
            </button>
            <button type="button" className="site-button-secondry" onClick={closeSellerRegistration}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
