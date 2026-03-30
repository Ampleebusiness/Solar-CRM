import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import Banner from '../Elements/Banner';
import SellerDashboardLayout from '../Elements/SellerDashboardLayout';
import { SOLAR_IMAGES } from '../../data/solarImages';
import { useSellerServices } from '../../hooks/useSellerServices';
import { getSubOptionsForCategory, SERVICE_CATEGORIES } from '../../data/sellerServiceCatalog';

const SOLAR_SERVICE_CATEGORY_OPTIONS = [
  '3KW Solar',
  '5KW Solar',
  '10KW Solar',
  '5KW structure + 3 KW plates',
  '10KW structure + 5 KW plates',
];

const INVERTER_BRAND_OPTIONS = ['Havells', 'Polycab', 'K Solar', 'UTL', 'Mocrotec', 'Luminous'];

const ACDB_DCDB_OPTIONS = ['Havells', 'Polycab', 'Others'];

function emptyForm() {
  const subs = getSubOptionsForCategory('Solar Installation');
  return {
    title: '',
    category: 'Solar Installation',
    subOption: subs.length ? subs[0] : '',

    // Always present (per requirement)
    solarServiceCategory: SOLAR_SERVICE_CATEGORY_OPTIONS[0],
    inverterBrand: INVERTER_BRAND_OPTIONS[0],
    acdbDcdb: ACDB_DCDB_OPTIONS[0],

    price: '',
    capacityKw: '',
    installationTime: '',
    warrantyYears: '',
    description: '',
    thumbnail: '',
    images: [],
  };
}

function readFilesAsDataUrls(fileList) {
  return Promise.all(
    Array.from(fileList || []).map(
      (file) =>
        new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.onerror = reject;
          r.readAsDataURL(file);
        })
    )
  );
}

