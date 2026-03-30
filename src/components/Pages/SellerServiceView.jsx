import React, { useMemo } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import Banner from '../Elements/Banner';
import SellerDashboardLayout from '../Elements/SellerDashboardLayout';
import { SOLAR_IMAGES } from '../../data/solarImages';
import { useSellerServices } from '../../hooks/useSellerServices';

export default function SellerServiceView() {
  const { id } = useParams();
  const { services } = useSellerServices();

  const svc = useMemo(() => services.find((s) => s.id === id) || null, [services, id]);

  return (
    <>
      <Header2 stickyNo />
      <div className="page-content">
       
        <SellerDashboardLayout>
          <div className="seller-crm-content">
            <div className="seller-crm-panel-head seller-crm-panel-head--table">
              <h2 className="seller-crm-panel-title">Service</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {svc && (
                  <NavLink to={`/seller-services/${svc.id}/edit`} className="seller-crm-btn-orange">
                    <i className="fa fa-pencil m-r8" aria-hidden />
                    Edit
                  </NavLink>
                )}
                <NavLink to="/seller-services" className="seller-crm-btn-outline">
                  <i className="fa fa-arrow-left m-r8" aria-hidden />
                  Back
                </NavLink>
              </div>
            </div>

            {!svc ? (
              <div className="seller-table__empty">Service not found.</div>
            ) : (
              <div className="seller-crm-service-view">
                <div className="seller-crm-service-view__media">
                  {svc.thumbnail ? (
                    <img src={svc.thumbnail} alt="" />
                  ) : (
                    <div className="seller-svc-card__placeholder">
                      <i className="fa fa-image" />
                    </div>
                  )}
                </div>

                <div className="seller-crm-service-view__info">
                  <h3 className="seller-crm-service-view__title">{svc.title}</h3>
                  <div className="seller-crm-service-view__grid">
                    <div>
                      <div className="seller-crm-k">Category</div>
                      <div className="seller-crm-v">{svc.category || '—'}</div>
                    </div>
                    <div>
                      <div className="seller-crm-k">Sub option</div>
                      <div className="seller-crm-v">{svc.subOption || '—'}</div>
                    </div>
                    <div>
                      <div className="seller-crm-k">Solar service category</div>
                      <div className="seller-crm-v">{svc.solarServiceCategory || '—'}</div>
                    </div>
                    <div>
                      <div className="seller-crm-k">Inverter brand</div>
                      <div className="seller-crm-v">{svc.inverterBrand || '—'}</div>
                    </div>
                    <div>
                      <div className="seller-crm-k">ACDB/DCDB</div>
                      <div className="seller-crm-v">{svc.acdbDcdb || '—'}</div>
                    </div>
                    <div>
                      <div className="seller-crm-k">Capacity (KW)</div>
                      <div className="seller-crm-v">{svc.capacityKw || '—'}</div>
                    </div>
                    <div>
                      <div className="seller-crm-k">Installation time</div>
                      <div className="seller-crm-v">{svc.installationTime || '—'}</div>
                    </div>
                    <div>
                      <div className="seller-crm-k">Warranty (years)</div>
                      <div className="seller-crm-v">{svc.warrantyYears || '—'}</div>
                    </div>
                    <div>
                      <div className="seller-crm-k">Price</div>
                      <div className="seller-crm-v">{svc.price || '—'}</div>
                    </div>
                  </div>

                  <div className="m-t20">
                    <div className="seller-crm-k">Description</div>
                    <div className="seller-crm-v seller-crm-v--desc">{svc.description || '—'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SellerDashboardLayout>
      </div>
      <Footer2 />
    </>
  );
}

