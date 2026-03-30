import React, { useMemo, useState } from 'react';
import SellerDashboardLayout from '../Elements/SellerDashboardLayout';
import { SELLER_DUMMY_ENQUIRIES } from '../../data/sellerDummyData';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import Banner from '../Elements/Banner';
import { SOLAR_IMAGES } from '../../data/solarImages';

export default function SellerEnquiries() {
  const [query, setQuery] = useState('');

  const enquiries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SELLER_DUMMY_ENQUIRIES;
    return SELLER_DUMMY_ENQUIRIES.filter((e) => {
      return (
        String(e.buyerName || '').toLowerCase().includes(q) ||
        String(e.buyerPhone || '').includes(q) ||
        String(e.requirement || '').toLowerCase().includes(q) ||
        String(e.city || '').toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <>
      <Header2 stickyNo />
      <div className="page-content">
       
        <SellerDashboardLayout>
          <div className="seller-crm-content">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <h4 style={{ margin: 0, fontWeight: 900, fontSize: 14, color: 'rgba(0,0,0,0.75)' }}>My Enquiries</h4>
              <div style={{ marginLeft: 'auto', minWidth: 260 }}>
                <input
                  className="form-control"
                  placeholder="Search enquiries by name, phone, requirement, city..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Buyer</th>
                    <th>Phone</th>
                    <th>Requirement</th>
                    <th>City</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ color: 'rgba(0,0,0,0.6)', padding: 18 }}>
                        No enquiries found for your search.
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((e) => (
                      <tr key={e.id}>
                        <td style={{ fontWeight: 800 }}>{e.buyerName}</td>
                        <td>{e.buyerPhone}</td>
                        <td style={{ maxWidth: 340 }}>{e.requirement}</td>
                        <td>{e.city}</td>
                        <td style={{ color: 'rgba(0,0,0,0.55)' }}>
                          {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '-'}
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

