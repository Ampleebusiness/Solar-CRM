import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import SellerDashboardLayout from '../Elements/SellerDashboardLayout';
import { SELLER_DUMMY_ACTIVE_LISTINGS, SELLER_DUMMY_ENQUIRIES, SELLER_DUMMY_LEADS } from '../../data/sellerDummyData';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import { safeJsonParse } from '../../utils/safeJsonParse';
import { fetchSolarUserDetail, persistSellerInfoFromApi } from '../../api/solarSellerProfile';

function readSellerInfo() {
  if (typeof window === 'undefined') return null;
  return safeJsonParse(localStorage.getItem('sellerInfo'), null);
}

export default function SellerDashboard() {
  const totalLeads = SELLER_DUMMY_LEADS.length;
  const totalEnquiries = SELLER_DUMMY_ENQUIRIES.length;
  const activeListings = SELLER_DUMMY_ACTIVE_LISTINGS;

  const [detailSeller, setDetailSeller] = useState(() => readSellerInfo() || {});
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    const info = readSellerInfo();
    const solarUserId = info?.id;
    if (!solarUserId) {
      setDetailSeller(info || {});
      setDetailLoading(false);
      setDetailError(null);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        setDetailLoading(true);
        setDetailError(null);
        const mapped = await fetchSolarUserDetail(solarUserId);
        if (cancelled) return;
        setDetailSeller(mapped);
        persistSellerInfoFromApi(mapped);
      } catch (e) {
        if (!cancelled) {
          setDetailError(e?.message || 'Could not load business details.');
          setDetailSeller(info || {});
        }
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const seller = detailSeller || {};

  return (
    <>
      <Header2 stickyNo />
      <div className="page-content">
        <SellerDashboardLayout>
          <div className="seller-crm-stat-grid">
            <div className="seller-crm-stat seller-crm-stat--pink">
              <div className="seller-crm-stat-wave" aria-hidden />
              <div className="seller-crm-stat-value">{totalLeads}</div>
              <div className="seller-crm-stat-label">Total Leads</div>
              <div className="seller-crm-stat-sub">new &amp; active</div>
            </div>
            <div className="seller-crm-stat seller-crm-stat--purple">
              <div className="seller-crm-stat-wave" aria-hidden />
              <div className="seller-crm-stat-value">{totalEnquiries}</div>
              <div className="seller-crm-stat-label">Enquiries</div>
              <div className="seller-crm-stat-sub">from customers</div>
            </div>
            <div className="seller-crm-stat seller-crm-stat--blue">
              <div className="seller-crm-stat-wave" aria-hidden />
              <div className="seller-crm-stat-value">{activeListings}</div>
              <div className="seller-crm-stat-label">Active Listings</div>
              <div className="seller-crm-stat-sub">live on platform</div>
            </div>
          </div>

          <div className="seller-crm-panel">
            <div className="seller-crm-panel-head">
              <h2 className="seller-crm-panel-title">Default business details</h2>
              <NavLink to="/seller-profile" className="seller-crm-btn-orange">
                Manage Profile
              </NavLink>
            </div>
            <div className="seller-crm-panel-body">
              {detailLoading && (
                <p className="text-muted" style={{ margin: 0 }}>
                  Loading details…
                </p>
              )}
              {detailError && !detailLoading && (
                <p className="text-warning" style={{ margin: '0 0 12px' }}>
                  {detailError}
                </p>
              )}
              {!detailLoading && (
                <dl className="seller-crm-dl">
                  <div className="seller-crm-dl-row">
                    <dt>Contact Person</dt>
                    <dd>{seller.fullName || '—'}</dd>
                  </div>
                  <div className="seller-crm-dl-row">
                    <dt>Phone</dt>
                    <dd>{seller.phone ? `+91 ${seller.phone}` : '—'}</dd>
                  </div>
                  <div className="seller-crm-dl-row">
                    <dt>Email</dt>
                    <dd>{seller.email || '—'}</dd>
                  </div>
                  <div className="seller-crm-dl-row">
                    <dt>Address</dt>
                    <dd>{seller.address || '—'}</dd>
                  </div>
                  <div className="seller-crm-dl-row">
                    <dt>City / State</dt>
                    <dd>{[seller.city, seller.state].filter(Boolean).join(', ') || '—'}</dd>
                  </div>
                </dl>
              )}
            </div>
          </div>
        </SellerDashboardLayout>
      </div>
      <Footer2 />
    </>
  );
}