export default function SellerServiceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { services, addService, updateService } = useSellerServices();
  const existing = useMemo(() => services.find((s) => s.id === id) || null, [services, id]);

  const [form, setForm] = useState(emptyForm);

  const subOptions = useMemo(() => getSubOptionsForCategory(form.category), [form.category]);
  const showSub = subOptions.length > 0;

  useEffect(() => {
    if (!isEdit) return;
    if (!existing) return;
    const subs = getSubOptionsForCategory(existing.category || 'Solar Installation');
    setForm({
      title: existing.title || '',
      category: existing.category || 'Solar Installation',
      subOption: existing.subOption || (subs.length ? subs[0] : ''),
      solarServiceCategory: existing.solarServiceCategory || SOLAR_SERVICE_CATEGORY_OPTIONS[0],
      inverterBrand: existing.inverterBrand || INVERTER_BRAND_OPTIONS[0],
      acdbDcdb: existing.acdbDcdb || ACDB_DCDB_OPTIONS[0],
      price: existing.price != null ? String(existing.price) : '',
      capacityKw: existing.capacityKw != null ? String(existing.capacityKw) : '',
      installationTime: existing.installationTime || '',
      warrantyYears: existing.warrantyYears != null ? String(existing.warrantyYears) : '',
      description: existing.description || '',
      thumbnail: existing.thumbnail || '',
      images: Array.isArray(existing.images) ? existing.images : [],
    });
  }, [isEdit, existing]);

  useEffect(() => {
    if (!showSub) {
      setForm((f) => ({ ...f, subOption: '' }));
      return;
    }
    if (form.subOption && subOptions.includes(form.subOption)) return;
    setForm((f) => ({ ...f, subOption: subOptions[0] || '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.category]);

  const fieldErrors = useMemo(() => {
    const e = {};
    if (!String(form.title || '').trim()) e.title = 'Service title is required.';
    if (!form.category) e.category = 'Category is required.';
    if (showSub && !String(form.subOption || '').trim()) e.subOption = 'Please select an option.';
    if (!String(form.solarServiceCategory || '').trim()) e.solarServiceCategory = 'Required.';
    if (!String(form.inverterBrand || '').trim()) e.inverterBrand = 'Required.';
    if (!String(form.acdbDcdb || '').trim()) e.acdbDcdb = 'Required.';
    return e;
  }, [form, showSub]);

  const isValid = Object.keys(fieldErrors).length === 0;

  const handleThumbnail = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const [url] = await readFilesAsDataUrls([f]);
    setForm((prev) => ({ ...prev, thumbnail: url }));
  };

  const handleGallery = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const urls = await readFilesAsDataUrls(files);
    setForm((prev) => ({ ...prev, images: [...(prev.images || []), ...urls].slice(0, 12) }));
  };

  const removeGalleryAt = (idx) => {
    setForm((prev) => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!isValid) return;

    const payload = {
      title: form.title.trim(),
      category: form.category,
      subOption: showSub ? form.subOption : '',
      solarServiceCategory: form.solarServiceCategory,
      inverterBrand: form.inverterBrand,
      acdbDcdb: form.acdbDcdb,
      price: form.price.trim(),
      capacityKw: form.capacityKw.trim(),
      installationTime: form.installationTime.trim(),
      warrantyYears: form.warrantyYears.trim(),
      description: form.description.trim(),
      thumbnail: form.thumbnail,
      images: form.images || [],
    };

    if (isEdit) updateService(id, payload);
    else addService(payload);

    navigate('/seller-services');
  };

  return (
    <>
      <Header2 stickyNo />
      <div className="page-content">
       
        <SellerDashboardLayout>
          <div className="seller-crm-content seller-crm-content--flush">
            <div className="seller-crm-panel-head seller-crm-panel-head--table">
              <h2 className="seller-crm-panel-title">{isEdit ? 'Edit service' : 'Add service'}</h2>
              <NavLink to="/seller-services" className="seller-crm-btn-outline">
                <i className="fa fa-arrow-left m-r8" aria-hidden />
                Back
              </NavLink>
            </div>

            {isEdit && !existing ? (
              <div className="seller-table__empty">Service not found.</div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="seller-crm-form-grid seller-crm-form-grid--2">
                  <div className="seller-crm-form-field seller-crm-form-field--full">
                    <label>Service title *</label>
                    <input
                      className="form-control"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    />
                    {fieldErrors.title && <span className="seller-crm-field-error">{fieldErrors.title}</span>}
                  </div>

                  <div className="seller-crm-form-field">
                    <label>Category *</label>
                    <select
                      className="form-control"
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    >
                      {SERVICE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.category && <span className="seller-crm-field-error">{fieldErrors.category}</span>}
                  </div>

                  {showSub && (
                    <div className="seller-crm-form-field">
                      <label>Sub option *</label>
                      <select
                        className="form-control"
                        value={form.subOption}
                        onChange={(e) => setForm((f) => ({ ...f, subOption: e.target.value }))}
                      >
                        {subOptions.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.subOption && <span className="seller-crm-field-error">{fieldErrors.subOption}</span>}
                    </div>
                  )}

                  <div className="seller-crm-form-field">
                    <label>Solar service category *</label>
                    <select
                      className="form-control"
                      value={form.solarServiceCategory}
                      onChange={(e) => setForm((f) => ({ ...f, solarServiceCategory: e.target.value }))}
                    >
                      {SOLAR_SERVICE_CATEGORY_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.solarServiceCategory && (
                      <span className="seller-crm-field-error">{fieldErrors.solarServiceCategory}</span>
                    )}
                  </div>

                  <div className="seller-crm-form-field">
                    <label>Inverter brand *</label>
                    <select
                      className="form-control"
                      value={form.inverterBrand}
                      onChange={(e) => setForm((f) => ({ ...f, inverterBrand: e.target.value }))}
                    >
                      {INVERTER_BRAND_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.inverterBrand && <span className="seller-crm-field-error">{fieldErrors.inverterBrand}</span>}
                  </div>

                  <div className="seller-crm-form-field">
                    <label>ACDB/DCDB *</label>
                    <select
                      className="form-control"
                      value={form.acdbDcdb}
                      onChange={(e) => setForm((f) => ({ ...f, acdbDcdb: e.target.value }))}
                    >
                      {ACDB_DCDB_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.acdbDcdb && <span className="seller-crm-field-error">{fieldErrors.acdbDcdb}</span>}
                  </div>

                  <div className="seller-crm-form-field">
                    <label>Price (optional)</label>
                    <input
                      className="form-control"
                      placeholder="₹"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    />
                  </div>

                  <div className="seller-crm-form-field">
                    <label>Capacity (KW)</label>
                    <input
                      className="form-control"
                      value={form.capacityKw}
                      onChange={(e) => setForm((f) => ({ ...f, capacityKw: e.target.value }))}
                    />
                  </div>

                  <div className="seller-crm-form-field">
                    <label>Installation time</label>
                    <input
                      className="form-control"
                      placeholder="e.g. 2–3 days"
                      value={form.installationTime}
                      onChange={(e) => setForm((f) => ({ ...f, installationTime: e.target.value }))}
                    />
                  </div>

                  <div className="seller-crm-form-field">
                    <label>Warranty (years)</label>
                    <input
                      className="form-control"
                      value={form.warrantyYears}
                      onChange={(e) => setForm((f) => ({ ...f, warrantyYears: e.target.value }))}
                    />
                  </div>

                  <div className="seller-crm-form-field seller-crm-form-field--full">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    />
                  </div>

                  <div className="seller-crm-form-field">
                    <label>Thumbnail image</label>
                    <input type="file" accept="image/*" className="form-control" onChange={handleThumbnail} />
                  </div>

                  <div className="seller-crm-form-field">
                    <label>Service images (multiple)</label>
                    <input type="file" accept="image/*" multiple className="form-control" onChange={handleGallery} />
                  </div>

                  <div className="seller-crm-form-field seller-crm-form-field--full">
                    <div className="seller-crm-media-preview">
                      {form.thumbnail ? (
                        <img className="seller-crm-media-preview__thumb" src={form.thumbnail} alt="" />
                      ) : (
                        <div className="seller-crm-media-preview__thumb seller-crm-media-preview__thumb--empty">
                          <i className="fa fa-image" aria-hidden />
                        </div>
                      )}

                      <div className="seller-crm-media-preview__gallery">
                        {(form.images || []).slice(0, 10).map((src, i) => (
                          <div key={i} className="seller-crm-thumb">
                            <img src={src} alt="" />
                            <button
                              type="button"
                              className="seller-crm-thumb-remove"
                              onClick={() => removeGalleryAt(i)}
                              aria-label="Remove"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="seller-crm-modal-actions">
                  <NavLink to="/seller-services" className="site-button-secondry">
                    Cancel
                  </NavLink>
                  <button type="submit" className="site-button" disabled={!isValid}>
                    <span>{isEdit ? 'Save service' : 'Add service'}</span>
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

