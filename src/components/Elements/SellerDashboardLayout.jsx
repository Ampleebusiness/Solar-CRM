import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function getSellerInfo() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('sellerInfo') || 'null');
  } catch {
    return null;
  }
}

const navItems = [
  { to: '/seller-dashboard', label: 'Dashboard', icon: 'fa-th-large' },
  { to: '/seller-leads', label: 'My Leads', icon: 'fa-users' },
  { to: '/seller-enquiries', label: 'My Enquiries', icon: 'fa-envelope' },
  { to: '/seller-customers', label: 'Solar CRM', icon: 'fa-address-book' },
  { to: '/seller-staff', label: 'Staff', icon: 'fa-id-badge' },
  { to: '/seller-services', label: 'Services', icon: 'fa-cogs' },
  { to: '/seller-profile', label: 'Manage Profile', icon: 'fa-user' },
];

export default function SellerDashboardLayout({ children }) {
  const { logout } = useAuth();

  const seller = getSellerInfo() || {};
  const displayName = seller.fullName || 'Seller';
  const displayPhone = seller.phone ? `+91 ${seller.phone}` : '—';

  return (
    <div className="seller-crm-page seller-crm-theme">
      <div className="container seller-crm-outer">
        <div className="seller-crm-shell">
          <aside className="seller-crm-sidebar">
            <div className="seller-crm-sidebar-profile">
              <div className="seller-crm-avatar" aria-hidden>
                <i className="fa fa-user" />
              </div>
              <div className="seller-crm-profile-name">{displayName}</div>
              <div className="seller-crm-profile-phone">{displayPhone}</div>
            </div>

            <nav className="seller-crm-sidebar-nav" aria-label="Seller account">
              <ul className="seller-crm-nav-list">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        isActive ? 'seller-crm-nav-link is-active' : 'seller-crm-nav-link'
                      }
                      end={item.to === '/seller-dashboard'}
                    >
                      <i className={`fa ${item.icon} seller-crm-nav-icon`} aria-hidden />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
                <li>
                  <button type="button" className="seller-crm-nav-link seller-crm-nav-link--logout" onClick={logout}>
                    <i className="fa fa-sign-out seller-crm-nav-icon" aria-hidden />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="seller-crm-main">{children}</main>
        </div>
      </div>
    </div>
  );
}
