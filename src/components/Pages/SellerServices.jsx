import React from 'react';
import { NavLink } from 'react-router-dom';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import SellerDashboardLayout from '../Elements/SellerDashboardLayout';
import { useSellerServices } from '../../hooks/useSellerServices';

export default function SellerServices() {
  const { services, deleteService } = useSellerServices();

  const handleDelete = (id) => {
    if (window.confirm('Delete this service?')) {
      deleteService(id);
    }
  };

  return (
    <>
      <Header2 stickyNo />
      <div className="page-content">
        <SellerDashboardLayout>
          <div className="seller-crm-content seller-crm-content--flush">
            <div className="seller-crm-panel-head seller-crm-panel-head--table">
              <h2 className="seller-crm-panel-title">Services management</h2>
              <NavLink to="/seller-services/new" className="seller-crm-btn-orange">
                <i className="fa fa-plus m-r8" aria-hidden />
                Add service
              </NavLink>
            </div>

            <div className="seller-crm-table-wrap">
              <table className="seller-table seller-table--crm">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Solar service category</th>
                    <th>Inverter brand</th>
                    <th>ACDB/DCDB</th>
                    <th className="seller-table__actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="seller-table__empty">
                        No services yet. Click &quot;Add service&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    services.map((svc) => (
                      <tr key={svc.id}>
                        <td className="seller-table__strong">{svc.title}</td>
                        <td>{svc.category || '—'}</td>
                        <td>{svc.solarServiceCategory || '—'}</td>
                        <td>{svc.inverterBrand || '—'}</td>
                        <td>{svc.acdbDcdb || '—'}</td>
                        <td className="seller-table__actions">
                          <NavLink to={`/seller-services/${svc.id}`} className="seller-crm-icon-btn" aria-label="View">
                            <i className="fa fa-eye" aria-hidden />
                          </NavLink>
                          <NavLink
                            to={`/seller-services/${svc.id}/edit`}
                            className="seller-crm-icon-btn"
                            aria-label="Edit"
                          >
                            <i className="fa fa-pencil" aria-hidden />
                          </NavLink>
                          <button
                            type="button"
                            className="seller-crm-icon-btn seller-crm-icon-btn--danger"
                            onClick={() => handleDelete(svc.id)}
                            aria-label="Delete"
                          >
                            <i className="fa fa-trash" aria-hidden />
                          </button>
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
