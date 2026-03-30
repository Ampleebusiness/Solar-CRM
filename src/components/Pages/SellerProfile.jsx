import React, { useState } from 'react';
import SellerDashboardLayout from '../Elements/SellerDashboardLayout';
import { SELLER_STATES, SELLER_STATE_TO_CITIES } from '../../data/sellerStatesCities';
import { safeJsonParse } from '../../utils/safeJsonParse';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import Banner from '../Elements/Banner';
import { SOLAR_IMAGES } from '../../data/solarImages';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

function readSellerInfo() {
  if (typeof window === 'undefined') return null;
  return safeJsonParse(localStorage.getItem('sellerInfo'), null);
}

export default function SellerProfile() {
  const seller = readSellerInfo() || {};

  const [form, setForm] = useState({
    fullName: seller.fullName || '',
    phone: seller.phone || '',
    email: seller.email || '',
    address: seller.address || '',
    state: seller.state || '',
    city: seller.city || '',
  });

  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const cities = SELLER_STATE_TO_CITIES[form.state] || [];

  const errors = (() => {
    const e = {};
    if (!String(form.fullName || '').trim()) e.fullName = 'Full Name is required.';

    const phoneDigits = digitsOnly(form.phone);
    if (!phoneDigits) e.phone = 'Phone Number is required.';
    else if (phoneDigits.length !== 10) e.phone = 'Phone must be exactly 10 digits.';

    if (!String(form.email || '').trim()) e.email = 'Email is required.';
    else if (!EMAIL_RE.test(String(form.email || '').trim())) e.email = 'Please enter a valid email address.';

    if (!String(form.address || '').trim()) e.address = 'Address is required.';

    if (!String(form.state || '').trim()) e.state = 'State is required.';
    if (!String(form.city || '').trim()) e.city = 'City is required.';
    if (form.state && form.city && !(cities || []).includes(form.city)) e.city = 'Please select a valid city.';
    return e;
  })();

  const isValid = Object.keys(errors).length === 0;

  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      if (key === 'state') return { ...prev, state: value, city: '' };
      return { ...prev, [key]: value };
    });
    setTouched((prev) => ({ ...prev, [key]: true }));
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const showError = (key) => touched[key];

  const onSave = async (e) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      address: true,
      state: true,
      city: true,
    });
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!isValid) return;

    try {
      setSaving(true);
      const sellerId = seller.id || `seller-${Date.now()}`;
      const nextSeller = {
        ...seller,
        ...form,
        id: sellerId,
        phone: digitsOnly(form.phone),
        email: String(form.email || '').trim().toLowerCase(),
        fullName: String(form.fullName || '').trim(),
        address: String(form.address || '').trim(),
      };

      localStorage.setItem('sellerInfo', JSON.stringify(nextSeller));

      // Keep auth identifier aligned with email (best-effort).
      const authRaw = localStorage.getItem('infrioAuth');
      const authObj = safeJsonParse(authRaw, null);
      if (authObj && authObj.role === 'seller') {
        localStorage.setItem(
          'infrioAuth',
          JSON.stringify({ ...authObj, identifier: nextSeller.email || nextSeller.phone || authObj.identifier })
        );
      }

      setSubmitSuccess('Profile saved successfully.');
    } catch (err) {
      setSubmitError(err?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header2 stickyNo />
      <div className="page-content">
      
        <SellerDashboardLayout>
          <div className="seller-crm-content">
            <h4 style={{ margin: 0, fontWeight: 900, fontSize: 14, color: 'rgba(0,0,0,0.75)' }}>My Profile</h4>
            <p style={{ marginTop: 6, color: 'rgba(0,0,0,0.6)', fontSize: 13 }}>
              Update your business details. (Editable fields below)
            </p>

            <form onSubmit={onSave} style={{ marginTop: 12 }}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input className="form-control" value={form.fullName} onChange={setField('fullName')} />
                    {errors.fullName && showError('fullName') && (
                      <div className="seller-form-error">{errors.fullName}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input className="form-control" inputMode="numeric" value={form.phone} onChange={setField('phone')} />
                    {errors.phone && showError('phone') && <div className="seller-form-error">{errors.phone}</div>}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label>Email *</label>
                    <input className="form-control" value={form.email} onChange={setField('email')} />
                    {errors.email && showError('email') && <div className="seller-form-error">{errors.email}</div>}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label>Address *</label>
                    <input className="form-control" value={form.address} onChange={setField('address')} />
                    {errors.address && showError('address') && <div className="seller-form-error">{errors.address}</div>}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>State *</label>
                    <select className="form-control" value={form.state} onChange={setField('state')}>
                      <option value="">Select state</option>
                      {SELLER_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.state && showError('state') && <div className="seller-form-error">{errors.state}</div>}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>City *</label>
                    <select className="form-control" value={form.city} onChange={setField('city')} disabled={!form.state}>
                      <option value="">Select city</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.city && showError('city') && <div className="seller-form-error">{errors.city}</div>}
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="seller-form-error" style={{ marginTop: 12 }}>
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="seller-form-error" style={{ marginTop: 12, color: '#bbf7d0' }}>
                  {submitSuccess}
                </div>
              )}

              <div className="seller-form-row-actions">
                <button type="submit" className="site-button" disabled={!isValid || saving}>
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </SellerDashboardLayout>
      </div>
      <Footer2 />
    </>
  );
}

