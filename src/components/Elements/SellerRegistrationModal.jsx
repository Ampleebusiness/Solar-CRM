import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SELLER_STATES, SELLER_STATE_TO_CITIES } from '../../data/sellerStatesCities';

const PHONE_DIGITS_ONLY = /^\d+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

function validateForm(values) {
  const errors = {};

  const fullName = String(values.fullName || '').trim();
  if (!fullName) errors.fullName = 'Full Name is required.';

  const phoneDigits = digitsOnly(values.phone);
  if (!phoneDigits) errors.phone = 'Phone Number is required.';
  else if (!PHONE_DIGITS_ONLY.test(phoneDigits)) errors.phone = 'Phone must contain digits only.';
  else if (phoneDigits.length !== 10) errors.phone = 'Phone must be exactly 10 digits.';

  const email = String(values.email || '').trim();
  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

  const address = String(values.address || '').trim();
  if (!address) errors.address = 'Address is required.';

  const state = String(values.state || '').trim();
  if (!state) errors.state = 'State is required.';

  const cities = SELLER_STATE_TO_CITIES[state] || [];
  const city = String(values.city || '').trim();
  if (!city) errors.city = 'City is required.';
  else if (!cities.includes(city)) errors.city = 'Please select a city from the dropdown.';

  return errors;
}

export default function SellerRegistrationModal() {
  const { sellerRegistrationOpen, closeSellerRegistration, loginAsSeller, auth } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    state: '',
    city: '',
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const stateCities = SELLER_STATE_TO_CITIES[form.state] || [];

  const errors = useMemo(() => validateForm(form), [form]);
  const isValid = Object.keys(errors).length === 0;

  const shouldShow = (key) => touched[key] || submitError || false;

  if (!sellerRegistrationOpen) return null;

  if (auth?.role === 'seller') {
    // If user is already seller, don’t keep modal open.
    closeSellerRegistration();
    return null;
  }

  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      // If state changes, reset city so it stays dependent.
      if (key === 'state') return { ...prev, state: value, city: '' };
      return { ...prev, [key]: value };
    });
    setTouched((prev) => ({ ...prev, [key]: true }));
    setSubmitError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Mark everything as touched so messages appear.
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      address: true,
      state: true,
      city: true,
    });

    if (!isValid) return;

    try {
      setSubmitting(true);

      // Dummy store (local state for now).
      const payload = {
        id: `seller-${Date.now()}`,
        fullName: form.fullName.trim(),
        phone: digitsOnly(form.phone),
        email: form.email.trim().toLowerCase(),
        address: form.address.trim(),
        state: form.state,
        city: form.city,
      };

      // Auto login as seller
      loginAsSeller(payload);
    } catch (err) {
      setSubmitError(err?.message || 'Registration failed. Please try again.');
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
                value={form.phone}
                onChange={(e) => {
                  // Allow typing but keep it numeric-ish for better UX.
                  const value = e.target.value;
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
              <select className="form-control" value={form.state} onChange={setField('state')}>
                <option value="">Select state</option>
                {SELLER_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && shouldShow('state') && <div className="seller-form-error">{errors.state}</div>}
            </div>

            <div className="seller-form-field">
              <label>City *</label>
              <select className="form-control" value={form.city} onChange={setField('city')} disabled={!form.state}>
                <option value="">Select city</option>
                {stateCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.city && shouldShow('city') && <div className="seller-form-error">{errors.city}</div>}
            </div>
          </div>

          {submitError && <div className="seller-form-error seller-form-error--global">{submitError}</div>}

          <div className="seller-modal-actions">
            <button
              type="submit"
              className="site-button"
              disabled={!isValid || submitting}
              aria-disabled={!isValid || submitting}
            >
              <span>{submitting ? 'Submitting...' : 'Register & Login'}</span>
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

