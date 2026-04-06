import React, { useEffect, useState, useMemo } from 'react';
import SellerDashboardLayout from '../Elements/SellerDashboardLayout';
import { safeJsonParse } from '../../utils/safeJsonParse';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import { fetchSolarStates, fetchSolarCities } from '../../api/solarLocations';
import {
  fetchSolarUserDetail,
  updateSolarUserProfile,
  mapSolarUserToSeller,
  persistSellerInfoFromApi,
} from '../../api/solarSellerProfile';

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
  const solarUserId = seller.id;

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    stateId: '',
    cityId: '',
  });

  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState(null);

  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatesLoading(true);
        const list = await fetchSolarStates();
        if (!cancelled) setStatesList(list);
      } catch {
        if (!cancelled) setStatesList([]);
      } finally {
        if (!cancelled) setStatesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!solarUserId) {
      setDetailLoading(false);
      setDetailError('Missing seller account. Please log in again.');
      const s = readSellerInfo() || {};
      setForm({
        fullName: s.fullName || '',
        phone: s.phone || '',
        email: s.email || '',
        address: s.address || '',
        stateId: s.stateId || '',
        cityId: s.cityId || '',
      });
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        setDetailLoading(true);
        setDetailError(null);
        const mapped = await fetchSolarUserDetail(solarUserId);
        if (cancelled) return;
        persistSellerInfoFromApi(mapped);
        setForm({
          fullName: mapped.fullName || '',
          phone: mapped.phone || '',
          email: mapped.email || '',
          address: mapped.address || '',
          stateId: mapped.stateId || '',
          cityId: mapped.cityId || '',
        });
      } catch (e) {
        if (!cancelled) {
          setDetailError(e?.message || 'Could not load profile.');
          const s = readSellerInfo() || {};
          setForm({
            fullName: s.fullName || '',
            phone: s.phone || '',
            email: s.email || '',
            address: s.address || '',
            stateId: s.stateId || '',
            cityId: s.cityId || '',
          });
        }
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [solarUserId]);

  useEffect(() => {
    if (!form.stateId) {
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
  }, [form.stateId]);

  const errors = useMemo(() => {
    const e = {};
    if (!String(form.fullName || '').trim()) e.fullName = 'Full Name is required.';

    const phoneDigits = digitsOnly(form.phone);
    if (!phoneDigits) e.phone = 'Phone Number is required.';
    else if (phoneDigits.length !== 10) e.phone = 'Phone must be exactly 10 digits.';
    else if (!/^[6-9]\d{9}$/.test(phoneDigits)) e.phone = 'Enter a valid Indian mobile number (starts with 6–9).';

    if (!String(form.email || '').trim()) e.email = 'Email is required.';
    else if (!EMAIL_RE.test(String(form.email || '').trim())) e.email = 'Please enter a valid email address.';

    if (!String(form.address || '').trim()) e.address = 'Address is required.';

    if (!String(form.stateId || '').trim()) e.stateId = 'State is required.';
    if (!String(form.cityId || '').trim()) e.cityId = 'City is required.';
    else if (!citiesList.some((c) => String(c.id) === String(form.cityId))) {
      e.cityId = 'Please select a valid city for the chosen state.';
    }
    return e;
  }, [form, citiesList]);

  const isValid = Object.keys(errors).length === 0;

  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      if (key === 'stateId') return { ...prev, stateId: value, cityId: '' };
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
      stateId: true,
      cityId: true,
    });
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!isValid || !solarUserId) return;

    try {
      setSaving(true);
      const data = await updateSolarUserProfile({
        solarUserId,
        full_name: form.fullName,
        phone_number: digitsOnly(form.phone),
        address: form.address,
        state_id: form.stateId,
        city_id: form.cityId,
      });

      if (data?.success && data.data) {
        const mapped = mapSolarUserToSeller(data.data);
        persistSellerInfoFromApi({
          ...mapped,
          email: form.email.trim().toLowerCase(),
        });
        setForm((prev) => ({
          ...prev,
          fullName: mapped.fullName,
          phone: mapped.phone,
          address: mapped.address,
          stateId: mapped.stateId,
          cityId: mapped.cityId,
        }));
        setSubmitSuccess(
          typeof data.message === 'string' && data.message
            ? data.message
            : 'Profile updated successfully.',
        );
      } else {
        const msg =
          typeof data?.message === 'string' ? data.message : 'Update failed. Please try again.';
        setSubmitError(msg);
      }
    } catch (err) {
      const apiMsg = err.response?.data?.message;
      setSubmitError(typeof apiMsg === 'string' ? apiMsg : err?.message || 'Failed to save profile.');
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

            {detailLoading && (
              <p className="text-muted" style={{ marginTop: 12 }}>
                Loading profile…
              </p>
            )}
            {detailError && !detailLoading && (
              <div className="alert alert-warning" style={{ marginTop: 12 }} role="alert">
                {detailError}
              </div>
            )}

            {!detailLoading && (
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
                      <input
                        className="form-control"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.phone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setForm((prev) => ({ ...prev, phone: v }));
                          setTouched((prev) => ({ ...prev, phone: true }));
                          setSubmitError(null);
                          setSubmitSuccess(null);
                        }}
                      />
                      {errors.phone && showError('phone') && <div className="seller-form-error">{errors.phone}</div>}
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Email *</label>
                      <input className="form-control" value={form.email} readOnly disabled style={{ opacity: 0.85 }} />
                      <small className="text-muted">Email cannot be changed here.</small>
                      {errors.email && showError('email') && <div className="seller-form-error">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Address *</label>
                      <input className="form-control" value={form.address} onChange={setField('address')} />
                      {errors.address && showError('address') && (
                        <div className="seller-form-error">{errors.address}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
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
                      {errors.stateId && showError('stateId') && (
                        <div className="seller-form-error">{errors.stateId}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
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
                      {errors.cityId && showError('cityId') && (
                        <div className="seller-form-error">{errors.cityId}</div>
                      )}
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="alert alert-danger" style={{ marginTop: 12 }} role="alert">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="alert alert-success" style={{ marginTop: 12 }} role="status">
                    {submitSuccess}
                  </div>
                )}

                <div className="seller-form-row-actions">
                  <button type="submit" className="site-button" disabled={!isValid || saving || !solarUserId}>
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </SellerDashboardLayout>
      </div>
      <Footer2 />
    </>
  );
}
