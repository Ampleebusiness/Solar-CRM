import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SellerDashboardLayout from '../Elements/SellerDashboardLayout';
import { CRM_DUMMY_CUSTOMERS, CRM_STATUSES, CRM_STATUS_BADGE_CLASS } from '../../data/sellerCrmCustomers';

const SYSTEM_SIZES = ['3KW', '5KW', '10KW'];

export default function SellerCustomers() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');
  const [systemSize, setSystemSize] = useState('');

  const cities = useMemo(() => {
    const set = new Set(CRM_DUMMY_CUSTOMERS.map((c) => c.city).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CRM_DUMMY_CUSTOMERS.filter((c) => {
      if (status && c.status !== status) return false;
      if (city && c.city !== city) return false;
      if (systemSize && c.systemSize !== systemSize) return false;
      if (!q) return true;
      return (
        String(c.name || '').toLowerCase().includes(q) ||
        String(c.phone || '').toLowerCase().includes(q)
      );
    });
  }, [query, status, city, systemSize]);

  return (
    <>
      <Header2 stickyNo />
      <div className="page-content">
        <SellerDashboardLayout>
          <div className="seller-crm-content seller-crm-content--flush">
            <div className="seller-crm-panel-head seller-crm-panel-head--table">
              <div>
                <h2 className="seller-crm-panel-title">Customers</h2>
                <div className="seller-crm-subtitle">Demo Solar CRM (UI only)</div>
              </div>
            </div>

            <div className="seller-crm-filters">
              <div className="seller-crm-filter">
                <label>Status</label>
                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">All</option>
                  {CRM_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="seller-crm-filter">
                <label>City</label>
                <select className="form-control" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">All</option>
                  {cities.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>

              <div className="seller-crm-filter">
                <label>System size</label>
                <select className="form-control" value={systemSize} onChange={(e) => setSystemSize(e.target.value)}>
                  <option value="">All</option>
                  {SYSTEM_SIZES.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>

              <div className="seller-crm-filter seller-crm-filter--search">
                <label>Search</label>
                <input
                  className="form-control"
                  placeholder="Search by name / phone..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="seller-crm-table-wrap">
              <table className="seller-table seller-table--crm">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>System Size</th>
                    <th>Assigned Staff</th>
                    <th>Status</th>
                    <th className="seller-table__actions">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="seller-table__empty">
                        No customers match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((c) => (
                      <tr key={c.id}>
                        <td className="seller-table__strong">{c.name}</td>
                        <td>{c.phone}</td>
                        <td>{c.city}</td>
                        <td>
                          <span className="seller-crm-pill">{c.systemSize}</span>
                        </td>
                        <td>{c.assignedStaff}</td>
                        <td>
                          <span className={CRM_STATUS_BADGE_CLASS[c.status] || 'seller-crm-status'}>
                            {c.status}
                          </span>
                        </td>
                        <td className="seller-table__actions">
                          <NavLink to={`/seller-customers/${c.id}`} className="seller-crm-btn-small">
                            View
                          </NavLink>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </SellerDashboardLayout>
      </div>
      <Footer2 />
    </>
  );
}

