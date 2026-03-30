import React, { useEffect, useMemo, useState } from 'react';

const ROLES = ['Manager', 'Sales', 'Technician'];
const PHONE_RE = /^\d{10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emptyForm() {
  return { name: '', phone: '', email: '', role: 'Sales' };
}

export default function SellerStaffModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          name: initial.name || '',
          phone: String(initial.phone || '').replace(/\D/g, '').slice(0, 10),
          email: initial.email || '',
          role: initial.role || 'Sales',
        });
      } else {
        setForm(emptyForm());
      }
    }
  }, [open, initial]);

  const fieldErrors = useMemo(() => {
    const e = {};
    if (!String(form.name || '').trim()) e.name = 'Name is required.';
    const p = String(form.phone || '').replace(/\D/g, '');
    if (!p) e.phone = 'Phone is required.';
    else if (!PHONE_RE.test(p)) e.phone = 'Enter 10-digit phone number.';
    if (!String(form.email || '').trim()) e.email = 'Email is required.';
    else if (!EMAIL_RE.test(String(form.email || '').trim())) e.email = 'Invalid email.';
    if (!form.role) e.role = 'Role is required.';
    return e;
  }, [form]);

  const isValid = Object.keys(fieldErrors).length === 0;

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!isValid) return;
    onSave({
      name: form.name.trim(),
      phone: String(form.phone).replace(/\D/g, ''),
      email: form.email.trim().toLowerCase(),
      role: form.role,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="seller-crm-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="staff-modal-title">
      <div className="seller-crm-modal-card seller-crm-modal-card--md">
        <div className="seller-crm-modal-head">
          <h3 id="staff-modal-title">{initial ? 'Edit staff member' : 'Add staff member'}</h3>
          <button type="button" className="seller-crm-modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <form className="seller-crm-modal-body" onSubmit={handleSubmit}>
          <div className="seller-crm-form-grid">
            <div className="seller-crm-form-field">
              <label>Name *</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              {fieldErrors.name && <span className="seller-crm-field-error">{fieldErrors.name}</span>}
            </div>
            <div className="seller-crm-form-field">
              <label>Phone *</label>
              <input
                className="form-control"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))
                }
              />
              {fieldErrors.phone && <span className="seller-crm-field-error">{fieldErrors.phone}</span>}
            </div>
            <div className="seller-crm-form-field">
              <label>Email *</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              {fieldErrors.email && <span className="seller-crm-field-error">{fieldErrors.email}</span>}
            </div>
            <div className="seller-crm-form-field">
              <label>Role *</label>
              <select className="form-control" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {fieldErrors.role && <span className="seller-crm-field-error">{fieldErrors.role}</span>}
            </div>
          </div>
          <div className="seller-crm-modal-actions">
            <button type="button" className="site-button-secondry" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="site-button" disabled={!isValid}>
              <span>{initial ? 'Save changes' : 'Add staff'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
