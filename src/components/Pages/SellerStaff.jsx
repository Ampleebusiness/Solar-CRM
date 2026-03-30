import React, { useState } from 'react';
import Header2 from '../Common/Header2';
import Footer2 from '../Common/Footer2';
import Banner from '../Elements/Banner';
import SellerDashboardLayout from '../Elements/SellerDashboardLayout';
import SellerStaffModal from '../Elements/SellerStaffModal';
import { SOLAR_IMAGES } from '../../data/solarImages';
import { useSellerStaff } from '../../hooks/useSellerStaff';

export default function SellerStaff() {
  const { staff, addStaff, updateStaff, deleteStaff } = useSellerStaff();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSave = (payload) => {
    if (editing) {
      updateStaff(editing.id, payload);
    } else {
      addStaff(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this staff member?')) {
      deleteStaff(id);
    }
  };

  return (
    <>
      <Header2 stickyNo />
      <div className="page-content">
       
        <SellerDashboardLayout>
          <div className="seller-crm-content">
            <div className="seller-crm-panel-head seller-crm-panel-head--table">
              <h2 className="seller-crm-panel-title">Staff management</h2>
              <button type="button" className="seller-crm-btn-orange" onClick={openAdd}>
                <i className="fa fa-plus m-r8" aria-hidden />
                Add staff
              </button>
            </div>
            <div className="seller-crm-table-wrap">
              <table className="seller-table seller-table--crm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="seller-table__actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="seller-table__empty">
                        No staff yet. Click &quot;Add staff&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    staff.map((s) => (
                      <tr key={s.id}>
                        <td className="seller-table__strong">{s.name}</td>
                        <td>{s.phone}</td>
                        <td>{s.email}</td>
                        <td>
                          <span className="seller-crm-badge">{s.role}</span>
                        </td>
                        <td className="seller-table__actions">
                          <button type="button" className="seller-crm-link-btn" onClick={() => openEdit(s)}>
                            Edit
                          </button>
                          <button type="button" className="seller-crm-link-btn seller-crm-link-btn--danger" onClick={() => handleDelete(s.id)}>
                            Delete
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

      <SellerStaffModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editing} />
    </>
  );
}
